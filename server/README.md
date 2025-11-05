# Repo Scout Backend Server

A simple Express.js backend server for the Repo Scout application.

## Features

- Express.js server with CORS support
- GitHub API proxy endpoint
- Health check endpoint
- Serves static files from the React build

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
GITHUB_TOKEN=your_github_token_here
PORT=3000
```

3. Start the development server:
```bash
npm run dev
```

4. Start the production server:
```bash
npm start
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/github/*` - GitHub API proxy

## Environment Variables

- `PORT` - Server port (default: 3000)
- `GITHUB_TOKEN` - GitHub personal access token (optional, for higher rate limits)

