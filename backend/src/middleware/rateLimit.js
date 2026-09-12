import rateLimit from 'express-rate-limit';

// Standard rate limiter for public report creation (30 reports per 15 min window per IP)
export const reportsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many incident reports submitted from this IP address. Please wait 15 minutes.'
    }
  }
});

// Rate limiter for citizen case tracking (60 lookups per 15 min window per IP)
export const trackingRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Tracking rate limit exceeded. Please wait a few minutes before checking case status again.'
    }
  }
});

// Rate limiter for WhatsApp webhook requests (120 per 5 min window)
export const whatsappRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many incoming webhook requests.'
    }
  }
});
