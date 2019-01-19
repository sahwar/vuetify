export interface MaskItem {
  test: (char: string) => boolean
  convert: (char: string) => string // eslint-disable-line no-use-before-define
}
export type MaskType = '#' | 'A' | 'a' | 'N' | 'n' | 'X'

export const defaultDelimiters = /[-!$%^&*()_+|~=`{}[\]:";'<>?,./\\ ]/

export const isMaskDelimiter = (char: string): boolean => char ? defaultDelimiters.test(char) : false

const allowedMasks: Dictionary<MaskItem> = {
  '#': {
    test: char => Boolean(char.match(/[0-9]/)),
    convert: char => char
  },
  'A': {
    test: char => Boolean(char.match(/[A-Z]/i)),
    convert: char => char.toUpperCase()
  },
  'a': {
    test: char => Boolean(char.match(/[a-z]/i)),
    convert: char => char.toLowerCase()
  },
  'N': {
    test: char => Boolean(char.match(/[0-9A-Z]/i)),
    convert: char => char.toUpperCase()
  },
  'n': {
    test: char => Boolean(char.match(/[0-9a-z]/i)),
    convert: char => char.toLowerCase()
  },
  'X': {
    test: isMaskDelimiter,
    convert: char => char
  }
}

const isMask = (char: string): boolean => allowedMasks.hasOwnProperty(char)

const convert = (mask: MaskType, char: string): string => {
  return allowedMasks[mask].convert(char)
}

const maskValidates = (mask: MaskType, char: string): boolean => {
  if (char == null || !isMask(mask)) return false
  return allowedMasks[mask].test(char)
}

export const maskText = (text: string | string[], masked: string | any[], dontFillMaskBlanks: boolean): string => {
  if (text == null) return ''
  text = String(text)
  if (!masked.length || !text.length) return text
  if (!Array.isArray(masked)) masked = masked.split('')

  let textIndex = 0
  let maskIndex = 0
  let newText = ''

  while (maskIndex < masked.length) {
    const mask = masked[maskIndex]

    // Assign the next character
    const char = text[textIndex]

    // Check if mask is delimiter
    // and current char matches
    if (!isMask(mask) && char === mask) {
      newText += mask
      textIndex++
    // Check if not mask
    } else if (!isMask(mask) && !dontFillMaskBlanks) {
      newText += mask
    // Check if is mask and validates
    } else if (maskValidates(mask, char)) {
      newText += convert(mask, char)
      textIndex++
    } else {
      return newText
    }

    maskIndex++
  }

  return newText
}

export const unmaskText = (text: string): string => {
  return text ? String(text).replace(new RegExp(defaultDelimiters, 'g'), '') : text
}
