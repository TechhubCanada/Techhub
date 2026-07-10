import { GET, POST } from '../route'
import createProductReviewWorkflow from '../../../../../../workflows/create-product-review'
import { PRODUCT_REVIEW_MODULE } from '../../../../../../modules/product-review'

jest.mock('../../../../../../workflows/create-product-review', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const createResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }

  return res
}

describe('store product review routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('lists approved product reviews with rating summary', async () => {
    const listAndCountProductReviews = jest.fn().mockResolvedValue([
      [
        { id: 'prev_1', rating: 5, status: 'approved' },
        {
          id: 'prev_2',
          product_id: 'prod_123',
          rating: 4,
          status: 'approved',
          title: 'Good board',
          content: 'Stable for daily use.',
          customer_name: 'Avery',
          customer_email: 'private@example.com',
          verified_purchase: true,
          created_at: new Date('2026-07-10T00:00:00.000Z'),
          published_at: new Date('2026-07-10T00:00:00.000Z'),
        },
      ],
      2,
    ])
    const req = {
      params: { id: 'prod_123' },
      query: { limit: '10', offset: '0' },
      scope: {
        resolve: jest.fn().mockReturnValue({ listAndCountProductReviews }),
      },
    } as any
    const res = createResponse() as any

    await GET(req, res)

    expect(req.scope.resolve).toHaveBeenCalledWith(PRODUCT_REVIEW_MODULE)
    expect(listAndCountProductReviews).toHaveBeenCalledWith(
      { product_id: 'prod_123', status: 'approved' },
      {
        order: { created_at: 'DESC' },
        skip: 0,
        take: 10,
      },
    )
    expect(res.json).toHaveBeenCalledWith({
      reviews: [
        {
          id: 'prev_1',
          product_id: undefined,
          rating: 5,
          title: undefined,
          content: undefined,
          customer_name: undefined,
          verified_purchase: undefined,
          status: 'approved',
          created_at: undefined,
          published_at: undefined,
        },
        {
          id: 'prev_2',
          product_id: 'prod_123',
          rating: 4,
          title: 'Good board',
          content: 'Stable for daily use.',
          customer_name: 'Avery',
          verified_purchase: true,
          status: 'approved',
          created_at: new Date('2026-07-10T00:00:00.000Z'),
          published_at: new Date('2026-07-10T00:00:00.000Z'),
        },
      ],
      count: 2,
      limit: 10,
      offset: 0,
      summary: {
        average_rating: 4.5,
        review_count: 2,
      },
    })
  })

  it('submits authenticated customer reviews for moderation', async () => {
    const run = jest.fn().mockResolvedValue({
      result: {
        review: {
          id: 'prev_1',
          product_id: 'prod_123',
          rating: 5,
          status: 'pending',
        },
      },
    })
    ;(createProductReviewWorkflow as jest.Mock).mockReturnValue({ run })

    const req = {
      params: { id: 'prod_123' },
      validatedBody: {
        rating: 5,
        title: 'Solid GPU',
        content: 'Runs cool and arrived quickly.',
      },
      auth_context: { actor_id: 'cus_123' },
      scope: {},
    } as any
    const res = createResponse() as any

    await POST(req, res)

    expect(createProductReviewWorkflow).toHaveBeenCalledWith(req.scope)
    expect(run).toHaveBeenCalledWith({
      input: {
        product_id: 'prod_123',
        customer_id: 'cus_123',
        rating: 5,
        title: 'Solid GPU',
        content: 'Runs cool and arrived quickly.',
      },
    })
    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.json).toHaveBeenCalledWith({
      review: {
        id: 'prev_1',
        product_id: 'prod_123',
        rating: 5,
        status: 'pending',
      },
    })
  })
})
