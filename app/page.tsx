'use client';
import { useState } from 'react';
import { ArrowRight, Wifi, WifiOff, Activity, Globe, HelpCircle, LifeBuoy } from 'lucide-react';
import axios from 'axios';

interface TroubleshootingStep {
  step_id: string;
  question: string;
  options: string[];
  solution?: string;
}

interface Ticket {
  ticket_id: string;
  user_email: string;
  issue_type: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  steps_taken: Array<{ question: string; answer: string }>;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<TroubleshootingStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [view, setView] = useState<'form' | 'troubleshoot' | 'ticket'>('form');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const issueTypes = [
    { id: 'no_internet', title: 'No Internet Connection', icon: WifiOff },
    { id: 'slow_internet', title: 'Slow Internet', icon: Activity },
    { id: 'wifi_issues', title: 'WiFi Not Connecting', icon: Wifi },
    { id: 'website_issues', title: 'Website Not Loading', icon: Globe },
    { id: 'other', title: 'Other Network Issue', icon: HelpCircle },
  ];

  const createTicket = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/tickets', {
        user_email: userEmail,
        user_name: userName,
        issue_type: 'Network Issue',
        description: description
      });
      setCurrentTicket(response.data);
      setView('troubleshoot');
      setError(null);
    } catch (err) {
      setError('Failed to create support ticket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startTroubleshooting = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/troubleshoot/start');
      setCurrentStep(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to start troubleshooting');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = async (answer: string) => {
    if (!currentStep) return;
    
    setLoading(true);
    try {
      // Record step in ticket
      if (currentTicket) {
        await axios.post(`http://localhost:8000/api/tickets/${currentTicket.ticket_id}/steps`, {
          question: currentStep.question,
          answer: answer
        });
      }

      // Get next step
      const response = await axios.get(
        `http://localhost:8000/api/troubleshoot/${currentStep.step_id}/${encodeURIComponent(answer)}`
      );
      setCurrentStep(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to get next step');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = () => {
    console.log('Feedback submitted:', { rating: feedbackRating, comment: feedbackText });
    setFeedbackSubmitted(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackSubmitted(false);
      setFeedbackRating(0);
      setFeedbackText('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-start via-purple-mid to-pink-end relative overflow-hidden">
      {/* Dark mode toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={() => document.documentElement.classList.toggle('dark')} 
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          aria-label="Toggle dark mode"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>
      </div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -right-4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-6 h-6 bg-white/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-white/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>

      <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col relative z-10">
        {/* Header section with icon */}
        <div className="text-center text-white mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-6 backdrop-blur-sm animate-float">
            <LifeBuoy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 animate-fadeIn bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Network Support Assistant
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Having network troubles? Don't worry! We'll guide you through the process step by step.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 animate-fadeIn">
            <div className="bg-red-100/90 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto w-full flex-1">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 animate-fadeIn">
            {view === 'form' && (
              <div className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Let's Get Started</h2>
                    <p className="text-gray-600 mt-2">Fill out the form below and we'll help you resolve your network issues.</p>
                  </div>
                  
                  {/* Quick access to common issues */}
                  <div className="mb-8">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Common Issues</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <button 
                        onClick={() => setDescription('WiFi Not Connecting')}
                        className="flex flex-col items-center p-4 border rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                      >
                        <Wifi className="w-6 h-6 text-blue-500 mb-2" />
                        <span className="text-sm text-gray-700">WiFi Issues</span>
                      </button>
                      <button 
                        onClick={() => setDescription('Slow Internet')}
                        className="flex flex-col items-center p-4 border rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                      >
                        <Activity className="w-6 h-6 text-blue-500 mb-2" />
                        <span className="text-sm text-gray-700">Slow Internet</span>
                      </button>
                      <button 
                        onClick={() => setDescription('Website Not Loading')}
                        className="flex flex-col items-center p-4 border rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                      >
                        <Globe className="w-6 h-6 text-blue-500 mb-2" />
                        <span className="text-sm text-gray-700">Website Issues</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 animate-fadeIn">
                    {/* Email field */}
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          transition-all hover:border-blue-400 bg-white/50 backdrop-blur-sm text-black"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          transition-all hover:border-blue-400 bg-white/50 backdrop-blur-sm text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What issue are you experiencing?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {issueTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setDescription(type.title)}
                            className={`flex items-center p-4 border rounded-lg transition-all transform hover:scale-105 
                              ${description === type.title 
                                ? 'border-blue-500 bg-blue-50 shadow-md' 
                                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'}`}
                          >
                            <type.icon className={`w-5 h-5 mr-3 ${
                              description === type.title ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                            <span className={`text-sm ${
                              description === type.title ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {type.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Details
                      </label>
                      <textarea
                        placeholder="Please provide any additional details about your issue..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                      />
                    </div>
                  </div>

                  <button
                    onClick={createTicket}
                    disabled={loading || !userEmail || !userName || !description}
                    className="w-full py-4 px-6 bg-gradient-custom from-indigo-start via-purple-mid to-pink-end text-white rounded-lg 
                      hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100
                      shadow-lg hover:shadow-xl disabled:hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <span className="text-lg">Start Troubleshooting</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {view === 'troubleshoot' && (
              <div className="p-8">
                {!currentStep && !loading && (
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Start</h2>
                    <button
                      onClick={startTroubleshooting}
                      className="py-3 px-6 bg-gradient-custom from-indigo-start via-purple-mid to-pink-end text-white rounded-lg 
                        hover:opacity-90 transition-opacity inline-flex items-center space-x-2"
                    >
                      <span>Begin Troubleshooting</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                  </div>
                )}

                {currentStep && !loading && (
                  <div className="space-y-6">
                    {/* Add progress indicator */}
                    <div className="mb-6">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-indigo-start via-purple-mid to-pink-end h-2.5 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 flex justify-between">
                        <span>Troubleshooting in progress</span>
                        <span>{currentStep.solution ? 'Solution found!' : 'Diagnosing issue...'}</span>
                      </p>
                    </div>
                    
                    <h2 className="text-2xl font-semibold text-gray-800">{currentStep.question}</h2>
                    
                    {currentStep.solution && (
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                        <h3 className="font-medium text-green-800 mb-2">Solution:</h3>
                        <pre className="whitespace-pre-wrap text-green-700">{currentStep.solution}</pre>
                      </div>
                    )}

                    <div className="space-y-3">
                      {currentStep.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleOptionClick(option)}
                          className="w-full py-3 px-4 bg-white border border-gray-300 hover:border-blue-500 hover:bg-blue-50 
                            rounded-lg text-left transition-all flex items-center justify-between group"
                        >
                          <span className="text-gray-700 group-hover:text-blue-600">{option}</span>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                        </button>
                      ))}
                    </div>

                    {/* Add help and resources section */}
                    <div className="mt-8 p-4 bg-blue-50/90 backdrop-blur-sm rounded-lg border border-blue-100">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">Need additional help?</h3>
                      <p className="text-blue-700 mb-4">Try these resources or contact our support team:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <a href="#" className="flex items-center p-3 bg-white/70 rounded-lg border border-blue-200 hover:bg-white/90 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2">
                            <path d="M18 6h-5c-1.1 0-2 .9-2 2v8" />
                            <circle cx="7" cy="16" r="3" />
                            <path d="M18 20.2V3" />
                          </svg>
                          <span className="text-blue-700">Video Tutorials</span>
                        </a>
                        <a href="#" className="flex items-center p-3 bg-white/70 rounded-lg border border-blue-200 hover:bg-white/90 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                            <path d="M16 16a4 4 0 1 1-4-4 4 4 0 0 1 4 4" />
                          </svg>
                          <span className="text-blue-700">Common FAQs</span>
                        </a>
                        <a href="tel:+18001234567" className="flex items-center p-3 bg-white/70 rounded-lg border border-blue-200 hover:bg-white/90 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <span className="text-blue-700">Call Support</span>
                        </a>
                        <a href="mailto:support@example.com" className="flex items-center p-3 bg-white/70 rounded-lg border border-blue-200 hover:bg-white/90 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          <span className="text-blue-700">Email Support</span>
                        </a>
                      </div>
                    </div>
                    
                    {/* Add feedback component */}
                    {currentStep && currentStep.solution && !showFeedback && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => setShowFeedback(true)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Was this helpful? Give feedback
                        </button>
                      </div>
                    )}

                    {showFeedback && (
                      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 animate-fadeIn">
                        <h3 className="text-lg font-medium text-green-800 mb-2">
                          {feedbackSubmitted ? 'Thank you for your feedback!' : 'Was this solution helpful?'}
                        </h3>
                        
                        {!feedbackSubmitted ? (
                          <>
                            <div className="flex justify-center gap-2 mb-4">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  onClick={() => setFeedbackRating(rating)}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    feedbackRating >= rating 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-white border border-gray-300 text-gray-400'
                                  }`}
                                >
                                  {rating}
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              placeholder="Any additional comments? (optional)"
                              className="w-full p-3 border border-gray-300 rounded-lg text-black mb-4"
                              rows={3}
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setShowFeedback(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={submitFeedback}
                                disabled={feedbackRating === 0}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-500"
                              >
                                Submit Feedback
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <span>Your feedback helps us improve our support!</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="bg-red-500 p-4 text-white">
        Test Tailwind
      </div>
    </div>
  );
} 