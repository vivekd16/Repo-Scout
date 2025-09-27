import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Star, 
  GitFork, 
  Eye, 
  ExternalLink, 
  Calendar, 
  Code, 
  Users,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { ProcessedRepository, fetchRepositoryReadme } from '@/services/repositoryApi';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface RepositoryModalProps {
  repository: ProcessedRepository | null;
  isOpen: boolean;
  onClose: () => void;
}

const RepositoryModal = ({ repository, isOpen, onClose }: RepositoryModalProps) => {
  const [readme, setReadme] = useState<string | null>(null);
  const [isLoadingReadme, setIsLoadingReadme] = useState(false);

  useEffect(() => {
    if (repository && isOpen) {
      setIsLoadingReadme(true);
      fetchRepositoryReadme(repository.fullName)
        .then(setReadme)
        .catch(() => setReadme(null))
        .finally(() => setIsLoadingReadme(false));
    }
  }, [repository, isOpen]);

  if (!repository) return null;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      Go: '#00ADD8',
      Rust: '#dea584',
      'C++': '#f34b7d',
      'C#': '#239120',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Dart: '#00B4AB',
      Shell: '#89e051',
      HTML: '#e34c26',
      CSS: '#1572B6',
      Vue: '#4FC08D',
      React: '#61DAFB',
      Angular: '#DD0031',
    };
    return colors[language] || '#6b7280';
  };

  const truncateReadme = (content: string, maxLength: number = 1000): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '\n\n... (truncated)';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarImage 
                  src={repository.owner.avatarUrl} 
                  alt={repository.owner.login}
                />
                <AvatarFallback className="text-lg font-medium">
                  {repository.owner.login[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {repository.name}
                </DialogTitle>
                <DialogDescription className="text-base">
                  by {repository.owner.login}
                </DialogDescription>
              </div>
            </div>
            <Button
              onClick={() => window.open(repository.url, '_blank')}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on GitHub</span>
            </Button>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {repository.description}
          </p>

          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{formatNumber(repository.stars)}</span>
              <span className="text-muted-foreground">stars</span>
            </div>
            <div className="flex items-center space-x-2">
              <GitFork className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{formatNumber(repository.forks)}</span>
              <span className="text-muted-foreground">forks</span>
            </div>
            {repository.openIssues > 0 && (
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">{repository.openIssues}</span>
                <span className="text-muted-foreground">open issues</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-muted-foreground">
                Updated {formatDistanceToNow(new Date(repository.lastUpdated), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Language and Topics */}
          <div className="flex flex-wrap items-center gap-2">
            {repository.language && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getLanguageColor(repository.language) }}
                />
                <span>{repository.language}</span>
              </Badge>
            )}
            {repository.topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => window.open(repository.url, '_blank')}
            variant="default"
          >
            <Code className="h-4 w-4 mr-2" />
            View Code
          </Button>
          {repository.openIssues > 0 && (
            <Button
              onClick={() => window.open(`${repository.url}/issues`, '_blank')}
              variant="outline"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Browse Issues ({repository.openIssues})
            </Button>
          )}
          <Button
            onClick={() => window.open(`${repository.url}/fork`, '_blank')}
            variant="outline"
          >
            <GitFork className="h-4 w-4 mr-2" />
            Fork Repository
          </Button>
          <Button
            onClick={() => window.open(repository.owner.profileUrl, '_blank')}
            variant="outline"
          >
            <Users className="h-4 w-4 mr-2" />
            View Owner
          </Button>
        </div>

        <Separator />

        {/* README Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <h3 className="text-lg font-semibold">README</h3>
          </div>
          
          <ScrollArea className="h-64 w-full rounded-md border p-4">
            {isLoadingReadme ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : readme ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {truncateReadme(readme)}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No README available</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Created {formatDistanceToNow(new Date(repository.createdAt), { addSuffix: true })}
          </div>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepositoryModal;