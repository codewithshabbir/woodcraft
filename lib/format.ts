const stableNumberFormatter = new Intl.NumberFormat("en-US")

export function formatNumber(value: number) {
  return stableNumberFormatter.format(value)
}
