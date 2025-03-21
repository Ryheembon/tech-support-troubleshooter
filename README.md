# Tech Support Assistant

A full-stack application with a FastAPI backend and Next.js frontend for providing technical support assistance.

## Prerequisites

- Node.js (v18 or later)
- Python 3.10 or later
- npm or yarn

## Quick Start

1. Clone the repository:
```bash
git clone [your-repo-url]
cd tech_support
```

2. Run the setup script:
```bash
./setup.sh
```

## Manual Setup (if setup script fails)

1. Install Node.js dependencies:
```bash
npm install
```

2. Install Tailwind CSS plugins (REQUIRED for styling):
```bash
npm install -D @tailwindcss/typography @tailwindcss/forms
```

3. Set up Python environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install fastapi==0.109.0 uvicorn==0.27.0 pydantic==2.5.3
```

## Running the Application

1. Start the backend server (in one terminal):
```bash
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
uvicorn main:app --reload
```

2. Start the frontend development server (in another terminal):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000 (or next available port)
- Backend API: http://localhost:8000

## Styling Setup and Common Issues

### First Time Setup
When setting up the project for the first time, ensure you:
1. Install Tailwind plugins:
```bash
npm install -D @tailwindcss/typography @tailwindcss/forms
```
2. Clear the Next.js cache:
```bash
rm -rf .next
```
3. Restart the development server:
```bash
npm run dev
```

### If Styles Are Not Appearing
If you encounter missing styles, follow these steps in order:
1. Stop the development server (Ctrl+C)
2. Clear the Next.js cache:
```bash
rm -rf .next
```
3. Verify Tailwind plugins are installed:
```bash
npm install -D @tailwindcss/typography @tailwindcss/forms
```
4. Restart the development server:
```bash
npm run dev
```

### Common Issues
- If you see "Cannot find module '@tailwindcss/typography'" error, run:
```bash
npm install -D @tailwindcss/typography @tailwindcss/forms
```
- If you see "No utility classes were detected", ensure your `tailwind.config.js` content paths are correct
- If styles are not updating, try clearing the cache with `rm -rf .next`

## Project Structure

- `/src/app` - Next.js frontend application
- `/` - FastAPI backend application
- `tailwind.config.js` - Tailwind CSS configuration
- `setup.sh` - Project setup script

## 📸 Screenshot

![Tech Support Interface Screenshot](screenshot.png)

## Features

- Interactive troubleshooting flows for common issues
- Beautiful UI with animations and glass morphism effects
- Form submission for custom support requests
- Session management for tracking troubleshooting history
- Responsive design for all devices
- Error handling and rate limiting

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/Ryheembon/tech-support-troubleshooter.git
   cd tech-support-troubleshooter
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- Next.js 14
- Tailwind CSS
- TypeScript
- Lucide Icons

## Development

The application uses modern React features and follows best practices for performance and user experience. Key components include:

- Error boundaries for graceful error handling
- Rate limiting for form submissions
- Local storage for session management
- Responsive animations and transitions
- Comprehensive troubleshooting flows

## Project Structure

```
tech-support/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx         # Root layout component
│   │   ├── globals.css        # Global styles
│   │   └── troubleshootingSteps.ts  # Troubleshooting logic
│   └── components/
│       └── ErrorBoundary.tsx  # Error handling component
├── public/
│   └── screenshot.png         # Application screenshot
├── tailwind.config.js         # Tailwind configuration
├── next.config.js            # Next.js configuration
└── package.json              # Project dependencies
```

## Key Features Explained

### Troubleshooting Flow
- Step-by-step guided process for common technical issues
- Dynamic solution paths based on user responses
- Visual progress tracking
- Session history preservation

### User Interface
- Modern glass morphism design
- Smooth animations and transitions
- Responsive layout for all devices
- Accessible form controls

### Error Handling
- Graceful error recovery
- User-friendly error messages
- Rate limiting protection
- Session management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [Lucide Icons](https://lucide.dev/) - For beautiful icons
- All contributors who have helped shape this project 

## Testing the Application

### 1. Test Backend Server
```bash
# In terminal 1
source venv/bin/activate
uvicorn main:app --reload

# You should see:
# - "Uvicorn running on http://127.0.0.1:8000"
# - "Application startup complete"
```

### 2. Test Frontend Server
```bash
# In terminal 2
npm run dev

# You should see:
# - "Next.js 14.x.x"
# - "Local: http://localhost:3000" (or another port)
# - "Ready" message
```

### 3. Visual Checks
Visit http://localhost:3000 (or the port shown in your terminal) and verify:
- [ ] Gradient background is visible (blue-purple-pink)
- [ ] Four issue category cards are displayed
- [ ] Glass-like transparency effects are working
- [ ] Animations (floating elements) are visible
- [ ] Form inputs have proper styling

### 4. Functionality Checks
Test the following features:
- [ ] Click each issue category - should show troubleshooting steps
- [ ] Fill and submit the support form
- [ ] Test the back button in troubleshooting flow
- [ ] Verify animations on hover/click
- [ ] Check if the form submission cooldown works

### 5. Common Issues and Fixes

If the gradient or styles are missing:
```bash
# Stop both servers (Ctrl+C) and run:
rm -rf .next
npm install -D @tailwindcss/typography @tailwindcss/forms
npm run dev
```

If the backend isn't responding:
```bash
# Verify Python environment is active (should see (venv) in terminal)
source venv/bin/activate
pip list  # Should show fastapi, uvicorn, and pydantic
``` 