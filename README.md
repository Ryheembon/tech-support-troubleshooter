```markdown
## Tech Support Troubleshooter

A full-stack **Tech Support Troubleshooter** web app built using **FastAPI** (for the backend) and **React/Next.js** (for the frontend).  

### 📸 Screenshot  

## 📸 Screenshot  

![Tech Support Troubleshooter](https://raw.githubusercontent.com/ryheembon/tech-support-troubbleshooter/main/troubleshooter_screenshot.png)



A full-stack **Tech Support Troubleshooter** web app built using **FastAPI** (for the backend) and **React/Next.js** (for the frontend). This app helps users troubleshoot common technical issues by providing detailed solutions, media (images/videos), and external resources.

## Features

- **Categorized Issues**: Issues are grouped into categories (e.g., Network Issues, System Errors, etc.).
- **Search Functionality**: Allows users to search and find issues quickly.
- **Detailed Solutions**: Provides step-by-step instructions, media (images/videos), and external links for further assistance.
- **CORS Support**: Backend supports Cross-Origin Resource Sharing (CORS) to enable communication with the frontend.

## Technologies Used

### Backend

- **FastAPI**: A modern web framework for building APIs with Python.
- **Pydantic**: Used for data validation.
- **Uvicorn**: ASGI server for serving the FastAPI app.
- **CORS Middleware**: To allow the frontend (React/Next.js) to communicate with the backend.

### Frontend

- **React/Next.js**: JavaScript libraries for building interactive user interfaces.
- **Axios**: For making HTTP requests to the backend API.
- **Lucide Icons**: A collection of high-quality icons.
- **Tailwind CSS**: For fast and responsive UI styling.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Ryheembon/tech-support-troubleshooter.git
cd tech-support-troubleshooter
```

### 2. Backend Setup (FastAPI)

Navigate to the backend folder:

```bash
cd tech_support_backend
```

Create and activate a Python virtual environment:

```bash
python -m venv venv  # Create virtual environment
source venv/bin/activate  # Activate virtual environment (Linux/macOS)
venv\Scripts\activate  # Windows
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will be running at `http://127.0.0.1:8000`.

### 3. Frontend Setup (React/Next.js)

Navigate to the frontend folder:

```bash
cd tech_support_frontend
```

Install the required dependencies:

```bash
npm install
```

Run the React/Next.js development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### 4. Testing the App

1. Open the frontend in your browser (`http://localhost:3000`).
2. Select an issue from the dropdown to see the troubleshooting steps, media, and external links returned from the FastAPI backend.

## API Documentation

The backend exposes the following API endpoint:

- **POST `/troubleshoot`**: Accepts an issue string (e.g., "Wi-Fi not working") and returns a solution with steps, media, and external links.

**Example request:**

```json
{
  "issue": "Wi-Fi not working"
}
```

**Example response:**

```json
{
  "solution": {
    "text": "Step 1: Restart your router and modem. ...",
    "media": "/images/router-settings.png",
    "links": [
      {"label": "Router Troubleshooting Guide", "url": "https://example.com/router-guide"},
      {"label": "How to Update Router Firmware", "url": "https://example.com/update-firmware"}
    ]
  }
}
```

## File Structure

```
tech-support-troubleshooter/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
└── frontend/
    ├── package.json
    ├── public/
    └── ...
```

### Backend Folder (`tech_support_backend`)

- `main.py`: The FastAPI application file that handles incoming requests and returns troubleshooting solutions.
- `requirements.txt`: A list of Python dependencies required for the backend.

### Frontend Folder (`tech_support_frontend`)

- `package.json`: The list of dependencies for the React/Next.js frontend.
- `public/`: Contains static files like images and icons.
- `pages/`: Contains React components, including the main page where users can select issues and view solutions.

## Contributing

Feel free to fork this repository and submit pull requests. If you find any bugs or have suggestions for improvements, please open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### **What’s Included in This `README.md`**

1. **Project Overview**: A brief description of the project, including its key features.
2. **Technologies Used**: The technologies powering both the **backend** (FastAPI, Pydantic, Uvicorn) and **frontend** (React, Next.js, Axios, Tailwind CSS).
3. **Setup Instructions**: Detailed instructions on how to clone the repository, set up both the **backend** and **frontend**, and run the app locally.
4. **API Documentation**: Explanation of the main **API endpoint** (`POST /troubleshoot`), including example requests and responses.
5. **File Structure**: Breakdown of the project directory structure to help users understand the organization of the codebase.
6. **Contributing**: Information on how to contribute to the project by forking, submitting pull requests, and opening issues.
7. **License**: Information about the project’s license (MIT License).
```
