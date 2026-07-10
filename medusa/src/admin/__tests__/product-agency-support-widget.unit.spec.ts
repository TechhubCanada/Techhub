import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('product agency support widget', () => {
  it('renders on both product details areas', () => {
    const source = readFileSync(
      join(__dirname, '../widgets/product-agency-support.tsx'),
      'utf8',
    );

    expect(source).toContain('zone: [');
    expect(source).toContain("'product.details.after'");
    expect(source).toContain("'product.details.side.after'");
  });
});
