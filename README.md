# FocusFlow - Modern Task Management Application

A beautiful, modern task management application built with React, Tailwind CSS, and Framer Motion.

## Features

- 🎯 **AI-Powered Prioritization**: Automatically assigns priority levels (Low, Medium, High) based on task descriptions
- 🎨 **Glassmorphism Design**: Modern UI with subtle blurs, rounded corners, and a soft color palette
- 📱 **Category Management**: Organize tasks by Inbox, Work, Personal, or High Priority
- ⏱️ **Focus Mode**: Integrated Pomodoro timer for focused work sessions
- ✨ **Smooth Animations**: Beautiful transitions powered by Framer Motion
- 💾 **Local Storage**: All tasks persist automatically after page refresh
- 🔍 **Search Functionality**: Quickly find tasks with the search bar

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Usage

1. **Add Tasks**: Type a task in the input field and click "Add" or press Enter
2. **Complete Tasks**: Click the circle icon to mark tasks as complete
3. **Delete Tasks**: Click the trash icon to remove tasks
4. **Filter by Category**: Use the sidebar to filter tasks by category
5. **Focus Mode**: Click "Focus Mode" in the sidebar to start a Pomodoro timer
6. **Search**: Use the search bar to quickly find specific tasks

## AI Prioritization

The app automatically determines task priority based on keywords:

- **High Priority**: urgent, asap, critical, deadline, fix, bug, error, etc.
- **Low Priority**: someday, maybe, later, optional, nice to have, etc.
- **Medium Priority**: Default for all other tasks

## License

MIT
