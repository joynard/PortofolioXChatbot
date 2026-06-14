import React, { useState, useEffect } from 'react';
import { Key, Cpu, Github, Save, CheckCircle, Info } from 'lucide-react';

const PRESET_MODELS = [
  { id: 'gemma-4-31b', name: 'Gemma 4 31B' },
  { id: 'gemma-4-26b', name: 'Gemma 4 26B' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash' },
  { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2 Flash' },
  { id: 'gemini-2.0-flash-lite', name: 'Gemini 2 Flash Lite' },
  { id: 'gemini-2.5-flash-tts', name: 'Gemini 2.5 Flash TTS' },
  { id: 'gemini-2.5-pro-tts', name: 'Gemini 2.5 Pro TTS' },
];

function Settings({ apiKey, setApiKey, githubUsername, setGithubUsername, modelName, setModelName }) {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localUsername, setLocalUsername] = useState(githubUsername);
  const [selectedPreset, setSelectedPreset] = useState(() => {
    const isPreset = PRESET_MODELS.some(model => model.id === modelName);
    return isPreset ? modelName : 'custom';
  });
  const [customModel, setCustomModel] = useState(() => {
    const isPreset = PRESET_MODELS.some(model => model.id === modelName);
    return isPreset ? '' : modelName;
  });
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    
    // Save API key
    setApiKey(localApiKey.trim());
    
    // Save GitHub username
    setGithubUsername(localUsername.trim());
    
    // Determine and save model name
    const finalModel = selectedPreset === 'custom' ? customModel.trim() : selectedPreset;
    if (finalModel) {
      setModelName(finalModel);
    }

    setSaveStatus('success');
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  // If external states change, synchronize local inputs
  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    setLocalUsername(githubUsername);
  }, [githubUsername]);

  return (
    <div className="tab-content">
      <div className="glass-panel settings-container">
        <div className="settings-header">
          <h2>Application Settings</h2>
          <p>Configure credentials and API connections for your workspace.</p>
        </div>

        <form onSubmit={handleSave} className="settings-card">
          {saveStatus === 'success' && (
            <div className="status-badge success">
              <CheckCircle size={18} />
              <span>Settings saved successfully! Changes are applied instantly.</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="api-key-input">Google AI Studio API Key</label>
            <div className="input-container">
              <Key className="input-icon" size={18} />
              <input
                id="api-key-input"
                type="password"
                placeholder="AIzaSy..."
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                className="input-field"
              />
            </div>
            <p className="settings-header" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Your API key is stored locally in your browser and never sent anywhere except directly to Google's API servers.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="model-select">AI Chat Model</label>
            <div className="select-container">
              <Cpu className="input-icon" size={18} />
              <select
                id="model-select"
                value={selectedPreset}
                onChange={(e) => {
                  setSelectedPreset(e.target.value);
                  if (e.target.value !== 'custom') {
                    setCustomModel('');
                  }
                }}
                className="select-field"
              >
                {PRESET_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
                <option value="custom">Custom Model ID...</option>
              </select>
            </div>
          </div>

          {selectedPreset === 'custom' && (
            <div className="form-group" style={{ marginTop: '-0.5rem' }}>
              <label htmlFor="custom-model-input">Custom Model Name / ID</label>
              <div className="input-container">
                <Cpu className="input-icon" size={18} />
                <input
                  id="custom-model-input"
                  type="text"
                  placeholder="e.g. gemma-2-27b-it"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="github-username-input">GitHub Username (Optional)</label>
            <div className="input-container">
              <Github className="input-icon" size={18} />
              <input
                id="github-username-input"
                type="text"
                placeholder="e.g. your-github-username"
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                className="input-field"
              />
            </div>
            <p className="settings-header" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              This will fetch your public repositories and profile statistics to build your portfolio. Leave blank to showcase the creator's portfolio (@joynard).
            </p>
          </div>

          <button id="save-settings-btn" type="submit" className="btn-primary">
            <Save size={18} />
            <span>Save Configuration</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
