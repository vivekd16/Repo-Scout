import { useState } from 'react';
import { Star, GitFork, Clock, ExternalLink, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProcessedRepository } from '@/services/repositoryApi';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface RepositoryCardProps {
  repository: ProcessedRepository;
  onClick?: (repository: ProcessedRepository) => void;
  index?: number;
}

const RepositoryCard = ({ repository, onClick, index = 0 }: RepositoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const truncateDescription = (text: string, maxLength: number = 120): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`h-full cursor-pointer transition-all duration-200 hover:shadow-lg border-border bg-card ${
          isHovered ? 'ring-2 ring-primary/20' : ''
        }`}
        onClick={() => onClick?.(repository)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage 
                  src={repository.owner.avatarUrl} 
                  alt={repository.owner.login}
                />
                <AvatarFallback className="text-sm font-medium">
                  {repository.owner.login[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg font-semibold text-foreground truncate">
                  {repository.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {repository.owner.login}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                window.open(repository.url, '_blank');
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {truncateDescription(repository.description)}
          </p>

          {/* Topics */}
          {repository.topics.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {repository.topics.slice(0, 3).map((topic) => (
                <Badge 
                  key={topic} 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 bg-secondary/50"
                >
                  {topic}
                </Badge>
              ))}
              {repository.topics.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{repository.topics.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              {/* Language */}
              {repository.language && (
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getLanguageColor(repository.language) }}
                  />
                  <span className="font-medium">{repository.language}</span>
                </div>
              )}

              {/* Stars */}
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span className="font-medium">{formatNumber(repository.stars)}</span>
              </div>

              {/* Forks */}
              <div className="flex items-center space-x-1">
                <GitFork className="h-4 w-4" />
                <span className="font-medium">{formatNumber(repository.forks)}</span>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center space-x-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(repository.lastUpdated), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Open Issues (if any) */}
          {repository.openIssues > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{repository.openIssues} open issues</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`${repository.url}/issues`, '_blank');
                }}
              >
                Contribute
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RepositoryCard;