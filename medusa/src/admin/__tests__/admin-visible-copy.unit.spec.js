const { readFileSync, readdirSync, statSync } = require('node:fs');
const { join } = require('node:path');

const collectFiles = (dir) => {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      return collectFiles(path);
    }

    return path.endsWith('.tsx') ? [path] : [];
  });
};

describe('custom admin visible copy', () => {
  it('does not mention the platform brand in custom route or widget copy', () => {
    const files = [
      ...collectFiles(join(__dirname, '../routes')),
      ...collectFiles(join(__dirname, '../widgets')),
      ...collectFiles(join(__dirname, '../components')),
    ];
    const visibleSources = files.map((file) => {
      return readFileSync(file, 'utf8')
        .split('\n')
        .filter((line) => !line.trim().startsWith('import '))
        .join('\n');
    });

    expect(visibleSources.join('\n')).not.toMatch(/\bmedusa\b/i);
  });
});
