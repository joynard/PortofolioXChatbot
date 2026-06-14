import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Portfolio from './components/Portfolio';
import Settings from './components/Settings';

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [githubUsername, setGithubUsername] = useState(() => localStorage.getItem('github_username') || '');
  const [modelName, setModelName] = useState(() => localStorage.getItem('gemini_model') || 'gemini-3.5-flash');
  const [activeTab, setActiveTab] = useState('chat');
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Sync settings with localStorage
  useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('github_username', githubUsername);
  }, [githubUsername]);

  useEffect(() => {
    localStorage.setItem('gemini_model', modelName);
  }, [modelName]);

  // Capture-phase scroll listener to hide header on mobile scroll down
  useEffect(() => {
    if (activeTab === 'chat') {
      setIsHeaderHidden(false);
      return;
    }

    const handleScroll = (e) => {
      if (window.innerWidth > 600) {
        setIsHeaderHidden(false);
        return;
      }

      const target = e.target;
      if (target instanceof Element) {
        const currentScrollY = target.scrollTop;
        
        // Ignore small movements
        if (Math.abs(currentScrollY - lastScrollY.current) < 12) {
          return;
        }

        if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
          setIsHeaderHidden(true);
        } else {
          setIsHeaderHidden(false);
        }
        
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [activeTab]);

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isHeaderHidden={isHeaderHidden} />
      <main className="app-container">
        {activeTab === 'portfolio' && (
          <Portfolio 
            githubUsername={githubUsername || 'joynard'} 
            isCreatorFallback={!githubUsername}
            onNavigateToSettings={() => setActiveTab('settings')}
          />
        )}
        {activeTab === 'chat' && (
          <Chatbot 
            apiKey={apiKey} 
            modelName={modelName} 
            onNavigateToSettings={() => setActiveTab('settings')}
          />
        )}
        {activeTab === 'settings' && (
          <Settings 
            apiKey={apiKey} 
            setApiKey={setApiKey}
            githubUsername={githubUsername}
            setGithubUsername={setGithubUsername}
            modelName={modelName}
            setModelName={setModelName}
          />
        )}
      </main>
      <footer className="footer-credit">
        Designed & Developed by{' '}
        <a 
          href="https://github.com/joynard" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          @joynard
        </a>
      </footer>
    </>
  );
}

export default App;
