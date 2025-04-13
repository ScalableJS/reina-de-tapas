import type { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .split("")
    .map((char) => translitMap[char] || char)
    .join("")
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase();

const translitMap: Record<string, string> = {
  "а": "a", "б": "b", "в": "v", "г": "g", "д": "d",
  "е": "e", "ё": "e", "ж": "zh", "з": "z", "и": "i",
  "й": "y", "к": "k", "л": "l", "м": "m", "н": "n",
  "о": "o", "п": "p", "р": "r", "с": "s", "т": "t",
  "у": "u", "ф": "f", "х": "h", "ц": "ts", "ч": "ch",
  "ш": "sh", "щ": "shch", "ы": "y", "э": "e", "ю": "yu", "я": "ya",
  "ь": "", "ъ": ""
}

const formatSlug =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string') {
      return format(value)
    }


    if (operation === 'create' || operation === 'update') {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }

export default formatSlug
