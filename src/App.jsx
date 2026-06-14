import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Portfolio from './components/Portfolio';
import Settings from './components/Settings';

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [githubUsername, setGithubUsername] = useState(() => localStorage.getItem('github_username') || '');
  const [modelName, setModelName] = useState(() => localStorage.getItem('gemini_model') || 'gemma-4-31b');
  const [activeTab, setActiveTab] = useState('portfolio');

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

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-container">
        {activeTab === 'portfolio' && (
          <Portfolio 
            githubUsername={githubUsername} 
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
    </>
  );
}

export default App;
