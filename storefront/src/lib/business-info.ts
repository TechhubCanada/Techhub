export const storeBusinessInfo = {
  name: "Tech Hub Canada",
  address: {
    street: "7595 Markham Rd Unit 2",
    city: "Markham",
    province: "ON",
    postalCode: "L3S 0B6",
    country: "Canada",
  },
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=7595%20Markham%20Rd%20Unit%202%2C%20Markham%2C%20ON%20L3S%200B6",
  phone: {
    label: "(905) 554-0641",
    href: "tel:+19055540641",
  },
  email: {
    label: "info@techhubcanada.com",
    href: "mailto:info@techhubcanada.com",
  },
  hours: [
    { day: "Monday", time: "10 a.m. - 7 p.m." },
    { day: "Tuesday", time: "10 a.m. - 7 p.m." },
    { day: "Wednesday", time: "10 a.m. - 7 p.m." },
    { day: "Thursday", time: "10 a.m. - 7 p.m." },
    { day: "Friday", time: "10 a.m. - 7 p.m." },
    { day: "Saturday", time: "12 - 6 p.m." },
    { day: "Sunday", time: "Closed" },
  ],
} as const
