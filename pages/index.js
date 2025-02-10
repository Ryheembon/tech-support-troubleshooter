import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, CardContent, Label, Select, Option } from "../components/ui";
import { ArrowRight, CheckCircle, AlertCircle, HelpCircle, RefreshCcw } from "lucide-react";
import './styles.css';  // Ensure this file contains your styles

export default function Home() {
  const [issue, setIssue] = useState("");
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [success, setSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");  // For search functionality

  useEffect(() => {
    setSuccess(false);
    setSolution(null);
  }, [issue]);

  const categories = {
    "Network Issues": [
      "Wi-Fi not working",
      "Slow internet",
      "Cannot connect to VPN",
      "No sound on computer",
      "Website not loading"
    ],
    "System Errors": [
      "Computer freezing",
      "Blue screen of death",
      "Slow computer"
    ],
    "App Crashes": [
      "App crashing",
      "Cannot print"
    ]
  };

  const filteredIssues = Object.entries(categories)
    .flatMap(([category, issues]) => issues)
    .filter((issue) => issue.toLowerCase().includes(searchTerm.toLowerCase()));

  const troubleshoot = async () => {
    setLoading(true);
    setAttempts(prev => prev + 1);
    try {
      const response = await axios.post("http://127.0.0.1:8000/troubleshoot", { issue });
      setSolution(response.data.solution);
      setSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      setSolution({ text: "Error reaching the server. Make sure FastAPI is running.", media: "", links: [] });
      setSuccess(false);
    }
    setLoading(false);
  };

  const resetAll = () => {
    setIssue("");
    setSolution(null);
    setAttempts(0);
    setSuccess(false);
  };

  return (
    <div className="troubleshooter-container">
      <div className="header">
        <h1 className="title">Tech Support Troubleshooter</h1>
        <p className="subtitle">We're here to help solve your technical issues</p>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search issues..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <Card className="main-card">
        <CardContent className="card-content">
          <div className="label-container">
            <Label className="input-label">
              What seems to be the problem?
              <HelpCircle
                className="help-icon"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              />
            </Label>
            {showTooltip && (
              <div className="tooltip">
                Select your issue from the dropdown and we'll provide targeted solutions.
              </div>
            )}
          </div>

          {/* Issue Dropdown with Categories */}
          <Select
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="issue-select"
          >
            <Option value="">Select an issue...</Option>
            {Object.entries(categories).map(([category, issues]) => (
              <optgroup label={category} key={category}>
                {issues.map((issue) => (
                  <Option key={issue} value={issue}>
                    {issue}
                  </Option>
                ))}
              </optgroup>
            ))}
          </Select>

          <div className="button-container">
            <Button
              className={`troubleshoot-button ${loading ? 'loading' : ''}`}
              onClick={troubleshoot}
              disabled={loading || !issue}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  Troubleshoot
                  <ArrowRight className="arrow-icon" />
                </>
              )}
            </Button>
            
            {attempts > 0 && (
              <Button
                onClick={resetAll}
                className="reset-button"
              >
                <RefreshCcw className="reset-icon" />
              </Button>
            )}
          </div>

          {attempts > 0 && (
            <div className="attempts-counter">
              Troubleshooting attempts: {attempts}
            </div>
          )}
        </CardContent>
      </Card>

      {solution && (
        <div className="solution-container">
          <Card className={`solution-card ${success ? 'success' : 'error'}`}>
            <CardContent className="solution-content">
              <div className="solution-header">
                {solution.text.includes("Error") ? (
                  <AlertCircle className="error-icon" />
                ) : (
                  <CheckCircle className="success-icon" />
                )}
                <div>
                  <h2 className="solution-title">
                    {solution.text.includes("Error") ? "Error" : "Suggested Fix"}
                  </h2>
                  <div className="solution-text">
                    {solution.text.split("\n").map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                  {solution.media && (
                    <img src={solution.media} alt="Solution Image" className="solution-media" />
                  )}
                  {solution.links && (
                    <div className="external-links">
                      {solution.links.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {solution && (
        <div className="feedback-section">
          <p>Did this fix your issue?</p>
          <div className="feedback-buttons">
            <Button className="yes-button" onClick={() => alert("Glad we could help!")}>
              ✅ Yes
            </Button>
            <Button className="no-button" onClick={() => alert("Try another solution or contact support.")}>
              ❌ No
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
