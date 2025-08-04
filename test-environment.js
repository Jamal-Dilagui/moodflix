/**
 * Test script for environment variables and configuration
 * Run with: node test-environment.js
 */

console.log('Environment Variables Check:');
console.log('==========================');

// Check required environment variables
const requiredEnvVars = [
  'MONGO_DB_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'OPENROUTER_API_KEY',
  'TMDB_API_KEY'
];

console.log('\nRequired Environment Variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅ SET' : '❌ MISSING';
  const displayValue = value ? (varName.includes('SECRET') || varName.includes('KEY') ? '***' : value.substring(0, 20) + '...') : 'undefined';
  console.log(`${status} ${varName}: ${displayValue}`);
});

console.log('\nNode Environment:', process.env.NODE_ENV);
console.log('Current Working Directory:', process.cwd());

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  console.log('Running in browser environment');
} else {
  console.log('Running in Node.js environment');
}

// Check if localStorage is available (browser only)
if (typeof localStorage !== 'undefined') {
  console.log('localStorage is available');
} else {
  console.log('localStorage is not available (Node.js environment)');
}

console.log('\nEnvironment check completed!'); 