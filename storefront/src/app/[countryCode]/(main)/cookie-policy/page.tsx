import { Metadata } from "next"
import { Layout, LayoutColumn } from "@/components/Layout"
import { Link } from "@/components/Link"
import { getStaticCountryCodes } from "@lib/util/static-country-codes"
import { storeBusinessInfo } from "@lib/business-info"
import { createPageMetadata, getLocalizedPath } from "@lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params

  return createPageMetadata({
    title: "Cookie Policy",
    description: "How TechHub uses cookies and similar technologies.",
    path: getLocalizedPath(countryCode, "cookie-policy"),
  })
}

export async function generateStaticParams() {
  return getStaticCountryCodes().map((countryCode) => ({ countryCode }))
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  return (
    <Layout className="pt-30 pb-20 md:pt-47 md:pb-32">
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 11, xl: 10 }}
      >
        <p className="mb-4 text-sm text-grayscale-500">
          Last updated: July 8, 2026
        </p>
        <h1 className="text-xl md:text-3xl mb-10 md:mb-16">Cookie Policy</h1>
      </LayoutColumn>
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 10, xl: 9 }}
        className="article"
      >
        <p>
          TechHub uses cookies, pixels, and browser storage to run our online
          store, remember choices, understand site performance, and improve the
          shopping experience. This policy explains the categories we use and
          how you can control optional cookies.
        </p>

        <h2>1. What cookies do</h2>
        <p>
          Cookies are small files or browser records stored on your device. They
          can remember a cart, keep a checkout session active, prevent repeated
          prompts, measure page activity, or support marketing tools. Similar
          technologies include local storage, pixels, tags, and SDKs.
        </p>

        <h2>2. Essential cookies</h2>
        <p>
          Essential cookies are always on because the website cannot work
          properly without them. They support cart, checkout, region selection,
          account login, fraud prevention, security, load balancing, and storing
          your cookie choices.
        </p>

        <h2>3. Preference cookies</h2>
        <p>
          Preference cookies remember choices that make the site easier to use,
          such as selected country, display settings, or returning visitor
          preferences. Turning these off may reset some convenience features.
        </p>

        <h2>4. Analytics cookies</h2>
        <p>
          Analytics cookies help us understand how visitors find and use the
          website, which pages are useful, and where checkout or product
          discovery can be improved. We use this information in aggregate where
          possible.
        </p>

        <h2>5. Marketing cookies</h2>
        <p>
          Marketing cookies may help measure campaigns, understand whether ads
          or emails are effective, and show more relevant offers. These are
          optional and stay off unless accepted.
        </p>

        <h2>6. Third-party services</h2>
        <p>
          Some cookies may be set by providers that help us operate the store,
          process payments, send email, measure traffic, host the website,
          prevent fraud, or run advertising. Those providers may process data
          under their own policies when their services are used.
        </p>

        <h2>7. Managing cookies</h2>
        <p>
          Optional cookies are off unless you accept them. You can update your
          choices anytime on the{" "}
          <Link href={`/${countryCode}/cookie-preferences`} variant="underline">
            Manage Cookie Preferences
          </Link>{" "}
          page. You can also block or delete cookies in your browser settings,
          but some store features may not work if essential cookies are blocked.
        </p>

        <h2>8. Banner timing</h2>
        <p>
          The cookie banner closes slowly after 45 seconds if no choice is made.
          Auto-close saves essential cookies only. It does not accept optional
          analytics or marketing cookies for you.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions can be sent to{" "}
          <a href={storeBusinessInfo.email.href}>
            {storeBusinessInfo.email.label}
          </a>
          .
        </p>
      </LayoutColumn>
    </Layout>
  )
}
