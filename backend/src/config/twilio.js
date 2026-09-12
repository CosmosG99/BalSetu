import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

let twilioClient = null;

if (accountSid && authToken && accountSid.startsWith('AC')) {
  twilioClient = twilio(accountSid, authToken);
  console.log(`[RAKSHAK] Twilio WhatsApp client initialized for sender ${whatsappFrom}.`);
} else {
  console.log('[RAKSHAK] Twilio credentials not configured. WhatsApp messaging will use mock console logging in demo mode.');
  if (!accountSid) console.log('[RAKSHAK] Missing TWILIO_ACCOUNT_SID');
  if (!authToken) console.log('[RAKSHAK] Missing TWILIO_AUTH_TOKEN');
  if (!whatsappFrom) console.log('[RAKSHAK] Missing TWILIO_WHATSAPP_NUMBER');
}

/**
 * Send a WhatsApp message via Twilio or mock log
 * @param {string} to - Recipient number e.g. 'whatsapp:+919876543210'
 * @param {string} body - Message body
 */
export async function sendWhatsAppMessage(to, body) {
  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  if (twilioClient) {
    try {
      const message = await twilioClient.messages.create({
        from: whatsappFrom,
        to: formattedTo,
        body
      });
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('❌ Twilio WhatsApp send error:', error.message);
      return { success: false, error: error.message };
    }
  } else {
    console.log(`📱 [MOCK WHATSAPP OUTBOUND] To: ${formattedTo}\nMessage:\n${body}\n---------------------------`);
    return { success: true, messageId: `mock-msg-${Date.now()}` };
  }
}

export default twilioClient;
