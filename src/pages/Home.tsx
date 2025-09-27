import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  TrendingUp, 
  GitBranch, 
  Search, 
  Github, 
  Users, 
  Code, 
  ArrowRight,
  Zap,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RepositoryCard from '@/components/RepositoryCard';
import RepositoryModal from '@/components/RepositoryModal';
import Layout from '@/components/Layout';
import { 
  fetchTopRepositories, 
  fetchPopularRepositories, 
  fetchGrowingRepositories,
  ProcessedRepository 
} from '@/services/repositoryApi';
import { useAuth } from '@/lib/AuthContext';

const Home = () => {
  const [topRepos, setTopRepos] = useState<ProcessedRepository[]>([]);
  const [popularRepos, setPopularRepos] = useState<ProcessedRepository[]>([]);
  const [growingRepos, setGrowingRepos] = useState<ProcessedRepository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<ProcessedRepository | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    loadPreviewData();
  }, []);

  const loadPreviewData = async () => {
    setIsLoading(true);
    try {
      const [top, popular, growing] = await Promise.all([
        fetchTopRepositories(undefined, 3),
        fetchPopularRepositories(undefined, 3),
        fetchGrowingRepositories(undefined, 3),
      ]);
      setTopRepos(top);
      setPopularRepos(popular);
      setGrowingRepos(growing);
    } catch (error) {
      console.error('Error loading preview data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepoClick = (repo: ProcessedRepository) => {
    setSelectedRepo(repo);
    setIsModalOpen(true);
  };

  const features = [
    {
      icon: Star,
      title: 'Top Repositories',
      description: 'Discover the most starred and established projects',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      link: '/top'
    },
    {
      icon: TrendingUp,
      title: 'Popular Projects',
      description: 'Find recently active repositories with high engagement',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      link: '/popular'
    },
    {
      icon: GitBranch,
      title: 'Growing Repositories',
      description: 'Explore emerging projects gaining momentum',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      link: '/growing'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Filter by language, topics, and activity level',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      link: '/explore'
    }
  ];

  const stats = [
    { label: 'Repositories Indexed', value: '10M+', icon: Github },
    { label: 'Active Contributors', value: '50M+', icon: Users },
    { label: 'Programming Languages', value: '500+', icon: Code },
    { label: 'Open Issues', value: '2M+', icon: Heart }
  ];

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-6 py-16 lg:py-24">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 animate-pulse rounded-full bg-primary/20 blur-xl" />
                <div className="relative bg-primary p-4 rounded-2xl">
                  <Github className="h-12 w-12 text-primary-foreground" />
                </div>
              </div>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Discover Amazing
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {' '}Open Source
              </span>
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
              Find your next contribution opportunity. Explore top repositories, 
              discover trending projects, and connect with the open source community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/explore">
                  <Search className="h-5 w-5 mr-2" />
                  Start Exploring
                </Link>
              </Button>
              {!user && (
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/signup">
                    <Users className="h-5 w-5 mr-2" />
                    Join Community
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Everything You Need to Contribute
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful tools and insights to help you find the perfect open source project
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-200 border-border">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between group-hover:bg-accent">
                      <Link to={feature.link}>
                        Explore
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-12 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Trusted by Developers Worldwide
              </h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Repository Previews */}
        <section className="px-6">
          <div className="mx-auto max-w-7xl space-y-12">
            {/* Top Repositories Preview */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <Star className="h-6 w-6 text-yellow-500" />
                    Top Repositories
                  </h2>
                  <p className="text-muted-foreground">Most starred projects on GitHub</p>
                </div>
                <Button asChild variant="outline">
                  <Link to="/top">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
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
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {topRepos.map((repo, index) => (
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

            {/* Popular Repositories Preview */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                    Popular Repositories
                  </h2>
                  <p className="text-muted-foreground">Recently active with high engagement</p>
                </div>
                <Button asChild variant="outline">
                  <Link to="/popular">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
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
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {popularRepos.map((repo, index) => (
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

            {/* Growing Repositories Preview */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <GitBranch className="h-6 w-6 text-green-500" />
                    Growing Repositories
                  </h2>
                  <p className="text-muted-foreground">Emerging projects gaining momentum</p>
                </div>
                <Button asChild variant="outline">
                  <Link to="/growing">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
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
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {growingRepos.map((repo, index) => (
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
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Start Contributing?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of developers who are making a difference in open source. 
                Find your perfect project and start contributing today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/explore">
                  <Search className="h-5 w-5 mr-2" />
                  Explore Projects
                </Link>
              </Button>
              {!user && (
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/signup">
                    <Users className="h-5 w-5 mr-2" />
                    Create Account
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

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

export default Home;