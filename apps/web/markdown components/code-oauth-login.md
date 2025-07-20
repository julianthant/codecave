import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Chrome, MessageCircle, Terminal, Code2, Zap } from 'lucide-react';

const CodeOAuthLogin = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const codeLines = [
    "// Initializing authentication module...",
    "const auth = new OAuth({",
    "  providers: ['github', 'google', 'discord'],",
    "  secure: true,",
    "  redirectUri: '/dashboard'",
    "});",
    "",
    "// Ready for authentication ✓"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % codeLines.length);
    }, 2000);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  const oauthProviders = [
    {
      name: 'GitHub',
      icon: Github,
      color: 'hover:text-foreground',
      description: 'git clone your-auth@github.com',
      command: '$ auth.login("github")'
    },
    {
      name: 'Google',
      icon: Chrome,
      color: 'hover:text-code-function',
      description: 'import { user } from "google"',
      command: '$ auth.login("google")'
    },
    {
      name: 'Discord',
      icon: MessageCircle,
      color: 'hover:text-accent',
      description: 'connect("discord://user")',
      command: '$ auth.login("discord")'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary text-xs animate-matrix-rain font-mono"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            {Math.random().toString(36).substring(2, 15)}
          </div>
        ))}
      </div>

      <Card className="w-full max-w-md terminal-border bg-card/80 backdrop-blur-sm relative">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Terminal className="h-6 w-6 text-primary animate-terminal-glow" />
            <CardTitle className="text-xl font-mono text-foreground">
              <span className="text-code-keyword">class</span>{" "}
              <span className="text-code-function">Authentication</span>{" "}
              <span className="text-muted-foreground">{"{"}</span>
            </CardTitle>
          </div>
          
          {/* Animated code display */}
          <div className="bg-secondary/30 rounded-lg p-4 text-left border border-border/50">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-destructive"></div>
                <div className="w-2 h-2 rounded-full bg-code-string"></div>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <span className="text-xs text-muted-foreground font-mono">terminal.js</span>
            </div>
            {codeLines.slice(0, currentLine + 1).map((line, index) => (
              <div
                key={index}
                className={`text-sm font-mono code-slide-in ${
                  index === currentLine ? 'text-primary' : 'text-muted-foreground'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {line.includes('//') ? (
                  <>
                    <span className="text-muted-foreground">{line.split('//')[0]}</span>
                    <span className="text-code-comment">//{line.split('//')[1]}</span>
                  </>
                ) : line.includes('const') ? (
                  <>
                    <span className="text-code-keyword">const</span>
                    <span className="text-foreground">{line.replace('const', '')}</span>
                  </>
                ) : line.includes("'") ? (
                  line.split("'").map((part, i) => (
                    <span key={i} className={i % 2 === 1 ? 'text-code-string' : 'text-foreground'}>
                      {i % 2 === 1 ? `'${part}'` : part}
                    </span>
                  ))
                ) : (
                  <span className="text-foreground">{line}</span>
                )}
                {index === currentLine && showCursor && (
                  <span className="text-primary animate-cursor-blink">|</span>
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground font-mono">
              <span className="text-code-comment">/* Choose your authentication provider */</span>
            </p>
          </div>

          <div className="space-y-3">
            {oauthProviders.map((provider) => (
              <Button
                key={provider.name}
                variant="oauth"
                className="w-full h-auto p-4 justify-start group"
                onClick={() => console.log(`Login with ${provider.name}`)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <provider.icon className={`h-5 w-5 ${provider.color} transition-colors`} />
                  <div className="flex-1 text-left">
                    <div className="font-mono text-sm font-medium">
                      {provider.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {provider.description}
                    </div>
                  </div>
                  <Code2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Button>
            ))}
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground font-mono">
                <Zap className="h-3 w-3" />
                <span>Secure OAuth 2.0 Protocol</span>
              </div>
              <p className="text-xs text-code-comment font-mono">
                // No passwords stored. Enterprise-grade security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeOAuthLogin;