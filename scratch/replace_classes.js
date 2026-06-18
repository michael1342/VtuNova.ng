const fs = require('fs');

const path = 'c:/Users/HomePC/SwiftTopup/src/pages/user/transactions.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
  ['bg-slate-50 dark:bg-bg-dark text-slate-800 dark:text-text-white', 'bg-bg-dark text-text-gray'],
  ['bg-white dark:bg-slate-800', 'bg-bg-card'],
  ['bg-white dark:bg-slate-700', 'bg-bg-card'],
  ['bg-slate-50 dark:bg-slate-900/40', 'bg-bg-dark-secondary'],
  ['bg-slate-50 dark:bg-slate-900/30', 'bg-bg-dark-secondary'],
  ['bg-slate-50/50 dark:bg-slate-900/30', 'bg-bg-dark-secondary'],
  ['bg-slate-100 dark:bg-slate-800', 'bg-bg-dark-secondary'],
  ['bg-slate-50 dark:bg-slate-700', 'bg-bg-dark'],
  ['border-slate-200 dark:border-slate-700', 'border-border'],
  ['border-slate-200 dark:border-slate-600', 'border-border'],
  ['border-slate-100 dark:border-slate-700', 'border-border'],
  ['border-slate-300', 'border-border'],
  ['divide-slate-100 dark:divide-slate-700', 'divide-border'],
  ['text-slate-900 dark:text-white', 'text-text-white'],
  ['text-slate-950 dark:text-white', 'text-text-white'],
  ['text-slate-500 dark:text-slate-400', 'text-text-muted'],
  ['text-slate-400', 'text-text-muted'], // Generic replacements that might miss the dark variant
  ['text-slate-600 dark:text-slate-300', 'text-text-gray'],
  ['text-slate-700 dark:text-slate-300', 'text-text-gray'],
  ['text-slate-800 dark:text-slate-200', 'text-text-gray'],
  ['hover:bg-slate-50 dark:hover:bg-slate-600', 'hover:bg-bg-card-hover'],
  ['hover:bg-slate-100 dark:hover:bg-slate-700', 'hover:bg-bg-card-hover'],
  ['hover:bg-slate-50/75 dark:hover:bg-slate-700/50', 'hover:bg-bg-card-hover'],
  ['hover:border-slate-300 dark:hover:border-slate-500', 'hover:border-border-hover'],
  ['bg-blue-50 dark:bg-blue-900/30 text-blue-600', 'bg-primary-glow text-primary'],
  ['bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600', 'bg-accent-cyan-glow text-accent-cyan'],
  ['bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600', 'bg-accent-green-glow text-accent-green'],
  ['bg-purple-50 dark:bg-purple-900/30 text-purple-600', 'bg-accent-purple-glow text-accent-purple'],
  ['bg-emerald-100 dark:bg-emerald-900/40', 'bg-accent-green-glow'],
  ['bg-blue-100 dark:bg-blue-900/40', 'bg-primary-glow'],
  ['text-emerald-600', 'text-accent-green'],
  ['text-red-600', 'text-red-500'],
  ['text-amber-600', 'text-accent-orange'],
  ['text-blue-600', 'text-primary'],
  ['bg-blue-600', 'bg-primary'],
  ['hover:bg-blue-700', 'hover:bg-primary-hover'],
  ['border-blue-600', 'border-primary'],
  ['focus:border-blue-500', 'focus:border-primary'],
  ['bg-emerald-500', 'bg-accent-green'],
  ['border-emerald-500', 'border-accent-green'],
  ['bg-blue-500', 'bg-primary'],
  ['border-blue-500', 'border-primary'],
  ['bg-slate-50', 'bg-bg-dark'], // Catch any leftovers
  ['text-slate-900', 'text-text-white'],
  ['text-slate-800', 'text-text-gray'],
  ['text-slate-700', 'text-text-gray'],
  ['text-slate-600', 'text-text-muted'],
  ['text-slate-500', 'text-text-muted'],
  ['bg-white', 'bg-bg-card'],
  ['border-slate-200', 'border-border'],
  ['border-slate-100', 'border-border'],
  ['bg-amber-400', 'bg-accent-orange'],
  ['bg-purple-500', 'bg-accent-purple'],
];

for (const [from, to] of replacements) {
  content = content.split(from).join(to);
}

// Write it back
fs.writeFileSync(path, content, 'utf8');
console.log('Replacements complete');
