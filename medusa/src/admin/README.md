# Admin Customizations

You can extend the Admin dashboard to add widgets and new pages. Your customizations interact with API routes to provide merchants with custom functionalities.

## Example: Create a Widget

A widget is a React component that can be injected into an existing page in the admin dashboard.

For example, create the file `src/admin/widgets/product-widget.tsx` with the following content:

```tsx title="src/admin/widgets/product-widget.tsx"
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// The widget
const ProductWidget = () => {
  return (
    <div>
      <h2>Product Widget</h2>
    </div>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductWidget;
```

This inserts a widget with the text “Product Widget” at the end of a product’s details page.

## Custom Admin Pages

Admin pages live under `src/admin/routes`. The folder name becomes the Admin route path, and each page exports a default React component plus `defineRouteConfig` metadata for the Admin navigation label and icon.

Current custom pages:

- `src/admin/routes/fashion/page.tsx` - Materials & Colors management.
- `src/admin/routes/marketplace/page.tsx` - Marketplace extension page for external storefront seller accounts shown on the ecommerce homepage. This page manages Best Buy, Amazon, and other marketplace profile URLs stored in the `marketplaceAccount` module.
- `src/admin/routes/about-product/page.tsx` - About page for the Tech Hub Canada ecommerce product and Agency by Naman Kataria credit.

Current custom product widgets:

- `src/admin/widgets/product-agency-support.tsx` - Agency support CTA rendered in both the main product details area and product details side area.

Visible custom route, widget, and component copy should use neutral Admin wording and avoid naming the underlying platform brand in merchant-facing panels.

## Custom Admin Styles

- `src/admin/styles/admin-sidebar.css` - Hides the visual scrollbar on the Admin sidebar while preserving sidebar scrolling.
