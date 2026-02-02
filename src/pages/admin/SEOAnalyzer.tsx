/**
 * SEO Analyzer Page
 * On-page SEO checks and technical SEO tools
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  FileText,
  Image,
  Link2,
  Code,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Globe,
  MapPin,
} from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface SEOCheck {
  id: string;
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  suggestion?: string;
}

interface AnalysisResult {
  score: number;
  checks: SEOCheck[];
}

const SEOAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [sitemapContent, setSitemapContent] = useState('');
  const [robotsContent, setRobotsContent] = useState('');

  const analyzeUrl = async () => {
    if (!url) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis (in production, this would fetch and analyze the page)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results
    const checks: SEOCheck[] = [
      {
        id: 'title',
        name: 'Title Tag',
        status: 'pass',
        message: 'Title is 45 characters (optimal: 50-60)',
      },
      {
        id: 'meta_desc',
        name: 'Meta Description',
        status: 'warn',
        message: 'Meta description is 180 characters',
        suggestion: 'Shorten to under 160 characters for full visibility in search results',
      },
      {
        id: 'h1',
        name: 'H1 Heading',
        status: 'pass',
        message: 'Page has exactly one H1 tag',
      },
      {
        id: 'heading_order',
        name: 'Heading Order',
        status: 'pass',
        message: 'Headings follow proper hierarchy (H1 → H2 → H3)',
      },
      {
        id: 'images',
        name: 'Image Alt Text',
        status: 'warn',
        message: '2 of 8 images missing alt text',
        suggestion: 'Add descriptive alt text to all images for accessibility and SEO',
      },
      {
        id: 'canonical',
        name: 'Canonical Tag',
        status: 'pass',
        message: 'Canonical URL is properly set',
      },
      {
        id: 'og_tags',
        name: 'OpenGraph Tags',
        status: 'pass',
        message: 'All essential OG tags present (title, description, image)',
      },
      {
        id: 'twitter_cards',
        name: 'Twitter Cards',
        status: 'fail',
        message: 'Missing Twitter card meta tags',
        suggestion: 'Add twitter:card, twitter:title, and twitter:description meta tags',
      },
      {
        id: 'structured_data',
        name: 'Structured Data',
        status: 'pass',
        message: 'JSON-LD structured data found for Property type',
      },
      {
        id: 'mobile_friendly',
        name: 'Mobile Viewport',
        status: 'pass',
        message: 'Viewport meta tag properly configured',
      },
    ];

    const passCount = checks.filter(c => c.status === 'pass').length;
    const score = Math.round((passCount / checks.length) * 100);

    setResult({ score, checks });
    setIsAnalyzing(false);
  };

  const generateSitemap = () => {
    const baseUrl = window.location.origin;
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/properties</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/projects</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/find-property</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
    setSitemapContent(sitemap);
  };

  const generateRobots = () => {
    const baseUrl = window.location.origin;
    const robots = `# Robots.txt for ${baseUrl}

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /client-portal/
Disallow: /agent/
Disallow: /auth
Disallow: /reset-password

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1`;
    setRobotsContent(robots);
  };

  const getStatusIcon = (status: SEOCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warn':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <PortalLayout
      title="SEO Analyzer"
      subtitle="Analyze and optimize pages for search engines"
    >
      <Tabs defaultValue="analyzer" className="space-y-6">
        <TabsList className="bg-card border border-border/20">
          <TabsTrigger value="analyzer">Page Analyzer</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          <TabsTrigger value="robots">Robots.txt</TabsTrigger>
          <TabsTrigger value="structured">Structured Data</TabsTrigger>
        </TabsList>

        {/* Page Analyzer */}
        <TabsContent value="analyzer" className="space-y-6">
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Analyze Page SEO
              </CardTitle>
              <CardDescription>
                Enter a URL to analyze its on-page SEO factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="input-luxury flex-1"
                />
                <Button
                  onClick={analyzeUrl}
                  disabled={!url || isAnalyzing}
                  className="btn-gold gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <Card className="glass-card border-border/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">SEO Score</h3>
                      <p className="text-sm text-muted-foreground">{url}</p>
                    </div>
                    <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {result.checks.filter(c => c.status === 'pass').length} Passed
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      {result.checks.filter(c => c.status === 'warn').length} Warnings
                    </Badge>
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      {result.checks.filter(c => c.status === 'fail').length} Failed
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Checks List */}
              <Card className="glass-card border-border/20">
                <CardHeader>
                  <CardTitle className="text-lg">SEO Checks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.checks.map((check) => (
                    <div
                      key={check.id}
                      className="p-4 rounded-lg bg-background/50 border border-border/10"
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(check.status)}
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{check.name}</h4>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {check.message}
                          </p>
                          {check.suggestion && (
                            <p className="text-sm text-primary mt-2 flex items-center gap-2">
                              <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">Fix</span>
                              {check.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Sitemap Generator */}
        <TabsContent value="sitemap" className="space-y-6">
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Sitemap Generator
              </CardTitle>
              <CardDescription>
                Generate an XML sitemap for search engine crawlers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateSitemap} className="btn-gold gap-2">
                <Globe className="w-4 h-4" />
                Generate Sitemap
              </Button>
              {sitemapContent && (
                <div className="space-y-2">
                  <Label>sitemap.xml</Label>
                  <Textarea
                    value={sitemapContent}
                    readOnly
                    className="font-mono text-xs h-80 input-luxury"
                  />
                  <p className="text-xs text-muted-foreground">
                    Save this content as <code>public/sitemap.xml</code> in your project
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Robots.txt Generator */}
        <TabsContent value="robots" className="space-y-6">
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Robots.txt Generator
              </CardTitle>
              <CardDescription>
                Control how search engines crawl your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateRobots} className="btn-gold gap-2">
                <FileText className="w-4 h-4" />
                Generate Robots.txt
              </Button>
              {robotsContent && (
                <div className="space-y-2">
                  <Label>robots.txt</Label>
                  <Textarea
                    value={robotsContent}
                    readOnly
                    className="font-mono text-xs h-60 input-luxury"
                  />
                  <p className="text-xs text-muted-foreground">
                    Save this content as <code>public/robots.txt</code> in your project
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Structured Data */}
        <TabsContent value="structured" className="space-y-6">
          <Card className="glass-card border-border/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Structured Data (JSON-LD)
              </CardTitle>
              <CardDescription>
                Example JSON-LD schemas for properties and projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Property Schema Example</Label>
                <Textarea
                  value={`{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "Luxury Villa in New Cairo",
  "description": "4 bedroom villa with pool and garden",
  "url": "https://example.com/properties/123",
  "image": "https://example.com/images/villa.jpg",
  "offers": {
    "@type": "Offer",
    "price": "5000000",
    "priceCurrency": "EGP"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "New Cairo",
    "addressRegion": "Cairo",
    "addressCountry": "EG"
  },
  "numberOfRooms": 4,
  "numberOfBathroomsTotal": 3,
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": 350,
    "unitCode": "MTK"
  }
}`}
                  readOnly
                  className="font-mono text-xs h-80 input-luxury"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Add this JSON-LD script to property detail pages to enhance search appearance
                with rich snippets showing price, location, and features.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PortalLayout>
  );
};

export default SEOAnalyzer;
