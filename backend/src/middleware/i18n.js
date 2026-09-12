import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load locale files
const locales = {
  en: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/en.json'), 'utf8')),
  hi: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/hi.json'), 'utf8')),
  mr: JSON.parse(fs.readFileSync(path.join(__dirname, '../locales/mr.json'), 'utf8'))
};

/**
 * Retrieve translation string for a dot-separated key (e.g. 'whatsapp.welcome')
 * Replaces placeholders like {caseId} with corresponding values in params object.
 */
export function translate(key, params = {}, lang = 'en') {
  const selectedLang = ['en', 'hi', 'mr'].includes(lang) ? lang : 'en';
  const parts = key.split('.');
  let current = locales[selectedLang];

  for (const part of parts) {
    if (current && current[part] !== undefined) {
      current = current[part];
    } else {
      // Fallback to English
      current = null;
      break;
    }
  }

  if (typeof current !== 'string') {
    let fallback = locales.en;
    for (const part of parts) {
      if (fallback && fallback[part] !== undefined) {
        fallback = fallback[part];
      } else {
        return key;
      }
    }
    current = typeof fallback === 'string' ? fallback : key;
  }

  // Parameter replacement
  let result = current;
  for (const [k, v] of Object.entries(params)) {
    result = result.replaceAll(`{${k}}`, String(v));
  }

  return result;
}

/**
 * Express middleware to extract language and attach translation helper
 */
export function i18nMiddleware(req, res, next) {
  let lang = 'en';

  if (req.query && req.query.lang && ['en', 'hi', 'mr'].includes(req.query.lang)) {
    lang = req.query.lang;
  } else if (req.headers['accept-language']) {
    const acceptHeader = req.headers['accept-language'].toLowerCase();
    if (acceptHeader.includes('mr')) {
      lang = 'mr';
    } else if (acceptHeader.includes('hi')) {
      lang = 'hi';
    }
  }

  req.lang = lang;
  req.t = (key, params = {}) => translate(key, params, req.lang);

  next();
}
