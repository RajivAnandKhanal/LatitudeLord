// Word arrays consumed by wordFilter.service.js to auto-reject anonymous
// feedback containing profanity (see initial_system_design: "all messages
// that contain bad nepali and english words are not sent and automatically
// rejected"). Not exhaustive — extend either array as needed; no code
// changes required elsewhere since wordFilter.service.js just merges them.

const ENGLISH_BAD_WORDS = [
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'bastard',
  'dick',
  'piss',
  'cunt',
  'slut',
  'whore',
  'motherfucker',
  'dumbass',
  'jackass',
  'crap',
];

const NEPALI_BAD_WORDS = ['साले', 'कमिना', 'कुकुर'];

module.exports = { ENGLISH_BAD_WORDS, NEPALI_BAD_WORDS };
