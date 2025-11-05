# Quick Start Guide

## 🚀 Start the Application

### Option 1: Start Everything Together (Recommended)

Run both frontend and backend in one command:
```bash
npm run dev:all
```

This starts:
- ✅ Frontend (Vite) on http://localhost:5173
- ✅ Backend (Express) on http://localhost:3000

### Option 2: Start Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

### Option 3: Production Mode

1. Build the frontend:
```bash
npm run build
```

2. Start the backend:
```bash
npm run server
```

The app will be served at: http://localhost:3000

## ✨ Features

The application now has:
- ✅ **Properly aligned sidebar** with collapse functionality
- ✅ **Backend proxy** for GitHub API to avoid CORS issues
- ✅ **Modern dark UI** matching the ossean-style design
- ✅ **Search functionality** for GitHub issues
- ✅ **Language and label filtering**
- ✅ **Table view** with issue details

## 🔧 Configuration

Create a `.env` file in the root directory (optional):
```env
GITHUB_TOKEN=your_github_token_here
```

**Note:** The app works without a token, but you'll have rate limits.

## 🎯 Usage

1. Enter a search term in the search bar
2. Select programming language filters (optional)
3. Click "Search" button
4. Browse the results in the table below

## 📝 Troubleshooting

### "Failed to fetch from GitHub" Error
- Make sure the backend is running: `npm run server`
- Check if port 3000 is available
- Verify `.env` file has valid `GITHUB_TOKEN`

### Sidebar not collapsing
- Clear browser cache and reload
- Check browser console for errors

### Backend won't start
- Make sure you've installed dependencies: `npm install`
- Check if port 3000 is already in use
- Review server logs for specific errors

## 🎨 UI Features

- **Collapsible Sidebar**: Click the chevron button to collapse/expand
- **Dark Theme**: Modern dark UI throughout
- **Responsive Design**: Works on desktop and tablet
- **Search Filters**: Filter by language and labels
- **Issue Cards**: Click any issue to view on GitHub

