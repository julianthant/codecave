'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Edit3, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Profile, UserSettings } from '@/db/schema'

interface CodeIntroProps {
  profile: Profile
  userSettings?: UserSettings
  isOwnProfile?: boolean
}

export function CodeIntro({
  profile,
  userSettings,
  isOwnProfile = false,
}: CodeIntroProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const codeContent = `const developer = {
  name: "${profile.displayName || profile.username}",
  username: "@${profile.username}",
  role: "${
    userSettings?.experienceLevel === 'senior'
      ? 'Senior Developer'
      : userSettings?.experienceLevel === 'mid'
        ? 'Mid-level Developer'
        : userSettings?.experienceLevel === 'junior'
          ? 'Junior Developer'
          : userSettings?.experienceLevel === 'lead'
            ? 'Lead Developer'
            : 'Developer'
  }",
  location: "Global", // Could be dynamic
  languages: ${JSON.stringify(userSettings?.languages || ['JavaScript', 'TypeScript'], null, 2).replace(/\n/g, '\n  ')},
  technologies: ${JSON.stringify(userSettings?.skills?.slice(0, 6) || ['React', 'Node.js'], null, 2).replace(/\n/g, '\n  ')},
  currentlyLearning: ["Web3", "Rust", "AI/ML"],
  askMeAbout: ["${userSettings?.skills?.[0] || 'React'}", "${userSettings?.skills?.[1] || 'TypeScript'}", "System Design"],
  challengeMe: "I love solving complex problems! 🚀",
  funFact: "I debug with console.log and I'm not ashamed 😄",
  availableForCollab: ${userSettings?.availableForCollab || false},
  contactMe: {
    github: "${profile.githubUsername || 'Not set'}",
    twitter: "${profile.twitterUsername || 'Not set'}",
    linkedin: "${profile.linkedinUrl ? 'Available' : 'Not set'}"
  }
};

// Let's build something amazing together! 🔥
console.log(\`Hello! I'm \${developer.name} 👋\`);`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const themeClasses = isDarkTheme
    ? 'bg-gray-900 border-gray-700'
    : 'bg-gray-50 border-gray-200'

  const textClasses = isDarkTheme ? 'text-gray-100' : 'text-gray-900'

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-gray-200 border-b">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-orange-600" />
            <h2 className="font-semibold text-gray-900 text-lg">
              Developer Profile
            </h2>
            <span className="font-mono text-gray-500 text-sm">bio.js</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="h-8"
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </Button>

            {/* Edit Button (only for own profile) */}
            {isOwnProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="h-8"
              >
                <Edit3 className="mr-1 w-3 h-3" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            )}

            {/* Copy Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8"
            >
              {copied ? (
                <>
                  <Check className="mr-1 w-3 h-3 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-1 w-3 h-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Code Content */}
        <div className={`p-6 ${themeClasses} transition-colors duration-200`}>
          <pre
            className={`${textClasses} font-mono text-sm leading-relaxed overflow-x-auto`}
          >
            <code className="language-javascript">
              {/* Syntax highlighting with spans */}
              <span className="text-purple-600">const</span>{' '}
              <span className="text-blue-600">developer</span>{' '}
              <span className="text-gray-500">=</span>{' '}
              <span className="text-yellow-600">{'{'}</span>
              {'\n'}
              <span className="text-green-600"> name</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-orange-600">
                &quot;{profile.displayName || profile.username}&quot;
              </span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> username</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-orange-600">
                &quot;@{profile.username}&quot;
              </span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> role</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-orange-600">
                &quot;
                {userSettings?.experienceLevel === 'senior'
                  ? 'Senior Developer'
                  : userSettings?.experienceLevel === 'mid'
                    ? 'Mid-level Developer'
                    : userSettings?.experienceLevel === 'junior'
                      ? 'Junior Developer'
                      : userSettings?.experienceLevel === 'lead'
                        ? 'Lead Developer'
                        : 'Developer'}
                &quot;
              </span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> location</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-orange-600">&quot;Global&quot;</span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> languages</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-yellow-600">[</span>
              {(userSettings?.languages || ['JavaScript', 'TypeScript']).map(
                (lang, index) => (
                  <span key={lang}>
                    <span className="text-orange-600">&quot;{lang}&quot;</span>
                    {index < (userSettings?.languages?.length || 2) - 1 && (
                      <span className="text-gray-500">, </span>
                    )}
                  </span>
                )
              )}
              <span className="text-yellow-600">]</span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> technologies</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-yellow-600">[</span>
              {(userSettings?.skills?.slice(0, 6) || ['React', 'Node.js']).map(
                (skill, index) => (
                  <span key={skill}>
                    <span className="text-orange-600">&quot;{skill}&quot;</span>
                    {index <
                      (userSettings?.skills?.slice(0, 6)?.length || 2) - 1 && (
                      <span className="text-gray-500">, </span>
                    )}
                  </span>
                )
              )}
              <span className="text-yellow-600">]</span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> currentlyLearning</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-yellow-600">[</span>
              <span className="text-orange-600">&quot;Web3&quot;</span>
              <span className="text-gray-500">, </span>
              <span className="text-orange-600">&quot;Rust&quot;</span>
              <span className="text-gray-500">, </span>
              <span className="text-orange-600">&quot;AI/ML&quot;</span>
              <span className="text-yellow-600">]</span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> askMeAbout</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-yellow-600">[</span>
              <span className="text-orange-600">
                &quot;{userSettings?.skills?.[0] || 'React'}&quot;
              </span>
              <span className="text-gray-500">, </span>
              <span className="text-orange-600">
                &quot;{userSettings?.skills?.[1] || 'TypeScript'}&quot;
              </span>
              <span className="text-gray-500">, </span>
              <span className="text-orange-600">&quot;System Design&quot;</span>
              <span className="text-yellow-600">]</span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> challengeMe</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-orange-600">
                &quot;I love solving complex problems! 🚀&quot;
              </span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> funFact</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-orange-600">
                &quot;I debug with console.log and I&apos;m not ashamed 😄&quot;
              </span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> availableForCollab</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-blue-600">
                {userSettings?.availableForCollab ? 'true' : 'false'}
              </span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> contactMe</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-yellow-600">{'{'}</span>
              {'\n'}
              <span className="text-green-600"> github</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-orange-600">
                &quot;{profile.githubUsername || 'Not set'}&quot;
              </span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> twitter</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-orange-600">
                &quot;{profile.twitterUsername || 'Not set'}&quot;
              </span>
              <span className="text-gray-500">,</span>
              {'\n'}
              <span className="text-green-600"> linkedin</span>
              <span className="text-gray-500">:</span>{' '}
              <span className="text-orange-600">
                &quot;{profile.linkedinUrl ? 'Available' : 'Not set'}&quot;
              </span>
              {'\n'}
              <span className="text-yellow-600">{'  }'}</span>
              {'\n'}
              <span className="text-yellow-600">{'}'}</span>
              <span className="text-gray-500">;</span>
              {'\n\n'}
              <span className="text-gray-400">
                {/* Let's build something amazing together! 🔥 */}
              </span>
              {'\n'}
              <span className="text-blue-600">console</span>
              <span className="text-gray-500">.</span>
              <span className="text-yellow-600">log</span>
              <span className="text-gray-500">(</span>
              <span className="text-orange-600">
                `Hello! I&apos;m ${'${developer.name}'} 👋`
              </span>
              <span className="text-gray-500">);</span>
            </code>
          </pre>
        </div>

        {/* Footer with additional info */}
        <div className="bg-gray-50 px-6 py-3 border-gray-200 border-t">
          <div className="flex justify-between items-center text-gray-500 text-xs">
            <span>💡 This code represents my developer profile</span>
            <span>Press F12 to run in console!</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
