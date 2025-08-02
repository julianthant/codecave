// Post Types and Block Definitions for CodeCave

export type BlockType = 
  | 'text'
  | 'code' 
  | 'image'
  | 'prompt'
  | 'math'
  | 'svg'
  | 'markdown'
  | 'terminal'

export type PostType = 
  | 'article'
  | 'snippet'
  | 'showcase'
  | 'discussion'

// Base block interface
export interface BaseBlock {
  id: string
  type: BlockType
  order: number
}

// Text Block
export interface TextBlock extends BaseBlock {
  type: 'text'
  content: {
    text: string
    format?: 'markdown' | 'plain'
  }
}

// Code Block
export interface CodeBlock extends BaseBlock {
  type: 'code'
  content: {
    code: string
    language: string
    filename?: string
    showLineNumbers?: boolean
  }
}

// Image Block
export interface ImageBlock extends BaseBlock {
  type: 'image'
  content: {
    url: string
    alt?: string
    caption?: string
    width?: number
    height?: number
    layout?: 'inline' | 'wide' | 'full'
  }
}

// AI Prompt Block
export interface PromptBlock extends BaseBlock {
  type: 'prompt'
  content: {
    prompt: string
    model?: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
    examples?: Array<{
      input: string
      output: string
    }>
  }
}

// Math Formula Block
export interface MathBlock extends BaseBlock {
  type: 'math'
  content: {
    formula: string
    displayMode?: boolean
    description?: string
  }
}

// SVG Block
export interface SVGBlock extends BaseBlock {
  type: 'svg'
  content: {
    code: string
    title?: string
    width?: number
    height?: number
  }
}

// Markdown Block
export interface MarkdownBlock extends BaseBlock {
  type: 'markdown'
  content: {
    markdown: string
    title?: string
  }
}

// Terminal Block
export interface TerminalBlock extends BaseBlock {
  type: 'terminal'
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

// Union type for all blocks
export type Block = 
  | TextBlock
  | CodeBlock
  | ImageBlock
  | PromptBlock
  | MathBlock
  | SVGBlock
  | MarkdownBlock
  | TerminalBlock

// Author information
export interface Author {
  id: string
  username: string
  display_name: string
  avatar_url?: string | null
  leetcode_rank?: string
  is_verified?: boolean
  is_admin?: boolean
  reputation_score?: number
  daily_streak?: number
}

// Base post interface
export interface BasePost {
  id: string
  type: PostType
  title: string
  author: Author
  blocks: Block[]
  tags: string[]
  created_at: string
  updated_at: string
  likes_count: number
  comments_count: number
  views_count: number
  is_liked?: boolean
  is_bookmarked?: boolean
  slug?: string
  description?: string
}

// Article Post - Long-form content with multiple blocks
export interface ArticlePost extends BasePost {
  type: 'article'
  subtitle?: string
  reading_time?: number
  featured_image?: string
  published_at?: string
  status: 'draft' | 'published' | 'archived'
}

// Code Snippet Post - Focused on code sharing
export interface SnippetPost extends BasePost {
  type: 'snippet'
  language: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  category?: string
  problem_source?: string
  solution_approach?: string
}

// Project Showcase Post - Displaying projects and demos
export interface ShowcasePost extends BasePost {
  type: 'showcase'
  demo_url?: string
  github_url?: string
  tech_stack: string[]
  project_status: 'in-progress' | 'completed' | 'maintained'
  screenshots?: Array<{
    url: string
    caption?: string
  }>
}

// Discussion Post - Community discussions and questions
export interface DiscussionPost extends BasePost {
  type: 'discussion'
  category: 'question' | 'general' | 'help' | 'announcement' | 'feedback'
  is_answered?: boolean
  accepted_answer_id?: string
  bounty_points?: number
}

// Union type for all post types
export type Post = ArticlePost | SnippetPost | ShowcasePost | DiscussionPost

// Post creation/editing interfaces
export interface CreatePostData {
  type: PostType
  title: string
  blocks: Omit<Block, 'id' | 'order'>[]
  tags: string[]
  description?: string
  // Type-specific fields
  subtitle?: string // Article
  language?: string // Snippet
  demo_url?: string // Showcase
  github_url?: string // Showcase
  tech_stack?: string[] // Showcase
  category?: string // Discussion
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string
}

// Post filters and search
export interface PostFilters {
  type?: PostType | PostType[]
  tags?: string[]
  author_id?: string
  difficulty?: string
  language?: string
  category?: string
  date_range?: {
    start: string
    end: string
  }
  sort_by?: 'created_at' | 'likes_count' | 'views_count' | 'comments_count'
  sort_order?: 'asc' | 'desc'
}

// Post statistics
export interface PostStats {
  total_posts: number
  posts_by_type: Record<PostType, number>
  top_tags: Array<{
    tag: string
    count: number
  }>
  posts_this_week: number
  posts_this_month: number
}

// Feed configuration
export interface FeedConfig {
  posts_per_page: number
  show_author_info: boolean
  show_post_stats: boolean
  enable_infinite_scroll: boolean
  default_sort: PostFilters['sort_by']
  supported_languages: string[]
  max_tags_per_post: number
}

// Post interaction events
export interface PostInteraction {
  post_id: string
  user_id: string
  type: 'like' | 'bookmark' | 'view' | 'share' | 'comment'
  created_at: string
  metadata?: Record<string, any>
}

// Comment system
export interface Comment {
  id: string
  post_id: string
  parent_id?: string // For nested comments
  author: Author
  content: string
  created_at: string
  updated_at: string
  likes_count: number
  is_liked?: boolean
  replies?: Comment[]
}

// Block validation schemas
export interface BlockValidation {
  type: BlockType
  required_fields: string[]
  optional_fields: string[]
  max_content_length?: number
  allowed_formats?: string[]
  validation_rules?: Record<string, any>
}

// Export utilities type
export interface PostUtils {
  validateBlock: (block: Block) => boolean
  validatePost: (post: Post) => boolean
  estimateReadingTime: (blocks: Block[]) => number
  extractTags: (content: string) => string[]
  generateSlug: (title: string) => string
  formatPostDate: (date: string) => string
}