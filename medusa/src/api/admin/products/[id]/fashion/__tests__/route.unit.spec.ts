import { GET } from '../route';

const createResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return res;
};

describe('GET /admin/products/:id/fashion', () => {
  it('returns an empty fashion payload when a product has no material option', async () => {
    const productModuleService = {
      retrieveProduct: jest.fn().mockResolvedValue({
        id: 'prod_missing_material',
        options: [{ id: 'opt_color', title: 'Color' }],
        variants: [
          {
            options: [{ option_id: 'opt_color', value: 'Black' }],
          },
        ],
      }),
    };
    const fashionModuleService = {
      listMaterials: jest.fn(),
    };
    const req = {
      params: { id: 'prod_missing_material' },
      scope: {
        resolve: jest
          .fn()
          .mockReturnValueOnce(productModuleService)
          .mockReturnValueOnce(fashionModuleService),
      },
    };
    const res = createResponse();

    await GET(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      missing_materials: [],
      materials: [],
    });
    expect(fashionModuleService.listMaterials).not.toHaveBeenCalled();
  });
});
