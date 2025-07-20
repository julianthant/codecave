import React from 'react';
import { Sun, Moon, Monitor, Palette, Code, Heart } from 'lucide-react';
import { ThemeDropdown } from '../ui/theme-toggle';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

const ThemeDemoSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-surface via-background to-surface-variant">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 mb-6">
            <Palette className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium font-mono text-primary uppercase tracking-wider">Theme System</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-4">
            Beautiful in Every Light
          </h2>
          <p className="text-xl text-muted font-mono max-w-3xl mx-auto leading-relaxed">
            Experience our Base44-inspired design that adapts seamlessly between light and dark modes
          </p>
        </header>

        {/* Theme Control */}
        <div className="flex justify-center mb-12">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-mono font-semibold text-foreground">Switch Theme:</span>
              <ThemeDropdown />
            </div>
          </div>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Color Palette Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-mono font-semibold text-foreground mb-4 flex items-center">
                <Palette className="w-5 h-5 text-primary mr-2" />
                Color Palette
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-muted">Primary</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full border border-border" />
                    <Badge>Orange</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-muted">Secondary</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-secondary rounded-full border border-border" />
                    <Badge variant="secondary">Blue</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-muted">Accent</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-accent rounded-full border border-border" />
                    <Badge variant="outline">Yellow</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Component Preview Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-mono font-semibold text-foreground mb-4 flex items-center">
                <Code className="w-5 h-5 text-primary mr-2" />
                Components
              </h3>
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-mono text-sm hover:opacity-90 transition-opacity">
                  Primary Button
                </button>
                <div className="bg-surface-variant border border-border rounded-lg p-3">
                  <code className="font-mono text-sm">
                    <span className="text-code-keyword">const</span>{" "}
                    <span className="text-code-function">theme</span>{" "}
                    = <span className="text-code-string">"dynamic"</span>;
                  </code>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>Light</Badge>
                  <Badge variant="secondary">Dark</Badge>
                  <Badge variant="outline">System</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Features Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-mono font-semibold text-foreground mb-4 flex items-center">
                <Heart className="w-5 h-5 text-primary mr-2" />
                Features
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="font-mono text-muted">Auto system detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span className="font-mono text-muted">Smooth transitions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="font-mono text-muted">Persistent preferences</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full" />
                  <span className="font-mono text-muted">Base44-inspired design</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Theme Comparison */}
        <div className="bg-gradient-to-r from-surface/50 to-surface-variant/50 rounded-3xl p-8 border border-border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-mono font-bold text-foreground mb-2">
              Perfect for Every Developer
            </h3>
            <p className="text-muted font-mono">
              Whether you prefer the clean brightness of light mode or the focused depth of dark mode
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-2xl flex items-center justify-center mx-auto">
                <Sun className="w-8 h-8 text-yellow-800" />
              </div>
              <h4 className="font-mono font-semibold text-foreground">Light Mode</h4>
              <p className="text-sm text-muted font-mono">Clean, bright, and energizing for daytime coding</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto">
                <Moon className="w-8 h-8 text-blue-100" />
              </div>
              <h4 className="font-mono font-semibold text-foreground">Dark Mode</h4>
              <p className="text-sm text-muted font-mono">Focused, elegant, and easy on the eyes</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-mono font-semibold text-foreground">System</h4>
              <p className="text-sm text-muted font-mono">Automatically adapts to your OS preference</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThemeDemoSection; 