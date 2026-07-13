import {
  createCollectionsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createProductTypesWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateTaxRegionsWorkflow,
  updateProductsWorkflow,
  uploadFilesWorkflow,
} from '@medusajs/medusa/core-flows';
import { readFile } from 'fs/promises';
import { basename, resolve } from 'path';
import {
  ExecArgs,
  FileDTO,
  IFulfillmentModuleService,
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IStockLocationService,
  IStoreModuleService,
} from '@medusajs/framework/types';
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from '@medusajs/framework/utils';
import {
  TECHHUB_COUNTRIES,
  TECHHUB_CURRENCY_CODE,
  TECHHUB_PICKUP_COUNTRIES,
  TECHHUB_REGION_NAME,
  buildTechHubDeliveryShippingOptions,
  buildTechHubPickupShippingOptions,
  getTechHubGeoZones,
} from './techhub-shipping-config';

type CategorySeed = {
  name: string;
  handle: string;
  description: string;
  rank: number;
};

type TypeSeed = {
  value: string;
};

type CollectionSeed = {
  title: string;
  handle: string;
  description: string;
};

type ProductSeed = {
  title: string;
  handle: string;
  description: string;
  categoryHandle: string;
  typeValue: string;
  collectionHandle: string;
  sku: string;
  price: number;
  condition: string;
  brand: string;
  specs: string[];
  imagePath: string;
};

type QueryGraph = {
  graph: <TRecord>(input: {
    entity: string;
    fields: string[];
    pagination?: {
      skip?: number;
      take?: number;
    };
  }) => Promise<{
    data: TRecord[];
  }>;
};

type SeedCategoryRecord = {
  id: string;
  name: string;
  handle: string;
};

type SeedCollectionRecord = {
  id: string;
  title: string;
  handle: string;
};

type SeedProductRecord = {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  images?: {
    url: string;
  }[];
};

type SeedTaxRegionRecord = {
  id: string;
  country_code: string;
  province_code?: string | null;
  provider_id?: string | null;
};

type SeedRegionRecord = {
  id: string;
  name: string;
  currency_code: string;
  countries?: {
    iso_2: string;
  }[];
};

const CURRENCY_CODE = 'cad';
const TAX_PROVIDER_ID = 'tp_system';
const SHIPPING_PROFILE_NAME = 'Default';
const SHIPPING_PROFILE_TYPE = 'default';
const DELIVERY_FULFILLMENT_SET_NAME = 'TechHub delivery';
const PICKUP_FULFILLMENT_SET_NAME = 'Store pickup';
const DELIVERY_SERVICE_ZONE_NAME = 'Canada';
const PICKUP_SERVICE_ZONE_NAME = 'Store pickup';
const STOCK_LOCATION_NAME = 'TechHub Warehouse';
const IMAGE_SOURCE_DIR = resolve(
  process.cwd(),
  '..',
  'storefront',
  'public',
  'images',
  'content',
);

const categories: CategorySeed[] = [
  {
    name: 'Computers',
    handle: 'computers',
    description: 'Business desktops, laptops, and workstations.',
    rank: 0,
  },
  {
    name: 'Printers',
    handle: 'printers',
    description: 'Office printers, projectors, and print hardware.',
    rank: 1,
  },
  {
    name: 'Tablets & Handheld',
    handle: 'tablets-handheld',
    description: 'Portable tablets and handheld devices for mobile teams.',
    rank: 2,
  },
  {
    name: 'Networking',
    handle: 'networking',
    description: 'Wi-Fi, switching, routing, and network support hardware.',
    rank: 3,
  },
  {
    name: 'Toner & Ink',
    handle: 'toner-ink',
    description: 'Replacement toner, ink, and office print supplies.',
    rank: 4,
  },
  {
    name: 'Parts & Accessories',
    handle: 'parts-accessories',
    description: 'Docks, peripherals, storage upgrades, and service parts.',
    rank: 5,
  },
];

const productTypes: TypeSeed[] = [
  { value: 'Desktop' },
  { value: 'Laptop' },
  { value: 'Workstation' },
  { value: 'Printer' },
  { value: 'Projector' },
  { value: 'Tablet' },
  { value: 'Networking' },
  { value: 'Toner' },
  { value: 'Docking Station' },
  { value: 'Accessory' },
];

const collections: CollectionSeed[] = [
  {
    title: 'Business Desktops',
    handle: 'business-desktops',
    description: 'Reliable office systems for everyday business workloads.',
  },
  {
    title: 'Mobile Workstations',
    handle: 'mobile-workstations',
    description: 'Portable performance hardware for design, CAD, and field work.',
  },
  {
    title: 'Office Print',
    handle: 'office-print',
    description: 'Printers, projectors, toner, and supplies for office teams.',
  },
  {
    title: 'Network & Support',
    handle: 'network-support',
    description: 'Networking hardware and support-focused infrastructure.',
  },
  {
    title: 'Parts & Accessories',
    handle: 'parts-accessories',
    description: 'Accessories and upgrades that keep office hardware running.',
  },
];

const products: ProductSeed[] = [
  {
    title: 'Dell OptiPlex Business Desktop',
    handle: 'dell-optiplex-business-desktop',
    description:
      'Compact business desktop sample for TechHub Canada office refreshes, built around the Dell OptiPlex class of systems.',
    categoryHandle: 'computers',
    typeValue: 'Desktop',
    collectionHandle: 'business-desktops',
    sku: 'THC-DELL-OPTIPLEX-DESKTOP',
    price: 699,
    condition: 'Refurbished',
    brand: 'Dell',
    specs: ['Intel Core i5 class CPU', '16 GB RAM', '512 GB SSD'],
    imagePath: 'techhub-modern-workstation.png',
  },
  {
    title: 'Lenovo ThinkCentre Small Form Desktop',
    handle: 'lenovo-thinkcentre-small-form-desktop',
    description:
      'Small form factor business desktop sample based on the Lenovo ThinkCentre systems commonly used in Canadian offices.',
    categoryHandle: 'computers',
    typeValue: 'Desktop',
    collectionHandle: 'business-desktops',
    sku: 'THC-LENOVO-THINKCENTRE-SFF',
    price: 649,
    condition: 'Refurbished',
    brand: 'Lenovo',
    specs: ['Intel Core i5 class CPU', '16 GB RAM', '256 GB SSD'],
    imagePath: 'techhub-dual-monitor-workstation.png',
  },
  {
    title: 'HP EliteBook 840 Business Laptop',
    handle: 'hp-elitebook-840-business-laptop',
    description:
      'Business laptop sample for hybrid teams, based on the HP EliteBook class of lightweight commercial notebooks.',
    categoryHandle: 'computers',
    typeValue: 'Laptop',
    collectionHandle: 'mobile-workstations',
    sku: 'THC-HP-ELITEBOOK-840',
    price: 849,
    condition: 'Refurbished',
    brand: 'HP',
    specs: ['14 inch display', '16 GB RAM', '512 GB SSD'],
    imagePath: 'techhub-laptop-white-desk.png',
  },
  {
    title: 'HP ZBook Mobile Workstation',
    handle: 'hp-zbook-mobile-workstation',
    description:
      'Performance laptop sample for creators, engineers, and power users who need workstation-class mobility.',
    categoryHandle: 'computers',
    typeValue: 'Workstation',
    collectionHandle: 'mobile-workstations',
    sku: 'THC-HP-ZBOOK-WORKSTATION',
    price: 1399,
    condition: 'Refurbished',
    brand: 'HP',
    specs: ['15 inch workstation display', '32 GB RAM', '1 TB SSD'],
    imagePath: 'techhub-laptop-display.png',
  },
  {
    title: 'Dell USB-C Docking Station',
    handle: 'dell-usb-c-docking-station',
    description:
      'Desk dock sample for connecting laptops to monitors, network, keyboard, mouse, and power through USB-C.',
    categoryHandle: 'parts-accessories',
    typeValue: 'Docking Station',
    collectionHandle: 'parts-accessories',
    sku: 'THC-DELL-USBC-DOCK',
    price: 159,
    condition: 'Open Box',
    brand: 'Dell',
    specs: ['USB-C host connection', 'Dual display support', 'Gigabit Ethernet'],
    imagePath: 'techhub-laptop-product-table.png',
  },
  {
    title: 'HP LaserJet Pro Office Printer',
    handle: 'hp-laserjet-pro-office-printer',
    description:
      'Laser printer sample for small offices that need dependable document output and easy supply replacement.',
    categoryHandle: 'printers',
    typeValue: 'Printer',
    collectionHandle: 'office-print',
    sku: 'THC-HP-LASERJET-PRO',
    price: 329,
    condition: 'New',
    brand: 'HP',
    specs: ['Monochrome laser', 'Network ready', 'Office duty cycle'],
    imagePath: 'techhub-electronics-storefront.png',
  },
  {
    title: 'Epson PowerLite Conference Projector',
    handle: 'epson-powerlite-conference-projector',
    description:
      'Conference room projector sample for boardrooms, classrooms, and presentation spaces.',
    categoryHandle: 'printers',
    typeValue: 'Projector',
    collectionHandle: 'office-print',
    sku: 'THC-EPSON-POWERLITE',
    price: 549,
    condition: 'Open Box',
    brand: 'Epson',
    specs: ['Conference room brightness', 'HDMI input', 'Portable chassis'],
    imagePath: 'techhub-real-store-interior-hero.png',
  },
  {
    title: 'Apple iPad Field Service Tablet',
    handle: 'apple-ipad-field-service-tablet',
    description:
      'Tablet sample for mobile checkout, field service notes, inventory checks, and customer-facing demos.',
    categoryHandle: 'tablets-handheld',
    typeValue: 'Tablet',
    collectionHandle: 'mobile-workstations',
    sku: 'THC-APPLE-IPAD-FIELD',
    price: 499,
    condition: 'Refurbished',
    brand: 'Apple',
    specs: ['10 inch class display', 'Wi-Fi', '64 GB storage'],
    imagePath: 'techhub-laptop-workspace-coffee.png',
  },
  {
    title: 'Ubiquiti Wi-Fi 6 Access Point',
    handle: 'ubiquiti-wifi-6-access-point',
    description:
      'Networking sample for office Wi-Fi upgrades, retail floors, warehouses, and support deployments.',
    categoryHandle: 'networking',
    typeValue: 'Networking',
    collectionHandle: 'network-support',
    sku: 'THC-UBIQUITI-WIFI6-AP',
    price: 189,
    condition: 'New',
    brand: 'Ubiquiti',
    specs: ['Wi-Fi 6', 'PoE powered', 'Cloud-managed networking'],
    imagePath: 'techhub-network-router.png',
  },
  {
    title: 'Brother TN Series Toner Cartridge',
    handle: 'brother-tn-series-toner-cartridge',
    description:
      'Replacement toner sample for office printer supply listings and recurring business replenishment.',
    categoryHandle: 'toner-ink',
    typeValue: 'Toner',
    collectionHandle: 'office-print',
    sku: 'THC-BROTHER-TN-TONER',
    price: 89,
    condition: 'New',
    brand: 'Brother',
    specs: ['Black toner', 'Office yield cartridge', 'Sealed supply item'],
    imagePath: 'techhub-electronics-storefront.png',
  },
  {
    title: 'TechHub Laptop SSD Upgrade Kit',
    handle: 'techhub-laptop-ssd-upgrade-kit',
    description:
      'Service parts sample for laptop repair, refresh, and speed upgrade workflows.',
    categoryHandle: 'parts-accessories',
    typeValue: 'Accessory',
    collectionHandle: 'parts-accessories',
    sku: 'THC-LAPTOP-SSD-UPGRADE',
    price: 129,
    condition: 'New',
    brand: 'TechHub Canada',
    specs: ['512 GB NVMe SSD', 'Installation-ready kit', 'Service counter item'],
    imagePath: 'techhub-laptop-repair-kit.png',
  },
  {
    title: 'Logitech Business Keyboard and Mouse Combo',
    handle: 'logitech-business-keyboard-mouse-combo',
    description:
      'Peripheral bundle sample for office workstations, service replacements, and new employee setups.',
    categoryHandle: 'parts-accessories',
    typeValue: 'Accessory',
    collectionHandle: 'parts-accessories',
    sku: 'THC-LOGITECH-KM-COMBO',
    price: 59,
    condition: 'New',
    brand: 'Logitech',
    specs: ['Wireless keyboard', 'Wireless mouse', 'Business desktop bundle'],
    imagePath: 'techhub-gaming-headset.png',
  },
];

function requireSeedRecord<T>(
  value: T | undefined,
  label: string,
): T {
  if (!value) {
    throw new Error(`Missing seed dependency: ${label}`);
  }

  return value;
}

function hasSeedProductImage(product: SeedProductRecord) {
  return Boolean(product.thumbnail || product.images?.length);
}

async function uploadProductImages(
  container: ExecArgs['container'],
  productsToUpload: ProductSeed[],
) {
  if (!productsToUpload.length) {
    return new Map<string, FileDTO>();
  }

  const files = await Promise.all(
    productsToUpload.map(async (product) => {
      const imageFilePath = resolve(IMAGE_SOURCE_DIR, product.imagePath);
      const content = await readFile(imageFilePath, 'base64');

      return {
        access: 'public' as const,
        filename: `${product.handle}-${basename(product.imagePath)}`,
        mimeType: 'image/png',
        content,
      };
    }),
  );

  const { result } = await uploadFilesWorkflow(container).run({
    input: {
      files,
    },
  });

  return new Map(
    result.map((file, index) => [productsToUpload[index].handle, file]),
  );
}

async function verifyPublicImageUrls(urls: string[]) {
  await Promise.all(
    urls.map(async (url) => {
      let response = await fetch(url, {
        method: 'HEAD',
      });

      if (response.status === 405 || response.status === 403) {
        response = await fetch(url, {
          headers: {
            Range: 'bytes=0-0',
          },
        });
      }

      if (!response.ok) {
        throw new Error(
          `Uploaded image URL failed verification: ${url} (${response.status})`,
        );
      }
    }),
  );
}

async function listExistingByHandle<TRecord extends { handle: string }>(
  container: ExecArgs['container'],
  entity: string,
  fields: string[],
  handles: string[],
) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as QueryGraph;
  const { data } = await query.graph<TRecord>({
    entity,
    fields,
    pagination: {
      skip: 0,
      take: 1000,
    },
  });

  return data.filter((record) => handles.includes(record.handle));
}

async function ensureDefaultSalesChannel(
  container: ExecArgs['container'],
  salesChannelModuleService: ISalesChannelModuleService,
) {
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: 'Default Sales Channel',
  });

  if (!defaultSalesChannel.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: 'Default Sales Channel',
          },
        ],
      },
    });

    defaultSalesChannel = result;
  }

  return requireSeedRecord(
    defaultSalesChannel[0],
    'Default Sales Channel',
  );
}

async function ensureCategories(
  container: ExecArgs['container'],
) {
  const handles = categories.map((category) => category.handle);
  const existing = await listExistingByHandle<SeedCategoryRecord>(
    container,
    'product_category',
    ['id', 'name', 'handle'],
    handles,
  );
  const existingHandles = new Set(existing.map((category) => category.handle));
  const missing = categories.filter(
    (category) => !existingHandles.has(category.handle),
  );

  let created = [];

  if (missing.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missing.map((category) => ({
          name: category.name,
          handle: category.handle,
          description: category.description,
          is_active: true,
          is_internal: false,
          rank: category.rank,
          metadata: {
            source: 'techhub-canada-sample-seed',
          },
        })),
      },
    });

    created = result;
  }

  return [...existing, ...created];
}

async function ensureProductTypes(
  container: ExecArgs['container'],
  productModuleService: IProductModuleService,
) {
  const existing = await productModuleService.listProductTypes(undefined, {
    take: 1000,
  });
  const existingValues = new Set(existing.map((type) => type.value));
  const missing = productTypes.filter(
    (type) => !existingValues.has(type.value),
  );

  let created = [];

  if (missing.length) {
    const { result } = await createProductTypesWorkflow(container).run({
      input: {
        product_types: missing.map((type) => ({
          value: type.value,
          metadata: {
            source: 'techhub-canada-sample-seed',
          },
        })),
      },
    });

    created = result;
  }

  return [...existing, ...created];
}

async function ensureCollections(
  container: ExecArgs['container'],
) {
  const handles = collections.map((collection) => collection.handle);
  const existing = await listExistingByHandle<SeedCollectionRecord>(
    container,
    'product_collection',
    ['id', 'title', 'handle'],
    handles,
  );
  const existingHandles = new Set(
    existing.map((collection) => collection.handle),
  );
  const missing = collections.filter(
    (collection) => !existingHandles.has(collection.handle),
  );

  let created = [];

  if (missing.length) {
    const { result } = await createCollectionsWorkflow(container).run({
      input: {
        collections: missing.map((collection) => ({
          title: collection.title,
          handle: collection.handle,
          metadata: {
            description: collection.description,
            source: 'techhub-canada-sample-seed',
          },
        })),
      },
    });

    created = result;
  }

  return [...existing, ...created];
}

async function ensureCanadaTaxRegion(container: ExecArgs['container']) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as QueryGraph;
  const { data: taxRegions } = await query.graph<SeedTaxRegionRecord>({
    entity: 'tax_region',
    fields: ['id', 'country_code', 'province_code', 'provider_id'],
    pagination: {
      skip: 0,
      take: 1000,
    },
  });

  const canadaTaxRegion = taxRegions.find(
    (taxRegion) =>
      taxRegion.country_code === 'ca' && !taxRegion.province_code,
  );

  if (!canadaTaxRegion) {
    await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: 'ca',
          provider_id: TAX_PROVIDER_ID,
        },
      ],
    });

    return;
  }

  if (canadaTaxRegion.provider_id !== TAX_PROVIDER_ID) {
    await updateTaxRegionsWorkflow(container).run({
      input: [
        {
          id: canadaTaxRegion.id,
          provider_id: TAX_PROVIDER_ID,
        },
      ],
    });
  }
}

async function ensureCanadaRegion(
  container: ExecArgs['container'],
  regionModuleService: IRegionModuleService,
  storeModuleService: IStoreModuleService,
) {
  const regions = await regionModuleService.listRegions(
    {
      currency_code: TECHHUB_CURRENCY_CODE,
    },
    {
      relations: ['countries'],
      take: 100,
    },
  );
  let canadaRegion = regions.find((region) =>
    region.countries?.some((country) => country.iso_2 === 'ca'),
  );

  if (!canadaRegion) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: TECHHUB_REGION_NAME,
            currency_code: TECHHUB_CURRENCY_CODE,
            countries: TECHHUB_COUNTRIES,
            payment_providers: ['pp_square_square'],
          },
        ],
      },
    });

    canadaRegion = result[0];
  }

  const [store] = await storeModuleService.listStores();

  if (store) {
    await storeModuleService.updateStores(store.id, {
      supported_currencies: [
        {
          currency_code: TECHHUB_CURRENCY_CODE,
          is_default: true,
        },
        {
          currency_code: 'usd',
        },
      ],
      default_sales_channel_id: store.default_sales_channel_id,
      default_region_id: canadaRegion.id,
    });
  }

  return canadaRegion as SeedRegionRecord;
}

async function ensureTechHubStockLocation(
  stockLocationService: IStockLocationService,
) {
  const existing = await stockLocationService.listStockLocations(
    {
      name: STOCK_LOCATION_NAME,
    },
    {
      relations: ['address'],
      take: 1,
    },
  );

  if (existing[0]) {
    return existing[0];
  }

  return stockLocationService.createStockLocations({
    name: STOCK_LOCATION_NAME,
    address: {
      city: 'Markham',
      country_code: 'CA',
      address_1: '',
    },
  });
}

async function ensureShippingProfile(
  fulfillmentModuleService: IFulfillmentModuleService,
) {
  const existing = await fulfillmentModuleService.listShippingProfiles(
    {
      name: SHIPPING_PROFILE_NAME,
      type: SHIPPING_PROFILE_TYPE,
    },
    {
      take: 1,
    },
  );

  if (existing[0]) {
    return existing[0];
  }

  const created = await fulfillmentModuleService.createShippingProfiles({
    name: SHIPPING_PROFILE_NAME,
    type: SHIPPING_PROFILE_TYPE,
  });

  return Array.isArray(created) ? created[0] : created;
}

async function ensureFulfillmentSetWithServiceZone({
  fulfillmentModuleService,
  fulfillmentSetName,
  fulfillmentSetType,
  serviceZoneName,
  countries,
}: {
  fulfillmentModuleService: IFulfillmentModuleService;
  fulfillmentSetName: string;
  fulfillmentSetType: string;
  serviceZoneName: string;
  countries: string[];
}) {
  const existingSets = await fulfillmentModuleService.listFulfillmentSets(
    {
      name: fulfillmentSetName,
      type: fulfillmentSetType,
    },
    {
      relations: ['service_zones', 'service_zones.geo_zones'],
      take: 1,
    },
  );
  const existingSet = existingSets[0];

  if (!existingSet) {
    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: fulfillmentSetName,
      type: fulfillmentSetType,
      service_zones: [
        {
          name: serviceZoneName,
          geo_zones: getTechHubGeoZones(countries),
        },
      ],
    });

    return {
      fulfillmentSet,
      serviceZone: fulfillmentSet.service_zones[0],
    };
  }

  const existingZone = existingSet.service_zones?.find(
    (serviceZone) => serviceZone.name === serviceZoneName,
  );

  if (!existingZone) {
    const serviceZone = await fulfillmentModuleService.createServiceZones({
      fulfillment_set_id: existingSet.id,
      name: serviceZoneName,
      geo_zones: getTechHubGeoZones(countries),
    });

    return {
      fulfillmentSet: existingSet,
      serviceZone,
    };
  }

  const hasAllCountries = countries.every((country) =>
    existingZone.geo_zones?.some(
      (geoZone) =>
        geoZone.type === 'country' && geoZone.country_code === country,
    ),
  );

  if (!hasAllCountries) {
    const serviceZone = await fulfillmentModuleService.updateServiceZones(
      existingZone.id,
      {
        geo_zones: getTechHubGeoZones(countries),
      },
    );

    return {
      fulfillmentSet: existingSet,
      serviceZone,
    };
  }

  return {
    fulfillmentSet: existingSet,
    serviceZone: existingZone,
  };
}

async function createMissingShippingOptions({
  container,
  fulfillmentModuleService,
  options,
}: {
  container: ExecArgs['container'];
  fulfillmentModuleService: IFulfillmentModuleService;
  options: ReturnType<typeof buildTechHubDeliveryShippingOptions>;
}) {
  const existing = await fulfillmentModuleService.listShippingOptions(
    {
      name: options.map((option) => option.name),
    },
    {
      take: 100,
    },
  );
  const existingOptionKeys = new Set(
    existing.map((option) => `${option.name}:${option.service_zone_id}`),
  );
  const missing = options.filter(
    (option) =>
      !existingOptionKeys.has(`${option.name}:${option.service_zone_id}`),
  );

  if (!missing.length) {
    return;
  }

  await createShippingOptionsWorkflow(container).run({
    input: missing,
  });
}

async function ensureCanadianShippingSetup({
  container,
  defaultSalesChannelId,
}: {
  container: ExecArgs['container'];
  defaultSalesChannelId: string;
}) {
  const remoteLink = container.resolve(ContainerRegistrationKeys.LINK);
  const fulfillmentModuleService: IFulfillmentModuleService = container.resolve(
    Modules.FULFILLMENT,
  );
  const regionModuleService: IRegionModuleService = container.resolve(
    Modules.REGION,
  );
  const stockLocationService: IStockLocationService = container.resolve(
    Modules.STOCK_LOCATION,
  );
  const storeModuleService: IStoreModuleService = container.resolve(
    Modules.STORE,
  );

  const region = await ensureCanadaRegion(
    container,
    regionModuleService,
    storeModuleService,
  );
  const stockLocation = await ensureTechHubStockLocation(stockLocationService);

  await remoteLink.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: 'manual_manual',
    },
  });

  const shippingProfile = await ensureShippingProfile(fulfillmentModuleService);
  const delivery = await ensureFulfillmentSetWithServiceZone({
    fulfillmentModuleService,
    fulfillmentSetName: DELIVERY_FULFILLMENT_SET_NAME,
    fulfillmentSetType: 'shipping',
    serviceZoneName: DELIVERY_SERVICE_ZONE_NAME,
    countries: TECHHUB_COUNTRIES,
  });
  const pickup = await ensureFulfillmentSetWithServiceZone({
    fulfillmentModuleService,
    fulfillmentSetName: PICKUP_FULFILLMENT_SET_NAME,
    fulfillmentSetType: 'pickup',
    serviceZoneName: PICKUP_SERVICE_ZONE_NAME,
    countries: TECHHUB_PICKUP_COUNTRIES,
  });

  await remoteLink.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: delivery.fulfillmentSet.id,
    },
  });
  await remoteLink.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: pickup.fulfillmentSet.id,
    },
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannelId],
    },
  });

  await createMissingShippingOptions({
    container,
    fulfillmentModuleService,
    options: buildTechHubDeliveryShippingOptions({
      currencyCode: TECHHUB_CURRENCY_CODE,
      regionId: region.id,
      serviceZoneId: delivery.serviceZone.id,
      shippingProfileId: shippingProfile.id,
    }),
  });
  await createMissingShippingOptions({
    container,
    fulfillmentModuleService,
    options: buildTechHubPickupShippingOptions({
      currencyCode: TECHHUB_CURRENCY_CODE,
      regionId: region.id,
      serviceZoneId: pickup.serviceZone.id,
      shippingProfileId: shippingProfile.id,
    }),
  });
}

export default async function seedTechHubProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService: IProductModuleService = container.resolve(
    Modules.PRODUCT,
  );
  const salesChannelModuleService: ISalesChannelModuleService =
    container.resolve(Modules.SALES_CHANNEL);

  logger.info('Seeding TechHub Canada sample product data...');

  await ensureCanadaTaxRegion(container);

  const defaultSalesChannel = await ensureDefaultSalesChannel(
    container,
    salesChannelModuleService,
  );
  await ensureCanadianShippingSetup({
    container,
    defaultSalesChannelId: defaultSalesChannel.id,
  });
  const categoryRecords = await ensureCategories(container);
  const typeRecords = await ensureProductTypes(container, productModuleService);
  const collectionRecords = await ensureCollections(
    container,
  );

  const productHandles = products.map((product) => product.handle);
  const existingProducts = await listExistingByHandle<SeedProductRecord>(
    container,
    'product',
    ['id', 'title', 'handle', 'thumbnail', 'images.url'],
    productHandles,
  );
  const existingProductHandles = new Set(
    existingProducts.map((product) => product.handle),
  );
  const productsToCreate = products.filter(
    (product) => !existingProductHandles.has(product.handle),
  );
  const existingProductsNeedingImages = existingProducts.filter(
    (product) => !hasSeedProductImage(product),
  );
  const productSeedsByHandle = new Map(
    products.map((product) => [product.handle, product]),
  );
  const productsNeedingImageUpload = [
    ...productsToCreate,
    ...existingProductsNeedingImages.map((product) =>
      requireSeedRecord(
        productSeedsByHandle.get(product.handle),
        `product seed ${product.handle}`,
      ),
    ),
  ];
  const uploadedImagesByHandle = await uploadProductImages(
    container,
    productsNeedingImageUpload,
  );

  const categoriesByHandle = new Map(
    categoryRecords.map((category) => [category.handle, category]),
  );
  const typesByValue = new Map(typeRecords.map((type) => [type.value, type]));
  const collectionsByHandle = new Map(
    collectionRecords.map((collection) => [collection.handle, collection]),
  );

  if (productsToCreate.length) {
    await createProductsWorkflow(container).run({
      input: {
        products: productsToCreate.map((product) => {
          const category = requireSeedRecord(
            categoriesByHandle.get(product.categoryHandle),
            `category ${product.categoryHandle}`,
          );
          const type = requireSeedRecord(
            typesByValue.get(product.typeValue),
            `type ${product.typeValue}`,
          );
          const collection = requireSeedRecord(
            collectionsByHandle.get(product.collectionHandle),
            `collection ${product.collectionHandle}`,
          );

          return {
            title: product.title,
            handle: product.handle,
            description: product.description,
            category_ids: [category.id],
            collection_id: collection.id,
            type_id: type.id,
            status: ProductStatus.PUBLISHED,
            thumbnail: requireSeedRecord(
              uploadedImagesByHandle.get(product.handle),
              `image ${product.handle}`,
            ).url,
            images: [
              {
                url: requireSeedRecord(
                  uploadedImagesByHandle.get(product.handle),
                  `image ${product.handle}`,
                ).url,
              },
            ],
            options: [
              {
                title: 'Condition',
                values: [product.condition],
              },
            ],
            variants: [
              {
                title: product.condition,
                sku: product.sku,
                manage_inventory: false,
                options: {
                  Condition: product.condition,
                },
                prices: [
                  {
                    amount: product.price,
                    currency_code: CURRENCY_CODE,
                  },
                ],
                metadata: {
                  brand: product.brand,
                  specs: product.specs,
                },
              },
            ],
            sales_channels: [
              {
                id: defaultSalesChannel.id,
              },
            ],
            metadata: {
              brand: product.brand,
              condition: product.condition,
              specs: product.specs,
              source: 'techhub-canada-sample-seed',
            },
          };
        }),
      },
    });
  }

  if (existingProductsNeedingImages.length) {
    await updateProductsWorkflow(container).run({
      input: {
        products: existingProductsNeedingImages.map((existingProduct) => {
          const file = requireSeedRecord(
            uploadedImagesByHandle.get(existingProduct.handle),
            `image ${existingProduct.handle}`,
          );

          return {
            id: existingProduct.id,
            thumbnail: file.url,
            images: [
              {
                url: file.url,
              },
            ],
          };
        }),
      },
    });
  }

  const uploadedUrls = Array.from(uploadedImagesByHandle.values()).map(
    (file) => file.url,
  );

  if (uploadedUrls.length) {
    await verifyPublicImageUrls(uploadedUrls);
  }

  if (!productsToCreate.length && !existingProductsNeedingImages.length) {
    logger.info('TechHub Canada sample products and images already exist.');
    return;
  }

  logger.info(
    `Created ${productsToCreate.length} TechHub Canada sample products and attached ${uploadedUrls.length} images.`,
  );
}
