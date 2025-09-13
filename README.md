# DatabaseAgentB [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Description

DatabaseAgentB is a backend application built with Node.js, Express, and MySQL. It leverages Google's Gemini AI model to generate SQL queries from natural language questions. The application allows users to connect to a MySQL database, retrieve table schemas, generate SQL queries based on user questions, and execute those queries. It's designed to provide a user-friendly interface for interacting with databases using natural language, abstracting away the complexity of writing SQL manually.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [How to use](#how-to-use)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Important Links](#important-links)
- [Footer](#footer)

## Features

- 🔑 **Database Connection:** Establishes a connection to a MySQL database using provided credentials.
- 📊 **Schema Retrieval:** Fetches and displays the schema of the connected database, including table names and column definitions.
- 🤖 **SQL Generation:** Generates SQL queries from natural language questions using the Google Gemini AI model.
- 🚀 **SQL Execution:** Executes generated SQL queries and returns the results.
- 🌐 **CORS Support:** Includes Cross-Origin Resource Sharing (CORS) to allow requests from a specific origin.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MySQL
- **AI Model:** Google Gemini (@google/generative-ai, @langchain/google-genai)
- **Other:** dotenv, body-parser, cors, node-fetch, puppeteer

## Installation

1.  **Clone the repository:**
   ```bash
   git clone https://github.com/codezshubham/DatabaseAgentB.git
   cd DatabaseAgentB
   ```
2.  **Install dependencies:**
   ```bash
   npm install
   ```
3.  **Set up environment variables:**
    - Create a `.env` file in the root directory.
    - Add your Google Gemini API key:
   ```
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```

## Usage

1.  **Start the server:**
   ```bash
   node Server.js
   ```
   (or use a process manager like PM2)

2.  **Connect to the database:**
   - Send a POST request to the `/connect` endpoint with the following JSON body:

   ```json
   {
     "host": "your_host",
     "port": your_port,
     "user": "your_user",
     "password": "your_password",
     "database": "your_database"
   }
   ```

3.  **Retrieve table schemas:**
   - Send a GET request to the `/tables` endpoint to get a list of tables.
   - Send a GET request to the `/schema` endpoint to get the schema of all tables.

4.  **Generate SQL:**
   - Send a POST request to the `/generate-sql` endpoint with the question in the request body:

   ```json
   {
     "question": "Show me all customers"
   }
   ```

5.  **Execute SQL:**
   - Send a POST request to the `/execute` endpoint with the generated SQL query:

   ```json
   {
     "sql": "SELECT * FROM customers"
   }
   ```

## How to use

This project provides a backend service for interacting with a MySQL database using natural language queries. Here's a breakdown of real-world use cases and how to leverage the API endpoints:

**Real-World Use Cases:**

*   **Data Analysis & Reporting:** Non-technical users can easily extract data and generate reports by asking questions in plain English, eliminating the need to write complex SQL queries.
*   **Database Exploration:** Developers and analysts can quickly explore database schemas and understand table relationships without manually browsing database documentation.
*   **Rapid Prototyping:** Generate and execute SQL queries on the fly to test data models and application logic during development.

**Step-by-Step Usage Guide:**

1.  **Establish Database Connection:**

    *   Use the `/connect` endpoint to establish a connection to your MySQL database.
    *   Ensure the provided credentials (host, port, user, password, database) are accurate.

2.  **Explore Database Schema (Optional):**

    *   Use the `/tables` endpoint to list available tables in the connected database.
    *   Use the `/schema` endpoint to retrieve detailed schema information (column names and types) for each table. This step is helpful to understand your database and formulate effective natural language questions.

3.  **Generate SQL Query:**

    *   Use the `/generate-sql` endpoint to convert a natural language question into a SQL query.
    *   Example: `{"question": "What are the names and emails of all customers?"}`

4.  **Execute SQL Query & Retrieve Results:**

    *   Use the `/execute` endpoint to execute the generated SQL query.
    *   The response will include the query results (`results`), column headers (`headers`), and the relevant table name (`table`).

## Project Structure

```
DatabaseAgentB
├── package.json          # Project dependencies and scripts
├── Server.js             # Main application file with API endpoints
├── vercel.json           # Configuration for Vercel deployment
├── .env                  # Environment variables (API keys, database credentials)
└── node_modules          # Project dependencies
```

## API Reference

### `/connect`

- **Method:** POST
- **Description:** Establishes a connection to the MySQL database.
- **Request Body:**

```json
{
  "host": "your_host",
  "port": your_port,
  "user": "your_user",
  "password": "your_password",
  "database": "your_database"
}
```

- **Response:**

```json
{
  "success": true/false,
  "message": "Connection successful/error message"
}
```

### `/tables`

- **Method:** GET
- **Description:** Retrieves a list of tables in the connected database.
- **Response:**

```json
{
  "success": true/false,
  "tables": ["table1", "table2", ...],
  "message": "Error message if unsuccessful"
}
```

### `/schema`

- **Method:** GET
- **Description:** Retrieves the schema of all tables in the connected database.
- **Response:**

```json
{
  "success": true/false,
  "schema": {
    "table1": [
      { "name": "column1", "type": "VARCHAR" },
      { "name": "column2", "type": "INT" }
    ],
    "table2": [...]
  },
  "message": "Error message if unsuccessful"
}
```

### `/generate-sql`

- **Method:** POST
- **Description:** Generates a SQL query from a natural language question.
- **Request Body:**

```json
{
  "question": "Your question here"
}
```

- **Response:**

```json
{
  "success": true/false,
  "sql": "Generated SQL query",
  "message": "Error message if unsuccessful"
}
```

### `/execute`

- **Method:** POST
- **Description:** Executes a SQL query against the connected database.
- **Request Body:**

```json
{
  "sql": "SQL query to execute"
}
```

- **Response:**

```json
{
  "success": true/false,
  "results": [{"column1": "value1", "column2": "value2"}, ...],
  "headers": ["column1", "column2", ...],
  "table": "table_name"/"multiple",
  "message": "Error message if unsuccessful"
}
```

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request.

## License

This project is licensed under the ISC License - see the [LICENSE](https://opensource.org/licenses/ISC) file for details.

## Important Links

- **Repository:** [https://github.com/codezshubham/DatabaseAgentB](https://github.com/codezshubham/DatabaseAgentB)

## Footer

DatabaseAgentB - [https://github.com/codezshubham/DatabaseAgentB](https://github.com/codezshubham/DatabaseAgentB) by codezshubham. Feel free to fork, star, and submit issues!

---

<p align="center">[This Readme generated by ReadmeCodeGen.](https://www.readmecodegen.com/)</p>
