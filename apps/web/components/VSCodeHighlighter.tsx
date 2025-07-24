import React from 'react';

interface VSCodeHighlighterProps {
  code: string;
  language: string;
}

// VS Code 2017 Dark Theme Colors
const VSCodeTheme = {
  background: '#1e1e1e',
  foreground: '#d4d4d4',
  comment: '#6a9955',
  keyword: '#569cd6',
  string: '#ce9178',
  number: '#b5cea8',
  function: '#dcdcaa',
  variable: '#9cdcfe',
  type: '#4ec9b0',
  operator: '#d4d4d4',
  punctuation: '#d4d4d4',
  property: '#9cdcfe',
  constant: '#4fc1ff',
  delimiter: '#d4d4d4'
};

interface Token {
  type: 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'type' | 'variable' | 'operator' | 'punctuation' | 'text';
  value: string;
}

export function VSCodeHighlighter({ code, language }: VSCodeHighlighterProps) {
  const tokenizeCode = (code: string, language: string): Token[] => {
    const tokens: Token[] = [];
    let remaining = code;

    const patterns = {
      typescript: [
        { type: 'comment' as const, regex: /^(\/\/.*$|\/\*[\s\S]*?\*\/)/m },
        { type: 'string' as const, regex: /^(['"`])((?:\\.|(?!\1)[^\\])*)\1/ },
        { type: 'keyword' as const, regex: /^(const|let|var|function|return|if|else|for|while|class|interface|type|import|export|from|default|async|await|try|catch|throw|new|this|super|extends|implements|useState|useEffect|io)\b/ },
        { type: 'type' as const, regex: /^(string|number|boolean|object|undefined|null|void|any|unknown|never|Cursor|User)\b/ },
        { type: 'function' as const, regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/ },
        { type: 'number' as const, regex: /^(\d+(?:\.\d+)?)/ },
        { type: 'operator' as const, regex: /^([+\-*/%=<>!&|^~?:])/ },
        { type: 'punctuation' as const, regex: /^([{}[\]();,.])/},
        { type: 'variable' as const, regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)/ }
      ],
      javascript: [
        { type: 'comment' as const, regex: /^(\/\/.*$|\/\*[\s\S]*?\*\/)/m },
        { type: 'string' as const, regex: /^(['"`])((?:\\.|(?!\1)[^\\])*)\1/ },
        { type: 'keyword' as const, regex: /^(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|try|catch|throw|new|this|useState)\b/ },
        { type: 'function' as const, regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/ },
        { type: 'number' as const, regex: /^(\d+(?:\.\d+)?)/ },
        { type: 'operator' as const, regex: /^([+\-*/%=<>!&|^~?:])/ },
        { type: 'punctuation' as const, regex: /^([{}[\]();,.])/},
        { type: 'variable' as const, regex: /^([a-zA-Z_$][a-zA-Z0-9_$]*)/ }
      ]
    };

    const languagePatterns = patterns[language as keyof typeof patterns] || patterns.javascript;

    while (remaining.length > 0) {
      let matched = false;

      // Check for whitespace first
      const whitespaceMatch = remaining.match(/^(\s+)/);
      if (whitespaceMatch) {
        tokens.push({ type: 'text', value: whitespaceMatch[1] });
        remaining = remaining.slice(whitespaceMatch[1].length);
        continue;
      }

      // Check each pattern
      for (const pattern of languagePatterns) {
        const match = remaining.match(pattern.regex);
        if (match && match.index === 0) {
          tokens.push({ type: pattern.type, value: match[1] || match[0] });
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }

      // If no pattern matches, take the next character as text
      if (!matched) {
        tokens.push({ type: 'text', value: remaining.charAt(0) });
        remaining = remaining.slice(1);
      }
    }

    return tokens;
  };

  const getTokenColor = (type: Token['type']): string => {
    switch (type) {
      case 'keyword': return VSCodeTheme.keyword;
      case 'string': return VSCodeTheme.string;
      case 'comment': return VSCodeTheme.comment;
      case 'number': return VSCodeTheme.number;
      case 'function': return VSCodeTheme.function;
      case 'type': return VSCodeTheme.type;
      case 'variable': return VSCodeTheme.variable;
      case 'operator': return VSCodeTheme.operator;
      case 'punctuation': return VSCodeTheme.punctuation;
      default: return VSCodeTheme.foreground;
    }
  };

  const renderTokens = () => {
    const tokens = tokenizeCode(code, language);
    return tokens.map((token, index) => (
      <span
        key={index}
        style={{ color: getTokenColor(token.type) }}
        className={token.type === 'keyword' ? 'font-semibold' : ''}
      >
        {token.value}
      </span>
    ));
  };

  return (
    <div
      className="text-sm font-mono overflow-x-auto p-4 rounded border border-[#3e3e42]"
      style={{ 
        backgroundColor: VSCodeTheme.background,
        color: VSCodeTheme.foreground 
      }}
    >
      <pre className="whitespace-pre-wrap">
        <code>
          {renderTokens()}
        </code>
      </pre>
    </div>
  );
}
