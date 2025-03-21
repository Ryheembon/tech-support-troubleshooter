# Tech Support Interface

A modern, user-friendly technical support interface built with Next.js and Tailwind CSS.

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