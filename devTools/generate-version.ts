import fs from 'fs';

// We are assuming deployment from EST timezone
const now = new Date();
const date = now.toISOString().split('T')[0].replace(/-/g, '.');
const time = now.toTimeString().split(' ')[0].replace(/:/g, '.');
const versionString = `${date}-${time}`;
fs.writeFileSync('src/version.ts', `export const version = '${versionString}';\n`);