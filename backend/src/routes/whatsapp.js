import { Router } from 'express';
import { handleWhatsAppWebhook } from '../services/whatsapp.js';
import { whatsappRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

/**
 * POST /api/whatsapp/webhook (public, rate-limited)
 * Receives incoming WhatsApp messages from Twilio Sandbox / Production
 */
router.post('/webhook', whatsappRateLimiter, async (req, res) => {
  try {
    const result = await handleWhatsAppWebhook(req.body);

    // Return TwiML or standard response
    res.set('Content-Type', 'text/xml');
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${result.reply}</Message>
</Response>`;
    return res.status(200).send(twiml);
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return res.status(500).json({
      error: {
        code: 'WHATSAPP_WEBHOOK_ERROR',
        message: error.message || 'Webhook processing failed'
      }
    });
  }
});

export default router;
