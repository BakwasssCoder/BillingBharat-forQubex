// WhatsApp Cloud API integration utilities
const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0';
const WHATSAPP_API_VERSION = 'v17.0';

interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text' | 'document' | 'image' | 'template';
  text?: {
    body: string;
  };
  document?: {
    link: string;
    caption: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text?: string;
        document?: {
          link: string;
          filename: string;
        };
      }>;
    }>;
  };
}

export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string,
  accessToken: string,
  phoneNumberId: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: {
            body: message,
          },
        } as WhatsAppMessage),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('WhatsApp API error:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('WhatsApp message sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}

export async function sendInvoicePDF(
  phoneNumber: string,
  pdfUrl: string,
  customerName: string,
  totalAmount: number,
  accessToken: string,
  phoneNumberId: string
): Promise<boolean> {
  try {
    const message = `Hey 👋 ${customerName},
Here's your Qubex: BuyNDeliver™ order invoice.
Total: ${new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(totalAmount)} (Item + Delivery + Service Fee).
Download: ${pdfUrl}
— QuickBuy Boy Team 💛`;

    const response = await fetch(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: {
            body: message,
          },
        } as WhatsAppMessage),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('WhatsApp API error:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('Invoice sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending invoice:', error);
    return false;
  }
}