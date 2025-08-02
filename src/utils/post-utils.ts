import { 
  Block, 
  Post, 
  BlockType, 
  PostType, 
  TextBlock, 
  CodeBlock, 
  ImageBlock,
  PromptBlock,
  MathBlock,
  SVGBlock,
  MarkdownBlock,
  TerminalBlock,
  BlockValidation 
} from '@/types/post-types'

// Block validation schemas
const BLOCK_VALIDATIONS: Record<BlockType, BlockValidation> = {
  text: {
    type: 'text',
    required_fields: ['content.text'],
    optional_fields: ['content.format'],
    max_content_length: 10000
  },
  code: {
    type: 'code',
    required_fields: ['content.code', 'content.language'],
    optional_fields: ['content.filename', 'content.showLineNumbers'],
    max_content_length: 50000
  },
  image: {
    type: 'image',
    required_fields: ['content.url'],
    optional_fields: ['content.alt', 'content.caption', 'content.width', 'content.height', 'content.layout'],
    allowed_formats: ['inline', 'wide', 'full']
  },
  prompt: {
    type: 'prompt',
    required_fields: ['content.prompt'],
    optional_fields: ['content.model', 'content.temperature', 'content.maxTokens', 'content.systemPrompt', 'content.examples'],
    max_content_length: 5000
  },
  math: {
    type: 'math',
    required_fields: ['content.formula'],
    optional_fields: ['content.displayMode', 'content.description'],
    max_content_length: 2000
  },
  svg: {
    type: 'svg',
    required_fields: ['content.code'],
    optional_fields: ['content.title', 'content.width', 'content.height'],
    max_content_length: 20000
  },
  markdown: {
    type: 'markdown',
    required_fields: ['content.markdown'],
    optional_fields: ['content.title'],
    max_content_length: 15000
  },
  terminal: {
    type: 'terminal',
    required_fields: ['content.commands'],
    optional_fields: ['content.cwd', 'content.title'],
    max_content_length: 10000
  }
}

// Supported programming languages
export const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala',
  'html', 'css', 'scss', 'sql', 'bash', 'shell', 'json',
  'yaml', 'xml', 'markdown', 'dockerfile', 'nginx'
]

// Post categories
export const POST_CATEGORIES = {
  discussion: ['question', 'general', 'help', 'announcement', 'feedback'],
  snippet: ['algorithm', 'data-structure', 'web-dev', 'mobile', 'backend', 'frontend'],
  showcase: ['web-app', 'mobile-app', 'desktop', 'game', 'tool', 'library'],
  article: ['tutorial', 'guide', 'opinion', 'news', 'review']
}

// Utility functions
export class PostUtils {
  /**
   * Validate a block against its schema
   */
  static validateBlock(block: Block): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const validation = BLOCK_VALIDATIONS[block.type]
    
    if (!validation) {
      errors.push(`Unknown block type: ${block.type}`)
      return { valid: false, errors }
    }

    // Check required fields
    for (const field of validation.required_fields) {
      if (!this.getNestedProperty(block, field)) {
        errors.push(`Missing required field: ${field}`)
      }
    }

    // Check content length
    if (validation.max_content_length) {
      const content = this.getBlockContent(block)
      if (content && content.length > validation.max_content_length) {
        errors.push(`Content exceeds maximum length of ${validation.max_content_length} characters`)
      }
    }

    // Check allowed formats
    if (validation.allowed_formats && block.type === 'image') {
      const imageBlock = block as ImageBlock
      if (imageBlock.content.layout && !validation.allowed_formats.includes(imageBlock.content.layout)) {
        errors.push(`Invalid layout format: ${imageBlock.content.layout}`)
      }
    }

    // Type-specific validations
    this.validateBlockTypeSpecific(block, errors)

    return { valid: errors.length === 0, errors }
  }

  /**
   * Validate a complete post
   */
  static validatePost(post: Post): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Basic post validation
    if (!post.title || post.title.trim().length === 0) {
      errors.push('Post title is required')
    }

    if (post.title && post.title.length > 200) {
      errors.push('Post title must be less than 200 characters')
    }

    if (!post.blocks || post.blocks.length === 0) {
      errors.push('Post must have at least one block')
    }

    if (post.tags.length > 10) {
      errors.push('Post cannot have more than 10 tags')
    }

    // Validate each block
    post.blocks.forEach((block, index) => {
      const blockValidation = this.validateBlock(block)
      if (!blockValidation.valid) {
        errors.push(`Block ${index + 1}: ${blockValidation.errors.join(', ')}`)
      }
    })

    // Type-specific post validation
    this.validatePostTypeSpecific(post, errors)

    return { valid: errors.length === 0, errors }
  }

  /**
   * Estimate reading time for a post
   */
  static estimateReadingTime(blocks: Block[]): number {
    const WORDS_PER_MINUTE = 200
    let totalWords = 0

    blocks.forEach(block => {
      switch (block.type) {
        case 'text':
          const textBlock = block as TextBlock
          const text = typeof textBlock.content === 'string' ? textBlock.content : textBlock.content.text
          totalWords += this.countWords(text)
          break
        case 'markdown':
          const markdownBlock = block as MarkdownBlock
          totalWords += this.countWords(markdownBlock.content.markdown)
          break
        case 'code':
          // Code takes longer to read, so we multiply by 1.5
          const codeBlock = block as CodeBlock
          totalWords += Math.floor(this.countWords(codeBlock.content.code) * 1.5)
          break
        case 'prompt':
          const promptBlock = block as PromptBlock
          totalWords += this.countWords(promptBlock.content.prompt)
          break
        default:
          // Other blocks add minimal reading time
          totalWords += 10
      }
    })

    return Math.max(1, Math.ceil(totalWords / WORDS_PER_MINUTE))
  }

  /**
   * Extract hashtags and mentions from content
   */
  static extractTags(content: string): string[] {
    const hashtagPattern = /#([a-zA-Z0-9_]+)/g
    const matches = content.match(hashtagPattern)
    return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : []
  }

  /**
   * Generate URL-friendly slug from title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50)
  }

  /**
   * Format post date for display
   */
  static formatPostDate(date: string): string {
    const postDate = new Date(date)
    const now = new Date()
    const diffInMs = now.getTime() - postDate.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInHours / 24

    if (diffInHours < 1) {
      return 'just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`
    } else {
      return postDate.toLocaleDateString()
    }
  }

  /**
   * Get block content as string for validation
   */
  private static getBlockContent(block: Block): string {
    switch (block.type) {
      case 'text':
        const textBlock = block as TextBlock
        return typeof textBlock.content === 'string' ? textBlock.content : textBlock.content.text
      case 'code':
        return (block as CodeBlock).content.code
      case 'prompt':
        return (block as PromptBlock).content.prompt
      case 'math':
        return (block as MathBlock).content.formula
      case 'svg':
        return (block as SVGBlock).content.code
      case 'markdown':
        return (block as MarkdownBlock).content.markdown
      case 'terminal':
        return (block as TerminalBlock).content.commands
          .map(cmd => `${cmd.input} ${cmd.output || ''}`)
          .join(' ')
      default:
        return ''
    }
  }

  /**
   * Count words in text
   */
  private static countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  /**
   * Get nested property from object using dot notation
   */
  private static getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  /**
   * Type-specific block validation
   */
  private static validateBlockTypeSpecific(block: Block, errors: string[]): void {
    switch (block.type) {
      case 'code':
        const codeBlock = block as CodeBlock
        if (!SUPPORTED_LANGUAGES.includes(codeBlock.content.language)) {
          errors.push(`Unsupported language: ${codeBlock.content.language}`)
        }
        break
      case 'image':
        const imageBlock = block as ImageBlock
        if (!this.isValidUrl(imageBlock.content.url)) {
          errors.push('Invalid image URL')
        }
        break
      case 'prompt':
        const promptBlock = block as PromptBlock
        if (promptBlock.content.temperature && (promptBlock.content.temperature < 0 || promptBlock.content.temperature > 2)) {
          errors.push('Temperature must be between 0 and 2')
        }
        break
      case 'svg':
        const svgBlock = block as SVGBlock
        if (!this.isValidSVG(svgBlock.content.code)) {
          errors.push('Invalid SVG code')
        }
        break
    }
  }

  /**
   * Type-specific post validation
   */
  private static validatePostTypeSpecific(post: Post, errors: string[]): void {
    switch (post.type) {
      case 'snippet':
        if (!post.tags.some(tag => SUPPORTED_LANGUAGES.includes(tag))) {
          errors.push('Code snippet must include a programming language tag')
        }
        break
      case 'discussion':
        if (!POST_CATEGORIES.discussion.includes((post as any).category)) {
          errors.push('Invalid discussion category')
        }
        break
    }
  }

  /**
   * Check if URL is valid
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * Basic SVG validation
   */
  private static isValidSVG(svgCode: string): boolean {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgCode, 'image/svg+xml')
      const errorNode = doc.querySelector('parsererror')
      return !errorNode
    } catch {
      return false
    }
  }
}

// Helper functions for components
export const getBlockComponent = (blockType: BlockType) => {
  const componentMap = {
    text: 'TextBlock',
    code: 'CodeBlock',
    image: 'ImageBlock',
    prompt: 'PromptBlock',
    math: 'MathBlock',
    svg: 'SVGBlock',
    markdown: 'MarkdownBlock',
    terminal: 'TerminalBlock'
  }
  return componentMap[blockType]
}

export const getPostTypeIcon = (postType: PostType) => {
  const iconMap = {
    article: 'FileText',
    snippet: 'Code',
    showcase: 'Eye',
    discussion: 'MessageCircle'
  }
  return iconMap[postType]
}

export const getPostTypeColor = (postType: PostType) => {
  const colorMap = {
    article: 'blue',
    snippet: 'green',
    showcase: 'purple',
    discussion: 'orange'
  }
  return colorMap[postType]
}