const fs = require('fs');
const path = require('path');
const [apDir, folder] = process.argv.slice(2);
const pkg = JSON.parse(fs.readFileSync(path.join(apDir, 'packages/pieces/community', folder, 'package.json'), 'utf8'));
const tsPath = path.join(apDir, 'tsconfig.base.json');
const ts = JSON.parse(fs.readFileSync(tsPath, 'utf8'));
ts.compilerOptions.paths[pkg.name] = [`packages/pieces/community/${folder}/src/index.ts`];
fs.writeFileSync(tsPath, JSON.stringify(ts, null, 2) + '\n');
console.log(`registered ${pkg.name}`);
