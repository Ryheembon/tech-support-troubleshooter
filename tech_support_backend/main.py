from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS)
    allow_headers=["*"],  # Allow all headers
)

# Define request body format
class IssueRequest(BaseModel):
    issue: str

# Expanded detailed solutions with images, text, and external links
detailed_solutions = {
    "Wi-Fi not working": {
        "text": """Step 1: Restart your router and modem.
        Step 2: Check if other devices are connected to the Wi-Fi.
        Step 3: Try reconnecting to the network by forgetting and reconnecting.
        Step 4: Ensure your router is within range of your device and not obstructed by walls or objects.
        Step 5: If you still experience issues, check for firmware updates for your router.""",
        "media": "/images/router-settings.png",  # Example image of router settings page
        "links": [
            {"label": "Router Troubleshooting Guide", "url": "https://example.com/router-guide"},
            {"label": "How to Update Router Firmware", "url": "https://example.com/update-firmware"}
        ]
    },
    "Slow internet": {
        "text": """Step 1: Run a speed test at fast.com or speedtest.net.
        Step 2: Disconnect unused devices that are consuming bandwidth.
        Step 3: Restart your router to refresh the connection.
        Step 4: Try using a wired connection to reduce latency.
        Step 5: Check for any large downloads or streaming services that might be slowing down the network.""",
        "media": "/images/speed-test.png",
        "links": [
            {"label": "Speed Test Website", "url": "https://fast.com"},
            {"label": "Optimize Your Wi-Fi Speed", "url": "https://example.com/optimize-wifi-speed"}
        ]
    },
    "Computer freezing": {
        "text": """Step 1: Close unnecessary programs using Task Manager (Ctrl+Shift+Esc) or Activity Monitor (Mac).
        Step 2: Restart your computer to resolve any temporary software issues.
        Step 3: Check your computer’s storage; delete unnecessary files or move them to external storage.
        Step 4: Run a malware scan to ensure no viruses are affecting performance.
        Step 5: Update your drivers and operating system to ensure compatibility with new applications.""",
        "media": "/images/task-manager.png",
        "links": [
            {"label": "How to Clean Up Your Computer", "url": "https://example.com/clean-computer"},
            {"label": "How to Update Drivers", "url": "https://example.com/update-drivers"}
        ]
    },
    "Blue screen of death": {
        "text": """Step 1: Write down the error code or stop code displayed on the blue screen.
        Step 2: Restart your computer and check if the issue persists.
        Step 3: Run the built-in Windows diagnostic tool (chkdsk) to check for disk errors: open Command Prompt and type 'chkdsk /f'.
        Step 4: Update your graphics drivers and check if the issue is related to hardware drivers.
        Step 5: If the problem continues, consider performing a system restore to a previous state or reinstalling Windows.""",
        "media": "/images/bsod-error.png",
        "links": [
            {"label": "BSOD Troubleshooting Guide", "url": "https://example.com/bsod-guide"},
            {"label": "How to Run CHKDSK", "url": "https://example.com/run-chkdsk"}
        ]
    },
    "App crashing": {
        "text": """Step 1: Restart the app and check if the issue is resolved.
        Step 2: Update the app to the latest version.
        Step 3: Clear the app’s cache or data in the settings (for mobile apps).
        Step 4: Reinstall the app if it continues to crash.
        Step 5: Check the app's official website for any known bugs or updates.""",
        "media": "/images/app-crash.png",
        "links": [
            {"label": "App Crash Troubleshooting", "url": "https://example.com/app-crash-fix"},
            {"label": "How to Clear App Cache", "url": "https://example.com/clear-app-cache"}
        ]
    },
    # Add more issues and solutions here...
}

@app.post("/troubleshoot")
def troubleshoot(issue_request: IssueRequest):
    solution = detailed_solutions.get(issue_request.issue, None)
    if solution is None:
        return {"solution": {"text": "No solution found.", "media": "", "links": []}}
    return {"solution": solution}
