describe('auth MFA configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      AUTH_MFA_ENCRYPTION_KEY: 'test-mfa-encryption-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('passes the MFA encryption key into the default auth module', () => {
    const config = require('../../../medusa-config');
    const modules = Array.isArray(config.modules)
      ? config.modules
      : Object.values(config.modules || {});

    const authModule = modules.find(
      (moduleConfig) => moduleConfig.resolve === '@medusajs/medusa/auth',
    );

    expect(authModule).toBeTruthy();
    expect(authModule.options.mfa).toMatchObject({
      encryption_key: 'test-mfa-encryption-key',
    });
    expect(authModule.options.providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          resolve: '@medusajs/medusa/auth-emailpass',
          id: 'emailpass',
        }),
      ]),
    );
  });
});
