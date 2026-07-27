export const DEFAULT_OPTIONS = {
  TRUNCATED_STRING: {
    tags: true,
    strict: true,
    type: 'words',
    ellipsis: '...',
  },
} as const;

export const SELF_CLOSING_TAGS = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];
