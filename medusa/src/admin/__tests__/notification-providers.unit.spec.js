describe('notification provider configuration', () => {
  it('uses Medusa notification providers without the Lexical builder plugin', () => {
    const config = require('../../../medusa-config')
    const modules = Array.isArray(config.modules)
      ? config.modules
      : Object.values(config.modules || {})

    const notificationModule = modules.find(
      (moduleConfig) => moduleConfig.resolve === '@medusajs/medusa/notification'
    )

    expect(notificationModule).toBeTruthy()

    const providerResolves = notificationModule.options.providers.map(
      (provider) => provider.resolve
    )
    const providerIds = notificationModule.options.providers.map(
      (provider) => provider.id
    )
    const pluginResolves = config.plugins.map((plugin) => plugin.resolve)

    expect(providerResolves).toEqual(
      expect.arrayContaining([
        '@medusajs/medusa/notification-local',
        './src/modules/resend',
      ])
    )
    expect(providerIds).toEqual(expect.arrayContaining(['local', 'resend']))
    expect(pluginResolves).not.toContain(
      '@codee-sh/medusa-plugin-notification-emails'
    )
  })
})
