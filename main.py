from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from datetime import datetime
import uuid

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Allow requests from your Next.js frontend
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],  # Your Next.js development server
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Enhanced data models
class UserBase(BaseModel):
    email: EmailStr
    name: str

class SupportTicket(BaseModel):
    ticket_id: str
    user_email: EmailStr
    issue_type: str
    description: str
    status: str
    created_at: datetime
    updated_at: datetime
    steps_taken: List[Dict[str, str]] = []

class TicketCreate(BaseModel):
    user_email: EmailStr
    user_name: str
    issue_type: str
    description: str

# In-memory storage (replace with database in production)
tickets: Dict[str, SupportTicket] = {}
troubleshooting_sessions: Dict[str, Dict] = {}

# Basic troubleshooting flow
troubleshooting_tree = {
    "start": {
        "question": "What type of network issue are you experiencing?",
        "options": ["No Internet Connection", "Slow Internet", "WiFi Not Connecting", "Website Not Loading"],
        "next_steps": {
            "No Internet Connection": "no_internet",
            "Slow Internet": "slow_internet",
            "WiFi Not Connecting": "wifi_issues",
            "Website Not Loading": "website_issues"
        }
    },
    "no_internet": {
        "question": "Is your router powered on and showing lights?",
        "options": ["Yes", "No", "Some lights are on"],
        "next_steps": {
            "Yes": "check_cables",
            "No": "power_cycle",
            "Some lights are on": "check_cables"
        }
    },
    "power_cycle": {
        "question": "Let's try power cycling your router.",
        "options": ["Done"],
        "solution": "1. Unplug your router\n2. Wait 30 seconds\n3. Plug it back in\n4. Wait 2-3 minutes\n5. Try connecting again",
        "next_steps": {
            "Done": "check_connection"
        }
    },
    "check_cables": {
        "question": "Let's check all the cables connecting your router and modem.",
        "options": ["All cables are connected", "Found a loose cable"],
        "next_steps": {
            "All cables are connected": "check_connection",
            "Found a loose cable": "reconnect_cable"
        }
    },
    "reconnect_cable": {
        "question": "Please reconnect the loose cable securely.",
        "options": ["Done"],
        "next_steps": {
            "Done": "check_connection"
        }
    },
    "check_connection": {
        "question": "Now try to connect to the internet again. Is it working?",
        "options": ["Yes", "No"],
        "next_steps": {
            "Yes": "resolved",
            "No": "further_steps"
        }
    },
    "resolved": {
        "question": "Great! Your problem has been resolved.",
        "options": ["Start over"],
        "solution": "The issue has been successfully resolved. If you encounter any more problems, feel free to start another troubleshooting session.",
        "next_steps": {
            "Start over": "start"
        }
    },
    "further_steps": {
        "question": "Would you like to continue with more advanced troubleshooting or contact support?",
        "options": ["Continue troubleshooting", "Contact support"],
        "next_steps": {
            "Continue troubleshooting": "advanced_troubleshooting",
            "Contact support": "contact_support"
        }
    },
    "advanced_troubleshooting": {
        "question": "Let's try some advanced troubleshooting steps.",
        "options": ["Done"],
        "solution": "1. Reset your router to factory settings\n2. Update your router's firmware\n3. Check for interference from other devices",
        "next_steps": {
            "Done": "check_connection"
        }
    },
    "contact_support": {
        "question": "Please contact our technical support team.",
        "options": ["OK"],
        "solution": "Our support team can be reached at:\nPhone: 1-800-123-4567\nEmail: support@example.com\nLive Chat: Available on our website",
        "next_steps": {
            "OK": "start"
        }
    },
    "slow_internet": {
        "question": "When did you first notice the slow internet speed?",
        "options": ["Today", "This week", "Always been slow"],
        "next_steps": {
            "Today": "recent_change",
            "This week": "recent_change",
            "Always been slow": "bandwidth_check"
        }
    },
    "recent_change": {
        "question": "Are there any new devices connected to your network?",
        "options": ["Yes", "No"],
        "next_steps": {
            "Yes": "check_devices",
            "No": "run_speedtest"
        }
    },
    "wifi_issues": {
        "question": "Can you see your WiFi network in the list of available networks?",
        "options": ["Yes", "No"],
        "next_steps": {
            "Yes": "wifi_visible",
            "No": "wifi_not_visible"
        }
    },
    "wifi_visible": {
        "question": "Are you able to connect to the WiFi network but not getting internet?",
        "options": ["Yes", "No - Can't connect at all"],
        "next_steps": {
            "Yes": "no_internet",
            "No - Can't connect at all": "wifi_password"
        }
    },
    "wifi_not_visible": {
        "question": "Let's try restarting your WiFi router.",
        "options": ["Done"],
        "solution": "1. Unplug the router\n2. Wait 30 seconds\n3. Plug it back in\n4. Wait 2-3 minutes for it to fully restart",
        "next_steps": {
            "Done": "check_wifi_after_restart"
        }
    },
    "check_wifi_after_restart": {
        "question": "Is your WiFi network visible now?",
        "options": ["Yes", "No"],
        "next_steps": {
            "Yes": "wifi_visible",
            "No": "contact_support"
        }
    },
    "website_issues": {
        "question": "Can you access other websites?",
        "options": ["Yes", "No"],
        "next_steps": {
            "Yes": "specific_website",
            "No": "no_internet"
        }
    },
    "specific_website": {
        "question": "The issue is likely with the specific website. Let's try some steps.",
        "options": ["OK"],
        "solution": "1. Clear your browser cache and cookies\n2. Try a different browser\n3. Check if the website is down using a service like downdetector.com\n4. Try accessing the website using a different device",
        "next_steps": {
            "OK": "check_website_again"
        }
    },
    "check_website_again": {
        "question": "Were you able to access the website after trying those steps?",
        "options": ["Yes", "No"],
        "next_steps": {
            "Yes": "resolved",
            "No": "contact_support"
        }
    },
    "bandwidth_check": {
        "question": "Let's check if your internet plan provides enough bandwidth.",
        "options": ["OK"],
        "solution": "1. Check your internet service plan to confirm your speed\n2. Run a speed test at speedtest.net\n3. If speeds are consistently below what you're paying for, contact your ISP",
        "next_steps": {
            "OK": "run_speedtest"
        }
    },
    "run_speedtest": {
        "question": "Please run a speed test at speedtest.net and tell us the result.",
        "options": ["Speed is good", "Speed is slower than expected"],
        "next_steps": {
            "Speed is good": "check_devices",
            "Speed is slower than expected": "isp_issue"
        }
    },
    "check_devices": {
        "question": "Are there multiple devices using your internet connection?",
        "options": ["Yes", "No"],
        "next_steps": {
            "Yes": "limit_devices",
            "No": "router_placement"
        }
    },
    "limit_devices": {
        "question": "Try limiting the number of devices or activities using bandwidth.",
        "options": ["Done"],
        "solution": "1. Disconnect devices you're not actively using\n2. Pause large downloads or streaming\n3. Check for background updates on devices",
        "next_steps": {
            "Done": "check_connection"
        }
    },
    "router_placement": {
        "question": "Let's check your router placement.",
        "options": ["OK"],
        "solution": "For optimal WiFi performance:\n1. Place router in a central location\n2. Keep away from metal objects and appliances\n3. Position antennas vertically\n4. Keep elevated off the floor",
        "next_steps": {
            "OK": "check_connection"
        }
    },
    "isp_issue": {
        "question": "The issue might be with your Internet Service Provider.",
        "options": ["Contact ISP", "Try more troubleshooting"],
        "solution": "Contact your ISP and report the slow speeds. Ask if there are any outages or issues in your area.",
        "next_steps": {
            "Contact ISP": "contact_support",
            "Try more troubleshooting": "router_placement"
        }
    },
    "wifi_password": {
        "question": "Are you entering the correct WiFi password?",
        "options": ["Yes, I'm sure", "Not sure"],
        "next_steps": {
            "Yes, I'm sure": "reset_network_settings",
            "Not sure": "find_password"
        }
    },
    "find_password": {
        "question": "Let's find your WiFi password.",
        "options": ["Found it"],
        "solution": "Your WiFi password can typically be found:\n1. On a sticker on your router\n2. In your router's admin panel\n3. In the documentation from your ISP",
        "next_steps": {
            "Found it": "check_connection"
        }
    },
    "reset_network_settings": {
        "question": "Let's try resetting your device's network settings.",
        "options": ["Done"],
        "solution": "For most devices:\n1. Go to Settings\n2. Find Network or WiFi settings\n3. Look for an option to forget/reset network connections\n4. Restart your device\n5. Try connecting again",
        "next_steps": {
            "Done": "check_connection"
        }
    }
}

# Ticket management endpoints
@app.post("/api/tickets", response_model=SupportTicket)
async def create_ticket(ticket_data: TicketCreate):
    ticket_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    new_ticket = SupportTicket(
        ticket_id=ticket_id,
        user_email=ticket_data.user_email,
        issue_type=ticket_data.issue_type,
        description=ticket_data.description,
        status="open",
        created_at=now,
        updated_at=now,
        steps_taken=[]
    )
    
    tickets[ticket_id] = new_ticket
    return new_ticket

@app.get("/api/tickets/{ticket_id}", response_model=SupportTicket)
async def get_ticket(ticket_id: str):
    if ticket_id not in tickets:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return tickets[ticket_id]

@app.get("/api/tickets/user/{email}", response_model=List[SupportTicket])
async def get_user_tickets(email: str):
    user_tickets = [ticket for ticket in tickets.values() if ticket.user_email == email]
    return user_tickets

@app.post("/api/tickets/{ticket_id}/steps")
async def add_troubleshooting_step(ticket_id: str, step: dict):
    if ticket_id not in tickets:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket = tickets[ticket_id]
    ticket.steps_taken.append(step)
    ticket.updated_at = datetime.utcnow()
    return {"status": "success"}

# Keep existing troubleshooting endpoints
@app.get("/api/troubleshoot/start")
async def start_troubleshooting():
    return {
        "step_id": "start",
        "question": troubleshooting_tree["start"]["question"],
        "options": troubleshooting_tree["start"]["options"]
    }

@app.get("/api/troubleshoot/{step_id}/{answer}")
async def get_next_step(step_id: str, answer: str):
    if step_id not in troubleshooting_tree:
        raise HTTPException(status_code=404, detail="Step not found")
    
    current_step = troubleshooting_tree[step_id]
    if answer not in current_step["next_steps"]:
        raise HTTPException(status_code=400, detail="Invalid answer")
    
    next_step_id = current_step["next_steps"][answer]
    next_step = troubleshooting_tree[next_step_id]
    
    return {
        "step_id": next_step_id,
        "question": next_step["question"],
        "options": next_step["options"],
        "solution": next_step.get("solution")
    }

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "API is running"}

@app.get("/api/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

# Add more API endpoints here 