const { loadEnv, defineConfig } = require('@medusajs/framework/utils');

loadEnv(process.env.NODE_ENV, process.cwd());

const getMeilisearchHost = () => {
  const host = process.env.MEILISEARCH_HOST;
  const port = process.env.MEILISEARCH_PORT;

  if (!host) {
    return 'https://fashion-starter-search.agilo.agency';
  }

  if (!port) {
    return host;
  }

  const hasProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(host);
  const url = new URL(hasProtocol ? host : `http://${host}`);

  if (!url.port) {
    url.port = port;
  }

  return url.toString().replace(/\/$/, '');
};

const corsOrigins = (...origins) => {
  return origins
    .filter(Boolean)
    .map((origin) => {
      if (/^\/.+\/$/.test(origin)) {
        return origin;
      }

      return origin.replace(/\/$/, '');
    })
    .join(',');
};

const defaultStoreCors = corsOrigins(
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'https://techhubcanada.com',
  'https://www.techhubcanada.com',
  '/https:\\/\\/.*\\.vercel\\.app$/',
  '/https:\\/\\/.*\\.app\\.github\\.dev$/',
  process.env.STOREFRONT_URL,
  process.env.NEXT_PUBLIC_BASE_URL,
  process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : undefined,
);

const defaultAdminCors = corsOrigins(
  'http://localhost:7000',
  'http://localhost:7001',
  'http://localhost:9000',
  'http://127.0.0.1:7000',
  'http://127.0.0.1:7001',
  'http://127.0.0.1:9000',
  'https://admin.techhubcanada.com',
  'https://manage.techhubcanada.com',
  '/https:\\/\\/.*\\.vercel\\.app$/',
  '/https:\\/\\/.*\\.app\\.github\\.dev$/',
  process.env.MEDUSA_BACKEND_URL,
  process.env.BACKEND_URL,
  process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : undefined,
);

const defaultAuthCors = corsOrigins(defaultAdminCors, defaultStoreCors);

const adminSingletonDependencies = [
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom',
  'react-dom/client',
  '@tanstack/react-query',
  'react-router',
  'react-router-dom',
];

const adminSingletonDedupe = [
  'react',
  'react-dom',
  '@tanstack/react-query',
  'react-router',
  'react-router-dom',
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const adminSingletonAliases = adminSingletonDependencies.map((dependency) => ({
  find: new RegExp(`^${escapeRegExp(dependency)}$`),
  replacement: require.resolve(dependency, { paths: [__dirname] }),
}));

const getInvoiceAddress = () => {
  return (process.env.INVOICE_COMPANY_ADDRESS || 'Tech Hub Canada')
    .replace(/\\n/g, '\n')
    .trim();
};

const getInvoiceAddressInfo = () => {
  const addressInfo = {
    companyName: process.env.INVOICE_COMPANY_NAME || 'Tech Hub Canada',
    address: () => getInvoiceAddress(),
    cocNumber: process.env.INVOICE_COC_NUMBER || 'Not configured',
    vatNumber: process.env.INVOICE_VAT_NUMBER || 'Not configured',
    iban: process.env.INVOICE_IBAN || 'Not configured',
    email: process.env.INVOICE_EMAIL || 'info@techhubcanada.com',
  };

  if (process.env.INVOICE_COMPANY_LOGO) {
    addressInfo.companyLogo = process.env.INVOICE_COMPANY_LOGO;
  }

  if (process.env.INVOICE_COMPANY_LOGO_WIDTH) {
    addressInfo.companyLogoWidth = Number(process.env.INVOICE_COMPANY_LOGO_WIDTH);
  }

  return addressInfo;
};

module.exports = defineConfig({
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === 'true',
    backendUrl: process.env.MEDUSA_ADMIN_BACKEND_URL ?? '/',
    storefrontUrl: process.env.STOREFRONT_URL,
    vite: () => ({
      resolve: {
        alias: adminSingletonAliases,
        dedupe: adminSingletonDedupe,
      },
      optimizeDeps: {
        include: adminSingletonDependencies,
      },
    }),
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE,
    http: {
      storeCors: process.env.STORE_CORS || defaultStoreCors,
      adminCors: process.env.ADMIN_CORS || defaultAdminCors,
      authCors: process.env.AUTH_CORS || defaultAuthCors,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
  },
  modules: [
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          {
            id: 'square',
            resolve:
              '@weareseeed/medusa-square-plugin/providers/square-payment',
          },
        ],
      },
    },
    {
      resolve: './src/modules/fashion',
    },
    {
      resolve: './src/modules/product-review',
    },
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/file-s3',
            id: 's3',
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              additional_client_config: {
                forcePathStyle:
                  process.env.S3_FORCE_PATH_STYLE === 'true' ? true : undefined,
              },
            },
          },
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/notification',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/notification-local',
            id: 'local',
            options: {
              channels: ['feed'],
            },
          },
          {
            resolve: './src/modules/resend',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM,
              siteTitle: 'TechHub',
              companyName: 'TechHub',
              footerLinks: [
                {
                  url: 'https://agilo.com',
                  label: 'Agilo',
                },
                {
                  url: 'https://www.instagram.com/agiloltd/',
                  label: 'Instagram',
                },
                {
                  url: 'https://www.linkedin.com/company/agilo/',
                  label: 'LinkedIn',
                },
              ],
            },
          },
          {
            resolve: './src/modules/slack',
            id: 'slack',
            options: {
              channels: ['slack'],
              webhook_url: process.env.SLACK_WEBHOOK_URL,
              admin_url: process.env.SLACK_ADMIN_URL,
            },
          },
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/event-bus-redis',
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: '@medusajs/medusa/caching',
      options: {
        providers: [
          {
            resolve: '@medusajs/caching-redis',
            id: 'caching-redis',
            is_default: true,
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/workflow-engine-redis',
      options: {
        redis: {
          redisUrl: process.env.REDIS_URL,
        },
      },
    },
    {
      resolve: '@medusajs/medusa/locking',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/locking-redis',
            id: 'locking-redis',
            is_default: true,
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
        ],
      },
    },
    {
      resolve: './src/modules/meilisearch',
      /**
       * @type {import('./src/modules/meilisearch/types').MeiliSearchPluginOptions}
       */
      options: {
        config: {
          host: getMeilisearchHost(),
          apiKey: process.env.MEILISEARCH_API_KEY,
        },
        settings: {
          products: {
            indexSettings: {
              searchableAttributes: [
                'title',
                'subtitle',
                'description',
                'collection',
                'categories',
                'type',
                'tags',
                'variants',
                'sku',
              ],
              displayedAttributes: [
                'id',
                'title',
                'handle',
                'subtitle',
                'description',
                'is_giftcard',
                'status',
                'thumbnail',
                'collection',
                'collection_handle',
                'categories',
                'categories_handle',
                'type',
                'tags',
                'variants',
                'sku',
              ],
            },
            primaryKey: 'id',
            /**
             * @param {import('@medusajs/types').ProductDTO} product
             */
            transformer: (product) => {
              return {
                id: product.id,
                title: product.title,
                handle: product.handle,
                subtitle: product.subtitle,
                description: product.description,
                is_giftcard: product.is_giftcard,
                status: product.status,
                thumbnail: product.images?.[0]?.url ?? null,
                collection: product.collection.title,
                collection_handle: product.collection.handle,
                categories:
                  product.categories?.map((category) => category.name) ?? [],
                categories_handle:
                  product.categories?.map((category) => category.handle) ?? [],
                type: product.type?.value,
                tags: product.tags.map((tag) => tag.value),
                variants: product.variants.map((variant) => variant.title),
                sku: product.variants
                  .filter(
                    (variant) => typeof variant.sku === 'string' && variant.sku,
                  )
                  .map((variant) => variant.sku),
              };
            },
          },
        },
      },
    },
  ],
  plugins: [
    {
      resolve: '@alphabite/medusa-wishlist',
      options: {
        allowGuestWishlist: true,
        includeWishlistItems: true,
        includeWishlistItemsTake: 20,
      },
    },
    {
      resolve: '@webbers/invoices-medusa',
      options: {
        defaultLocale: process.env.INVOICE_DEFAULT_LOCALE || 'en',
        addressInfo: getInvoiceAddressInfo(),
        colors: {
          background: process.env.INVOICE_COLOR_BACKGROUND || '#111827',
          text: process.env.INVOICE_COLOR_TEXT || '#ffffff',
        },
      },
    },
    {
      resolve: '@weareseeed/medusa-square-plugin',
      options: {},
    },
    {
      resolve: 'medusa-plugin-content',
      options: {},
    },
    {
      resolve: '@alphabite/medusa-collection-images',
      options: {},
    },
    {
      resolve: '@empty-complete-org/medusa-product-attributes',
      options: {},
    },
    {
      resolve: '@agilo/medusa-analytics-plugin',
      options: {},
    },
  ],
});
