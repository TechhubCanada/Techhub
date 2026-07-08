import {
  getAdminBasePath,
  getAdminHref,
  getAdminPathParam,
} from '../routing'

describe('admin routing helpers', () => {
  it('detects the mounted admin base path', () => {
    expect(getAdminBasePath('/app/fashion')).toBe('/app')
    expect(getAdminBasePath('/custom-prefix/app/fashion/mat_123')).toBe(
      '/custom-prefix/app'
    )
    expect(getAdminBasePath('/fashion/mat_123')).toBe('')
  })

  it('builds hrefs relative to the admin base path', () => {
    expect(getAdminHref('/fashion/mat_123', '/app/products')).toBe(
      '/app/fashion/mat_123'
    )
    expect(getAdminHref('fashion/mat_123', '/app/products')).toBe(
      '/app/fashion/mat_123'
    )
    expect(getAdminHref('/fashion/mat_123', '/fashion')).toBe(
      '/fashion/mat_123'
    )
  })

  it('extracts route parameters from admin paths', () => {
    expect(getAdminPathParam('fashion', '/app/fashion/mat_123')).toBe(
      'mat_123'
    )
    expect(
      getAdminPathParam('fashion', '/custom-prefix/app/fashion/mat_123/colors')
    ).toBe('mat_123')
    expect(getAdminPathParam('fashion', '/app/products')).toBeUndefined()
  })
})
