import re
import json
from typing import Dict, List, Tuple
from openai import OpenAI
from config import OPENAI_API_KEY

class DiagnosticEngine:
    def __init__(self):
        self.openai_client = OpenAI(api_key=OPENAI_API_KEY)
        
        self.issue_patterns = {
            "slow_internet": {
                "keywords": ["slow", "internet", "wifi", "connection", "loading", "buffering"],
                "questions": [
                    "What's your internet speed?",
                    "Are you using WiFi or ethernet?",
                    "How many devices are connected?",
                    "Have you tried restarting your router?"
                ],
                "solutions": [
                    "Restart your router and modem",
                    "Check for background downloads",
                    "Move closer to your WiFi router",
                    "Contact your ISP if the issue persists"
                ]
            },
            "screen_flickering": {
                "keywords": ["flicker", "screen", "display", "blinking", "glitch"],
                "questions": [
                    "Is this happening on all applications?",
                    "Does it happen during startup?",
                    "Have you updated your graphics drivers?",
                    "Is your monitor properly connected?"
                ],
                "solutions": [
                    "Update your graphics drivers",
                    "Check monitor cable connections",
                    "Try a different monitor or cable",
                    "Check for software conflicts"
                ]
            },
            "login_problems": {
                "keywords": ["login", "password", "account", "access", "sign in", "authentication"],
                "questions": [
                    "Are you getting any specific error messages?",
                    "Have you tried resetting your password?",
                    "Is this happening on all devices?",
                    "Can you access the account recovery options?"
                ],
                "solutions": [
                    "Try resetting your password",
                    "Clear browser cache and cookies",
                    "Try a different browser",
                    "Contact support if the issue persists"
                ]
            },
            "general_performance": {
                "keywords": ["slow", "performance", "lag", "freeze", "crash", "unresponsive"],
                "questions": [
                    "When did this start happening?",
                    "Have you installed any new software recently?",
                    "How much free disk space do you have?",
                    "Are you running many programs at once?"
                ],
                "solutions": [
                    "Restart your computer",
                    "Close unnecessary programs",
                    "Check for malware",
                    "Free up disk space",
                    "Update your operating system"
                ]
            }
        }
    
    def analyze_with_openai(self, description: str) -> Dict:
        try:
            prompt = f"""
            You are a tech support expert. Analyze this user's tech issue and provide:
            1. A clear diagnosis
            2. 3-4 follow-up questions to gather more information
            3. 3-4 specific solutions to try
            4. The most likely issue category (slow_internet, screen_flickering, login_problems, general_performance, or other)
            
            User's issue: {description}
            
            Respond in JSON format:
            {{
                "diagnosis": "your diagnosis here",
                "follow_up_questions": ["question1", "question2", "question3"],
                "solutions": ["solution1", "solution2", "solution3"],
                "issue_type": "category_name",
                "confidence": 0.85
            }}
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful tech support expert. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            content = response.choices[0].message.content
            try:
                result = json.loads(content)
                return result
            except json.JSONDecodeError:
                return self.analyze_with_keywords(description)
                
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return self.analyze_with_keywords(description)
    
    def analyze_with_keywords(self, description: str) -> Dict:
        description_lower = description.lower()
        
        matched_issues = []
        for issue_type, pattern in self.issue_patterns.items():
            score = 0
            for keyword in pattern["keywords"]:
                if keyword in description_lower:
                    score += 1
            
            if score > 0:
                matched_issues.append({
                    "issue_type": issue_type,
                    "score": score,
                    "questions": pattern["questions"],
                    "solutions": pattern["solutions"]
                })
        
        matched_issues.sort(key=lambda x: x["score"], reverse=True)
        
        if matched_issues:
            best_match = matched_issues[0]
            return {
                "diagnosis": f"Based on your description, this appears to be a {best_match['issue_type'].replace('_', ' ')} issue.",
                "confidence": best_match["score"] / len(best_match["questions"]),
                "follow_up_questions": best_match["questions"][:3],
                "solutions": best_match["solutions"][:3],
                "issue_type": best_match["issue_type"]
            }
        else:
            return {
                "diagnosis": "I couldn't identify a specific issue type from your description. Could you provide more details?",
                "confidence": 0.0,
                "follow_up_questions": [
                    "What exactly is happening?",
                    "When did this start?",
                    "What have you already tried?"
                ],
                "solutions": [
                    "Try restarting your device",
                    "Check for software updates",
                    "Contact technical support"
                ],
                "issue_type": "unknown"
            }
    
    def analyze_issue(self, description: str) -> Dict:
        return self.analyze_with_openai(description)

diagnostic_engine = DiagnosticEngine()
