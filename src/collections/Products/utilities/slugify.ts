export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .trim()
    .split("")
    .map((char) => translitMap[char] || char)
    .join("")
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

const translitMap: Record<string, string> = {
  "а": "a", "б": "b", "в": "v", "г": "g", "д": "d",
  "е": "e", "ё": "e", "ж": "zh", "з": "z", "и": "i",
  "й": "y", "к": "k", "л": "l", "м": "m", "н": "n",
  "о": "o", "п": "p", "р": "r", "с": "s", "т": "t",
  "у": "u", "ф": "f", "х": "h", "ц": "ts", "ч": "ch",
  "ш": "sh", "щ": "shch", "ы": "y", "э": "e", "ю": "yu", "я": "ya",
  "ь": "", "ъ": ""
}