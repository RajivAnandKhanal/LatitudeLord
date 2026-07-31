const { ENGLISH_BAD_WORDS, NEPALI_BAD_WORDS } = require('../utils/badWordList');

const ALL_BAD_WORDS = [...ENGLISH_BAD_WORDS, ...NEPALI_BAD_WORDS].map((w) => w.toLowerCase());

/**
 * Lowercases (Latin script only — Devanagari has no case) and strips
 * punctuation so simple evasion like "f.u.c.k" or "F**k" still normalizes
 * to something matchable. Keeps Devanagari (\u0900-\u097F), Latin
 * letters/digits, and whitespace only.
 */
const normalize = (text = '') =>
  text
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^a-z0-9\u0900-\u097F\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * True if the given text contains any word from the English or Nepali
 * bad-word lists (substring match on normalized text). Used to
 * auto-reject anonymous feedback submissions before they touch the DB.
 */
const containsBadWord = (text = '') => {
  const normalized = normalize(text);
  if (!normalized) return false;
  return ALL_BAD_WORDS.some((word) => normalized.includes(word));
};

module.exports = { containsBadWord, normalize };
