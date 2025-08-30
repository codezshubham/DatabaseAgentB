import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors({
  origin: "https://database-agent-coral.vercel.app"
}));
app.use(bodyParser.json());

let dbConfig = null;
let connection = null; 

app.post("/connect", async (req, res) => {
  const { host, port, user, password, database } = req.body;

  try {
    dbConfig = { host, port, user, password, database };   // <-- store for later use

    connection = await mysql.createConnection(dbConfig);   // <-- keep a live connection
    console.log("✅ Connected to DB:", database);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Connection error:", err.message);
    res.json({ success: false, message: err.message });
  }
});


app.get("/tables", async (req, res) => {
  console.log("📥 /tables endpoint hit");

  try {
    if (!connection) {
      return res.json({ success: false, message: "Not connected" });
    }

    const [rows] = await connection.query("SHOW TABLES");
    const tables = rows.map(r => Object.values(r)[0]);

    console.log("📊 Tables:", tables);
    res.json({ success: true, tables });
  } catch (err) {
    console.error("❌ Error fetching tables:", err.message);
    res.json({ success: false, message: err.message });
  }
});

app.get("/schema", async (req, res) => {
  console.log("📥 /schema endpoint hit");

  try {
    if (!connection) {
      return res.json({ success: false, message: "Not connected" });
    }

    // get all tables
    const [tables] = await connection.query("SHOW TABLES");
    let schema = {};

    for (let row of tables) {
      const tableName = Object.values(row)[0];
      // get columns for each table
      const [cols] = await connection.query(`SHOW COLUMNS FROM \`${tableName}\``);
      schema[tableName] = cols.map(c => ({
        name: c.Field,
        type: c.Type
      }));
    }

    console.log("📊 Schema:", schema);
    res.json({ success: true, schema });
  } catch (err) {
    console.error("❌ Error fetching schema:", err.message);
    res.json({ success: false, message: err.message });
  }
});


// ---------- SQL Normalizer ----------
function normalizeSQL(raw) {
  return raw
    .replace(/```sql|```/g, "")
    .replace(/^`+|`+$/g, "")
    .trim()
    .replace(/;+\s*$/g, "");
}

// ---------- Generate SQL ----------
app.post("/generate-sql", async (req, res) => {
  try {
    const { question } = req.body;

    // fetch schema
    const [tables] = await connection.query("SHOW TABLES");
    let schema = {};
    for (let row of tables) {
      const tableName = Object.values(row)[0];
      const [cols] = await connection.query(`SHOW COLUMNS FROM \`${tableName}\``);
      schema[tableName] = cols.map(c => `${c.Field} (${c.Type})`);
    }

    const prompt = `
        You are a strict SQL generator for MySQL.
        Use ONLY the schema provided.
        If the question asks to "show me a table", always use SELECT * FROM <table>.
        Schema:
        ${JSON.stringify(schema, null, 2)}

        Convert this natural language question into ONE safe SELECT query.
        Do NOT return explanations, markdown, or backticks.
        Question: "${question}"
      `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    let sql = normalizeSQL(result.response.text());

    res.json({ success: true, sql });
  } catch (err) {
    console.error("Error generating SQL:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});



// ---------- Execute SQL ----------
app.post("/execute", async (req, res) => {
  try {
    if (!connection) {
      return res.status(400).json({ success: false, message: "No DB connection configured." });
    }

    const { sql } = req.body;

    const [rows] = await connection.query(sql);

    // detect if query uses JOIN or multiple tables
    let tableName = null;
    if (/join/i.test(sql)) {
      tableName = "multiple";
    } else {
      const match = sql.match(/from\s+([`"]?)(\w+)\1/i);
      if (match) {
        tableName = match[2];
      }
    }

    res.json({
      success: true,
      results: rows,
      headers: rows.length > 0 ? Object.keys(rows[0]) : [],
      table: tableName
    });

  } catch (error) {
    console.error("❌ SQL Execution Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default app;



