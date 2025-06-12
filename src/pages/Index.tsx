import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Github, Users, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [issues, setIssues] = useState<ProcessedIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { toast } = useToast();
  const { searchCount, incrementSearchCount, isSearchLimitReached } = useSearchLimit();
  const { user, logout } = useAuth();

  const popularLanguages = [
    "JavaScript", "Python", "Java", "TypeScript", "C++", "Go", "Rust", "PHP"
  ];

  const popularLabels = [
    "good first issue", "help wanted", "bug", "enhancement", "documentation", "hacktoberfest", "ssoc"
  ];

  useEffect(() => {
    // Add a delay to show the loader when the page loads
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const toggleLabel = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const handleSearch = async () => {
    if (isSearchLimitReached) {
      // AuthModal is now handled in App.tsx and will show automatically if user is not logged in.
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    incrementSearchCount();
    
    try {
      // Add a minimum delay to show the loader
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // console.log('Starting search with:', { selectedLanguage, selectedLabels, searchQuery }); // Removed console.log
      const results = await searchGitHubIssues(
        selectedLanguage || undefined,
        selectedLabels.length > 0 ? selectedLabels : undefined,
        searchQuery || undefined
      );
      
      setIssues(results);
      
      toast({
        title: "Search completed",
        description: `Found ${results.length} latest issues`,
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

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Github className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Repo Scout</h1>
                <p className="text-sm text-slate-600">Discover & contribute to open source</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <a href="https://github.com/vivekd16/Repo-Scout" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/guidance">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Contribution Guide
                </Link>
              </Button>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 ml-auto cursor-pointer">
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
                <Button variant="ghost" onClick={() => { /* AuthModal is now handled by App.tsx */ }} className="ml-auto">
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Find Your Next Open Source Contribution
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover the latest GitHub issues that match your skills and interests. Get PR templates 
            and contribution guides for each repository to help you contribute effectively.
          </p>
          {!user && (
            <p className="text-sm text-slate-500 mt-2">
              {5 - searchCount} searches remaining before sign in required
            </p>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Latest Issues
            </CardTitle>
            <CardDescription>
              Find the most recent open source issues to contribute to, sorted by creation date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Input */}
            <div>
              <Input
                placeholder="Search issues by keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg py-3"
              />
            </div>

            {/* Language Filter */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Programming Language
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularLanguages.map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage(selectedLanguage === lang ? "" : lang)}
                    className="rounded-full"
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </div>

            {/* Labels Filter */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Labels</h3>
              <div className="flex flex-wrap gap-2">
                {popularLabels.map((label) => (
                  <Button
                    key={label}
                    variant={selectedLabels.includes(label) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLabel(label)}
                    className="rounded-full"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              size="lg"
              onClick={handleSearch}
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
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Latest Issues
              </h3>
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="h-4 w-4" />
                <span>{issues.length} issues found (sorted by creation date)</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <Loader />
              </div>
            ) : issues.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
                {issues.map((issue, index) => (
                  <IssueCard key={index} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="text-center w-full">
                <p className="text-slate-600">No issues found matching your criteria. Try adjusting your search filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats - only show if haven't searched yet */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
                <p className="text-slate-600">Open Source Projects</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <p className="text-slate-600">Active Community</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <p className="text-slate-600">Free to Use</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

    </div>
  );
};

export default Index;
