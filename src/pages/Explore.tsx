import { useState, useEffect } from 'react';
import { Search, Filter, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import RepositoryCard from '@/components/RepositoryCard';
import RepositoryModal from '@/components/RepositoryModal';
import Layout from '@/components/Layout';
import { 
  fetchTopRepositories, 
  fetchPopularRepositories, 
  fetchGrowingRepositories,
  searchRepositories,
  getPopularLanguages,
  ProcessedRepository 
} from '@/services/repositoryApi';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '');
  const [activeTab, setActiveTab] = useState('top');
  
  const [topRepos, setTopRepos] = useState<ProcessedRepository[]>([]);
  const [popularRepos, setPopularRepos] = useState<ProcessedRepository[]>([]);
  const [growingRepos, setGrowingRepos] = useState<ProcessedRepository[]>([]);
  const [searchResults, setSearchResults] = useState<ProcessedRepository[]>([]);
  
  const [isLoadingTop, setIsLoadingTop] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [isLoadingGrowing, setIsLoadingGrowing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const [selectedRepo, setSelectedRepo] = useState<ProcessedRepository | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { toast } = useToast();
  const languages = getPopularLanguages();

  // Load initial data
  useEffect(() => {
    loadTopRepositories();
    loadPopularRepositories();
    loadGrowingRepositories();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const language = searchParams.get('language');
    const query = searchParams.get('q');
    
    if (language) {
      setSelectedLanguage(language);
    }
    if (query) {
      setSearchQuery(query);
      handleSearch(query, language || '');
    }
  }, [searchParams]);

  const loadTopRepositories = async (language?: string) => {
    setIsLoadingTop(true);
    try {
      const repos = await fetchTopRepositories(language);
      setTopRepos(repos);
    } catch (error) {
      toast({
        title: 'Error loading top repositories',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingTop(false);
    }
  };

  const loadPopularRepositories = async (language?: string) => {
    setIsLoadingPopular(true);
    try {
      const repos = await fetchPopularRepositories(language);
      setPopularRepos(repos);
    } catch (error) {
      toast({
        title: 'Error loading popular repositories',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPopular(false);
    }
  };

  const loadGrowingRepositories = async (language?: string) => {
    setIsLoadingGrowing(true);
    try {
      const repos = await fetchGrowingRepositories(language);
      setGrowingRepos(repos);
    } catch (error) {
      toast({
        title: 'Error loading growing repositories',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingGrowing(false);
    }
  };

  const handleSearch = async (query?: string, language?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const repos = await searchRepositories(searchTerm, language || selectedLanguage);
      setSearchResults(repos);
      setActiveTab('search');
      
      // Update URL
      const params = new URLSearchParams();
      if (searchTerm) params.set('q', searchTerm);
      if (language || selectedLanguage) params.set('language', language || selectedLanguage);
      setSearchParams(params);
      
      toast({
        title: 'Search completed',
        description: `Found ${repos.length} repositories`,
      });
    } catch (error) {
      toast({
        title: 'Search failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    
    // Reload all sections with new language
    if (language) {
      loadTopRepositories(language);
      loadPopularRepositories(language);
      loadGrowingRepositories(language);
    } else {
      loadTopRepositories();
      loadPopularRepositories();
      loadGrowingRepositories();
    }

    // Update URL if there's a search query
    if (searchQuery) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (language) params.set('language', language);
      setSearchParams(params);
    }
  };

  const handleRefresh = () => {
    loadTopRepositories(selectedLanguage);
    loadPopularRepositories(selectedLanguage);
    loadGrowingRepositories(selectedLanguage);
    toast({
      title: 'Refreshed',
      description: 'Repository data has been updated.',
    });
  };

  const handleRepoClick = (repo: ProcessedRepository) => {
    setSelectedRepo(repo);
    setIsModalOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setActiveTab('top');
    setSearchParams({});
  };

  const LoadingGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-64 animate-pulse">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-muted rounded" />
                <div className="w-20 h-3 bg-muted rounded" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="w-full h-3 bg-muted rounded" />
            <div className="w-3/4 h-3 bg-muted rounded" />
            <div className="flex space-x-2">
              <div className="w-16 h-5 bg-muted rounded" />
              <div className="w-16 h-5 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const RepositoryGrid = ({ repositories, isLoading }: { repositories: ProcessedRepository[], isLoading: boolean }) => {
    if (isLoading) return <LoadingGrid />;
    
    if (repositories.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No repositories found.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositories.map((repo, index) => (
          <RepositoryCard
            key={repo.id}
            repository={repo}
            onClick={handleRepoClick}
            index={index}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Explore Repositories</h1>
            <p className="text-muted-foreground">
              Discover amazing open source projects across different categories
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="w-fit">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
            <CardDescription>
              Find repositories by name, description, or filter by programming language
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Languages</SelectItem>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={() => handleSearch()} 
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {selectedLanguage && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtered by:</span>
                <Badge variant="secondary" className="gap-1">
                  {selectedLanguage}
                  <button
                    onClick={() => handleLanguageChange('')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Repository Sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="top">Top</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="growing">Growing</TabsTrigger>
            {searchResults.length > 0 && (
              <TabsTrigger value="search" className="relative">
                Search Results
                <Badge variant="secondary" className="ml-2 text-xs">
                  {searchResults.length}
                </Badge>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="top" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Top Repositories</h2>
              <p className="text-muted-foreground mb-6">
                The most starred repositories with proven track records
              </p>
              <RepositoryGrid repositories={topRepos} isLoading={isLoadingTop} />
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Popular Repositories</h2>
              <p className="text-muted-foreground mb-6">
                Recently active repositories with high engagement
              </p>
              <RepositoryGrid repositories={popularRepos} isLoading={isLoadingPopular} />
            </div>
          </TabsContent>

          <TabsContent value="growing" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Growing Repositories</h2>
              <p className="text-muted-foreground mb-6">
                Emerging projects gaining momentum and community support
              </p>
              <RepositoryGrid repositories={growingRepos} isLoading={isLoadingGrowing} />
            </div>
          </TabsContent>

          {searchResults.length > 0 && (
            <TabsContent value="search" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Search Results</h2>
                  <p className="text-muted-foreground">
                    Found {searchResults.length} repositories matching "{searchQuery}"
                    {selectedLanguage && ` in ${selectedLanguage}`}
                  </p>
                </div>
                <Button variant="outline" onClick={clearSearch}>
                  Clear Search
                </Button>
              </div>
              <RepositoryGrid repositories={searchResults} isLoading={isSearching} />
            </TabsContent>
          )}
        </Tabs>

        {/* Repository Modal */}
        <RepositoryModal
          repository={selectedRepo}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default Explore;