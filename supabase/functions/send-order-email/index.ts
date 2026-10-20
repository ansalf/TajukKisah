import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderWebhookPayload {
  type: "INSERT";
  table: "orders";
  record: {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_whatsapp: string;
    template_id: string;
    template_title: string;
    groom_name: string;
    bride_name: string;
    wedding_date: string;
    ceremony_venue?: string;
    reception_venue?: string;
    song_title?: string;
    song_artist?: string;
    song_reference_url?: string;
    special_requests?: string;
    created_at: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") || "atelier@tajukkisah.com";

    const payload: OrderWebhookPayload = await req.json();
    const order = payload.record;

    if (!order) {
      return new Response(JSON.stringify({ error: "Missing order record" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if email dispatch provider is configured
    if (!resendApiKey) {
      console.warn("TajukKisah: RESEND_API_KEY environment variable is not configured. Email logged to console.");
      console.info("Simulated Order Email Notification:", {
        to: adminEmail,
        orderId: order.id,
        customer: order.customer_name,
        template: order.template_title,
        music: `${order.song_title || "None"} (${order.song_artist || "N/A"})`,
      });
      return new Response(
        JSON.stringify({
          message: "Order processed. Email dispatch logged (RESEND_API_KEY not configured).",
          orderId: order.id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send order alert email via Resend API
    const emailHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2A151B; background-color: #FAF6EE; padding: 32px; border: 1px solid #C7A66A;">
        <h2 style="color: #651F32; text-transform: uppercase; letter-spacing: 0.15em; font-size: 20px; text-align: center;">TajukKisah Atelier</h2>
        <h3 style="text-align: center; font-style: italic; margin-bottom: 24px;">New Wedding Invitation Commission Request</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid rgba(101,31,50,0.1);"><td style="padding: 8px 0; font-weight: bold;">Client Name:</td><td>${order.customer_name}</td></tr>
          <tr style="border-bottom: 1px solid rgba(101,31,50,0.1);"><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${order.customer_email}</td></tr>
          <tr style="border-bottom: 1px solid rgba(101,31,50,0.1);"><td style="padding: 8px 0; font-weight: bold;">WhatsApp:</td><td><a href="https://wa.me/${order.customer_whatsapp.replace(/[^0-9]/g, '')}">${order.customer_whatsapp}</a></td></tr>
          <tr style="border-bottom: 1px solid rgba(101,31,50,0.1);"><td style="padding: 8px 0; font-weight: bold;">Chosen Theme:</td><td>${order.template_title} (${order.template_id})</td></tr>
          <tr style="border-bottom: 1px solid rgba(101,31,50,0.1);"><td style="padding: 8px 0; font-weight: bold;">Bride & Groom:</td><td>${order.groom_name} & ${order.bride_name}</td></tr>
          <tr style="border-bottom: 1px solid rgba(101,31,50,0.1);"><td style="padding: 8px 0; font-weight: bold;">Wedding Date:</td><td>${order.wedding_date}</td></tr>
          <tr style="border-bottom: 1px solid rgba(101,31,50,0.1);"><td style="padding: 8px 0; font-weight: bold;">Ceremony Venue:</td><td>${order.ceremony_venue || '-'}</td></tr>
          <tr style="border-bottom: 1px solid rgba(101,31,50,0.1);"><td style="padding: 8px 0; font-weight: bold;">Reception Venue:</td><td>${order.reception_venue || '-'}</td></tr>
          <tr style="border-bottom: 1px solid rgba(101,31,50,0.1);"><td style="padding: 8px 0; font-weight: bold;">Requested Music:</td><td>${order.song_title ? `${order.song_title} — ${order.song_artist || ''}` : 'Atelier Curated'}</td></tr>
          ${order.song_reference_url ? `<tr style="border-bottom: 1px solid rgba(101,31,50,0.1);"><td style="padding: 8px 0; font-weight: bold;">Music Reference:</td><td><a href="${order.song_reference_url}">${order.song_reference_url}</a></td></tr>` : ''}
          <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Notes / Requests:</td><td>${order.special_requests || 'None'}</td></tr>
        </table>

        <div style="text-align: center; margin-top: 32px;">
          <a href="https://wa.me/${order.customer_whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(order.customer_name)},%20we%20have%20received%20your%20TajukKisah%20invitation%20order!" style="background-color: #651F32; color: #FFFFFF; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 2px;">
            Follow Up via WhatsApp
          </a>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "TajukKisah Atelier <orders@tajukkisah.com>",
        to: [adminEmail],
        subject: `[New Order] ${order.groom_name} & ${order.bride_name} — ${order.template_title}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: res.ok ? 200 : 400,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
