import { POST } from '../route'
import moderateProductReviewWorkflow from '../../../../../../workflows/moderate-product-review'

jest.mock('../../../../../../workflows/moderate-product-review', () => ({
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

describe('admin product review moderation route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('moderates product reviews through the workflow', async () => {
    const run = jest.fn().mockResolvedValue({
      result: {
        review: {
          id: 'prev_1',
          status: 'approved',
          moderated_by: 'user_123',
        },
      },
    })
    ;(moderateProductReviewWorkflow as jest.Mock).mockReturnValue({ run })

    const req = {
      params: { id: 'prev_1' },
      validatedBody: {
        status: 'approved',
        moderation_note: 'Looks good',
      },
      auth_context: { actor_id: 'user_123' },
      scope: {},
    } as any
    const res = createResponse() as any

    await POST(req, res)

    expect(moderateProductReviewWorkflow).toHaveBeenCalledWith(req.scope)
    expect(run).toHaveBeenCalledWith({
      input: {
        id: 'prev_1',
        status: 'approved',
        moderation_note: 'Looks good',
        moderated_by: 'user_123',
      },
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      review: {
        id: 'prev_1',
        status: 'approved',
        moderated_by: 'user_123',
      },
    })
  })
})
