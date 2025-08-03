import React from 'react'
import { Code, BookOpen, Github, ExternalLink } from 'lucide-react'
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export function DeveloperSection() {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="px-4 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
        Developer
      </DropdownMenuLabel>
      <DropdownMenuItem className="px-4 py-2 cursor-pointer">
        <Link href="/repositories" className="flex items-center space-x-3 w-full">
          <Code className="w-4 h-4 text-gray-500" />
          <span>Repositories</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="px-4 py-2 cursor-pointer">
        <Link href="/projects" className="flex items-center space-x-3 w-full">
          <BookOpen className="w-4 h-4 text-gray-500" />
          <span>Projects</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="px-4 py-2 cursor-pointer">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center w-full"
        >
          <div className="flex items-center space-x-3">
            <Github className="w-4 h-4 text-gray-500" />
            <span>GitHub Profile</span>
          </div>
          <ExternalLink className="w-3 h-3 text-gray-400" />
        </a>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  )
}