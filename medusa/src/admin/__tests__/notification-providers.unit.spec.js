describe('admin extension configuration', () => {
  it('uses only the intended admin plugins and notification providers', () => {
    const config = require('../../../medusa-config');
    const medusaPackage = require('../../../package.json');
    const modules = Array.isArray(config.modules)
      ? config.modules
      : Object.values(config.modules || {});

    const notificationModule = modules.find(
      (moduleConfig) =>
        moduleConfig.resolve === '@medusajs/medusa/notification',
    );

    expect(notificationModule).toBeTruthy();

    const providerResolves = notificationModule.options.providers.map(
      (provider) => provider.resolve,
    );
    const providerIds = notificationModule.options.providers.map(
      (provider) => provider.id,
    );
    const resendProvider = notificationModule.options.providers.find(
      (provider) => provider.id === 'resend',
    );
    const pluginResolves = config.plugins.map((plugin) => plugin.resolve);

    expect(providerResolves).toEqual(
      expect.arrayContaining([
        '@medusajs/medusa/notification-local',
        './src/modules/resend',
      ]),
    );
    expect(providerIds).toEqual(expect.arrayContaining(['local', 'resend']));
    expect(resendProvider.options.footerLinks).toEqual([
      {
        url: 'https://techhubcanada.com',
        label: 'TechHub',
      },
    ]);
    expect(JSON.stringify(resendProvider.options.footerLinks)).not.toContain(
      'agilo',
    );
    expect(JSON.stringify(resendProvider.options.footerLinks)).not.toContain(
      'namankataria',
    );
    expect(pluginResolves).not.toContain(
      '@codee-sh/medusa-plugin-notification-emails',
    );
    expect(pluginResolves).not.toContain('@codee-sh/medusa-plugin-automations');
    expect(pluginResolves).not.toContain('@reorderjs/reorder');
    expect(pluginResolves).not.toContain(
      '@financedistrict/medusa-plugin-agentic-commerce',
    );
    expect(medusaPackage.dependencies).not.toHaveProperty(
      '@codee-sh/medusa-plugin-automations',
    );
    expect(medusaPackage.dependencies).not.toHaveProperty('@reorderjs/reorder');
    expect(medusaPackage.dependencies).not.toHaveProperty(
      '@financedistrict/medusa-plugin-agentic-commerce',
    );
  });
});
