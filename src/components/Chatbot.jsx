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
  "Explain the core features of the Gemma 4 models.",
  "How can I set up automated deployments with GitHub Actions?",
  "Write a clean CSS glassmorphic card design template.",
  "Give me ideas for advanced features to add to this chatbot app."
];

const CREATOR_FALLBACK_API_KEY = import.meta.env.VITE_CREATOR_API_KEY || "";

function Chatbot({ apiKey, modelName, onNavigateToSettings }) {
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('chatbot_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [useFallback, setUseFallback] = useState(() => sessionStorage.getItem('use_fallback_api') || 'prompt');
  const [fallbackCount, setFallbackCount] = useState(() => parseInt(localStorage.getItem('fallback_api_count') || '0', 10));
  const [showLimitModal, setShowLimitModal] = useState(false);
  
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

    // Guard fallback API key usage limits
    if (!apiKey) {
      if (fallbackCount >= 10) {
        setShowLimitModal(true);
        return;
      }
    }

    setErrorMessage('');
    const userMessage = { sender: 'user', text };
    
    // Optimistically add user message and clear inputs
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) {
      setInputValue('');
    }
    setIsLoading(true);

    try {
      const activeKey = apiKey || CREATOR_FALLBACK_API_KEY;
      if (!activeKey) {
        throw new Error('Creator fallback API key is not configured. Please enter your own API key in Settings.');
      }
      const response = await sendChatMessage(activeKey, modelName, messages, text);
      const aiMessage = { sender: 'ai', text: response };
      setMessages(prev => [...prev, aiMessage]);

      // Increment fallback usage count
      if (!apiKey) {
        const nextCount = fallbackCount + 1;
        setFallbackCount(nextCount);
        localStorage.setItem('fallback_api_count', nextCount.toString());
      }
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

  // If API key is missing and they haven't accepted the fallback key yet
  if (!apiKey && useFallback === 'prompt') {
    return (
      <div className="tab-content" style={{ justifyContent: 'center' }}>
        <div className="glass-panel welcome-message" style={{ padding: '2.5rem', maxWidth: '500px' }}>
          <Bot size={48} style={{ color: 'var(--color-primary)', filter: 'drop-shadow(0 0 4px var(--color-primary))' }} />
          <h2>Try DevHub.AI Chatbot</h2>
          <p>
            You don't have a personal Google AI Studio API key configured. Would you like to try the chatbot using the creator's API Key? (Maximum 10 messages).
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', width: '100%' }}>
            <button 
              id="try-fallback-btn"
              onClick={() => {
                setUseFallback('yes');
                sessionStorage.setItem('use_fallback_api', 'yes');
              }} 
              className="btn-primary"
              style={{ flex: 1 }}
            >
              Yes, Try It
            </button>
            <button 
              id="configure-own-key-btn"
              onClick={onNavigateToSettings} 
              className="btn-github"
              style={{ flex: 1 }}
            >
              No, Enter My Key
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="glass-panel chat-layout">
        {showLimitModal && (
          <div className="modal-backdrop">
            <div className="glass-panel welcome-message" style={{ padding: '2.5rem', maxWidth: '450px', background: 'var(--surf-glass)', backdropFilter: 'blur(20px)' }}>
              <AlertCircle size={48} style={{ color: 'var(--color-accent)' }} />
              <h2>Obrolan Gratis Habis</h2>
              <p>
                Anda telah mencapai batas maksimal 10 obrolan gratis menggunakan API Key kreator. 
                Silakan masukkan API Key Google AI Studio Anda sendiri untuk melanjutkan.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                <a 
                  href="https://aistudio.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  Dapatkan API Key Gratis
                </a>
                <a 
                  href="https://ai.google.dev/gemini-api/docs/quickstart" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-github"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  Baca Tutorial Setup
                </a>
                <button 
                  id="go-settings-limit-btn"
                  onClick={() => {
                    setShowLimitModal(false);
                    onNavigateToSettings();
                  }} 
                  className="btn-github"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                >
                  Masukkan API Key di Settings
                </button>
              </div>
            </div>
          </div>
        )}
        
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
