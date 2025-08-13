# Tech Whisperer API

A FastAPI backend for troubleshooting common tech issues using AI-powered diagnostics with OpenAI integration.

## 🚀 Features

- **AI-Powered Diagnostics**: Uses OpenAI GPT-3.5-turbo for intelligent issue analysis
- **User Authentication**: JWT-based authentication system
- **Session History**: Track all troubleshooting sessions
- **Smart Fallback**: Keyword-based analysis when OpenAI is unavailable
- **PostgreSQL Database**: Robust data storage
- **Swagger Documentation**: Interactive API docs
- **Comprehensive Logging**: Track all API usage and errors

## 📁 Project Structure

```
tech_whisperer/
├── main.py              # FastAPI application with all endpoints
├── models.py            # SQLAlchemy database models
├── database.py          # Database configuration and session management
├── auth.py              # JWT authentication utilities
├── diagnostic_engine.py # AI-powered diagnostic engine
├── schemas.py           # Pydantic request/response models
├── config.py            # Configuration settings
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Database Setup
You'll need PostgreSQL installed. Create a database:
```sql
CREATE DATABASE tech_whisperer;
```

### 3. Environment Configuration
Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://username:password@localhost/tech_whisperer
SECRET_KEY=your-super-secret-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key-here
```

**⚠️ SECURITY WARNING:**
- Never commit your `.env` file to version control
- Generate a strong SECRET_KEY (you can use: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- Keep your OpenAI API key secure and never share it
- Add `.env` to your `.gitignore` file

### 4. Run the Application
```bash
python main.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## 🔌 API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login and get JWT token

### Troubleshooting
- `POST /diagnose` - Submit an issue for AI diagnosis
- `GET /sessions` - Get user's troubleshooting history
- `GET /sessions/{id}` - Get specific session details
- `GET /stats` - Get usage statistics

### Testing
- `GET /test-openai` - Test OpenAI integration
- `GET /health` - Health check

## 🧠 How the AI Works

1. **Primary Analysis**: Uses OpenAI GPT-3.5-turbo to analyze user issues
2. **Structured Response**: AI provides diagnosis, follow-up questions, and solutions
3. **Fallback System**: If OpenAI fails, uses keyword-based pattern matching
4. **Session Storage**: All interactions are stored in PostgreSQL

## 📚 Learning Notes

### FastAPI Concepts Demonstrated:
- **Dependency Injection**: `Depends()` for database sessions and authentication
- **Pydantic Models**: Request/response validation and serialization
- **JWT Authentication**: Secure token-based authentication
- **CORS Middleware**: Cross-origin resource sharing
- **OpenAPI Documentation**: Automatic API documentation

### Database Concepts:
- **SQLAlchemy ORM**: Object-relational mapping
- **Relationship Management**: One-to-many relationships
- **Session Management**: Database connection handling

### Security Features:
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Stateless authentication
- **Input Validation**: Pydantic schema validation

### AI Integration:
- **OpenAI API**: GPT-3.5-turbo for natural language processing
- **Error Handling**: Graceful fallback when AI is unavailable
- **Structured Prompts**: Consistent AI responses

## 🔍 Example Usage

### 1. Register a User
```bash
curl -X POST "http://localhost:8000/register" \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

### 2. Login
```bash
curl -X POST "http://localhost:8000/login" \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "password123"}'
```

### 3. Diagnose an Issue
```bash
curl -X POST "http://localhost:8000/diagnose" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"description": "My computer is running very slowly and freezing frequently"}'
```

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Check PostgreSQL is running
   - Verify DATABASE_URL in config.py
   - Ensure database exists

2. **OpenAI API Error**:
   - Check API key is correct
   - Verify internet connection
   - Check OpenAI account has credits

3. **Import Errors**:
   - Ensure all dependencies are installed
   - Check Python version (3.8+ recommended)

## 🔧 Development Tips

1. **Use the Interactive Docs**: Visit `/docs` to test endpoints
2. **Check Logs**: Monitor `tech_whisperer.log` for debugging
3. **Test OpenAI**: Use `/test-openai` endpoint to verify AI integration
4. **Database Inspection**: Use a PostgreSQL client to inspect data

## 🚀 Next Steps

Potential enhancements:
- Add user roles and permissions
- Implement issue categories and tags
- Add email notifications
- Create a web frontend
- Add rate limiting
- Implement caching
- Add unit tests

## 📝 Notes for Learning

This project demonstrates modern Python web development practices:
- **Type Hints**: Throughout the codebase
- **Async/Await**: FastAPI's async nature
- **Error Handling**: Comprehensive exception handling
- **Logging**: Structured logging for debugging
- **Configuration Management**: Environment-based config
- **API Design**: RESTful API principles
