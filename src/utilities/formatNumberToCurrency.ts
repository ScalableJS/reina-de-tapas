import { currency } from '@/collections/Products/ui/Variants/VariantSelect/columns/PriceInput/utilities'

export const formatNumberToCurrency = (value: number): string => {
  if (!currency) {
    return value.toString()
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  }).format(value)
}
