describe('commerce plugin configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...originalEnv,
      INVOICE_COMPANY_NAME: 'Tech Hub Canada',
      INVOICE_COMPANY_ADDRESS: '123 Tech Street\nToronto, Canada',
      INVOICE_COC_NUMBER: 'COC-123',
      INVOICE_VAT_NUMBER: 'VAT-123',
      INVOICE_IBAN: 'CA00TECH123',
      INVOICE_EMAIL: 'info@techhubcanada.com',
      INVOICE_COLOR_BACKGROUND: '#111827',
      INVOICE_COLOR_TEXT: '#ffffff',
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('registers wishlist and invoice plugins with production defaults', () => {
    const config = require('../../../medusa-config')
    const medusaPackage = require('../../../package.json')

    const wishlistPlugin = config.plugins.find(
      (plugin) => plugin.resolve === '@alphabite/medusa-wishlist',
    )
    const invoicePlugin = config.plugins.find(
      (plugin) => plugin.resolve === '@webbers/invoices-medusa',
    )

    expect(medusaPackage.dependencies).toHaveProperty(
      '@alphabite/medusa-wishlist',
    )
    expect(medusaPackage.dependencies).toHaveProperty(
      '@webbers/invoices-medusa',
    )

    expect(wishlistPlugin).toMatchObject({
      options: {
        allowGuestWishlist: true,
        includeWishlistItems: true,
        includeWishlistItemsTake: 20,
      },
    })

    expect(invoicePlugin).toMatchObject({
      options: {
        defaultLocale: 'en',
        addressInfo: {
          companyName: 'Tech Hub Canada',
          cocNumber: 'COC-123',
          vatNumber: 'VAT-123',
          iban: 'CA00TECH123',
          email: 'info@techhubcanada.com',
        },
        colors: {
          background: '#111827',
          text: '#ffffff',
        },
      },
    })
    expect(invoicePlugin.options.addressInfo.address({ ca: 'Canada' })).toBe(
      '123 Tech Street\nToronto, Canada',
    )
  })
})
