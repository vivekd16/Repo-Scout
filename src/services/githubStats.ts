export const GITHUB_GRAPHQL_API_BASE = 'https://api.github.com/graphql';

export interface GitHubContributionDay {
  contributionCount: number;
  date: string;
}

export interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

export interface GitHubContributionCalendar {
  totalContributions: number;
  weeks: GitHubContributionWeek[];
}

export interface GitHubContributionsCollection {
  contributionCalendar: GitHubContributionCalendar;
}

export interface GitHubUserContributions {
  user: {
    contributionsCollection: GitHubContributionsCollection;
  };
}

export interface GitHubPullRequest {
  totalCount: number;
}

export interface GitHubUserPRs {
  user: {
    pullRequests: GitHubPullRequest;
  };
}

// GraphQL query to get contribution data
export const GET_CONTRIBUTIONS_QUERY = `
  query($userName: String!) {
    user(login: $userName) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to get pull request data
export const GET_PRS_QUERY = `
  query($userName: String!, $query: String!) {
    user(login: $userName) {
      pullRequests(first: 1, query: $query) {
        totalCount
      }
    }
  }
`;

export const fetchGitHubContributions = async (username: string, githubPAT: string): Promise<GitHubUserContributions | null> => {
  if (!username || !githubPAT) {
    console.warn("GitHub username or PAT is missing.");
    return null;
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubPAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_CONTRIBUTIONS_QUERY,
        variables: {
          userName: username,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GitHub GraphQL API error for contributions:", errorData);
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data as GitHubUserContributions;
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return null;
  }
};

export const fetchGitHubPRs = async (username: string, githubPAT: string): Promise<{ created: number; merged: number; } | null> => {
  if (!username || !githubPAT) {
    console.warn("GitHub username or PAT is missing.");
    return null;
  }

  try {
    const createdResponse = await fetch(GITHUB_GRAPHQL_API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubPAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_PRS_QUERY,
        variables: {
          userName: username,
          query: `author:${username} is:pr`,
        },
      }),
    });

    const mergedResponse = await fetch(GITHUB_GRAPHQL_API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubPAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_PRS_QUERY,
        variables: {
          userName: username,
          query: `author:${username} is:pr is:merged`,
        },
      }),
    });

    if (!createdResponse.ok || !mergedResponse.ok) {
      const createdErrorData = await createdResponse.json();
      const mergedErrorData = await mergedResponse.json();
      console.error("GitHub GraphQL API error for PRs created:", createdErrorData);
      console.error("GitHub GraphQL API error for PRs merged:", mergedErrorData);
      throw new Error("Failed to fetch GitHub PRs");
    }

    const createdData = await createdResponse.json();
    const mergedData = await mergedResponse.json();

    const createdPRs = createdData.data.user.pullRequests.totalCount;
    const mergedPRs = mergedData.data.user.pullRequests.totalCount;

    return { created: createdPRs, merged: mergedPRs };
  } catch (error) {
    console.error("Error fetching GitHub PRs:", error);
    return null;
  }
}; 