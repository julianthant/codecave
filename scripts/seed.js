#!/usr/bin/env node

/**
 * Database Seeding Script for CodeCave
 * 
 * This script runs the seed.sql file to populate the database with realistic test data.
 * Run with: node scripts/seed.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load environment variables
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch (error) {
  // Try to install dotenv if it's missing
  try {
    execSync('npm install dotenv', { stdio: 'ignore' });
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
  } catch (installError) {
    console.log('Note: dotenv package not available, reading .env manually...');
    
    // Manual .env reading as fallback
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const envContents = fs.readFileSync(envPath, 'utf8');
      envContents.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      });
    }
  }
}

function main() {
  console.log('🌱 Starting CodeCave database seeding...\n');

  // Check if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.error('Please set your DATABASE_URL in .env file');
    process.exit(1);
  }

  // Check if seed file exists
  const seedFilePath = path.join(__dirname, '..', 'supabase', 'seed.sql');
  if (!fs.existsSync(seedFilePath)) {
    console.error('❌ Seed file not found at:', seedFilePath);
    process.exit(1);
  }

  console.log('📁 Found seed file:', seedFilePath);
  console.log('🗄️  Database URL:', process.env.DATABASE_URL.replace(/:\/\/.*@/, '://***@'));
  console.log();

  try {
    // Run the seed file using psql
    console.log('🚀 Executing seed file...');
    
    const command = `psql "${process.env.DATABASE_URL}" -f "${seedFilePath}"`;
    
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });

    console.log('✅ Seed execution completed!\n');
    console.log('📊 Execution output:');
    console.log(output);

    console.log('\n🎉 CodeCave database has been successfully seeded!');
    console.log('\n📋 Seeded data includes:');
    console.log('   • 15 diverse developer profiles');
    console.log('   • 25+ social connections');
    console.log('   • 10 collaboration opportunities');
    console.log('   • 15+ collaboration applications');
    console.log('   • 10 posts with rich content');
    console.log('   • 8 portfolio projects');
    console.log('   • Realistic engagement data');
    console.log('\n🚀 Your development environment is ready!');
    console.log('\nYou can now:');
    console.log('   • Run "pnpm dev" to start the development server');
    console.log('   • Visit /connections to see the social network');
    console.log('   • Visit /collaborations to see project opportunities');
    console.log('   • Visit /feed to see posts and content');

  } catch (error) {
    console.error('❌ Error executing seed file:');
    console.error(error.message);
    
    if (error.message.includes('command not found: psql')) {
      console.error('\n💡 PostgreSQL client (psql) is required to run this script.');
      console.error('Install instructions:');
      console.error('   • macOS: brew install postgresql');
      console.error('   • Ubuntu: sudo apt-get install postgresql-client');
      console.error('   • Windows: Download from https://www.postgresql.org/download/');
      console.error('\nAlternatively, you can run the seed.sql file directly in:');
      console.error('   • Supabase SQL Editor');
      console.error('   • pgAdmin');
      console.error('   • Any PostgreSQL client');
    }
    
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };