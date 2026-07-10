import { NextRequest } from "next/server"

import { retrieveOrder } from "@lib/data/orders"
import { convertToLocale } from "@lib/util/money"
import { getSquareReceiptUrl } from "@lib/util/square-receipt"

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")

const formatMoney = (amount: number | null | undefined, currency: string) =>
  convertToLocale({
    amount: amount ?? 0,
    currency_code: currency,
  })

const formatAddress = (
  address:
    | {
        first_name?: string | null
        last_name?: string | null
        company?: string | null
        address_1?: string | null
        address_2?: string | null
        city?: string | null
        province?: string | null
        postal_code?: string | null
        country_code?: string | null
        country?: { display_name?: string | null } | null
        phone?: string | null
      }
    | null
    | undefined
) => {
  const lines = [
    [address?.first_name, address?.last_name].filter(Boolean).join(" "),
    address?.company,
    [address?.address_1, address?.address_2].filter(Boolean).join(", "),
    [address?.city, address?.province, address?.postal_code]
      .filter(Boolean)
      .join(", "),
    address?.country?.display_name || address?.country_code?.toUpperCase(),
    address?.phone,
  ].filter(Boolean)

  return lines.map((line) => escapeHtml(line)).join("<br />")
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const shouldPreview = request.nextUrl.searchParams.get("preview") === "1"
  const order = await retrieveOrder(id)
  const currency = order.currency_code
  const invoiceNumber = `INV-${order.display_id}`
  const orderDate = new Date(order.created_at).toLocaleDateString("en-CA")
  const squareReceiptUrl = getSquareReceiptUrl(order)

  const itemRows = (order.items ?? [])
    .map((item) => {
      const title = escapeHtml(item.product_title || item.title)
      const variant = item.variant_title
        ? `<div class="muted">${escapeHtml(item.variant_title)}</div>`
        : ""

      return `
        <tr>
          <td>
            <strong>${title}</strong>
            ${variant}
          </td>
          <td class="numeric">${escapeHtml(item.quantity)}</td>
          <td class="numeric">${escapeHtml(formatMoney(item.unit_price, currency))}</td>
          <td class="numeric">${escapeHtml(formatMoney(item.total, currency))}</td>
        </tr>
      `
    })
    .join("")

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(invoiceNumber)} | Tech Hub Canada</title>
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #f5f5f5;
        color: #111;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.45;
      }
      main {
        width: min(920px, calc(100% - 32px));
        margin: 32px auto;
        background: #fff;
        border: 1px solid #ddd;
        padding: 40px;
      }
      header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 24px;
        margin-bottom: 28px;
      }
      h1, h2, p { margin: 0; }
      h1 { font-size: 28px; }
      h2 { font-size: 15px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: .04em; }
      .muted { color: #666; font-size: 13px; }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px;
        margin-bottom: 28px;
      }
      .panel {
        border: 1px solid #ddd;
        padding: 16px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        border-bottom: 1px solid #ddd;
        padding: 12px 0;
        text-align: left;
        vertical-align: top;
      }
      th { font-size: 13px; text-transform: uppercase; letter-spacing: .04em; color: #555; }
      .numeric { text-align: right; }
      .totals {
        margin-left: auto;
        margin-top: 24px;
        width: min(360px, 100%);
      }
      .total-line {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }
      .grand-total {
        font-weight: 700;
        font-size: 18px;
        border-bottom: 0;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        margin: 0 auto 16px;
        width: min(920px, calc(100% - 32px));
      }
      button {
        border: 1px solid #111;
        background: #111;
        color: #fff;
        border-radius: 4px;
        padding: 10px 14px;
        cursor: pointer;
      }
      .button-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #111;
        border-radius: 4px;
        padding: 10px 14px;
        color: #111;
        text-decoration: none;
      }
      .receipt-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 24px;
      }
      @media print {
        body { background: #fff; }
        main { width: 100%; margin: 0; border: 0; padding: 0; }
        .actions { display: none; }
      }
    </style>
  </head>
  <body>
    <div class="actions">
      <button onclick="window.print()">Print invoice</button>
    </div>
    <main>
      <header>
        <div>
          <h1>Tech Hub Canada</h1>
          <p class="muted">7595 Markham Rd Unit 2, Markham, ON L3S 0B6</p>
          <p class="muted">info@techhubcanada.com</p>
        </div>
        <div>
          <h2>Invoice</h2>
          <p><strong>${escapeHtml(invoiceNumber)}</strong></p>
          <p class="muted">Order ${escapeHtml(order.display_id)}</p>
          <p class="muted">${escapeHtml(orderDate)}</p>
        </div>
      </header>

      <section class="grid">
        <div class="panel">
          <h2>Bill to</h2>
          <p>${formatAddress(order.billing_address)}</p>
        </div>
        <div class="panel">
          <h2>Ship to</h2>
          <p>${formatAddress(order.shipping_address)}</p>
        </div>
      </section>

      <section>
        <h2>Items</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th class="numeric">Qty</th>
              <th class="numeric">Unit</th>
              <th class="numeric">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
      </section>

      <section class="totals">
        <div class="total-line">
          <span>Subtotal</span>
          <span>${escapeHtml(formatMoney(order.subtotal, currency))}</span>
        </div>
        <div class="total-line">
          <span>Shipping</span>
          <span>${escapeHtml(formatMoney(order.shipping_total, currency))}</span>
        </div>
        <div class="total-line">
          <span>Tax</span>
          <span>${escapeHtml(formatMoney(order.tax_total, currency))}</span>
        </div>
        <div class="total-line grand-total">
          <span>Total</span>
          <span>${escapeHtml(formatMoney(order.total, currency))}</span>
        </div>
      </section>

      ${
        squareReceiptUrl
          ? `<section class="receipt-actions">
              <a class="button-link" href="${escapeHtml(squareReceiptUrl)}" target="_blank" rel="noreferrer">Open Payment receipt</a>
            </section>`
          : ""
      }
    </main>
  </body>
</html>`

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-disposition": `${shouldPreview ? "inline" : "attachment"}; filename="${invoiceNumber}.html"`,
    },
  })
}
