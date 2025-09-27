# 🔍 Repo Scout

**A modern, dark-mode repository finder for discovering amazing open source projects**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://work-1-smoruqnxdtszbzbv.prod-runtime.all-hands.dev)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

## ✨ Features

### 🎨 **Modern Dark UI**
- **Production-ready dark mode** with consistent theming
- **Responsive design** that works on mobile, tablet, and desktop
- **Smooth animations** and transitions using Framer Motion
- **Accessible components** built with Radix UI primitives

### 🔍 **Repository Discovery**
- **Top Repositories**: Most starred and established projects
- **Popular Repositories**: Recently active with high engagement  
- **Growing Repositories**: Emerging projects gaining momentum
- **Smart Search**: Filter by name, description, and programming language
- **Language Filtering**: 500+ programming languages supported

### 🏗️ **Persistent Navigation**
- **Sidebar Navigation** with all required tabs:
  - Home, Explore, Top, Popular, Growing
  - Languages (dropdown), Sign In, Sign Up
  - Profile, Settings, About, Demo
- **Mobile-responsive** with collapsible sidebar
- **Breadcrumb navigation** for better UX

### 🔐 **Authentication System**
- **Sign In/Sign Up flows** with email/password
- **Client-side validation** and error states
- **OAuth provider placeholders** (Google, GitHub, Twitter)
- **"Remember me"** checkbox and password visibility toggle
- **Form validation** using React Hook Form + Zod

### 📊 **Repository Information**
Each repository card displays:
- **Repository name** and owner
- **Owner avatar/profile picture**
- **Short description** (truncated)
- **Primary language** with color coding
- **Star and fork counts**
- **Last updated** relative time
- **Open issues count**

### 🔍 **Repository Details Modal**
- **README excerpt** with markdown rendering
- **Repository topics/tags**
- **Comprehensive statistics**
- **Direct GitHub links**
- **Contribution guidelines**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/piyushdhoka/Repo-Scout.git
   cd Repo-Scout
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your GitHub token for higher rate limits
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:12000
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 Demo Instructions

### Live Demo
Visit the [live demo](https://work-1-smoruqnxdtszbzbv.prod-runtime.all-hands.dev) to explore all features.

### Interactive Demo
1. Navigate to `/demo` in the application
2. Follow the guided walkthrough
3. Learn how to discover and contribute to open source projects

### Key Demo Features
- **Repository browsing** across different categories
- **Search and filtering** by language and keywords  
- **Repository details** with README preview
- **Authentication flows** (Sign In/Sign Up)
- **Responsive design** testing

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### UI Components
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Data & State
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **GitHub API** - Repository data

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout with sidebar
│   ├── RepositoryCard.tsx
│   └── RepositoryModal.tsx
├── pages/              # Route components
│   ├── Home.tsx        # Landing page
│   ├── Explore.tsx     # Main repository browser
│   ├── Top.tsx         # Top repositories
│   ├── Popular.tsx     # Popular repositories
│   ├── Growing.tsx     # Growing repositories
│   ├── SignIn.tsx      # Authentication
│   ├── SignUp.tsx      # Registration
│   ├── About.tsx       # About page
│   └── Demo.tsx        # Interactive demo
├── services/           # API services
│   └── repositoryApi.ts # GitHub API integration
├── lib/                # Utilities and context
│   ├── AuthContext.tsx # Authentication context
│   └── utils.ts        # Helper functions
└── hooks/              # Custom React hooks
```

## 🔧 Configuration

### Environment Variables

```bash
# GitHub API Token (optional - for higher rate limits)
VITE_GITHUB_TOKEN=your_github_personal_access_token_here

# Firebase Configuration (optional - for authentication)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### GitHub API Rate Limits
- **Without token**: 60 requests/hour
- **With token**: 5,000 requests/hour

## 🎨 Design System

### Dark Mode Theme
- **Background**: Deep dark blue (`#0f172a`)
- **Cards**: Slightly lighter dark (`#1e293b`)
- **Text**: High contrast white/gray
- **Accents**: Blue, green, yellow for categories
- **Borders**: Subtle gray borders

## 🤝 Contributing

We welcome contributions! To get started:

1. **Fork the repository** and create your branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m "feat: describe your change"
   ```
3. **Push to your fork** and open a Pull Request:
   ```bash
   git push origin feat/your-feature-name
   ```
4. **Describe your changes** in the PR and request a review.

### Guidelines
- Follow the existing code style and naming conventions
- Write clear, concise commit messages
- Add tests or documentation as needed
- Maintain responsive design
- Follow TypeScript best practices

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the open source community**

*Discover amazing projects, contribute to open source, and connect with developers worldwide.*


