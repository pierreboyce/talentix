#!/usr/bin/env node

/**
 * 🚀 Deploy Talentix Coming Soon Page to Production
 * 
 * This script helps deploy the coming soon page protection to talentix.co.uk
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Talentix Production Deployment Script');
console.log('=========================================');

// Check if essential files exist
const essentialFiles = [
  'src/app/coming-soon/page.tsx',
  'src/middleware.ts',
  'next.config.js',
  'package.json'
];

console.log('\n📋 Checking essential files...');
let allFilesExist = true;

essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n🚨 Missing essential files! Cannot deploy safely.');
  process.exit(1);
}

console.log('\n🔧 Checking middleware configuration...');
const middlewareContent = fs.readFileSync('src/middleware.ts', 'utf8');
if (middlewareContent.includes('talentix_access') && middlewareContent.includes('/coming-soon')) {
  console.log('✅ Middleware protection configured');
} else {
  console.log('❌ Middleware protection not properly configured');
}

console.log('\n🎨 Checking coming soon page...');
const comingSoonContent = fs.readFileSync('src/app/coming-soon/page.tsx', 'utf8');
if (comingSoonContent.includes('yourfirstjob129!') && comingSoonContent.includes('talentix')) {
  console.log('✅ Coming soon page configured with correct password');
} else {
  console.log('❌ Coming soon page not properly configured');
}

console.log('\n📦 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');
} catch (error) {
  console.log('❌ Build failed!');
  console.log('Please fix build errors before deploying.');
  process.exit(1);
}

console.log('\n🎯 Deployment Options:');
console.log('1. Vercel (Recommended): Run "vercel --prod"');
console.log('2. Netlify: Run "netlify deploy --prod"');
console.log('3. Manual: Upload .next folder and source files');

console.log('\n🔑 Important Reminders:');
console.log('- Password: yourfirstjob129!');
console.log('- Domain: talentix.co.uk should point to your deployment');
console.log('- Test: Visit talentix.co.uk to see coming soon page');

console.log('\n✨ Ready for deployment! 🚀');
