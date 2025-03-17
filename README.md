# Track It Easy - Backend

This is the backend service for the Track It Easy application. It is built with Fastify and uses PostgreSQL as the database.

## Prerequisites

- Node.js (v20 or later)
- Docker
- PostgreSQL

## Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables:

```
# Database configuration
DATABASE_URL
ACCESS_SECRET
REFRESH_SECRET
COOKIE_SECRET

# Server configuration
PORT=3000
HOST=0.0.0.0

# Other configurations
NODE_ENV=development
```

## Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/track-it-easy.git
cd track-it-easy/backend
```

2. Install dependencies:

```sh
npm install
```

## Running the Application

1. Run the backend server:

```sh
npm run dev
```

The server will start on the port specified in the `.env` file (default is 3000).

## Building the Application

To build the backend application, run the following command:

```sh
npm run build
```

## Project Structure

- `src/app`: Contains the main application logic and actions.
- `src/api`: Contains the API routes and error handling.
- `src/domain`: Contains the domain entities, services, and adapters.
- `src/infra`: Contains the database schema and repositories.
- `src/config`: Contains the configuration files.
- `src/middleware`: Contains the middleware for authentication.

## Dependencies

- `fastify`: Fast and low overhead web framework, for Node.js
- `pg`: PostgreSQL client for Node.js
- `drizzle-orm`: TypeScript ORM for SQL databases
- `dotenv`: Loads environment variables from a `.env` file into `process.env`
- `typescript`: TypeScript language support
- `ts-node`: TypeScript execution environment and REPL for Node.js
- `@types/node`: TypeScript definitions for Node.js

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
