import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, AlertCircle, Settings, Trash2, ArrowRight } from 'lucide-react';
import { sendChatMessage } from '../services/ai';
import { marked } from 'marked';

// Configure marked to handle line breaks and tables nicely
marked.setOptions({
  gfm: true,
  breaks: true,
});

const SUGGESTED_PROMPTS = [
  "Explain the core features of the Gemma 2 models.",
  "How can I set up automated deployments with GitHub Actions?",
  "Write a clean CSS glassmorphic card design template.",
  "Give me ideas for advanced features to add to this chatbot app."
];

function Chatbot({ apiKey, modelName, onNavigateToSettings }) {
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('chatbot_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  // Keep scroll focused on latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Sync messages to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('chatbot_messages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    setErrorMessage('');
    const userMessage = { sender: 'user', text };
    
    // Optimistically add user message and clear inputs
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) {
      setInputValue('');
    }
    setIsLoading(true);

    try {
      const response = await sendChatMessage(apiKey, modelName, messages, text);
      const aiMessage = { sender: 'ai', text: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setErrorMessage(error.message || 'An unexpected error occurred while communicating with the AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your conversation history?')) {
      setMessages([]);
      sessionStorage.removeItem('chatbot_messages');
      setErrorMessage('');
    }
  };

  const formatMessageText = (text) => {
    try {
      return { __html: marked.parse(text) };
    } catch (e) {
      console.error(e);
      return { __html: text }; // Fallback to raw text if parsing fails
    }
  };

  // If API key is missing, show configuration prompt
  if (!apiKey) {
    return (
      <div className="tab-content" style={{ justifyContent: 'center' }}>
        <div className="glass-panel welcome-message" style={{ padding: '2.5rem' }}>
          <AlertCircle size={48} style={{ color: 'var(--color-accent)', filter: 'drop-shadow(0 0 4px var(--color-accent))' }} />
          <h2>API Key Configuration Required</h2>
          <p>
            To activate the AI chatbot, you need to configure your Google AI Studio API Key. 
            This is a security practice that ensures your API usage is private and billed directly to your credentials.
          </p>
          <button id="configure-api-btn" onClick={onNavigateToSettings} className="btn-primary" style={{ marginTop: '1rem' }}>
            <Settings size={18} />
            <span>Go to Settings</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="glass-panel chat-layout">
        
        {/* Banner */}
        <div className="chat-banner">
          <div className="chat-banner-model">
            <span className="status-dot"></span>
            <span>Active Model: <strong>{modelName}</strong></span>
          </div>
          {messages.length > 0 && (
            <button 
              id="clear-chat-btn"
              onClick={handleClearHistory} 
              className="btn-clear-chat" 
              title="Clear chat history"
            >
              <Trash2 size={14} />
              <span style={{ marginLeft: '0.25rem' }}>Clear Chat</span>
            </button>
          )}
        </div>

        {/* Message Panel */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <Bot size={48} />
              <h2>Welcome to DevHub Chat</h2>
              <p>
                This chatbot is connected directly to your Google AI Studio account using the <strong>{modelName}</strong> model.
                Ask technical questions, draft code, or brainstorm ideas.
              </p>
              
              <div className="suggested-prompts">
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <button 
                    key={index} 
                    onClick={() => handleSend(prompt)}
                    className="prompt-btn"
                  >
                    <span>{prompt}</span>
                    <ArrowRight size={14} style={{ float: 'right', marginTop: '2px', opacity: 0.7 }} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`chat-bubble-container ${msg.sender}`}>
                <div className="chat-avatar">
                  {msg.sender === 'user' ? 'ME' : 'AI'}
                </div>
                <div 
                  className="chat-bubble"
                  dangerouslySetInnerHTML={formatMessageText(msg.text)}
                />
              </div>
            ))
          )}

          {isLoading && (
            <div className="chat-bubble-container ai">
              <div className="chat-avatar">AI</div>
              <div className="chat-bubble">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="status-badge warning" style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }} 
          className="chat-input-panel"
        >
          <div className="chat-input-wrapper">
            <input
              id="chat-message-input"
              type="text"
              placeholder="Ask anything, e.g. explain React lifecycle..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="chat-input"
            />
            <button 
              id="send-message-btn"
              type="submit" 
              disabled={isLoading || !inputValue.trim()}
              className="btn-send"
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}

export default Chatbot;
