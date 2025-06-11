import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, FileText, GitPullRequest, BookOpen, Calendar, MessageSquare } from "lucide-react";
import { ProcessedIssue } from "@/services/githubApi";
import { useState } from "react";
import { auth } from "@/lib/firebase";

interface IssueCardProps {
  issue: ProcessedIssue;
}

export const IssueCard = ({ issue }: IssueCardProps) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const defaultPRTemplate = `## Description\r\nBrief description of what this PR does\r\n\r\n## Type of Change\r\n- [ ] Bug fix (non-breaking change which fixes an issue)\r\n- [ ] New feature (non-breaking change which adds functionality)\r\n- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)\r\n- [ ] This change requires a documentation update\r\n\r\n## How Has This Been Tested?\r\nPlease describe the tests that you ran to verify your changes.\r\n\r\n## Checklist:\r\n- [ ] My code follows the style guidelines of this project\r\n- [ ] I have performed a self-review of my own code\r\n- [ ] I have commented my code, particularly in hard-to-understand areas\r\n- [ ] I have made corresponding changes to the documentation\r\n- [ ] My changes generate no new warnings\r\n- [ ] I have added tests that prove my fix is effective or that my feature works\r\n- [ ] New and existing unit tests pass locally with my changes`;

  const defaultContributingGuide = `# Contributing to ${issue.repo}\r\n\r\nThank you for your interest in contributing! Here's how you can get started:\r\n\r\n## Getting Started\r\n1. Fork the repository\r\n2. Clone your fork locally\r\n3. Create a new branch for your feature/fix\r\n4. Make your changes\r\n5. Test your changes\r\n6. Submit a pull request\r\n\r\n## Development Setup\r\n1. Install dependencies\r\n2. Set up your development environment\r\n3. Run tests to ensure everything works\r\n\r\n## Guidelines\r\n- Follow the existing code style\r\n- Write clear, descriptive commit messages\r\n- Add tests for new functionality\r\n- Update documentation as needed\r\n- Be respectful in discussions\r\n\r\n## Need Help?\r\nFeel free to ask questions in the issues or discussions section!`;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg leading-tight">
            {issue.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-3 w-3" />
            {formatRelativeDate(issue.createdAt)}
          </div>
        </div>
        <CardDescription className="font-medium text-blue-600">
          {issue.repo}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-100">
              {issue.language}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MessageSquare className="h-3 w-3" />
              {issue.comments} comments
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {issue.labels.slice(0, 3).map((label, labelIndex) => (
              <Badge 
                key={labelIndex} 
                variant="outline" 
                className="text-xs"
              >
                {label}
              </Badge>
            ))}
            {issue.labels.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{issue.labels.length - 3} more
              </Badge>
            )}
          </div>
          <div className="text-xs text-slate-500">
            Created {formatDate(issue.createdAt)} by {issue.author}
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              asChild
            >
              <a href={issue.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                View Issue
              </a>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex-1">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Contribution Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Contribution Guide for {issue.repo}</DialogTitle>
                  <DialogDescription>
                    Everything you need to contribute to this issue
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="guide" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="guide" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Contributing Guide
                    </TabsTrigger>
                    <TabsTrigger value="template" className="flex items-center gap-2">
                      <GitPullRequest className="h-4 w-4" />
                      PR Template
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="guide" className="mt-4">
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <pre className="whitespace-pre-wrap text-sm">
                        {issue.contributingGuide || defaultContributingGuide}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="template" className="mt-4">
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                      <pre className="whitespace-pre-wrap text-sm">
                        {issue.prTemplate || defaultPRTemplate}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
