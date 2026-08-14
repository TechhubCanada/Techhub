import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(__dirname, '../../../..');
const seedSource = readFileSync(
  resolve(repoRoot, 'medusa/src/scripts/seed-techhub-products.ts'),
  'utf8',
);

describe('TechHub product image policy', () => {
  it('uses the marketplace-ready ThinkCentre image and refreshes the retired seed image', () => {
    expect(
      existsSync(
        resolve(
          repoRoot,
          'storefront/public/images/content/techhub-lenovo-thinkcentre-m715q.png',
        ),
      ),
    ).toBe(true);
    expect(seedSource).toContain(
      "imagePath: 'techhub-lenovo-thinkcentre-m715q.png'",
    );
    expect(seedSource).toContain(
      "handle: 'lenovo-thinkcentre-small-form-desktop'",
    );
    expect(seedSource).toContain('existingProductsWithOutdatedSeedImages');
    expect(seedSource).toContain('techhub-dual-monitor-workstation');
  });
});
