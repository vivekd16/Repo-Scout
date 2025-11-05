# How to Start the Application

## Quick Start (Development)

Run both frontend and backend together:
```bash
npm run dev:all
```

This will start:
- Frontend (Vite): http://localhost:5173
- Backend (Express): http://localhost:3000

## Or Start Separately

### Frontend Only
```bash
npm run dev
```
Frontend: http://localhost:5173

### Backend Only
```bash
npm run server
```
Backend: http://localhost:3000

## Production Build

1. Build the frontend:
```bash
npm run build
```

2. Start the backend:
```bash
npm run server
```

The application will be served on http://localhost:3000

## Environment Variables

Create a `.env` file in the root directory:

```env
# GitHub Personal Access Token (optional, for higher rate limits)
GITHUB_TOKEN=ghp_your_token_here
VITE_GITHUB_TOKEN=ghp_your_token_here

# Server Port
PORT=3000
```

## Troubleshooting

### "Failed to fetch from GitHub" Error

1. Make sure the backend server is running on port 3000
2. Check if you have a `.env` file with `GITHUB_TOKEN`
3. Verify the backend proxy is working by visiting: http://localhost:3000/api/health

### CORS Issues

The backend has CORS enabled for:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (Express server)

If you're using a different port, update `server/index.js` CORS configuration.

