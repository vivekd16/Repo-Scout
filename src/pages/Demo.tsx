import { useState } from 'react';
import { Play, Pause, RotateCcw, Github, Star, GitFork, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';

const Demo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps = [
    {
      title: 'Welcome to Repo Scout',
      description: 'Your gateway to discovering amazing open source projects',
      content: (
        <div className="text-center space-y-4">
          <div className="bg-primary p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Github className="h-10 w-10 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold">Repo Scout Demo</h3>
          <p className="text-muted-foreground">
            Let's explore how to find and contribute to open source projects
          </p>
        </div>
      )
    },
    {
      title: 'Explore Top Repositories',
      description: 'Discover the most starred projects on GitHub',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="text-xl font-semibold">Top Repositories</h3>
          </div>
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">R</span>
                </div>
                <div>
                  <CardTitle className="text-lg">react</CardTitle>
                  <CardDescription>facebook</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                The library for web and native user interfaces
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span>JavaScript</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>220k</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="h-4 w-4" />
                  <span>45k</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: 'Filter by Language',
      description: 'Find projects in your preferred programming language',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-purple-500" />
            <h3 className="text-xl font-semibold">Language Filtering</h3>
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Filter repositories by programming language:
            </p>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'Python', 'TypeScript', 'Go', 'Rust'].map((lang) => (
                <Badge key={lang} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  {lang}
                </Badge>
              ))}
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                💡 <strong>Tip:</strong> Use language filters to find projects that match your skills and interests.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Search Functionality',
      description: 'Find specific projects with powerful search',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Smart Search</h3>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search repositories..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
                value="machine learning"
                readOnly
              />
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                🔍 <strong>Search Tips:</strong>
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Search by repository name or description</li>
                <li>• Combine with language filters for better results</li>
                <li>• Use specific keywords like "beginner-friendly"</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Repository Details',
      description: 'Get comprehensive information about each project',
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Repository Information</h3>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">V</span>
                  </div>
                  <div>
                    <CardTitle>vue</CardTitle>
                    <CardDescription>vuejs</CardDescription>
                  </div>
                </div>
                <Button size="sm">
                  <Github className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The Progressive JavaScript Framework
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">frontend</Badge>
                <Badge variant="outline">javascript</Badge>
                <Badge variant="outline">framework</Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>⭐ 206k stars</span>
                <span>🍴 34k forks</span>
                <span>📝 1.2k issues</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: 'Start Contributing',
      description: 'Ready to make your first contribution?',
      content: (
        <div className="text-center space-y-6">
          <div className="bg-green-500 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Github className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">You're Ready!</h3>
            <p className="text-muted-foreground mb-6">
              Now you know how to discover amazing open source projects. 
              Start exploring and find your next contribution opportunity.
            </p>
          </div>
          <div className="space-y-3">
            <Button className="w-full" size="lg">
              Start Exploring
            </Button>
            <p className="text-sm text-muted-foreground">
              Join thousands of developers contributing to open source
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play functionality
  useState(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= demoSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  });

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary p-3 rounded-full">
              <Play className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Interactive Demo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn how to use Repo Scout to discover and contribute to open source projects
          </p>
        </div>

        {/* Demo Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleAutoPlay}
            variant={isPlaying ? "default" : "outline"}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Auto Play
              </>
            )}
          </Button>
          <Button onClick={resetDemo} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {demoSteps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / demoSteps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="min-h-[400px]">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{demoSteps[currentStep].title}</CardTitle>
              <CardDescription className="text-lg">
                {demoSteps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center p-8">
              {demoSteps[currentStep].content}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentStep === demoSteps.length - 1}
          >
            Next
          </Button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2">
          {demoSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-primary'
                  : index < currentStep
                  ? 'bg-primary/50'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Separator />

        {/* Additional Resources */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Now that you've seen how Repo Scout works, start exploring real repositories 
            and find your next contribution opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Search className="h-5 w-5 mr-2" />
              Start Exploring
            </Button>
            <Button variant="outline" size="lg">
              <Github className="h-5 w-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Demo;