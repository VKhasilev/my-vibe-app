#!/usr/bin/env node

// Only install Linux-specific Rollup binary on Linux platforms
if (process.platform === 'linux') {
  const { execSync } = require('child_process');
  try {
    execSync('npm install @rollup/rollup-linux-x64-gnu --no-save --legacy-peer-deps', {
      stdio: 'ignore'
    });
  } catch (error) {
    // Silently fail - this is optional for the build
  }
}
