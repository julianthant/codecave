Block Types Documentation
Overview
Additional block types for the CodeCave editor including AI prompts, math formulas, SVG rendering, markdown, and terminal output.
File Structure
app/components/feed/PostBlocks/
├── PromptBlock.tsx # AI prompt display
├── MathBlock.tsx # LaTeX/KaTeX formulas
├── SVGBlock.tsx # SVG preview and code
├── MarkdownBlock.tsx # Rich markdown preview
├── TerminalBlock.tsx # Terminal output display
├── TextBlock.tsx # Enhanced text block
└── ImageBlock.tsx # Enhanced image block
Implementation
AI Prompt Block
tsx// app/components/feed/PostBlocks/PromptBlock.tsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface PromptBlockProps {
block: {
id: string
content: {
prompt: string
model?: string
temperature?: number
maxTokens?: number
systemPrompt?: string
examples?: Array<{ input: string; output: string }>
}
}
}

export function PromptBlock({ block }: PromptBlockProps) {
const [copied, setCopied] = useState(false)
const [showDetails, setShowDetails] = useState(false)
const { content } = block

const handleCopy = () => {
navigator.clipboard.writeText(content.prompt)
setCopied(true)
setTimeout(() => setCopied(false), 2000)
}

return (
<div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
{/_ Header _/}
<div className="px-4 py-3 bg-white/50 dark:bg-gray-900/50 border-b border-purple-200 dark:border-purple-800">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-2">
<Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
<span className="font-medium text-gray-900 dark:text-gray-100">AI Prompt</span>
{content.model && (
<span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
{content.model}
</span>
)}
</div>
<button
            onClick={handleCopy}
            className="p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            title="Copy prompt"
          >
{copied ? (
<Check className="w-4 h-4 text-green-500" />
) : (
<Copy className="w-4 h-4" />
)}
</button>
</div>
</div>

      {/* Main Prompt */}
      <div className="p-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {content.prompt}
          </p>
        </div>

        {/* Examples */}
        {content.examples && content.examples.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Examples:</h4>
            {content.examples.map((example, index) => (
              <div key={index} className="bg-white/70 dark:bg-gray-900/70 rounded-lg p-3 text-sm">
                <div className="mb-2">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Input:</span>
                  <p className="mt-1 text-gray-800 dark:text-gray-200">{example.input}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Output:</span>
                  <p className="mt-1 text-gray-800 dark:text-gray-200">{example.output}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Parameters Toggle */}
        {(content.temperature !== undefined || content.maxTokens || content.systemPrompt) && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-3 flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            <span>Parameters</span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Parameters Details */}
        {showDetails && (
          <div className="mt-3 p-3 bg-white/70 dark:bg-gray-900/70 rounded-lg space-y-2 text-sm">
            {content.temperature !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Temperature:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">{content.temperature}</span>
              </div>
            )}
            {content.maxTokens && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Max Tokens:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">{content.maxTokens}</span>
              </div>
            )}
            {content.systemPrompt && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">System Prompt:</span>
                <p className="mt-1 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded p-2">
                  {content.systemPrompt}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

)
}
Math Formula Block
tsx// app/components/feed/PostBlocks/MathBlock.tsx
'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathBlockProps {
block: {
id: string
content: {
formula: string
displayMode?: boolean
description?: string
}
}
}

export function MathBlock({ block }: MathBlockProps) {
const mathRef = useRef<HTMLDivElement>(null)
const { content } = block

useEffect(() => {
if (mathRef.current) {
try {
katex.render(content.formula, mathRef.current, {
displayMode: content.displayMode ?? true,
throwOnError: false,
errorColor: '#ef4444',
trust: true,
strict: false,
macros: {
"\\RR": "\\mathbb{R}",
"\\NN": "\\mathbb{N}",
"\\ZZ": "\\mathbb{Z}",
"\\QQ": "\\mathbb{Q}",
"\\CC": "\\mathbb{C}",
}
})
} catch (error) {
console.error('KaTeX render error:', error)
if (mathRef.current) {
mathRef.current.innerHTML = `<span class="text-red-500">Error rendering formula</span>`
}
}
}
}, [content.formula, content.displayMode])

return (
<div className="my-4">
{content.description && (
<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
{content.description}
</p>
)}
<div className={cn(
"overflow-x-auto py-4",
content.displayMode ? "text-center" : "inline-block"
)}>
<div
ref={mathRef}
className={cn(
"text-gray-900 dark:text-gray-100",
content.displayMode ? "text-lg" : "text-base"
)}
/>
</div>
</div>
)
}
SVG Block
tsx// app/components/feed/PostBlocks/SVGBlock.tsx
'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Code, Eye, Copy, Check, Maximize2 } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface SVGBlockProps {
block: {
id: string
content: {
code: string
title?: string
width?: number
height?: number
}
}
}

export function SVGBlock({ block }: SVGBlockProps) {
const [view, setView] = useState<'preview' | 'code'>('preview')
const [copied, setCopied] = useState(false)
const [svgElement, setSvgElement] = useState<string>('')
const { content } = block

useEffect(() => {
// Sanitize and validate SVG
try {
const parser = new DOMParser()
const doc = parser.parseFromString(content.code, 'image/svg+xml')
const errorNode = doc.querySelector('parsererror')

      if (errorNode) {
        throw new Error('Invalid SVG')
      }

      // Set dimensions if provided
      const svgEl = doc.querySelector('svg')
      if (svgEl) {
        if (content.width) svgEl.setAttribute('width', content.width.toString())
        if (content.height) svgEl.setAttribute('height', content.height.toString())
        setSvgElement(new XMLSerializer().serializeToString(svgEl))
      }
    } catch (error) {
      console.error('SVG parse error:', error)
      setSvgElement('')
    }

}, [content.code, content.width, content.height])

const handleCopy = () => {
navigator.clipboard.writeText(content.code)
setCopied(true)
setTimeout(() => setCopied(false), 2000)
}

return (
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
{/_ Header _/}
<div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
<div className="flex items-center space-x-2">
<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
{content.title || 'SVG'}
</span>
</div>
<div className="flex items-center space-x-2">
<button
            onClick={handleCopy}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Copy SVG code"
          >
{copied ? (
<Check className="w-4 h-4 text-green-500" />
) : (
<Copy className="w-4 h-4" />
)}
</button>
<div className="flex bg-gray-200 dark:bg-gray-700 rounded p-0.5">
<button
onClick={() => setView('preview')}
className={cn(
"px-2 py-1 rounded text-xs font-medium transition-colors",
view === 'preview'
? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
: "text-gray-600 dark:text-gray-400"
)} >
<Eye className="w-3.5 h-3.5" />
</button>
<button
onClick={() => setView('code')}
className={cn(
"px-2 py-1 rounded text-xs font-medium transition-colors",
view === 'code'
? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
: "text-gray-600 dark:text-gray-400"
)} >
<Code className="w-3.5 h-3.5" />
</button>
</div>
</div>
</div>

      {/* Content */}
      <div className="p-4">
        {view === 'preview' ? (
          <div className="flex items-center justify-center min-h-[200px] bg-gray-50 dark:bg-gray-950 rounded-lg p-4">
            {svgElement ? (
              <div
                dangerouslySetInnerHTML={{ __html: svgElement }}
                className="max-w-full overflow-auto"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Invalid SVG</p>
            )}
          </div>
        ) : (
          <div className="max-h-[400px] overflow-auto rounded-lg">
            <SyntaxHighlighter
              language="xml"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                fontSize: '0.875rem',
              }}
            >
              {content.code}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>

)
}
Markdown Block
tsx// app/components/feed/PostBlocks/MarkdownBlock.tsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Eye, Code } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownBlockProps {
block: {
id: string
content: {
markdown: string
title?: string
}
}
}

export function MarkdownBlock({ block }: MarkdownBlockProps) {
const [view, setView] = useState<'preview' | 'source'>('preview')
const { content } = block

return (
<div className="my-4">
{/_ Header _/}
{content.title && (
<div className="flex items-center justify-between mb-3">
<h3 className="font-medium text-gray-900 dark:text-gray-100">
{content.title}
</h3>
<div className="flex bg-gray-200 dark:bg-gray-700 rounded p-0.5">
<button
onClick={() => setView('preview')}
className={cn(
"px-2 py-1 rounded text-xs font-medium transition-colors",
view === 'preview'
? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
: "text-gray-600 dark:text-gray-400"
)} >
<Eye className="w-3.5 h-3.5" />
</button>
<button
onClick={() => setView('source')}
className={cn(
"px-2 py-1 rounded text-xs font-medium transition-colors",
view === 'source'
? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
: "text-gray-600 dark:text-gray-400"
)} >
<Code className="w-3.5 h-3.5" />
</button>
</div>
</div>
)}

      {/* Content */}
      {view === 'preview' ? (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    style={vscDarkPlus}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">{children}</table>
                  </div>
                )
              }
            }}
          >
            {content.markdown}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language="markdown"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
            }}
          >
            {content.markdown}
          </SyntaxHighlighter>
        </div>
      )}
    </div>

)
}
Terminal Block
tsx// app/components/feed/PostBlocks/TerminalBlock.tsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Terminal, Copy, Check, Maximize2, Minimize2 } from 'lucide-react'

interface TerminalBlockProps {
block: {
id: string
content: {
commands: Array<{
input: string
output?: string
type?: 'command' | 'output' | 'error'
}>
cwd?: string
title?: string
}
}
}

export function TerminalBlock({ block }: TerminalBlockProps) {
const [copied, setCopied] = useState(false)
const [isExpanded, setIsExpanded] = useState(false)
const { content } = block

const handleCopy = () => {
const text = content.commands
.map(cmd => {
let result = ''
if (cmd.input) result += `$ ${cmd.input}\n`
if (cmd.output) result += `${cmd.output}\n`
return result
})
.join('')

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

}

return (
<div className={cn(
"bg-gray-900 rounded-lg overflow-hidden font-mono text-sm",
isExpanded && "fixed inset-4 z-50 flex flex-col"
)}>
{/_ Terminal Header _/}
<div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
<div className="flex items-center space-x-2">
<div className="flex space-x-1.5">
<div className="w-3 h-3 bg-red-500 rounded-full" />
<div className="w-3 h-3 bg-yellow-500 rounded-full" />
<div className="w-3 h-3 bg-green-500 rounded-full" />
</div>
<Terminal className="w-4 h-4 text-gray-400" />
<span className="text-xs text-gray-400">
{content.title || content.cwd || 'Terminal'}
</span>
</div>
<div className="flex items-center space-x-2">
<button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
            title="Copy commands"
          >
{copied ? (
<Check className="w-4 h-4 text-green-400" />
) : (
<Copy className="w-4 h-4" />
)}
</button>
<button
onClick={() => setIsExpanded(!isExpanded)}
className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
title={isExpanded ? "Minimize" : "Maximize"} >
{isExpanded ? (
<Minimize2 className="w-4 h-4" />
) : (
<Maximize2 className="w-4 h-4" />
)}
</button>
</div>
</div>

      {/* Terminal Content */}
      <div className={cn(
        "p-4 overflow-auto bg-gray-950",
        !isExpanded && "max-h-[400px]",
        isExpanded && "flex-1"
      )}>
        {content.cwd && (
          <div className="text-gray-500 text-xs mb-2">
            {content.cwd}
          </div>
        )}

        <div className="space-y-2">
          {content.commands.map((cmd, index) => (
            <div key={index}>
              {cmd.input && (
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">$</span>
                  <span className="text-gray-100 flex-1">{cmd.input}</span>
                </div>
              )}
              {cmd.output && (
                <div className={cn(
                  "ml-4 whitespace-pre-wrap",
                  cmd.type === 'error' ? "text-red-400" : "text-gray-300"
                )}>
                  {cmd.output}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cursor */}
        <div className="inline-block w-2 h-4 bg-gray-400 animate-pulse mt-2" />
      </div>
    </div>

)
}
Enhanced Text Block
tsx// app/components/feed/PostBlocks/TextBlock.tsx
'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface TextBlockProps {
block: {
id: string
content: {
text: string
format?: 'markdown' | 'plain'
}
}
}

export function TextBlock({ block }: TextBlockProps) {
const { content } = block
const isMarkdown = content.format === 'markdown' || content.text.includes('\*\*') || content.text.includes('##')

if (!isMarkdown) {
return (
<p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
{content.text}
</p>
)
}

return (
<div className="prose prose-sm dark:prose-invert max-w-none">
<ReactMarkdown
remarkPlugins={[remarkGfm]}
components={{
// Custom link component
a({ href, children }) {
return (

                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                {children}
              </a>
            )
          },
          // Custom code component
          code({ inline, className, children }) {
            return inline ? (
              <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            )
          },
          // Custom blockquote
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic">
                {children}
              </blockquote>
            )
          }
        }}
      >
        {content.text}
      </ReactMarkdown>
    </div>

)
}
Enhanced Image Block
tsx// app/components/feed/PostBlocks/ImageBlock.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Expand, X } from 'lucide-react'

interface ImageBlockProps {
block: {
id: string
content: {
url: string
alt?: string
caption?: string
width?: number
height?: number
layout?: 'inline' | 'wide' | 'full'
}
}
}

export function ImageBlock({ block }: ImageBlockProps) {
const [isFullscreen, setIsFullscreen] = useState(false)
const [imageError, setImageError] = useState(false)
const { content } = block

if (imageError) {
return (
<div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
<p className="text-gray-500 dark:text-gray-400">Failed to load image</p>
</div>
)
}

return (
<>
<figure className={cn(
"relative group",
content.layout === 'wide' && "-mx-4 md:-mx-8",
content.layout === 'full' && "-mx-4 md:-mx-16"
)}>
<div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
<Image
src={content.url}
alt={content.alt || 'Image'}
width={content.width || 800}
height={content.height || 600}
className="w-full h-auto"
onError={() => setImageError(true)}
/>

          {/* Fullscreen button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="View fullscreen"
          >
            <Expand className="w-4 h-4" />
          </button>
        </div>

        {content.caption && (
          <figcaption className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {content.caption}
          </figcaption>
        )}
      </figure>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <Image
            src={content.url}
            alt={content.alt || 'Image'}
            width={content.width || 1920}
            height={content.height || 1080}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>

)
}
