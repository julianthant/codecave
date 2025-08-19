'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SkillBadgeProps {
  skill: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md'
}

export function SkillBadge({ skill, variant = 'primary', size = 'md' }: SkillBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  const variantClasses = {
    primary: 'bg-orange-100 text-orange-800 border border-orange-200',
    secondary: 'bg-gray-100 text-gray-700 border border-gray-200',
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center rounded-full font-medium transition-all duration-200 hover:shadow-sm ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {skill}
    </motion.span>
  )
}