const API_BASE_URL = 'http://localhost:8000';

let currentUser = null;
let authToken = localStorage.getItem('authToken');

const authSection = document.getElementById('authSection');
const mainApp = document.getElementById('mainApp');
const loadingOverlay = document.getElementById('loadingOverlay');

document.addEventListener('DOMContentLoaded', function() {
    if (authToken) {
        validateToken();
    } else {
        showAuthSection();
    }
    
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('diagnosisForm').addEventListener('submit', handleDiagnosis);
}

function showTab(tabName) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (tabName === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabs[0].classList.add('active');
    } else {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        tabs[1].classList.add('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.access_token;
            localStorage.setItem('authToken', authToken);
            currentUser = { username };
            showMainApp();
            loadUserSessions();
        } else {
            const error = await response.json();
            alert(`Login failed: ${error.detail}`);
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.access_token;
            localStorage.setItem('authToken', authToken);
            currentUser = { username };
            showMainApp();
            alert('Registration successful! Welcome to Tech Whisperer!');
        } else {
            const error = await response.json();
            alert(`Registration failed: ${error.detail}`);
        }
    } catch (error) {
        alert('Registration failed: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function validateToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = { username: 'User' };
            showMainApp();
            loadUserSessions();
        } else {
            localStorage.removeItem('authToken');
            authToken = null;
            showAuthSection();
        }
    } catch (error) {
        localStorage.removeItem('authToken');
        authToken = null;
        showAuthSection();
    }
}

function logout() {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    showAuthSection();
}

function showAuthSection() {
    authSection.classList.remove('hidden');
    mainApp.classList.add('hidden');
}

function showMainApp() {
    authSection.classList.add('hidden');
    mainApp.classList.remove('hidden');
    document.getElementById('userDisplayName').textContent = currentUser.username;
}

function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

async function handleDiagnosis(e) {
    e.preventDefault();
    
    const description = document.getElementById('issueDescription').value;
    
    if (!description.trim()) {
        alert('Please describe your tech issue');
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/diagnose`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ description })
        });
        
        if (response.ok) {
            const data = await response.json();
            displayResults(data);
            loadUserSessions();
        } else {
            const error = await response.json();
            alert(`Diagnosis failed: ${error.detail}`);
        }
    } catch (error) {
        alert('Diagnosis failed: ' + error.message);
    } finally {
        hideLoading();
    }
}

function displayResults(data) {
    const resultsSection = document.getElementById('resultsSection');
    const diagnosisText = document.getElementById('diagnosisText');
    const confidenceScore = document.getElementById('confidenceScore');
    const followUpQuestions = document.getElementById('followUpQuestions');
    const solutionsList = document.getElementById('solutionsList');
    
    diagnosisText.textContent = data.diagnosis;
    
    const confidencePercent = Math.round(data.confidence * 100);
    confidenceScore.textContent = `${confidencePercent}%`;
    
    followUpQuestions.innerHTML = '';
    data.follow_up_questions.forEach(question => {
        const li = document.createElement('li');
        li.textContent = question;
        followUpQuestions.appendChild(li);
    });
    
    solutionsList.innerHTML = '';
    data.solutions.forEach(solution => {
        const li = document.createElement('li');
        li.textContent = solution;
        solutionsList.appendChild(li);
    });
    
    resultsSection.classList.remove('hidden');
    
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

async function loadUserSessions() {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const sessions = await response.json();
            displaySessions(sessions);
        } else {
            console.error('Failed to load sessions');
        }
    } catch (error) {
        console.error('Error loading sessions:', error);
    }
}

function displaySessions(sessions) {
    const sessionsList = document.getElementById('sessionsList');
    
    if (sessions.length === 0) {
        sessionsList.innerHTML = '<div class="loading">No troubleshooting sessions yet. Start by describing a tech issue!</div>';
        return;
    }
    
    sessionsList.innerHTML = '';
    
    sessions.forEach(session => {
        const sessionCard = document.createElement('div');
        sessionCard.className = 'session-card';
        
        const date = new Date(session.created_at).toLocaleDateString();
        const time = new Date(session.created_at).toLocaleTimeString();
        
        sessionCard.innerHTML = `
            <div class="session-header">
                <span class="session-date">${date} at ${time}</span>
                <span class="session-status">${session.status}</span>
            </div>
            <div class="session-issue">${session.issue_description}</div>
            <div class="session-diagnosis">${session.diagnosis}</div>
        `;
        
        sessionsList.appendChild(sessionCard);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('offline', function() {
    alert('You are offline. Please check your internet connection.');
});
