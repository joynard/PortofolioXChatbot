/**
 * Fetches user profile details from GitHub REST API.
 * @param {string} username - GitHub username.
 * @returns {Promise<Object>} User profile object.
 */
export const fetchGitHubProfile = async (username) => {
  if (!username) {
    throw new Error('GitHub username is not configured.');
  }

  const response = await fetch(`https://api.github.com/users/${username}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`GitHub user "${username}" was not found.`);
    }
    throw new Error(`Failed to fetch GitHub profile: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Fetches public repositories for a user from GitHub REST API.
 * @param {string} username - GitHub username.
 * @returns {Promise<Array>} List of repositories.
 */
export const fetchGitHubRepos = async (username) => {
  if (!username) {
    throw new Error('GitHub username is not configured.');
  }

  // Fetch repositories sorted by recently pushed/updated
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=60`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub repositories: ${response.statusText}`);
  }

  const repos = await response.json();
  
  // Sort by stargazers_count (descending) so top projects show up first, but keep them high quality
  return repos.sort((a, b) => {
    // If stars are different, sort by stars. Otherwise sort by last updated date.
    if (b.stargazers_count !== a.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
};
