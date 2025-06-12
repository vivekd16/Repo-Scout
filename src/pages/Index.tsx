import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Github, Users, BookOpen, Sun, Moon, Menu, LogOut, LogIn } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { searchGitHubIssues, ProcessedIssue } from "@/services/githubApi";
import { useToast } from "@/hooks/use-toast";
import { IssueCard } from "@/components/IssueCard";
import Loader from "@/components/Loader";
import { useSearchLimit } from "@/hooks/useSearchLimit";
import { useAuth } from "@/lib/AuthContext";
// import AuthModal from "@/components/AuthModal"; // Removed as AuthModal is handled in App.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [issues, setIssues] = useState<ProcessedIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('hasSeenIndexLoader') ? false : true;
  });
  const { toast } = useToast();
  const { searchCount, incrementSearchCount, isSearchLimitReached } = useSearchLimit();
  const { user, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullStart, setPullStart] = useState(0)
  const [pullDistance, setPullDistance] = useState(0)

  const popularLanguages = [
    "JavaScript", "Python", "Java", "TypeScript", "C++", "Go", "Rust", "PHP"
  ];

  const popularLabels = [
    "good first issue", "help wanted", "bug", "enhancement", "documentation", "hacktoberfest", "ssoc"
  ];

  useEffect(() => {
    if (!isPageLoading) return;
    const timer = setTimeout(() => {
      setIsPageLoading(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('hasSeenIndexLoader', 'true');
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [isPageLoading]);

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const handleSearch = async () => {
    if (isSearchLimitReached) {
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    incrementSearchCount();
    try {
      // Add a minimum delay to show the loader
      await new Promise(resolve => setTimeout(resolve, 1000));
      const results = await searchGitHubIssues(
        selectedLanguage || undefined,
        selectedLabels.length > 0 ? selectedLabels : undefined,
        searchQuery || undefined,
        100, // perPage
        1    // page
      );
      setIssues(results);
      toast({
        title: "Search completed",
        description: `Found ${results.length} issues`,
      });
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: "Failed to fetch issues from GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleSearch();
  };

  const handlePullStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      setPullStart(e.touches[0].clientY)
    }
  }, [])

  const handlePullMove = useCallback((e: TouchEvent) => {
    if (pullStart === 0) return
    const touch = e.touches[0]
    const pull = touch.clientY - pullStart
    if (pull > 0) {
      setPullDistance(pull)
    }
  }, [pullStart])

  const handlePullEnd = useCallback(() => {
    if (pullDistance > 100) {
      setIsRefreshing(true)
      handleSearch().finally(() => {
        setIsRefreshing(false)
        setPullDistance(0)
      })
    } else {
      setPullDistance(0)
    }
    setPullStart(0)
  }, [pullDistance, handleSearch])

  useEffect(() => {
    document.addEventListener('touchstart', handlePullStart)
    document.addEventListener('touchmove', handlePullMove)
    document.addEventListener('touchend', handlePullEnd)

    return () => {
      document.removeEventListener('touchstart', handlePullStart)
      document.removeEventListener('touchmove', handlePullMove)
      document.removeEventListener('touchend', handlePullEnd)
    }
  }, [handlePullStart, handlePullMove, handlePullEnd])

  // Theme switch component
  function ThemeSwitch() {
    const [theme, setTheme] = useState(() => {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    }, [theme]);

    return (
      <button
        aria-label="Toggle dark mode"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-md hover:bg-accent transition-colors"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-foreground" />
        ) : (
          <Moon className="h-5 w-5 text-foreground" />
        )}
      </button>
    );
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Pull to refresh indicator */}
      <div 
        className={`fixed top-0 left-0 right-0 h-1 bg-primary transition-transform duration-200 ${
          pullDistance > 0 ? 'scale-x-100' : 'scale-x-0'
        }`}
        style={{ transform: `scaleX(${Math.min(pullDistance / 200, 1)})` }}
      />
      
      {/* Header */}
      <header className="bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-primary p-1.5 sm:p-2 rounded-lg">
                <Github className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Repo Scout</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Discover & contribute to open source</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center space-x-4">
              <ThemeSwitch />
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-9" asChild>
                <a href="https://github.com/vivekd16/Repo-Scout" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-9" asChild>
                <Link to="/guidance">
                  <BookOpen className="h-4 w-4" />
                </Link>
              </Button>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ml-auto cursor-pointer">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={logout}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => { /* AuthModal is now handled by App.tsx */ }} className="ml-auto">
                  Sign In
                </Button>
              )}
            </nav>

            {/* Mobile Navigation */}
            <div className="flex items-center space-x-2 sm:hidden">
              <ThemeSwitch />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                  <nav className="flex flex-col space-y-4 mt-4">
                    <Button variant="ghost" className="justify-start" asChild>
                      <a href="https://github.com/vivekd16/Repo-Scout" target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link to="/guidance">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Guidance
                      </Link>
                    </Button>
                    {user ? (
                      <Button variant="ghost" className="justify-start" onClick={logout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    ) : (
                      <Button variant="ghost" className="justify-start" onClick={() => { /* AuthModal is now handled by App.tsx */ }}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Find Your Next Open Source Contribution
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Discover the latest GitHub issues that match your skills and interests. Get PR templates 
            and contribution guides for each repository to help you contribute effectively.
          </p>
          {!user && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              {5 - searchCount} searches remaining before sign in required
            </p>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 sm:mb-8 shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              Search Latest Issues
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Find the most recent open source issues to contribute to, sorted by creation date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Search Input */}
            <div className="relative">
              <Input
                placeholder="Search issues by keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-base sm:text-lg py-2 sm:py-3 pr-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchClick(e)
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSearchClick}
                disabled={isLoading}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Language Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                Programming Language
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {popularLanguages.map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage(selectedLanguage === lang ? "" : lang)}
                    className="rounded-full text-xs sm:text-sm"
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </div>

            {/* Labels Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Labels</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {popularLabels.map((label) => (
                  <Button
                    key={label}
                    variant={selectedLabels.includes(label) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLabel(label)}
                    className="rounded-full text-xs sm:text-sm"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base" 
              size="lg"
              onClick={handleSearchClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center w-full">
                  <Search className="h-4 w-4 mr-2 animate-spin" />
                  <span>Searching Latest Issues...</span>
                </div>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Latest Issues
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Latest Issues
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Users className="h-4 w-4" />
                <span>{issues.length} issues found (sorted by creation date)</span>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <Loader />
              </div>
            ) : issues.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
                {issues.map((issue) => (
                  <IssueCard key={issue.url} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="text-center w-full">
                <p className="text-muted-foreground text-sm sm:text-base">No issues found matching your criteria. Try adjusting your search filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats - only show if haven't searched yet */}
        {!hasSearched && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="text-center">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <p className="text-muted-foreground">Open Source Projects</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">Active Community</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-muted-foreground">Free to Use</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

    </div>
  );
};

export default Index;
