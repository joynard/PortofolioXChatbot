import React from 'react';
import { Bot, FolderGit2, MessageSquareCode, Settings as SettingsIcon } from 'lucide-react';

function Navbar({ activeTab, setActiveTab, isHeaderHidden }) {
  return (
    <header className={`glass-panel navbar ${isHeaderHidden ? 'navbar-hidden' : ''}`}>
      <div className={`brand ${activeTab === 'chat' ? 'hide-on-mobile' : ''}`}>
        <Bot size={24} />
        <span>DevHub.AI</span>
      </div>
      
      <nav className="nav-links">
        <button 
          id="nav-portfolio"
          className={`nav-item ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          <FolderGit2 size={18} />
          <span>Portfolio</span>
        </button>
        
        <button 
          id="nav-chat"
          className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquareCode size={18} />
          <span>AI Chat</span>
        </button>
        
        <button 
          id="nav-settings"
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <SettingsIcon size={18} />
          <span>Settings</span>
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
