const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  pushed_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  open_issues_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
}

export interface SearchRepositoriesResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

export interface ProcessedRepository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  lastUpdated: string;
  topics: string[];
  owner: {
    login: string;
    avatarUrl: string;
    profileUrl: string;
  };
  openIssues: number;
  createdAt: string;
}

// Fetch top repositories (highest stars)
export const fetchTopRepositories = async (
  language?: string,
  perPage: number = 30,
  page: number = 1
): Promise<ProcessedRepository[]> => {
  try {
    let searchQuery = 'stars:>1000';
    
    if (language) {
      searchQuery += ` language:${language}`;
    }

    const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=${perPage}&page=${page}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data: SearchRepositoriesResponse = await response.json();
    return processRepositories(data.items);
  } catch (error) {
    console.error('Error fetching top repositories:', error);
    throw error;
  }
};

// Fetch popular repositories (high recent activity)
export const fetchPopularRepositories = async (
  language?: string,
  perPage: number = 30,
  page: number = 1
): Promise<ProcessedRepository[]> => {
  try {
    // Get repositories updated in the last 30 days with good star count
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateString = thirtyDaysAgo.toISOString().split('T')[0];
    
    let searchQuery = `pushed:>${dateString} stars:>100`;
    
    if (language) {
      searchQuery += ` language:${language}`;
    }

    const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=updated&order=desc&per_page=${perPage}&page=${page}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data: SearchRepositoriesResponse = await response.json();
    return processRepositories(data.items);
  } catch (error) {
    console.error('Error fetching popular repositories:', error);
    throw error;
  }
};

// Fetch growing repositories (recently created with good traction)
export const fetchGrowingRepositories = async (
  language?: string,
  perPage: number = 30,
  page: number = 1
): Promise<ProcessedRepository[]> => {
  try {
    // Get repositories created in the last 6 months with growing star count
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const dateString = sixMonthsAgo.toISOString().split('T')[0];
    
    let searchQuery = `created:>${dateString} stars:>50`;
    
    if (language) {
      searchQuery += ` language:${language}`;
    }

    const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=${perPage}&page=${page}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data: SearchRepositoriesResponse = await response.json();
    return processRepositories(data.items);
  } catch (error) {
    console.error('Error fetching growing repositories:', error);
    throw error;
  }
};

// Search repositories with custom query
export const searchRepositories = async (
  query: string,
  language?: string,
  sort: 'stars' | 'updated' | 'created' = 'stars',
  perPage: number = 30,
  page: number = 1
): Promise<ProcessedRepository[]> => {
  try {
    let searchQuery = query;
    
    if (language) {
      searchQuery += ` language:${language}`;
    }

    const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=${sort}&order=desc&per_page=${perPage}&page=${page}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data: SearchRepositoriesResponse = await response.json();
    return processRepositories(data.items);
  } catch (error) {
    console.error('Error searching repositories:', error);
    throw error;
  }
};

// Fetch repository README
export const fetchRepositoryReadme = async (fullName: string): Promise<string | null> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${fullName}/readme`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.content) {
      return atob(data.content);
    }
    return null;
  } catch (error) {
    console.error('Error fetching repository README:', error);
    return null;
  }
};

// Helper function to process repositories
const processRepositories = (repositories: GitHubRepository[]): ProcessedRepository[] => {
  return repositories.map(repo => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || 'No description available',
    url: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language || 'Unknown',
    lastUpdated: repo.updated_at,
    topics: repo.topics || [],
    owner: {
      login: repo.owner.login,
      avatarUrl: repo.owner.avatar_url,
      profileUrl: repo.owner.html_url,
    },
    openIssues: repo.open_issues_count,
    createdAt: repo.created_at,
  }));
};

// Get popular programming languages
export const getPopularLanguages = (): string[] => {
  return [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'Go',
    'Rust',
    'C++',
    'C#',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
    'Dart',
    'Shell',
    'HTML',
    'CSS',
    'Vue',
    'React',
    'Angular'
  ];
};