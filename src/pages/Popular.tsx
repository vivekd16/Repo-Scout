import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, Filter, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RepositoryCard from '@/components/RepositoryCard';
import RepositoryModal from '@/components/RepositoryModal';
import Layout from '@/components/Layout';
import { 
  fetchPopularRepositories, 
  getPopularLanguages,
  ProcessedRepository 
} from '@/services/repositoryApi';
import { useToast } from '@/hooks/use-toast';

const Popular = () => {
  const [repositories, setRepositories] = useState<ProcessedRepository[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<ProcessedRepository | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { toast } = useToast();
  const languages = getPopularLanguages();

  useEffect(() => {
    loadRepositories();
  }, []);

  const loadRepositories = async (language?: string) => {
    setIsLoading(true);
    try {
      const repos = await fetchPopularRepositories(language);
      setRepositories(repos);
    } catch (error) {
      toast({
        title: 'Error loading repositories',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    loadRepositories(language || undefined);
  };

  const handleRefresh = () => {
    loadRepositories(selectedLanguage || undefined);
    toast({
      title: 'Refreshed',
      description: 'Popular repositories have been updated.',
    });
  };

  const handleRepoClick = (repo: ProcessedRepository) => {
    setSelectedRepo(repo);
    setIsModalOpen(true);
  };

  const LoadingGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
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

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Popular Repositories</h1>
            </div>
            <p className="text-muted-foreground">
              Recently active repositories with high engagement and community activity
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="w-fit">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter by Language
            </CardTitle>
            <CardDescription>
              Show popular repositories for a specific programming language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full sm:w-64">
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
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Repositories</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{repositories.length}</div>
              <p className="text-xs text-muted-foreground">
                Recently updated
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {repositories.reduce((sum, repo) => sum + repo.openIssues, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Open for contribution
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forks</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {repositories.reduce((sum, repo) => sum + repo.forks, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Community contributions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Repositories Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {selectedLanguage ? `Popular ${selectedLanguage} Repositories` : 'Popular Repositories'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Sorted by recent activity
            </p>
          </div>
          
          {isLoading ? (
            <LoadingGrid />
          ) : repositories.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No repositories found.</p>
            </div>
          ) : (
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
          )}
        </div>

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

export default Popular;