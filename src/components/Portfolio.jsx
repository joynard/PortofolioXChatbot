import React, { useState, useEffect } from 'react';
import { Github, Star, GitFork, ExternalLink, Search, Settings, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchGitHubProfile, fetchGitHubRepos } from '../services/github';

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  "C++": '#f34b7d',
  "C#": '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Shell: '#89e051',
};

function Portfolio({ githubUsername, onNavigateToSettings, isCreatorFallback }) {
  const [profile, setProfile] = useState(() => {
    const saved = sessionStorage.getItem('github_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [repos, setRepos] = useState(() => {
    const saved = sessionStorage.getItem('github_repos');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    if (!githubUsername) return;
    
    setLoading(true);
    setError('');
    
    try {
      const [profileData, reposData] = await Promise.all([
        fetchGitHubProfile(githubUsername),
        fetchGitHubRepos(githubUsername)
      ]);
      
      setProfile(profileData);
      setRepos(reposData);
      
      // Cache details in sessionStorage
      sessionStorage.setItem('github_profile', JSON.stringify(profileData));
      sessionStorage.setItem('github_repos', JSON.stringify(reposData));
    } catch (err) {
      setError(err.message || 'Failed to fetch GitHub profile and repositories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only auto-load if we don't have cached data yet, or if the username changed
    const cachedUser = sessionStorage.getItem('github_cached_username');
    if (!profile || repos.length === 0 || cachedUser !== githubUsername) {
      if (githubUsername) {
        loadData();
        sessionStorage.setItem('github_cached_username', githubUsername);
      }
    }
  }, [githubUsername]);

  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fullText = `"There are so many more incredible things built in private, but since this only lists public repositories, you're seeing just a fraction of what the creator has made."`;

  useEffect(() => {
    if (isCreatorFallback) {
      setIsTyping(true);
      setTypedText("");
      let index = 0;
      let timeoutId;

      const typeChar = () => {
        if (index < fullText.length) {
          const nextChar = fullText.charAt(index);
          setTypedText((prev) => prev + nextChar);
          index++;

          let delay = 35;
          if (nextChar === ',') {
            delay = 280;
          } else if (nextChar === '.') {
            delay = 500;
          } else if (nextChar === ' ') {
            delay = Math.random() * 20 + 20;
          } else {
            delay = Math.random() * 15 + 25;
          }

          timeoutId = setTimeout(typeChar, delay);
        } else {
          setIsTyping(false);
        }
      };

      typeChar();

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [isCreatorFallback]);

  const filteredRepos = repos.filter(repo => {
    const nameMatches = repo.name.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatches = repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const langMatches = repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatches || descMatches || langMatches;
  });

  if (loading) {
    return (
      <div className="tab-content">
        <div className="portfolio-loading">
          <div className="spinner"></div>
          <p>Retrieving GitHub profile details and repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content" style={{ justifyContent: 'center' }}>
        <div className="glass-panel welcome-message" style={{ padding: '2.5rem', maxWidth: '600px' }}>
          <AlertCircle size={48} style={{ color: 'var(--color-accent)' }} />
          <h2>Connection Error</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button id="retry-github-btn" onClick={loadData} className="btn-primary">
              <RefreshCw size={18} />
              <span>Retry Connection</span>
            </button>
            <button id="nav-settings-err-btn" onClick={onNavigateToSettings} className="btn-github">
              <Settings size={18} />
              <span>Check Settings</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="portfolio-layout">
        
        {/* Left Column - Profile Card */}
        {profile && (
          <aside className="glass-panel profile-card">
            <img 
              src={profile.avatar_url} 
              alt={`${profile.name || profile.login}'s avatar`} 
              className="profile-avatar"
            />
            {isCreatorFallback && (
              <div className="status-badge warning" style={{ fontSize: '0.75rem', padding: '0.65rem 0.8rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left', lineHeight: '1.35' }}>
                <span style={{ fontWeight: '700', alignSelf: 'center', marginBottom: '0.1rem' }}>Creator Hall of Fame</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                  Showing creator's portfolio since no username was configured.
                </span>
                <span style={{ fontSize: '0.68rem', opacity: 0.8, borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.25rem', marginTop: '0.25rem', fontStyle: 'italic', minHeight: '48px', display: 'block' }}>
                  {typedText}
                  {isTyping && <span className="typing-cursor">|</span>}
                </span>
              </div>
            )}
            <div>
              <h2 className="profile-name">{profile.name || profile.login}</h2>
              <span className="profile-username">@{profile.login}</span>
            </div>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{profile.public_repos}</span>
                <span className="stat-label">Repos</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profile.followers}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profile.following}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            <a 
              id="github-profile-link"
              href={profile.html_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-github"
            >
              <Github size={18} />
              <span>View GitHub Profile</span>
            </a>
          </aside>
        )}

        {/* Right Column - Repos List */}
        <section className="repo-grid-container">
          <div className="portfolio-title">
            <div>
              <h2>Projects & Repositories</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing {filteredRepos.length} of {repos.length} public projects
              </span>
            </div>
            
            <div className="input-container" style={{ width: '260px' }}>
              <Search className="input-icon" size={16} />
              <input
                id="repo-search-input"
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ padding: '0.5rem 1rem 0.5rem 2.2rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {filteredRepos.length === 0 ? (
            <div className="glass-panel empty-state" style={{ padding: '3rem' }}>
              <p>No projects match your search criteria.</p>
            </div>
          ) : (
            <div className="repo-grid">
              {filteredRepos.map((repo) => (
                <a 
                  key={repo.id} 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="repo-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="repo-header">
                    <div className="repo-name-row">
                      <h3 style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        {repo.name}
                      </h3>
                      <ExternalLink size={14} style={{ opacity: 0.5 }} />
                    </div>
                    <p className="repo-desc">{repo.description || 'No description provided.'}</p>
                  </div>

                  <div className="repo-footer">
                    {repo.language && (
                      <div className="repo-lang">
                        <span 
                          className="lang-dot" 
                          style={{ backgroundColor: LANG_COLORS[repo.language] || '#8b8b8b' }}
                        ></span>
                        <span>{repo.language}</span>
                      </div>
                    )}
                    <div className="repo-stats">
                      <span className="repo-stat" title="Stars">
                        <Star size={12} />
                        <span>{repo.stargazers_count}</span>
                      </span>
                      <span className="repo-stat" title="Forks">
                        <GitFork size={12} />
                        <span>{repo.forks_count}</span>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default Portfolio;
