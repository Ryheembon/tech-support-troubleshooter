'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  LifeBuoy, Wifi, Activity, Globe, HelpCircle, Send, 
  Sparkles, ArrowLeft, CheckCircle2, ArrowRight,
  AlertCircle, Power, Zap, Settings, Download, HardDrive,
  Network, Shield, Printer, Monitor, Loader2
} from 'lucide-react';
import { troubleshootingFlows } from './troubleshootingSteps';
import { ErrorBoundary } from './ErrorBoundary';

// Rate limiting - one submission per minute
const SUBMISSION_COOLDOWN = 60000;

const commonIssues = [
  { id: 'wifi', title: 'WiFi Issues', icon: Wifi, description: 'Connection problems or slow WiFi' },
  { id: 'performance', title: 'Slow Performance', icon: Activity, description: 'System running slowly' },
  { id: 'website', title: 'Website Access', icon: Globe, description: 'Cannot access websites' },
  { id: 'other', title: 'Other Issues', icon: HelpCircle, description: 'Other technical problems' },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('');
  const [description, setDescription] = useState('');
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [troubleshootingHistory, setTroubleshootingHistory] = useState<string[]>([]);
  const [savedSessions, setSavedSessions] = useState<{
    date: string;
    issue: string;
    steps: string[];
    solution: string | null;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Load saved sessions from localStorage with error handling
  useEffect(() => {
    try {
      setIsLoading(true);
      const saved = localStorage.getItem('troubleshootingSessions');
      if (saved) {
        const parsedSessions = JSON.parse(saved);
        if (Array.isArray(parsedSessions)) {
          setSavedSessions(parsedSessions);
        }
      }
    } catch (error) {
      console.error('Error loading saved sessions:', error);
      // If there's an error, we'll just start fresh
      localStorage.removeItem('troubleshootingSessions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cleanup old sessions periodically (keep last 50)
  useEffect(() => {
    if (savedSessions.length > 50) {
      const recentSessions = savedSessions.slice(-50);
      setSavedSessions(recentSessions);
      localStorage.setItem('troubleshootingSessions', JSON.stringify(recentSessions));
    }
  }, [savedSessions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const now = Date.now();
    if (now - lastSubmissionTime < SUBMISSION_COOLDOWN) {
      const waitTime = Math.ceil((SUBMISSION_COOLDOWN - (now - lastSubmissionTime)) / 1000);
      setError(`Please wait ${waitTime} seconds before submitting another request.`);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    
    try {
      // Save form data and send email notification
      const formData = { email, name, selectedIssue, description };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Submitting:', formData);
      
      // Update submission time
      setLastSubmissionTime(now);
      
      // Show success message
      alert('Your request has been submitted. We will contact you shortly.');
      
      // Clear form
      setEmail('');
      setName('');
      setDescription('');
      setSelectedIssue('');
    } catch (error) {
      setError('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveTroubleshootingSession = useCallback(() => {
    try {
      const session = {
        date: new Date().toISOString(),
        issue: selectedIssue,
        steps: troubleshootingHistory,
        solution: solution
      };

      const updatedSessions = [...savedSessions, session];
      setSavedSessions(updatedSessions);
      localStorage.setItem('troubleshootingSessions', JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error saving session:', error);
      setError('Unable to save session. Please try again.');
    }
  }, [savedSessions, selectedIssue, troubleshootingHistory, solution]);

  const getStepIcon = (stepId: string) => {
    const iconMap: Record<string, any> = {
      'check-power': Power,
      'check-connection': Network,
      'check-speed': Zap,
      'optimize-connection': Settings,
      'check-resources': HardDrive,
      'scan-malware': Shield,
      'check-disk': Download,
      'hardware-type': Monitor,
      'default': AlertCircle
    };
    return iconMap[stepId] || iconMap.default;
  };

  const startTroubleshooting = (issue: string) => {
    setSelectedIssue(issue);
    setCurrentStep('start');
    setSolution(null);
    setTroubleshootingHistory([]);
  };

  const handleOption = (option: { text: string; nextStep?: string; solution?: string }) => {
    if (option.solution) {
      setSolution(option.solution);
    } else if (option.nextStep && selectedIssue) {
      setTroubleshootingHistory(prev => [...prev, currentStep || '']);
      setCurrentStep(option.nextStep);
    }
  };

  const goBack = () => {
    if (troubleshootingHistory.length > 0) {
      const newHistory = [...troubleshootingHistory];
      const lastStep = newHistory.pop();
      setTroubleshootingHistory(newHistory);
      setCurrentStep(lastStep || 'start');
      setSolution(null);
    } else {
      setCurrentStep(null);
      setSolution(null);
      setSelectedIssue('');
    }
  };

  const getCurrentQuestion = () => {
    if (!selectedIssue || !currentStep) return null;
    return troubleshootingFlows[selectedIssue]?.[currentStep];
  };

  const renderTroubleshootingStep = () => {
    const question = getCurrentQuestion();
    if (!question) return null;

    const StepIcon = getStepIcon(question.id);
    const totalSteps = Object.keys(troubleshootingFlows[selectedIssue]).length;
    const currentStepNumber = troubleshootingHistory.length + 1;

    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-start justify-between">
          <button
            onClick={goBack}
            className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-white/60 text-sm flex items-center gap-2">
            <div className="h-1 w-32 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/60 rounded-full transition-all duration-300"
                style={{ width: `${(currentStepNumber / totalSteps) * 100}%` }}
              ></div>
            </div>
            <span>Step {currentStepNumber}/{totalSteps}</span>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6">
            <StepIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-8">
            {question.question}
          </h3>

          <div className="grid gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOption(option)}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl 
                  transition-all duration-300 text-white text-left
                  hover:transform hover:scale-102 focus:outline-none focus:ring-2 
                  focus:ring-white/30 flex items-center justify-between group"
              >
                <span>{option.text}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSolution = () => {
    if (!solution) return null;

    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-start justify-between">
          <button
            onClick={goBack}
            className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={saveTroubleshootingSession}
            className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Save Session
          </button>
        </div>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white">Solution Found</h3>
          <p className="text-white/90 text-lg leading-relaxed max-w-2xl mx-auto">
            {solution}
          </p>
          <div className="mt-8 space-y-4">
            <button
              onClick={() => {
                setCurrentStep(null);
                setSolution(null);
                setSelectedIssue('');
              }}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg
                transition-all duration-300 text-white inline-flex items-center gap-2"
            >
              Start New Issue
              <ArrowRight className="w-4 h-4" />
            </button>
            {savedSessions.length > 0 && (
              <div className="text-white/60 text-sm">
                Previous sessions saved: {savedSessions.length}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Update the form button to show loading state
  const renderSubmitButton = () => (
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg
        transition-all duration-300 font-medium flex items-center gap-2
        focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          Submit Request
          <Send className="w-4 h-4" />
        </>
      )}
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen p-6 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -right-4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 -left-4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl animate-pulse-soft"></div>
          
          {/* Decorative sparkles */}
          <div className="absolute top-20 left-20 animate-float" style={{ animationDelay: '1s' }}>
            <Sparkles className="w-6 h-6 text-white/30" />
          </div>
          <div className="absolute bottom-32 right-20 animate-float" style={{ animationDelay: '2s' }}>
            <Sparkles className="w-4 h-4 text-white/20" />
          </div>
        </div>

        <div className="w-full max-w-4xl relative z-10">
          {/* Header section */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-8 backdrop-blur-sm ring-1 ring-white/20 shadow-lg">
              <LifeBuoy className="w-12 h-12 text-white animate-pulse-soft" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Tech Support Assistant
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Having technical issues? We're here to help you resolve them quickly and efficiently.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-white text-center animate-slide-up">
              {error}
            </div>
          )}

          {/* Main card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl ring-1 ring-white/20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {!currentStep ? (
              <>
                {/* Common issues grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {commonIssues.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => startTroubleshooting(item.title)}
                      className={`group p-6 rounded-xl transition-all duration-300 ${
                        selectedIssue === item.title 
                          ? 'bg-white/20 ring-2 ring-white/30' 
                          : 'bg-white/10 hover:bg-white/15 hover:scale-105'
                      }`}
                    >
                      <div className="flex flex-col items-center text-white">
                        <item.icon className={`w-8 h-8 mb-3 transition-transform group-hover:scale-110 ${
                          selectedIssue === item.title ? 'text-white' : 'text-white/70'
                        }`} />
                        <h3 className="font-medium mb-2">{item.title}</h3>
                        <p className="text-sm opacity-70 text-center">{item.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Support form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-white/90 font-medium">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                          text-white placeholder-white/50 focus:outline-none focus:ring-2 
                          focus:ring-white/30 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-white/90 font-medium">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                          text-white placeholder-white/50 focus:outline-none focus:ring-2 
                          focus:ring-white/30 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-white/90 font-medium">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please describe your issue in detail..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg
                        text-white placeholder-white/50 focus:outline-none focus:ring-2 
                        focus:ring-white/30 transition-all duration-300 min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    {renderSubmitButton()}
                  </div>
                </form>
              </>
            ) : solution ? (
              renderSolution()
            ) : (
              renderTroubleshootingStep()
            )}
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}
