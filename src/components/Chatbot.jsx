import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, AlertCircle, Settings, Trash2, ArrowRight, Copy, Check } from 'lucide-react';
import { sendChatMessage } from '../services/ai';
import { marked } from 'marked';

// Configure marked to handle line breaks and tables nicely
marked.setOptions({
  gfm: true,
  breaks: true,
});

const SUGGESTED_PROMPTS = [
  "Explain the core features of the Gemini 3.5 models.",
  "How can I set up automated deployments with GitHub Actions?",
  "Write a clean CSS glassmorphic card design template.",
  "Give me ideas for advanced features to add to this chatbot app."
];

const getCreatorFallbackKey = () => {
  try {
    const b64 = typeof __CREATOR_KEY_B64__ !== 'undefined' ? __CREATOR_KEY_B64__ : '';
    if (!b64) return '';
    return atob(b64);
  } catch (e) {
    console.error('Failed to decode fallback API key:', e);
    return '';
  }
};

const CREATOR_FALLBACK_API_KEY = getCreatorFallbackKey();

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
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Inject copy buttons to code blocks dynamically when messages load
  useEffect(() => {
    if (!chatContainerRef.current) return;
    const preElements = chatContainerRef.current.querySelectorAll('pre');
    preElements.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return;

      const button = document.createElement('button');
      button.className = 'code-copy-btn';
      button.type = 'button';
      button.innerHTML = '<span>Copy</span>';
      
      pre.style.position = 'relative';

      button.addEventListener('click', () => {
        const codeElement = pre.querySelector('code');
        if (codeElement) {
          const codeText = codeElement.innerText;
          navigator.clipboard.writeText(codeText).then(() => {
            button.innerHTML = '<span>Copied!</span>';
            button.classList.add('copied');
            setTimeout(() => {
              button.innerHTML = '<span>Copy</span>';
              button.classList.remove('copied');
            }, 2000);
          });
        }
      });

      pre.appendChild(button);
    });
  }, [messages, isLoading]);

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

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
      if (fallbackCount >= 5) {
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
            You don't have a personal Google AI Studio API key configured. Would you like to try the chatbot using the creator's API Key? (Maximum 5 messages).
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
              <h2>Free Chats Exhausted</h2>
              <p>
                You have reached the maximum limit of 5 free chats using the creator's API Key. 
                Please enter your own Google AI Studio API Key to continue.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                <a 
                  href="https://aistudio.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  Get Free API Key
                </a>
                <a 
                  href="https://ai.google.dev/gemini-api/docs/quickstart" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-github"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  Read Setup Tutorial
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
                  Enter API Key in Settings
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
        <div className="chat-messages" ref={chatContainerRef}>
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
                <div className="chat-bubble-wrapper">
                  <div 
                    className="chat-bubble"
                    dangerouslySetInnerHTML={formatMessageText(msg.text)}
                  />
                  {msg.sender === 'ai' && (
                    <button 
                      type="button"
                      onClick={() => handleCopyText(msg.text, index)} 
                      className="bubble-copy-btn"
                      title="Copy response"
                    >
                      {copiedIndex === index ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="chat-bubble-container ai">
              <div className="chat-bubble-wrapper">
                <div className="chat-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
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
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
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
