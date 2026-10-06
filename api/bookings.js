const allowedServices = new Set([
  "signature-nails",
  "nail-art",
  "classic-lashes",
  "hybrid-lashes",
  "volume-lashes",
  "refill-care",
]);

const serviceNames = {
  "signature-nails": "Signature Nails",
  "nail-art": "Nail Art",
  "classic-lashes": "Classic Lashes",
  "hybrid-lashes": "Hybrid Lashes",
  "volume-lashes": "Volume Lashes",
  "refill-care": "Refill + Care",
};

function clean(value, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function escapeHtml(value) {
  return clean(value, 5000)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const {
      service,
      date,
      time,
      fullName,
      phone,
      email,
      instagram,
      notes,
      consent,
    } = req.body ?? {};

    const safeService = clean(service, 60);
    const safeDate = clean(date, 20);
    const safeTime = clean(time, 30);
    const safeName = clean(fullName, 120);
    const safePhone = clean(phone, 40);
    const safeEmail = clean(email, 180).toLowerCase();
    const safeInstagram = clean(instagram, 100);
    const safeNotes = clean(notes, 2000);

    if (!allowedServices.has(safeService)) {
      return res.status(400).json({ error: "Please select a valid service." });
    }

    if (!safeDate || !safeTime) {
      return res.status(400).json({ error: "Please select a date and time." });
    }

    if (!safeName || !safePhone || !safeEmail) {
      return res.status(400).json({
        error: "Name, phone number and email are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (consent !== true) {
      return res.status(400).json({
        error: "Booking consent is required.",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.BOOKING_NOTIFICATION_EMAIL;

    if (!supabaseUrl || !supabaseSecret) {
      console.error("Supabase environment variables are missing.");
      return res.status(500).json({
        error: "Booking storage is not configured.",
      });
    }

    const record = {
      service: safeService,
      service_name: serviceNames[safeService],
      preferred_date: safeDate,
      preferred_time: safeTime,
      full_name: safeName,
      phone: safePhone,
      email: safeEmail,
      instagram: safeInstagram || null,
      notes: safeNotes || null,
      status: "pending",
      email_status: "pending",
    };

    const insertResponse = await fetch(
      `${supabaseUrl}/rest/v1/booking_requests`,
      {
        method: "POST",
        headers: {
          apikey: supabaseSecret,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(record),
      }
    );

    if (!insertResponse.ok) {
      const body = await insertResponse.text();
      console.error("Supabase insert failed:", body);

      return res.status(500).json({
        error: "We couldn't save your booking request. Please try again.",
      });
    }

    const inserted = await insertResponse.json();
    const booking = inserted?.[0];

    let emailSent = false;

    if (resendKey && notificationEmail && booking?.id) {
      const fromEmail =
        process.env.RESEND_FROM_EMAIL ||
        "Purple Muse <onboarding@resend.dev>";

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `purple-muse-booking-${booking.id}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [notificationEmail],
          reply_to: safeEmail,
          subject: `New Purple Muse Booking — ${serviceNames[safeService]}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#211329">
              <div style="background:#6d28d9;padding:28px;color:white">
                <div style="font-size:12px;letter-spacing:2px;opacity:.75">
                  PURPLE MUSE
                </div>
                <h1 style="margin:12px 0 0;font-size:30px">
                  New Booking Request
                </h1>
              </div>

              <div style="padding:30px;border:1px solid #eee">
                <p><strong>Client:</strong> ${escapeHtml(safeName)}</p>
                <p><strong>Service:</strong> ${escapeHtml(serviceNames[safeService])}</p>
                <p><strong>Date:</strong> ${escapeHtml(safeDate)}</p>
                <p><strong>Time:</strong> ${escapeHtml(safeTime)}</p>
                <p><strong>Phone / WhatsApp:</strong> ${escapeHtml(safePhone)}</p>
                <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
                <p><strong>Instagram:</strong> ${
                  safeInstagram ? escapeHtml(safeInstagram) : "Not provided"
                }</p>

                <div style="margin-top:24px">
                  <strong>Notes / Inspiration</strong>
                  <p style="line-height:1.6;color:#555">
                    ${
                      safeNotes
                        ? escapeHtml(safeNotes).replaceAll("\n", "<br>")
                        : "No additional notes."
                    }
                  </p>
                </div>

                <div style="margin-top:28px;padding:16px;background:#f6f1ff">
                  Status: <strong>Pending confirmation</strong>
                </div>
              </div>
            </div>
          `,
        }),
      });

      emailSent = emailResponse.ok;

      if (!emailSent) {
        console.error(
          "Resend failed:",
          await emailResponse.text()
        );
      }

      await fetch(
        `${supabaseUrl}/rest/v1/booking_requests?id=eq.${booking.id}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseSecret,
            Authorization: `Bearer ${supabaseSecret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_status: emailSent ? "sent" : "failed",
          }),
        }
      );
    }

    return res.status(201).json({
      success: true,
      bookingId: booking?.id,
      emailSent,
    });
  } catch (error) {
    console.error("Booking API error:", error);

    return res.status(500).json({
      error: "Something went wrong while creating your booking request.",
    });
  }
}
