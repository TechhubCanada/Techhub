import { Modules } from '@medusajs/framework/utils';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { z } from '@medusajs/framework/zod';

const techSpecItemSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

const techProductDetailsSchema = z.object({
  buying_summary: z.string().trim().optional().default(''),
  specs: z.array(techSpecItemSchema).optional().default([]),
  best_for: z.array(z.string().trim().min(1)).optional().default([]),
  included: z.array(z.string().trim().min(1)).optional().default([]),
  compatibility: z.string().trim().optional().default(''),
  support_note: z.string().trim().optional().default(''),
});

const parseLines = (value: unknown) => {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
};

const parseSpecLines = (specs: string[]) => {
  return specs
    .map((spec) => {
      const [label, ...rest] = spec.split(':');
      const value = rest.join(':').trim();

      return value
        ? { label: label.trim(), value }
        : { label: spec.trim(), value: '' };
    })
    .filter((spec) => spec.label || spec.value);
};

const getTechProductDetails = (metadata: Record<string, unknown> | null) => {
  const parsed = techProductDetailsSchema.safeParse(
    metadata?.tech_product_details ?? {},
  );

  if (parsed.success) {
    return parsed.data;
  }

  const seededSpecs = parseLines(metadata?.specs);

  return {
    buying_summary: '',
    specs: parseSpecLines(seededSpecs),
    best_for: [],
    included: [],
    compatibility: '',
    support_note: '',
  };
};

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const productService = req.scope.resolve(Modules.PRODUCT);
  const product = await productService.retrieveProduct(req.params.productId);

  res.json(getTechProductDetails(product.metadata ?? null));
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const productService = req.scope.resolve(Modules.PRODUCT);
  const product = await productService.retrieveProduct(req.params.productId);
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const details = techProductDetailsSchema.parse(body);

  const updatedProduct = await productService.updateProducts(req.params.productId, {
    metadata: {
      ...(product.metadata ?? {}),
      tech_product_details: details,
    },
  });

  res.json({
    product: updatedProduct,
    tech_product_details: details,
  });
}
