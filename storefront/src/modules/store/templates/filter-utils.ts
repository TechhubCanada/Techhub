export function resolveSelectedIds<
  TItem extends { id: string },
  TKey extends keyof TItem,
>(items: TItem[], selected: string[] | undefined, key: TKey) {
  if (!selected?.length) {
    return undefined
  }

  const ids = items
    .filter((item) => selected.includes(String(item[key])))
    .map((item) => item.id)

  return ids.length ? ids : undefined
}
