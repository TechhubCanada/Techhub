describe('product review configuration', () => {
  it('registers the product review module and route middleware', () => {
    const config = require('../../../medusa-config')
    const middlewares = require('../../api/middlewares').default

    const modules = Array.isArray(config.modules)
      ? config.modules
      : Object.values(config.modules || {})
    const moduleResolves = modules.map((moduleConfig) => moduleConfig.resolve)
    const routeMatchers = middlewares.routes.map((route) => route.matcher)

    expect(moduleResolves).toContain('./src/modules/product-review')
    expect(routeMatchers).toEqual(
      expect.arrayContaining([
        '/store/products/:id/reviews',
        '/admin/product-reviews/:id/moderate',
      ]),
    )
  })
})
