import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('product image standards widget', () => {
  it('gives TechHub staff marketplace-ready upload guidance', () => {
    const source = readFileSync(
      join(__dirname, '../widgets/product-image-standards.tsx'),
      'utf8',
    );

    expect(source).toContain('Product image standard');
    expect(source).toContain('2000 x 2000 px');
    expect(source).toContain('pure white (#FFFFFF) background');
    expect(source).toContain('85%');
    expect(source).toContain('No watermarks, price badges, borders, text');
    expect(source).toContain(
      'Use TechHub-owned, manufacturer-authorized, or properly licensed images',
    );
    expect(source).toContain("'product.details.side.after'");
  });
});
