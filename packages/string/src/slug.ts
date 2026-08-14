type SlugMapping = {
  charset: Charset;
  locales: Locales;
};

type Charset = {
  [key: string]: string;
};

type AvailableLocales =
  | 'bg'
  | 'es'
  | 'fr'
  | 'it'
  | 'de'
  | 'nl'
  | 'pt'
  | 'sv'
  | 'uk'
  | 'vi'
  | 'da'
  | 'nb';

type Locales = {
  [key in AvailableLocales]: Charset;
};

export type SlugOptions = {
  /**
   * Trim leading and trailing whitespace.
   *
   * @defaultValue `true`
   */
  trim?: boolean;

  /**
   * Convert the string to lowercase.
   *
   * @defaultValue `true`
   */
  lower?: boolean;

  /**
   * Remove characters outside `[A-Za-z0-9\s]` after transliteration.
   *
   * @defaultValue `false`
   */
  strict?: boolean;

  /**
   * Remove characters matching this expression. Should be a global character
   * class (e.g. `/[*+~.()'"!:@]/g`).
   */
  remove?: RegExp;

  /**
   * Locale whose character mapping takes precedence over the default charset.
   */
  locale?: AvailableLocales;

  /**
   * Character used to separate words.
   *
   * @defaultValue `'-'`
   */
  separator?: string;
};

/**
 * Creates a slug function pre-configured with default options.
 */
export type SlugBuilder = (options?: SlugOptions) => Slug;

/**
 * A slug function, with helpers to extend the charset or derive a new
 * pre-configured instance.
 */
export interface Slug {
  (input: string, options?: SlugOptions): string;
  /**
   * Extends the shared character mapping with additional entries.
   *
   * @param charset - A map of characters to their slug equivalents.
   *
   * @example
   * ```ts
   * slug.extend({ '@': 'at' });
   * ```
   */
  extend: (charset: Charset) => void;

  /**
   * Creates a new slug function with custom default options.
   *
   * @param options - Default options for the new instance.
   * @returns A configured slug function.
   *
   * @example
   * ```ts
   * const customSlug = slug.create({ lower: false });
   * ```
   */
  create: SlugBuilder;
}

type TransformOptions = {
  /**
   * Expression whose matches are stripped from the transliterated output.
   */
  remove: RegExp;

  /**
   * The effective character mapping (default charset merged with the locale).
   */
  charset: Charset;

  /** Locale-specific overrides checked before the default charset. */
  localeCharset?: Charset;

  /**
   * Character used to separate words; occurrences produced by the mapping are
   * normalized to spaces before the final separator is applied.
   */
  separator: string;
};

const DEFAULT_OPTIONS = {
  trim: true,
  lower: true,
  strict: false,
  separator: '-',
  remove: /[^\w\s$*_+~.()'"!\-:@]+/g,
} as const;

const DEFAULT_MAPPING: SlugMapping = {
  charset: {
    $: 'dollar',
    '%': 'percent',
    '&': 'and',
    '<': 'less',
    '>': 'greater',
    '|': 'or',
    '¢': 'cent',
    '£': 'pound',
    '¤': 'currency',
    '¥': 'yen',
    '©': '(c)',
    ª: 'a',
    '®': '(r)',
    º: 'o',
    À: 'A',
    Á: 'A',
    Â: 'A',
    Ã: 'A',
    Ä: 'A',
    Å: 'A',
    Æ: 'AE',
    Ç: 'C',
    È: 'E',
    É: 'E',
    Ê: 'E',
    Ë: 'E',
    Ì: 'I',
    Í: 'I',
    Î: 'I',
    Ï: 'I',
    Ð: 'D',
    Ñ: 'N',
    Ò: 'O',
    Ó: 'O',
    Ô: 'O',
    Õ: 'O',
    Ö: 'O',
    Ø: 'O',
    Ù: 'U',
    Ú: 'U',
    Û: 'U',
    Ü: 'U',
    Ý: 'Y',
    Þ: 'TH',
    ß: 'ss',
    à: 'a',
    á: 'a',
    â: 'a',
    ã: 'a',
    ä: 'a',
    å: 'a',
    æ: 'ae',
    ç: 'c',
    è: 'e',
    é: 'e',
    ê: 'e',
    ë: 'e',
    ì: 'i',
    í: 'i',
    î: 'i',
    ï: 'i',
    ð: 'd',
    ñ: 'n',
    ò: 'o',
    ó: 'o',
    ô: 'o',
    õ: 'o',
    ö: 'o',
    ø: 'o',
    ù: 'u',
    ú: 'u',
    û: 'u',
    ü: 'u',
    ý: 'y',
    þ: 'th',
    ÿ: 'y',
    Ā: 'A',
    ā: 'a',
    Ă: 'A',
    ă: 'a',
    Ą: 'A',
    ą: 'a',
    Ć: 'C',
    ć: 'c',
    Č: 'C',
    č: 'c',
    Ď: 'D',
    ď: 'd',
    Đ: 'DJ',
    đ: 'dj',
    Ē: 'E',
    ē: 'e',
    Ė: 'E',
    ė: 'e',
    Ę: 'e',
    ę: 'e',
    Ě: 'E',
    ě: 'e',
    Ğ: 'G',
    ğ: 'g',
    Ģ: 'G',
    ģ: 'g',
    Ĩ: 'I',
    ĩ: 'i',
    Ī: 'i',
    ī: 'i',
    Į: 'I',
    į: 'i',
    İ: 'I',
    ı: 'i',
    Ķ: 'k',
    ķ: 'k',
    Ļ: 'L',
    ļ: 'l',
    Ľ: 'L',
    ľ: 'l',
    Ł: 'L',
    ł: 'l',
    Ń: 'N',
    ń: 'n',
    Ņ: 'N',
    ņ: 'n',
    Ň: 'N',
    ň: 'n',
    Ō: 'O',
    ō: 'o',
    Ő: 'O',
    ő: 'o',
    Œ: 'OE',
    œ: 'oe',
    Ŕ: 'R',
    ŕ: 'r',
    Ř: 'R',
    ř: 'r',
    Ś: 'S',
    ś: 's',
    Ş: 'S',
    ş: 's',
    Š: 'S',
    š: 's',
    Ţ: 'T',
    ţ: 't',
    Ť: 'T',
    ť: 't',
    Ũ: 'U',
    ũ: 'u',
    Ū: 'u',
    ū: 'u',
    Ů: 'U',
    ů: 'u',
    Ű: 'U',
    ű: 'u',
    Ų: 'U',
    ų: 'u',
    Ŵ: 'W',
    ŵ: 'w',
    Ŷ: 'Y',
    ŷ: 'y',
    Ÿ: 'Y',
    Ź: 'Z',
    ź: 'z',
    Ż: 'Z',
    ż: 'z',
    Ž: 'Z',
    ž: 'z',
    Ə: 'E',
    ƒ: 'f',
    Ơ: 'O',
    ơ: 'o',
    Ư: 'U',
    ư: 'u',
    ǈ: 'LJ',
    ǉ: 'lj',
    ǋ: 'NJ',
    ǌ: 'nj',
    Ș: 'S',
    ș: 's',
    Ț: 'T',
    ț: 't',
    ə: 'e',
    '˚': 'o',
    Ά: 'A',
    Έ: 'E',
    Ή: 'H',
    Ί: 'I',
    Ό: 'O',
    Ύ: 'Y',
    Ώ: 'W',
    ΐ: 'i',
    Α: 'A',
    Β: 'B',
    Γ: 'G',
    Δ: 'D',
    Ε: 'E',
    Ζ: 'Z',
    Η: 'H',
    Θ: '8',
    Ι: 'I',
    Κ: 'K',
    Λ: 'L',
    Μ: 'M',
    Ν: 'N',
    Ξ: '3',
    Ο: 'O',
    Π: 'P',
    Ρ: 'R',
    Σ: 'S',
    Τ: 'T',
    Υ: 'Y',
    Φ: 'F',
    Χ: 'X',
    Ψ: 'PS',
    Ω: 'W',
    Ϊ: 'I',
    Ϋ: 'Y',
    ά: 'a',
    έ: 'e',
    ή: 'h',
    ί: 'i',
    ΰ: 'y',
    α: 'a',
    β: 'b',
    γ: 'g',
    δ: 'd',
    ε: 'e',
    ζ: 'z',
    η: 'h',
    θ: '8',
    ι: 'i',
    κ: 'k',
    λ: 'l',
    μ: 'm',
    ν: 'n',
    ξ: '3',
    ο: 'o',
    π: 'p',
    ρ: 'r',
    ς: 's',
    σ: 's',
    τ: 't',
    υ: 'y',
    φ: 'f',
    χ: 'x',
    ψ: 'ps',
    ω: 'w',
    ϊ: 'i',
    ϋ: 'y',
    ό: 'o',
    ύ: 'y',
    ώ: 'w',
    Ё: 'Yo',
    Ђ: 'DJ',
    Є: 'Ye',
    І: 'I',
    Ї: 'Yi',
    Ј: 'J',
    Љ: 'LJ',
    Њ: 'NJ',
    Ћ: 'C',
    Џ: 'DZ',
    А: 'A',
    Б: 'B',
    В: 'V',
    Г: 'G',
    Д: 'D',
    Е: 'E',
    Ж: 'Zh',
    З: 'Z',
    И: 'I',
    Й: 'J',
    К: 'K',
    Л: 'L',
    М: 'M',
    Н: 'N',
    О: 'O',
    П: 'P',
    Р: 'R',
    С: 'S',
    Т: 'T',
    У: 'U',
    Ф: 'F',
    Х: 'H',
    Ц: 'C',
    Ч: 'Ch',
    Ш: 'Sh',
    Щ: 'Sh',
    Ъ: 'U',
    Ы: 'Y',
    Ь: '',
    Э: 'E',
    Ю: 'Yu',
    Я: 'Ya',
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'j',
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
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sh',
    ъ: 'u',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    ё: 'yo',
    ђ: 'dj',
    є: 'ye',
    і: 'i',
    ї: 'yi',
    ј: 'j',
    љ: 'lj',
    њ: 'nj',
    ћ: 'c',
    ѝ: 'u',
    џ: 'dz',
    Ґ: 'G',
    ґ: 'g',
    Ғ: 'GH',
    ғ: 'gh',
    Қ: 'KH',
    қ: 'kh',
    Ң: 'NG',
    ң: 'ng',
    Ү: 'UE',
    ү: 'ue',
    Ұ: 'U',
    ұ: 'u',
    Һ: 'H',
    һ: 'h',
    Ә: 'AE',
    ә: 'ae',
    Ө: 'OE',
    ө: 'oe',
    Ա: 'A',
    Բ: 'B',
    Գ: 'G',
    Դ: 'D',
    Ե: 'E',
    Զ: 'Z',
    Է: "E'",
    Ը: "Y'",
    Թ: "T'",
    Ժ: 'JH',
    Ի: 'I',
    Լ: 'L',
    Խ: 'X',
    Ծ: "C'",
    Կ: 'K',
    Հ: 'H',
    Ձ: "D'",
    Ղ: 'GH',
    Ճ: 'TW',
    Մ: 'M',
    Յ: 'Y',
    Ն: 'N',
    Շ: 'SH',
    Չ: 'CH',
    Պ: 'P',
    Ջ: 'J',
    Ռ: "R'",
    Ս: 'S',
    Վ: 'V',
    Տ: 'T',
    Ր: 'R',
    Ց: 'C',
    Փ: "P'",
    Ք: "Q'",
    Օ: "O''",
    Ֆ: 'F',
    և: 'EV',
    ء: 'a',
    آ: 'aa',
    أ: 'a',
    ؤ: 'u',
    إ: 'i',
    ئ: 'e',
    ا: 'a',
    ب: 'b',
    ة: 'h',
    ت: 't',
    ث: 'th',
    ج: 'j',
    ح: 'h',
    خ: 'kh',
    د: 'd',
    ذ: 'th',
    ر: 'r',
    ز: 'z',
    س: 's',
    ش: 'sh',
    ص: 's',
    ض: 'dh',
    ط: 't',
    ظ: 'z',
    ع: 'a',
    غ: 'gh',
    ف: 'f',
    ق: 'q',
    ك: 'k',
    ل: 'l',
    م: 'm',
    ن: 'n',
    ه: 'h',
    و: 'w',
    ى: 'a',
    ي: 'y',
    'ً': 'an',
    'ٌ': 'on',
    'ٍ': 'en',
    'َ': 'a',
    'ُ': 'u',
    'ِ': 'e',
    'ْ': '',
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    پ: 'p',
    چ: 'ch',
    ژ: 'zh',
    ک: 'k',
    گ: 'g',
    ی: 'y',
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
    '฿': 'baht',
    ა: 'a',
    ბ: 'b',
    გ: 'g',
    დ: 'd',
    ე: 'e',
    ვ: 'v',
    ზ: 'z',
    თ: 't',
    ი: 'i',
    კ: 'k',
    ლ: 'l',
    მ: 'm',
    ნ: 'n',
    ო: 'o',
    პ: 'p',
    ჟ: 'zh',
    რ: 'r',
    ს: 's',
    ტ: 't',
    უ: 'u',
    ფ: 'f',
    ქ: 'k',
    ღ: 'gh',
    ყ: 'q',
    შ: 'sh',
    ჩ: 'ch',
    ც: 'ts',
    ძ: 'dz',
    წ: 'ts',
    ჭ: 'ch',
    ხ: 'kh',
    ჯ: 'j',
    ჰ: 'h',
    Ṣ: 'S',
    ṣ: 's',
    Ẁ: 'W',
    ẁ: 'w',
    Ẃ: 'W',
    ẃ: 'w',
    Ẅ: 'W',
    ẅ: 'w',
    ẞ: 'SS',
    Ạ: 'A',
    ạ: 'a',
    Ả: 'A',
    ả: 'a',
    Ấ: 'A',
    ấ: 'a',
    Ầ: 'A',
    ầ: 'a',
    Ẩ: 'A',
    ẩ: 'a',
    Ẫ: 'A',
    ẫ: 'a',
    Ậ: 'A',
    ậ: 'a',
    Ắ: 'A',
    ắ: 'a',
    Ằ: 'A',
    ằ: 'a',
    Ẳ: 'A',
    ẳ: 'a',
    Ẵ: 'A',
    ẵ: 'a',
    Ặ: 'A',
    ặ: 'a',
    Ẹ: 'E',
    ẹ: 'e',
    Ẻ: 'E',
    ẻ: 'e',
    Ẽ: 'E',
    ẽ: 'e',
    Ế: 'E',
    ế: 'e',
    Ề: 'E',
    ề: 'e',
    Ể: 'E',
    ể: 'e',
    Ễ: 'E',
    ễ: 'e',
    Ệ: 'E',
    ệ: 'e',
    Ỉ: 'I',
    ỉ: 'i',
    Ị: 'I',
    ị: 'i',
    Ọ: 'O',
    ọ: 'o',
    Ỏ: 'O',
    ỏ: 'o',
    Ố: 'O',
    ố: 'o',
    Ồ: 'O',
    ồ: 'o',
    Ổ: 'O',
    ổ: 'o',
    Ỗ: 'O',
    ỗ: 'o',
    Ộ: 'O',
    ộ: 'o',
    Ớ: 'O',
    ớ: 'o',
    Ờ: 'O',
    ờ: 'o',
    Ở: 'O',
    ở: 'o',
    Ỡ: 'O',
    ỡ: 'o',
    Ợ: 'O',
    ợ: 'o',
    Ụ: 'U',
    ụ: 'u',
    Ủ: 'U',
    ủ: 'u',
    Ứ: 'U',
    ứ: 'u',
    Ừ: 'U',
    ừ: 'u',
    Ử: 'U',
    ử: 'u',
    Ữ: 'U',
    ữ: 'u',
    Ự: 'U',
    ự: 'u',
    Ỳ: 'Y',
    ỳ: 'y',
    Ỵ: 'Y',
    ỵ: 'y',
    Ỷ: 'Y',
    ỷ: 'y',
    Ỹ: 'Y',
    ỹ: 'y',
    '–': '-',
    '‘': "'",
    '’': "'",
    '“': '"',
    '”': '"',
    '„': '"',
    '†': '+',
    '•': '*',
    '…': '...',
    '₠': 'ecu',
    '₢': 'cruzeiro',
    '₣': 'french franc',
    '₤': 'lira',
    '₥': 'mill',
    '₦': 'naira',
    '₧': 'peseta',
    '₨': 'rupee',
    '₩': 'won',
    '₪': 'new shequel',
    '₫': 'dong',
    '€': 'euro',
    '₭': 'kip',
    '₮': 'tugrik',
    '₯': 'drachma',
    '₰': 'penny',
    '₱': 'peso',
    '₲': 'guarani',
    '₳': 'austral',
    '₴': 'hryvnia',
    '₵': 'cedi',
    '₸': 'kazakhstani tenge',
    '₹': 'indian rupee',
    '₺': 'turkish lira',
    '₽': 'russian ruble',
    '₿': 'bitcoin',
    '℠': 'sm',
    '™': 'tm',
    '∂': 'd',
    '∆': 'delta',
    '∑': 'sum',
    '∞': 'infinity',
    '♥': 'love',
    元: 'yuan',
    円: 'yen',
    '﷼': 'rial',
    ﻵ: 'laa',
    ﻷ: 'laa',
    ﻹ: 'lai',
    ﻻ: 'la',
  },
  locales: {
    bg: {
      Й: 'Y',
      Ц: 'Ts',
      Щ: 'Sht',
      Ъ: 'A',
      Ь: 'Y',
      й: 'y',
      ц: 'ts',
      щ: 'sht',
      ъ: 'a',
      ь: 'y',
    },
    de: {
      Ä: 'AE',
      ä: 'ae',
      Ö: 'OE',
      ö: 'oe',
      Ü: 'UE',
      ü: 'ue',
      ß: 'ss',
      '%': 'prozent',
      '&': 'und',
      '|': 'oder',
      '∑': 'summe',
      '∞': 'unendlich',
      '♥': 'liebe',
    },
    es: {
      '%': 'por ciento',
      '&': 'y',
      '<': 'menor que',
      '>': 'mayor que',
      '|': 'o',
      '¢': 'centavos',
      '£': 'libras',
      '¤': 'moneda',
      '₣': 'francos',
      '∑': 'suma',
      '∞': 'infinito',
      '♥': 'amor',
    },
    fr: {
      '%': 'pourcent',
      '&': 'et',
      '<': 'plus petit',
      '>': 'plus grand',
      '|': 'ou',
      '¢': 'centime',
      '£': 'livre',
      '¤': 'devise',
      '₣': 'franc',
      '∑': 'somme',
      '∞': 'infini',
      '♥': 'amour',
    },
    pt: {
      '%': 'porcento',
      '&': 'e',
      '<': 'menor',
      '>': 'maior',
      '|': 'ou',
      '¢': 'centavo',
      '∑': 'soma',
      '£': 'libra',
      '∞': 'infinito',
      '♥': 'amor',
    },
    uk: {
      И: 'Y',
      и: 'y',
      Й: 'Y',
      й: 'y',
      Ц: 'Ts',
      ц: 'ts',
      Х: 'Kh',
      х: 'kh',
      Щ: 'Shch',
      щ: 'shch',
      Г: 'H',
      г: 'h',
    },
    vi: {
      Đ: 'D',
      đ: 'd',
    },
    da: {
      Ø: 'OE',
      ø: 'oe',
      Å: 'AA',
      å: 'aa',
      '%': 'procent',
      '&': 'og',
      '|': 'eller',
      $: 'dollar',
      '<': 'mindre end',
      '>': 'større end',
    },
    nb: {
      '&': 'og',
      Å: 'AA',
      Æ: 'AE',
      Ø: 'OE',
      å: 'aa',
      æ: 'ae',
      ø: 'oe',
    },
    it: {
      '&': 'e',
    },
    nl: {
      '&': 'en',
    },
    sv: {
      '&': 'och',
      Å: 'AA',
      Ä: 'AE',
      Ö: 'OE',
      å: 'aa',
      ä: 'ae',
      ö: 'oe',
    },
  },
};

/**
 * Converts a string into a URL-friendly slug.
 *
 * Transliterates accented and non-ASCII characters to ASCII, replaces spaces
 * with a separator, and optionally lowercases and strictly strips the result.
 * Characters absent from the mapping are passed through unchanged (and later
 * filtered by `remove`/`strict`). A locale may be provided to override specific
 * mappings.
 *
 * @param input - The string to slug.
 * @param options - Slug options. See {@link SlugOptions}.
 * @returns The slugified string. Empty input yields `''`.
 *
 * @example
 * ```ts
 * slug('Hello, World!');
 * // => 'hello-world!'
 *
 * slug('Hello, World!', { strict: true });
 * // => 'hello-world'
 *
 * slug('Olá, coração', { locale: 'pt' });
 * // => 'ola-coracao'
 * ```
 */
const builder: SlugBuilder = (config = DEFAULT_OPTIONS) => {
  const mapping: SlugMapping = DEFAULT_MAPPING;

  const transform = (input: string, options: TransformOptions): string => {
    const { charset, localeCharset, remove, separator } = options;

    let output = '';

    for (const char of input.normalize()) {
      let value = localeCharset?.[char] ?? charset[char] ?? char;

      if (value === separator) {
        value = ' ';
      }

      output += value;
    }

    return output.replace(remove, '');
  };

  const replace: Slug = (input, options) => {
    const {
      trim,
      lower,
      strict,
      remove,
      locale: localeKey,
      separator = '-',
    } = { ...DEFAULT_OPTIONS, ...config, ...options };

    if (!input) {
      return '';
    }

    const localeCharset = localeKey ? mapping.locales[localeKey] : undefined;

    let slug = transform(input, {
      charset: mapping.charset,
      localeCharset,
      remove,
      separator,
    });

    if (strict) {
      slug = slug.replace(/[^A-Za-z0-9\s]/g, '');
    }

    if (trim) {
      slug = slug.trim();
    }

    slug = slug.replace(/\s+/g, separator);

    if (lower) {
      slug = slug.toLowerCase();
    }

    return slug;
  };

  replace.create = builder;
  replace.extend = (charset) => {
    Object.assign(mapping.charset, charset);
  };

  return replace;
};

/**
 * Converts a string into a URL-friendly slug using the default configuration.
 *
 * @example
 * ```ts
 * slug('Hello, World!');
 * // => 'hello-world!'
 *
 * slug('Hello, World!', { lower: false, separator: '_' });
 * // => 'Hello_World!'
 * ```
 */
export const slug = builder(DEFAULT_OPTIONS);
