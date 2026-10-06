import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    id: "signature-nails",
    name: "Signature Nails",
    category: "NAILS",
    description: "Sculpted sets and polished finishes tailored to your look.",
  },
  {
    id: "nail-art",
    name: "Nail Art",
    category: "NAILS",
    description: "Chrome, aura, French, gems and custom statement designs.",
  },
  {
    id: "classic-lashes",
    name: "Classic Lashes",
    category: "LASHES",
    description: "Clean, natural definition for an effortless finish.",
  },
  {
    id: "hybrid-lashes",
    name: "Hybrid Lashes",
    category: "LASHES",
    description: "A balanced mix of classic definition and volume.",
  },
  {
    id: "volume-lashes",
    name: "Volume Lashes",
    category: "LASHES",
    description: "Fuller, softer and more dramatic lash styling.",
  },
  {
    id: "refill-care",
    name: "Refill + Care",
    category: "MAINTENANCE",
    description: "Maintenance, refill and removal appointments.",
  },
];

const times = [
  "9:00 AM",
  "10:30 AM",
  "12:00 PM",
  "1:30 PM",
  "3:00 PM",
  "4:30 PM",
  "6:00 PM",
];

function Booking() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    service: "",
    date: "",
    time: "",
    fullName: "",
    phone: "",
    email: "",
    instagram: "",
    notes: "",
    consent: false,
  });

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.service),
    [form.service]
  );

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const canContinue = () => {
    if (step === 1) return Boolean(form.service);
    if (step === 2) return Boolean(form.date && form.time);

    if (step === 3) {
      return Boolean(
        form.fullName.trim() &&
          form.phone.trim() &&
          form.email.trim()
      );
    }

    return true;
  };

  const next = () => {
    if (!canContinue()) return;
    setStep((current) => Math.min(current + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((current) => Math.max(current - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.consent || submitting) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "We couldn't send your booking request."
        );
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="booking-page booking-success-page">
        <div className="booking-page-noise" />

        <Link to="/" className="booking-back-home">
          <ArrowLeft size={16} />
          PURPLE MUSE
        </Link>

        <section className="booking-success">
          <div className="success-icon">
            <Check size={34} />
          </div>

          <span className="booking-kicker">
            APPOINTMENT REQUEST RECEIVED
          </span>

          <h1>
            YOU'RE ON
            <br />
            <em>THE LIST.</em>
          </h1>

          <p>
            Thank you, {form.fullName}. Your appointment request has been
            received and saved. Purple Muse will contact you to confirm
            availability and finalise your appointment.
          </p>

          <div className="success-summary">
            <div>
              <span>SERVICE</span>
              <strong>{selectedService?.name}</strong>
            </div>

            <div>
              <span>DATE</span>
              <strong>{form.date}</strong>
            </div>

            <div>
              <span>TIME</span>
              <strong>{form.time}</strong>
            </div>
          </div>

          <Link to="/" className="success-home-button">
            BACK TO PURPLE MUSE
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <div className="booking-page-noise" />

      <header className="booking-page-nav">
        <Link to="/" className="booking-back-home">
          <ArrowLeft size={16} />
          PURPLE <span>MUSE</span>
        </Link>

        <span>BOOK YOUR LOOK</span>

        <div className="booking-step-count">
          0{step} / 04
        </div>
      </header>

      <section className="booking-page-layout">
        <aside className="booking-page-visual">
          <div className="booking-page-image booking-page-image-editorial">
            <img
              className="booking-nail-model"
              src="https://images.pexels.com/photos/31259735/pexels-photo-31259735.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Model displaying long manicured nails"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              sizes="(max-width: 900px) 100vw, 42vw"
            />

            <div className="booking-page-image-overlay" />

            <div className="booking-page-image-copy">
              <Sparkles size={16} />

              <p>
                YOUR BEAUTY.
                <br />
                YOUR ENERGY.
                <br />
                YOUR LOOK.
              </p>
            </div>
          </div>

          <div className="booking-progress">
            {[1, 2, 3, 4].map((number) => (
              <div
                key={number}
                className={`booking-progress-item ${
                  step >= number ? "active" : ""
                }`}
              >
                <span>0{number}</span>

                <div className="booking-progress-line" />

                <small>
                  {number === 1 && "SERVICE"}
                  {number === 2 && "DATE + TIME"}
                  {number === 3 && "YOUR DETAILS"}
                  {number === 4 && "CONFIRM"}
                </small>
              </div>
            ))}
          </div>
        </aside>

        <form className="booking-form-panel" onSubmit={submit}>
          {step === 1 && (
            <div className="booking-step booking-step-services">
              <span className="booking-kicker">01 / CHOOSE YOUR SERVICE</span>

              <h1>
                WHAT ARE WE
                <br />
                <em>CREATING?</em>
              </h1>

              <p className="booking-step-intro">
                Choose the service you want. We can refine the exact style
                together before your appointment.
              </p>

              <div className="booking-service-grid">
                {services.map((service, index) => (
                  <button
                    type="button"
                    key={service.id}
                    className={`booking-service-option ${
                      form.service === service.id ? "selected" : ""
                    }`}
                    onClick={() => update("service", service.id)}
                  >
                    <span className="booking-service-number">
                      0{index + 1}
                    </span>

                    <div>
                      <small>{service.category}</small>
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                    </div>

                    <span className="booking-option-check">
                      <Check size={15} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="booking-step">
              <span className="booking-kicker">
                02 / DATE + TIME
              </span>

              <h1>
                WHEN SHOULD
                <br />
                <em>WE CREATE?</em>
              </h1>

              <p className="booking-step-intro">
                Choose your preferred appointment date and time. The artist
                will confirm final availability.
              </p>

              <div className="booking-field">
                <label>
                  <CalendarDays size={17} />
                  PREFERRED DATE
                </label>

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>

              <div className="booking-time-section">
                <label>
                  <Clock3 size={17} />
                  PREFERRED TIME
                </label>

                <div className="booking-time-grid">
                  {times.map((time) => (
                    <button
                      type="button"
                      key={time}
                      className={`booking-time ${
                        form.time === time ? "selected" : ""
                      }`}
                      onClick={() => update("time", time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="booking-step">
              <span className="booking-kicker">
                03 / YOUR DETAILS
              </span>

              <h1>
                TELL US
                <br />
                <em>ABOUT YOU.</em>
              </h1>

              <div className="booking-details-grid">
                <div className="booking-field">
                  <label>
                    <UserRound size={16} />
                    FULL NAME
                  </label>

                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.fullName}
                    onChange={(e) =>
                      update("fullName", e.target.value)
                    }
                  />
                </div>

                <div className="booking-field">
                  <label>
                    <Phone size={16} />
                    PHONE / WHATSAPP
                  </label>

                  <input
                    type="tel"
                    placeholder="+234..."
                    value={form.phone}
                    onChange={(e) =>
                      update("phone", e.target.value)
                    }
                  />
                </div>

                <div className="booking-field">
                  <label>
                    <Mail size={16} />
                    EMAIL
                  </label>

                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) =>
                      update("email", e.target.value)
                    }
                  />
                </div>

                <div className="booking-field">
                  <label>INSTAGRAM</label>

                  <input
                    type="text"
                    placeholder="@username (optional)"
                    value={form.instagram}
                    onChange={(e) =>
                      update("instagram", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="booking-field booking-notes">
                <label>NOTES / INSPIRATION</label>

                <textarea
                  placeholder="Tell us about the look you have in mind..."
                  value={form.notes}
                  onChange={(e) =>
                    update("notes", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="booking-step">
              <span className="booking-kicker">
                04 / CONFIRM REQUEST
              </span>

              <h1>
                ONE LAST
                <br />
                <em>LOOK.</em>
              </h1>

              <div className="booking-review">
                <div>
                  <span>SERVICE</span>
                  <strong>{selectedService?.name}</strong>
                </div>

                <div>
                  <span>DATE</span>
                  <strong>{form.date}</strong>
                </div>

                <div>
                  <span>TIME</span>
                  <strong>{form.time}</strong>
                </div>

                <div>
                  <span>NAME</span>
                  <strong>{form.fullName}</strong>
                </div>

                <div>
                  <span>PHONE</span>
                  <strong>{form.phone}</strong>
                </div>

                <div>
                  <span>EMAIL</span>
                  <strong>{form.email}</strong>
                </div>
              </div>

              {form.notes && (
                <div className="booking-review-notes">
                  <span>YOUR NOTES</span>
                  <p>{form.notes}</p>
                </div>
              )}

              <label className="booking-consent">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) =>
                    update("consent", e.target.checked)
                  }
                />

                <span className="booking-custom-checkbox">
                  <Check size={13} />
                </span>

                <p>
                  I understand this is an appointment request and my booking
                  is not confirmed until Purple Muse contacts me.
                </p>
              </label>
            </div>
          )}

          {submitError && (
            <div className="booking-submit-error" role="alert">
              {submitError}
            </div>
          )}

          <div className="booking-form-actions">
            {step > 1 ? (
              <button
                type="button"
                className="booking-secondary-button"
                onClick={back}
              >
                <ArrowLeft size={17} />
                BACK
              </button>
            ) : (
              <Link
                to="/"
                className="booking-secondary-button"
              >
                <ArrowLeft size={17} />
                BACK HOME
              </Link>
            )}

            {step < 4 ? (
              <button
                type="button"
                className="booking-primary-button"
                disabled={!canContinue()}
                onClick={next}
              >
                CONTINUE
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                type="submit"
                className="booking-primary-button"
                disabled={!form.consent || submitting}
              >
                {submitting ? "SENDING..." : "SEND REQUEST"}
                {!submitting && <ArrowRight size={17} />}
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}

export default Booking;
