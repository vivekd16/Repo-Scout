import { Github, Heart, Users, Code, Star, GitBranch, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const About = () => {
  const features = [
    {
      icon: Star,
      title: 'Top Repositories',
      description: 'Discover the most starred and established open source projects',
      color: 'text-yellow-500'
    },
    {
      icon: GitBranch,
      title: 'Growing Projects',
      description: 'Find emerging repositories that are gaining momentum',
      color: 'text-green-500'
    },
    {
      icon: Zap,
      title: 'Smart Search',
      description: 'Advanced filtering by language, topics, and activity level',
      color: 'text-purple-500'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Connect with maintainers and fellow contributors',
      color: 'text-blue-500'
    }
  ];

  const stats = [
    { label: 'Repositories Indexed', value: '10M+' },
    { label: 'Programming Languages', value: '500+' },
    { label: 'Active Contributors', value: '50M+' },
    { label: 'Open Issues', value: '2M+' }
  ];

  return (
    <Layout>
      <div className="p-6 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="bg-primary p-4 rounded-2xl">
              <Github className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground">About Repo Scout</h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Repo Scout is your gateway to the open source world. We help developers discover 
            amazing projects, find contribution opportunities, and connect with vibrant communities 
            across GitHub's vast ecosystem.
          </p>
        </section>

        {/* Mission Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              To democratize open source contribution by making it easier for developers 
              to find projects that match their skills, interests, and availability.
            </p>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <Heart className="h-8 w-8 text-red-500" />
                <h3 className="text-2xl font-semibold text-foreground">Why Open Source Matters</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Open source software powers the modern world. From the operating systems we use 
                to the frameworks that build our applications, open source projects form the 
                foundation of technology. By contributing to open source, developers not only 
                give back to the community but also improve their skills, build their reputation, 
                and create lasting professional relationships.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">What We Offer</h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools to help you navigate the open source landscape
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">By the Numbers</h2>
            <p className="text-lg text-muted-foreground">
              The scale of open source development
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Built With</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Modern technologies for a seamless experience
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'GitHub API', 
              'Framer Motion', 'Radix UI', 'React Hook Form', 'Zod'
            ].map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe open source should be accessible to everyone, regardless of 
                  experience level or background.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Strong communities build better software. We help connect developers 
                  with projects and people.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We curate and highlight high-quality projects that provide value 
                  to the developer community.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center space-y-6 py-12 bg-muted/30 rounded-lg">
          <h2 className="text-3xl font-bold text-foreground">Get Involved</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Repo Scout is an open source project itself. We welcome contributions, 
            feedback, and suggestions from the community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="https://github.com/repo-scout/repo-scout" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/repo-scout/repo-scout/issues" target="_blank" rel="noopener noreferrer">
                Report an Issue
              </a>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;