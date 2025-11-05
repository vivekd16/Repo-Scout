const GITHUB_API_BASE = import.meta.env.VITE_API_URL || 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // Load from environment variables using Vite's import.meta.env
const USE_PROXY = import.meta.env.VITE_USE_PROXY === 'true' || true; // Prefer backend proxy by default for CORS/rate limiting

async function fetchWithFallback(primaryUrl: string, secondaryUrl: string | null, headers: Record<string, string>) {
  try {
    const res = await fetch(primaryUrl, { headers });
    if (res.ok) return res;
    if (secondaryUrl) {
      const res2 = await fetch(secondaryUrl, { headers });
      if (res2.ok) return res2;
      return res2; // return last response (error)
    }
    return res; // return primary response (error)
  } catch (_) {
    if (secondaryUrl) {
      try {
        const res2 = await fetch(secondaryUrl, { headers });
        return res2;
      } catch (e2) {
        throw e2;
      }
    }
    throw _;
  }
}

export interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
  user: {
    login: string;
  };
  created_at: string;
  comments: number;
  state: string;
}

export interface SearchIssuesResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssue[];
}

export interface ProcessedIssue {
  title: string;
  repo: string;
  labels: string[];
  language: string;
  url: string;
  author: string;
  createdAt: string;
  comments: number;
  prTemplate?: string;
  contributingGuide?: string;
}

export interface RepoTemplates {
  prTemplate?: string;
  contributingGuide?: string;
}

export const fetchRepoTemplates = async (repoFullName: string): Promise<RepoTemplates> => {
  const templates: RepoTemplates = {};
  
  // Try to fetch PR template from common locations
  const prTemplatePaths = [
    '.github/pull_request_template.md',
    '.github/PULL_REQUEST_TEMPLATE.md',
    'pull_request_template.md',
    'PULL_REQUEST_TEMPLATE.md'
  ];
  
  for (const path of prTemplatePaths) {
    try {
      const urlProxy = `/api/github/repos/${repoFullName}/contents/${path}`;
      const urlDirect = `${GITHUB_API_BASE}/repos/${repoFullName}/contents/${path}`;
      
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json'
      };
      
      if (!USE_PROXY && GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
      }
      
      const response = await fetchWithFallback(USE_PROXY ? urlProxy : urlDirect, USE_PROXY ? urlDirect : urlProxy, headers);
      
      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          templates.prTemplate = atob(data.content);
          break;
        }
      }
    } catch (error) {
      // Continue trying other paths
    }
  }
  
  // Try to fetch CONTRIBUTING guide
  const contributingPaths = [
    'CONTRIBUTING.md',
    '.github/CONTRIBUTING.md',
    'docs/CONTRIBUTING.md'
  ];
  
  for (const path of contributingPaths) {
    try {
      const urlProxy = `/api/github/repos/${repoFullName}/contents/${path}`;
      const urlDirect = `${GITHUB_API_BASE}/repos/${repoFullName}/contents/${path}`;
      
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json'
      };
      
      if (!USE_PROXY && GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
      }
      
      const response = await fetchWithFallback(USE_PROXY ? urlProxy : urlDirect, USE_PROXY ? urlDirect : urlProxy, headers);
      
      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          templates.contributingGuide = atob(data.content);
          break;
        }
      }
    } catch (error) {
      // Continue trying other paths
    }
  }
  
  return templates;
};

export const searchGitHubIssues = async (
  language?: string,
  labels?: string[],
  query?: string,
  perPage: number = 100,
  page: number = 1,
  organization?: string
): Promise<ProcessedIssue[]> => {
  try {
    // Build search query
    let searchQuery = 'is:issue is:open';
    
    if (organization) {
      searchQuery += ` org:${organization}`;
    }
    
    if (language) {
      searchQuery += ` language:${language}`;
    }
    
    if (labels && labels.length > 0) {
      labels.forEach(label => {
        searchQuery += ` label:"${label}"`;
      });
    }
    
    if (query && query.trim()) {
      searchQuery += ` ${query.trim()}`;
    }

    // Sort by created date (newest first)
    const endpoint = `search/issues?q=${encodeURIComponent(searchQuery)}&sort=created&order=desc&per_page=${perPage}&page=${page}`;
    const urlProxy = `/api/github/${endpoint}`;
    const urlDirect = `${GITHUB_API_BASE}/${endpoint}`;
    
    console.log('Searching GitHub with query:', searchQuery);
    
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    
    if (!USE_PROXY && GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }
    
    const response = await fetchWithFallback(USE_PROXY ? urlProxy : urlDirect, USE_PROXY ? urlDirect : urlProxy, headers);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data: SearchIssuesResponse = await response.json();
    
    console.log(`Found ${data.total_count} issues`);

    // Process the issues with templates
    const processedIssues: ProcessedIssue[] = await Promise.all(
      data.items.map(async (issue) => {
        // Extract repo name from repository_url
        const repoName = issue.repository_url.replace('https://api.github.com/repos/', '');
        
        // Get repository details to fetch the language
        let repoLanguage = 'Unknown';
        try {
          const repoUrlProxy = `/api/github/repos/${repoName}`;
          const repoUrlDirect = issue.repository_url;
            
          const headers: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json'
          };
          
          if (!USE_PROXY && GITHUB_TOKEN) {
            headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
          }
          
          const repoResponse = await fetchWithFallback(USE_PROXY ? repoUrlProxy : repoUrlDirect, USE_PROXY ? repoUrlDirect : repoUrlProxy, headers);
          
          if (repoResponse.ok) {
            const repoData = await repoResponse.json();
            repoLanguage = repoData.language || 'Unknown';
          }
        } catch (error) {
          console.warn('Failed to fetch repo language:', error);
        }

        // Fetch repository templates
        let templates: RepoTemplates = {};
        try {
          templates = await fetchRepoTemplates(repoName);
        } catch (error) {
          console.warn('Failed to fetch repo templates:', error);
        }

        return {
          title: issue.title,
          repo: repoName,
          labels: issue.labels.map(label => label.name),
          language: repoLanguage,
          url: issue.html_url,
          author: issue.user.login,
          createdAt: issue.created_at,
          comments: issue.comments,
          prTemplate: templates.prTemplate,
          contributingGuide: templates.contributingGuide
        };
      })
    );

    return processedIssues;
  } catch (error) {
    console.error('Error searching GitHub issues:', error);
    throw error;
  }
};
