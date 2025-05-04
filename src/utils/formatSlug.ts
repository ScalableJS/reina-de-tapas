import type { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .toLowerCase()
    .normalize('NFD')
    .trim()
    .split('')
    .map((char) => translitMap[char] || char)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')

const translitMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ы: 'y',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  ь: '',
  ъ: '',
}

export const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, siblingData, originalDoc }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      return format(value)
    }

    const fallbackSource = siblingData?.[fallback] || originalDoc?.[fallback]

    if (typeof fallbackSource === 'string' && fallbackSource.trim() !== '') {
      return format(fallbackSource)
    }

    return value
  }
