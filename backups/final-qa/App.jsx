import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Menu,
  Sparkles,
  Star,
  X,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Signature Nails",
    text: "Sculpted sets, polished finishes and nail art created around your mood.",
    className: "large",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
  },
  {
    number: "02",
    title: "Lash Sets",
    text: "Classic, hybrid and volume sets tailored to your eyes.",
    className: "small",
    image:
      "https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=1000&q=78",
  },
  {
    number: "03",
    title: "Nail Art",
    text: "Chrome, aura, gems, French details and statement designs.",
    className: "small",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1000&q=78",
  },
  {
    number: "04",
    title: "Refill + Care",
    text: "Maintenance and beauty rituals that keep every set looking fresh.",
    className: "wide",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
  },
];

const gallery = [
  {
    title: "Purple French",
    category: "NAIL ART",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=78",
  },
  {
    title: "Soft Detail",
    category: "SIGNATURE SET",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1200&q=78",
  },
  {
    title: "After Dark",
    category: "EDITORIAL",
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=78",
  },
];

function ServiceCard({ service }) {
  const card = useRef();

  function move(e) {
    if (window.innerWidth < 900) return;

    const rect = card.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card.current, {
      rotateY: x * 8,
      rotateX: -y * 8,
      transformPerspective: 900,
      duration: 0.4,
      ease: "power2.out",
    });
  }

  function leave() {
    gsap.to(card.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  }

  return (
    <article
      ref={card}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`service-card service-card-visual ${service.className}`}
    >
      <img
        className="service-card-image"
        src={service.image}
        alt={service.title}
        loading="lazy"
        decoding="async"
      />

      <div className="service-card-overlay"></div>
      <div className="service-card-glow"></div>

      <div className="service-top">
        <span>{service.number}</span>
        <ArrowUpRight />
      </div>

      <div className="service-bottom">
        <span className="service-view">VIEW SERVICE</span>
        <h3>{service.title}</h3>
        <p>{service.text}</p>
      </div>
    </article>
  );
}

function App() {
  const cursor = useRef();
  const cursorText = useRef();
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const onMouseMove = (event) => {
      if (!cursor.current) return;

      gsap.to(cursor.current, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    const context = gsap.context(() => {
      gsap.from(".nav", {
        y: -30,
        opacity: 0,
        duration: 1,
        delay: 0.1,
      });

      gsap.from(".hero-kicker", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2,
      });

      gsap.from(".hero-line span", {
        yPercent: 110,
        stagger: 0.1,
        duration: 1.15,
        ease: "power4.out",
        delay: 0.3,
      });

      gsap.from(".hero-description", {
        y: 25,
        opacity: 0,
        duration: 0.9,
        delay: 0.85,
      });

      gsap.from(".hero-cta", {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay: 1,
        ease: "back.out(1.5)",
      });

      gsap.from(".hero-image-shell", {
        x: 80,
        opacity: 0,
        scale: 0.94,
        duration: 1.2,
        delay: 0.45,
        ease: "power3.out",
      });

      gsap.to(".hero-visual", {
        yPercent: 14,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.from(element, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
          },
        });
      });

      gsap.utils.toArray(".gallery-card").forEach((card, index) => {
        gsap.from(card, {
          y: 130,
          opacity: 0,
          rotate: index % 2 ? 3 : -3,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
          },
        });
      });
    });

    return () => {
      context.revert();
      lenis.destroy();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeImage !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImage]);

  function cursorMode(text) {
    if (!cursor.current || !cursorText.current) return;

    cursorText.current.innerText = text;

    gsap.to(cursor.current, {
      width: 92,
      height: 92,
      backgroundColor: "#8b5cf6",
      duration: 0.3,
    });
  }

  function cursorReset() {
    if (!cursor.current) return;

    gsap.to(cursor.current, {
      width: 14,
      height: 14,
      backgroundColor: "#d8b4fe",
      duration: 0.3,
    });

    if (cursorText.current) {
      cursorText.current.innerText = "";
    }
  }

  function openGallery(index) {
    setActiveImage(index);
  }

  function closeGallery() {
    setActiveImage(null);
  }

  function nextImage() {
    setActiveImage((current) => (current + 1) % gallery.length);
  }

  function previousImage() {
    setActiveImage(
      (current) => (current - 1 + gallery.length) % gallery.length
    );
  }

  function magneticMove(e) {
    if (window.innerWidth < 900) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * 0.22,
      y: y * 0.22,
      duration: 0.25,
      ease: "power2.out",
    });
  }

  function magneticLeave(e) {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: "elastic.out(1, 0.45)",
    });
  }

  return (
    <main>
      <div className="noise" />

      <div ref={cursor} className="cursor">
        <span ref={cursorText}></span>
      </div>

      <nav className="nav">
        <a className="logo" href="#">
          PURPLE<span>MUSE</span>
        </a>

        <div className="nav-center">
          <a href="#services">Services</a>
          <a href="#work">Lookbook</a>
          <a href="#about">About</a>
        </div>

        <a className="nav-book" href="#booking">
          Book appointment
          <ArrowUpRight size={15} />
        </a>

        <button className="menu">
          <Menu />
        </button>
      </nav>

      <section className="hero">
        <div className="hero-gradient gradient-one"></div>
        <div className="hero-gradient gradient-two"></div>

        <div className="hero-content">
          <div className="hero-kicker">
            <Sparkles size={14} />
            NAILS · LASHES · BEAUTY
          </div>

          <h1>
            <span className="hero-line">
              <span>BEAUTY</span>
            </span>

            <span className="hero-line outline">
              <span>WITHOUT</span>
            </span>

            <span className="hero-line">
              <span>LIMITS.</span>
            </span>
          </h1>

          <div className="hero-bottom">
            <p className="hero-description">
              Statement nails. Precision lashes. An appointment designed to
              feel as good as the final look.
            </p>

            <a
              href="#booking"
              className="hero-cta"
              onMouseEnter={() => cursorMode("BOOK")}
              onMouseLeave={cursorReset}
            >
              <span>
                BOOK
                <br />
                YOUR LOOK
              </span>

              <ArrowUpRight />
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-shell">
            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury beauty editorial"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="hero-image-overlay"></div>
            <div className="hero-image-glow"></div>
          </div>
        </div>

        <div className="floating-label label-one">PURPLE ENERGY</div>
        <div className="floating-label label-two">EST. 2026</div>

        <div className="hero-number">001</div>

        <div className="scroll-text">
          SCROLL
          <span></span>
          DISCOVER
        </div>
      </section>

      <section className="manifesto">
        <span className="section-number reveal">02 / MANIFESTO</span>

        <div className="manifesto-copy reveal">
          <div>NOT JUST</div>
          <div className="right purple">AN APPOINTMENT.</div>
          <div>A WHOLE</div>
          <div className="right italic">MOOD.</div>
        </div>

        <div className="manifesto-decoration" aria-hidden="true">
          <div className="manifesto-monogram">PM</div>

          <div className="manifesto-orbit manifesto-orbit-one"></div>
          <div className="manifesto-orbit manifesto-orbit-two"></div>

          <span className="manifesto-star manifesto-star-one">✦</span>
          <span className="manifesto-star manifesto-star-two">✧</span>
          <span className="manifesto-star manifesto-star-three">✦</span>

          <div className="manifesto-vertical">
            NAILS / LASHES / BEAUTY
          </div>

          <div className="manifesto-note manifesto-note-one">
            <span>01</span>
            <p>
              DETAIL IS
              <br />
              THE DIFFERENCE.
            </p>
          </div>

          <div className="manifesto-note manifesto-note-two">
            <span>02</span>
            <p>
              MADE TO
              <br />
              FEEL LIKE YOU.
            </p>
          </div>

          <div className="manifesto-note manifesto-note-three">
            <span>03</span>
            <p>
              BEAUTY WITH
              <br />
              INTENTION.
            </p>
          </div>
        </div>

        <p className="manifesto-small reveal">
          Beauty is personal. Every appointment starts with your energy and
          ends with something that feels unmistakably yours.
        </p>
      </section>

      <section id="services" className="services">
        <header className="section-header reveal">
          <div>
            <span className="mini-title">WHAT WE DO</span>

            <h2>
              BEAUTY,
              <br />
              <em>CURATED.</em>
            </h2>
          </div>

          <p>
            From minimal detail to maximalist sets, every service is treated
            like its own creative direction.
          </p>
        </header>

        <div className="service-grid">
          {services.map((service) => (
            <ServiceCard key={service.number} service={service} />
          ))}
        </div>
      </section>

      <section id="work" className="work">
        <header className="work-heading reveal">
          <span className="mini-title">SELECTED WORK</span>

          <h2>
            THE <em>LOOKBOOK.</em>
          </h2>
        </header>

        <div className="gallery">
          {gallery.map((item, index) => (
            <article
              key={item.title}
              className={`gallery-card gallery-${index + 1}`}
              onMouseEnter={() => cursorMode("VIEW")}
              onMouseLeave={cursorReset}
              onClick={() => openGallery(index)}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
              />

              <div className="gallery-shade"></div>

              <div className="gallery-info">
                <div>
                  <span>
                    0{index + 1} / {item.category}
                  </span>
                  <h3>{item.title}</h3>
                </div>

                <ArrowUpRight />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="about about-editorial">
        <div className="marquee">
          <div>
            NAILS ✦ LASHES ✦ BEAUTY ✦ PURPLE ENERGY ✦ NAILS ✦ LASHES ✦ BEAUTY
            ✦ PURPLE ENERGY ✦
          </div>
        </div>

        <div className="about-editorial-grid">
          <div className="about-editorial-copy reveal">
            <span className="mini-title">03 / THE ARTIST</span>

            <h2>
              BEAUTY
              <br />
              <em>WITH INTENTION.</em>
            </h2>

            <p>
              Every appointment is built around detail, personality and the
              kind of confidence you carry after you leave the chair.
            </p>

            <a href="#">
              DISCOVER THE STORY
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="about-editorial-visual reveal">
            <div className="about-image-frame">
              <img
                src="https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=80"
                alt="Beauty artist editorial portrait"
                loading="lazy"
                decoding="async"
              />

              <div className="about-image-overlay"></div>

              <div className="about-image-caption">
                <span>THE ARTIST</span>
                <strong>BEAUTY AS SELF-EXPRESSION</strong>
              </div>
            </div>

            <div className="about-floating-card">
              <span>01</span>
              <p>
                Precision.
                <br />
                Detail.
                <br />
                Personality.
              </p>
            </div>

            <div className="about-script">Purple Muse</div>
          </div>
        </div>
      </section>

      <section className="editorial-bridge">
        <div className="editorial-watermark">PURPLE MUSE</div>

        <div className="editorial-track">
          <div className="editorial-chip editorial-chip-one">
            <span>01</span>
            <strong>NAILS</strong>
            <small>SCULPTED WITH INTENTION</small>
          </div>

          <div className="editorial-chip editorial-chip-two">
            <span>02</span>
            <strong>LASHES</strong>
            <small>SOFT · HYBRID · VOLUME</small>
          </div>

          <div className="editorial-chip editorial-chip-three">
            <span>03</span>
            <strong>DETAIL</strong>
            <small>BEAUTY IN EVERY FINISH</small>
          </div>
        </div>

        <div className="editorial-marquee">
          <div>
            NAILS ✦ LASHES ✦ BEAUTY ✦ DETAIL ✦ SELF-EXPRESSION ✦ NAILS ✦ LASHES ✦ BEAUTY ✦ DETAIL ✦ SELF-EXPRESSION ✦
          </div>
        </div>
      </section>

      <section className="testimonial">
        <div className="stars reveal">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={17} fill="currentColor" />
          ))}
        </div>

        <blockquote className="reveal">
          “She understood the assignment before I even finished explaining it.”
        </blockquote>

        <p className="reveal">CLIENT LOVE / 001</p>
      </section>

      <section id="booking" className="booking booking-force">
        <div className="booking-force-bg"></div>

        <img
          className="booking-force-img booking-force-img-main"
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
          alt="Beauty editorial"
          loading="lazy"
          decoding="async"
        />

        <img
          className="booking-force-img booking-force-img-nails"
          src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1000&q=78"
          alt="Nail art"
          loading="lazy"
          decoding="async"
        />

        <img
          className="booking-force-img booking-force-img-detail"
          src="https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1000&q=78"
          alt="Beauty detail"
          loading="lazy"
          decoding="async"
        />

        <div className="booking-force-overlay"></div>

        <div className="booking-force-content">
          <span className="mini-title reveal">YOUR NEXT LOOK</span>

          <h2 className="reveal">
            LET'S MAKE
            <br />
            <em>A STATEMENT.</em>
          </h2>

          <p className="booking-force-copy reveal">
            From everyday elegance to full glam, your next look is one
            appointment away.
          </p>

          <a
            className="booking-circle reveal"
            href="#"
            onMouseEnter={() => cursorMode("BOOK")}
            onMouseLeave={cursorReset}
          >
            BOOK
            <br />
            NOW
            <ArrowUpRight />
          </a>
        </div>

        <div className="booking-force-features reveal">
          <div>
            <span>✦</span>
            <strong>Premium Services</strong>
            <small>Nails · Lashes · Beauty</small>
          </div>

          <div>
            <span>♡</span>
            <strong>Personalised</strong>
            <small>Tailored to you</small>
          </div>

          <div>
            <span>◇</span>
            <strong>Confidence</strong>
            <small>Beyond the chair</small>
          </div>
        </div>
      </section>


      <footer className="footer-rich">
        <div className="footer-watermark">PURPLE MUSE</div>

        <div className="footer-top">
          <div>
            <div className="footer-logo">
              PURPLE
              <br />
              MUSE.
            </div>

            <p className="footer-statement">
              Nails, lashes and beauty designed to feel unmistakably yours.
            </p>
          </div>

          <div className="footer-socials">
            <span className="footer-social-label">FOLLOW THE MUSE</span>

            <a href="#" className="footer-social-link">
              <span className="social-icon social-instagram" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                  <circle cx="12" cy="12" r="4"></circle>
                  <circle cx="17.5" cy="6.5" r="1"></circle>
                </svg>
              </span>
              <span>INSTAGRAM</span>
              <span className="social-arrow">↗</span>
            </a>

            <a href="#" className="footer-social-link">
              <span className="social-icon social-tiktok" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M14 4v10.2a4.2 4.2 0 1 1-3.3-4.1"></path>
                  <path d="M14 4c.9 2.1 2.5 3.5 5 3.9"></path>
                </svg>
              </span>
              <span>TIKTOK</span>
              <span className="social-arrow">↗</span>
            </a>

            <a href="#" className="footer-social-link">
              <span className="social-icon social-whatsapp" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M20 11.7a8 8 0 0 1-11.8 7l-4.2 1.1 1.1-4.1A8 8 0 1 1 20 11.7Z"></path>
                  <path d="M8.7 8.4c.5 2 2.1 3.7 4.2 4.7"></path>
                  <path d="M13.2 13.1c.7.3 1.4.2 1.9-.3"></path>
                </svg>
              </span>
              <span>WHATSAPP</span>
              <span className="social-arrow">↗</span>
            </a>
          </div>
        </div>

        <div className="footer-badges">
          <div className="footer-badge">
            <span>01</span>
            <strong>NAILS</strong>
            <small>SCULPTED WITH INTENTION</small>
          </div>

          <div className="footer-badge">
            <span>02</span>
            <strong>LASHES</strong>
            <small>SOFT · HYBRID · VOLUME</small>
          </div>

          <div className="footer-badge">
            <span>03</span>
            <strong>BEAUTY</strong>
            <small>CONFIDENCE IN EVERY DETAIL</small>
          </div>
        </div>

        <div className="footer-orbit footer-orbit-one"></div>
        <div className="footer-orbit footer-orbit-two"></div>

        <span className="footer-star footer-star-one">✦</span>
        <span className="footer-star footer-star-two">✧</span>

        <div className="copyright">
          © 2026 PURPLE MUSE BEAUTY
          <span>NAILS · LASHES · BEAUTY</span>
        </div>
      </footer>

      {activeImage !== null && (
        <div className="lightbox">
          <button
            className="lightbox-close"
            onClick={closeGallery}
            onMouseEnter={() => cursorMode("CLOSE")}
            onMouseLeave={cursorReset}
            onMouseMove={magneticMove}
          >
            <X />
          </button>

          <button
            className="lightbox-arrow lightbox-left"
            onClick={previousImage}
            onMouseEnter={() => cursorMode("PREV")}
            onMouseLeave={(e) => {
              cursorReset();
              magneticLeave(e);
            }}
            onMouseMove={magneticMove}
          >
            <ArrowLeft />
          </button>

          <div
            className="lightbox-stage"
            onMouseEnter={() => cursorMode("DRAG")}
            onMouseLeave={cursorReset}
          >
            <img
              key={activeImage}
              src={gallery[activeImage].image}
              alt={gallery[activeImage].title}
              decoding="async"
            />

            <div className="lightbox-caption">
              <span>
                0{activeImage + 1} / {gallery[activeImage].category}
              </span>
              <h3>{gallery[activeImage].title}</h3>
            </div>
          </div>

          <button
            className="lightbox-arrow lightbox-right"
            onClick={nextImage}
            onMouseEnter={() => cursorMode("NEXT")}
            onMouseLeave={(e) => {
              cursorReset();
              magneticLeave(e);
            }}
            onMouseMove={magneticMove}
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
