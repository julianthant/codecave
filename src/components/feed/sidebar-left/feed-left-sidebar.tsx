'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MiniProfile } from './mini-profile'
import { QuickActions } from './quick-actions'
import { PremiumAd } from './premium-ad'

export function FeedLeftSidebar() {
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <MiniProfile />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <QuickActions />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <PremiumAd />
      </motion.div>
    </motion.div>
  )
}