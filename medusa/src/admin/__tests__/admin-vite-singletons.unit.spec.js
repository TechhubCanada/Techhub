const path = require('node:path')

describe('admin Vite dependency singletons', () => {
  const projectRoot = path.resolve(__dirname, '../../..')

  it('forces admin extensions to share Medusa React and React Query instances', () => {
    const config = require('../../../medusa-config')

    expect(typeof config.admin.vite).toBe('function')

    const viteConfig = config.admin.vite({})
    const aliasFor = (dependency) =>
      viteConfig.resolve.alias.find((alias) => alias.find.test(dependency))

    const expectedAliases = {
      react: require.resolve('react', { paths: [projectRoot] }),
      'react/jsx-runtime': require.resolve('react/jsx-runtime', {
        paths: [projectRoot],
      }),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime', {
        paths: [projectRoot],
      }),
      'react-dom': require.resolve('react-dom', { paths: [projectRoot] }),
      'react-dom/client': require.resolve('react-dom/client', {
        paths: [projectRoot],
      }),
      '@tanstack/react-query': require.resolve('@tanstack/react-query', {
        paths: [projectRoot],
      }),
      'react-router': require.resolve('react-router', { paths: [projectRoot] }),
      'react-router-dom': require.resolve('react-router-dom', {
        paths: [projectRoot],
      }),
    }

    for (const [dependency, replacement] of Object.entries(expectedAliases)) {
      expect(aliasFor(dependency)).toEqual(
        expect.objectContaining({ replacement })
      )
    }

    const reactAlias = aliasFor('react')
    expect(reactAlias.find.test('react/jsx-runtime')).toBe(false)

    expect(viteConfig.resolve.dedupe).toEqual(
      expect.arrayContaining([
        'react',
        'react-dom',
        '@tanstack/react-query',
        'react-router',
        'react-router-dom',
      ])
    )
  })
})
