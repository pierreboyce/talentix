import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events - Career Workshops & Webinars for UK Students | Talentix',
  description: 'Upcoming Talentix events including career workshops, webinars, and sessions for UK teenagers. Learn about job searching, interview prep, and getting your first job.',
  keywords: [
    'Talentix events',
    'career workshops UK',
    'teen career webinars',
    'student career events',
    'youth employment workshops',
    'career sessions UK',
    'teen job workshops',
    'career prep events UK'
  ],
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: 'Events - Career Workshops for UK Students | Talentix',
    description: 'Upcoming Talentix events including career workshops and webinars for UK teenagers preparing for their first job.',
    url: 'https://talentix.co.uk/events',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Events - Career workshops for UK students' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Events for UK Students | Talentix',
    description: 'Upcoming Talentix events including career workshops and webinars for UK teenagers.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

interface ScheduleItem {
  sector: string;
  emoji: string;
  dates: string;
}

interface EventItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  speakers: string[];
  learnings: string[];
  bonus?: string;
  registrationLink: string;
  logo?: string;
  secondaryLogo?: string;
  poster?: string;
  spotsAvailable?: number;
  type: string;
  format: string;
  soldOut?: boolean;
  dateLabel: string;
  eventDateTimeUtc: string;
  schedule?: ScheduleItem[];
  launchBadge?: string;
}

const events: EventItem[] = [
  {
    id: 'interview-series',
    title: 'Talentix Interview Series — Free Mock Interviews with Professionals',
    shortDescription:
      'Practise with a working professional in your chosen sector. Honest feedback, real confidence — completely free.',
    fullDescription:
      'Limited spaces per sector. Sign up for one or more — they fill fast.',
    speakers: [],
    learnings: [
      'Real mock interview with a working professional',
      'Genuine, personalised feedback on your performance',
      'Build confidence before the real thing',
      'Sector-specific interview practice',
    ],
    registrationLink: 'https://forms.gle/ysz72L7MWh6oR3xy8',
    poster: '/interview-series-poster.png',
    type: 'Interview Series',
    format: 'Online',
    soldOut: false,
    dateLabel: '13 May – 15 June',
    eventDateTimeUtc: '2026-06-15T23:59:59Z',
    launchBadge: 'Talentix Interview Series',
    schedule: [
      { sector: 'Law', emoji: '⚖️', dates: '13–15th May' },
      { sector: 'Finance', emoji: '💰', dates: '20–22nd May' },
      { sector: 'Tech', emoji: '💻', dates: '27–29th May' },
      { sector: 'Engineering', emoji: '⚙️', dates: '3–5th June' },
      { sector: 'Healthcare', emoji: '🏥', dates: '8–10th June' },
      { sector: 'Creative Industries', emoji: '🎨', dates: '11–12th June' },
      { sector: 'Business + Consulting', emoji: '📊', dates: '13–15th June' },
    ],
  },
  {
    id: 'interview-masterclass',
    title: 'Talentix Interview Masterclass',
    shortDescription:
      'One hour with industry professionals — the interview framework that actually works, plus live Q&A.',
    fullDescription:
      'The gateway event to the Interview Series. Everything you need before the real thing.',
    speakers: [],
    learnings: [
      'The interview framework successful applicants use',
      'How to turn interview nerves into confidence',
      'Live Q&A with industry professionals',
      'Explore career sectors: Law, Finance, Tech & more',
    ],
    registrationLink: 'https://luma.com/pyjh0o7a',
    poster: '/interview-masterclass-poster.png',
    type: 'Masterclass',
    format: 'Online',
    soldOut: false,
    dateLabel: '11th May, 6–7 PM',
    eventDateTimeUtc: '2026-05-11T19:00:00Z',
  },
  {
    id: 'rise-talentix-masterclass',
    title: 'RISE x Talentix Online Assessment and Interview Masterclass',
    shortDescription:
      'Learn exactly how to pass online assessments and stand out in interviews for competitive apprenticeships, university pathways, and early-career roles.',
    fullDescription:
      "Over 70% of applicants are eliminated at the online assessment stage, and many others fall at interview. Not because they are not smart enough, but because no one properly prepares them. Talentix is collaborating with RISE to host an Online Assessment and Interview Masterclass for students targeting competitive apprenticeships, part-time or full-time jobs, and universities that require interviews.",
    speakers: [
      'Slaughter and May (Lewis Laithwaite)',
      'Bloomberg (Queentela Ezeala)',
      'JLR (Tasnim Akhter)',
      'Barclays (Cenk Mustafa)',
      'Thames Water (Faris Kadeb)',
      'KPMG (Riza P.)',
    ],
    learnings: [
      'How to approach online assessments strategically',
      'How to stand out in video and in-person interviews',
      'What top firms are actually looking for',
      'The common mistakes that instantly weaken applications',
    ],
    bonus: 'You may get the opportunity to receive a mock interview from one of these apprentices.',
    registrationLink: 'https://luma.com/sa9qzyb0',
    logo: '/RISE x Talentix logo.png',
    poster: '/RISE X Talentix poster.png',
    spotsAvailable: 60,
    type: 'Masterclass',
    format: 'Online',
    soldOut: false,
    dateLabel: '15 March, 2:00 PM to 3:30 PM',
    eventDateTimeUtc: '2026-03-15T14:00:00Z',
  },
];

export default function EventsPage() {
  const now = new Date();

  const pastOrSoldOutEvents = events.filter((event) => {
    const eventHasPassed = now.getTime() >= new Date(event.eventDateTimeUtc).getTime();
    return eventHasPassed || Boolean(event.soldOut);
  });

  const currentEvents = events.filter((event) => {
    const eventHasPassed = now.getTime() >= new Date(event.eventDateTimeUtc).getTime();
    return !eventHasPassed && !event.soldOut;
  });

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .events-bg {
              background: radial-gradient(circle at 8% 15%, rgba(251, 191, 36, 0.2), transparent 36%),
                radial-gradient(circle at 92% 18%, rgba(236, 72, 153, 0.14), transparent 30%),
                linear-gradient(150deg, #fffbeb 0%, #ffffff 46%, #f5f3ff 100%);
            }

            .events-shell {
              border: 1px solid #fef3c7;
              border-radius: 28px;
              background: rgba(255, 255, 255, 0.9);
              box-shadow: 0 16px 40px rgba(124, 58, 237, 0.1);
              backdrop-filter: blur(2px);
            }

            .workshops-testimonial-card {
              background: rgba(255, 255, 255, 0.96);
              border: 1px solid #ede9fe;
              border-radius: 20px;
              padding: 1.25rem;
              box-shadow: 0 12px 26px rgba(124, 58, 237, 0.12);
              transition: transform 0.22s ease, box-shadow 0.22s ease;
              position: relative;
              overflow: hidden;
            }

            @media (min-width: 640px) {
              .workshops-testimonial-card {
                padding: 1.75rem;
                border-radius: 22px;
              }
            }

            @media (min-width: 768px) {
              .workshops-testimonial-card {
                padding: 2.5rem;
              }
            }

            @media (min-width: 1024px) {
              .workshops-testimonial-card {
                padding: 3rem 3.25rem;
              }
            }

            .workshops-testimonial-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 16px 34px rgba(124, 58, 237, 0.18);
            }

            .pill {
              border-radius: 999px;
              padding: 0.34rem 0.82rem;
              font-size: 0.78rem;
              line-height: 1;
              font-weight: 800;
              display: inline-flex;
              align-items: center;
              gap: 0.3rem;
              letter-spacing: 0.01em;
              box-shadow: 0 6px 12px rgba(17, 24, 39, 0.08);
              border: 1px solid transparent;
            }

            .pill-yellow { background: #fef3c7; color: #92400e; border-color: #fde68a; }
            .pill-purple { background: #ede9fe; color: #6d28d9; border-color: #ddd6fe; }
            .pill-pink { background: #fce7f3; color: #be185d; border-color: #fbcfe8; }
            .pill-blue { background: #dbeafe; color: #1d4ed8; border-color: #bfdbfe; }
            .pill-green { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
            .pill-gray { background: #f3f4f6; color: #374151; border-color: #e5e7eb; }
            .pill-red { background: #fee2e2; color: #b91c1c; border-color: #fecaca; }

            .workshops-dots {
              margin-top: 0.8rem;
              display: flex;
              gap: 0.5rem;
              align-items: center;
            }

            .workshops-dot {
              width: 10px;
              height: 10px;
              border-radius: 999px;
              border: none;
              background: #d1d5db;
              transition: all 0.2s ease;
              animation: floatDot 2.4s ease-in-out infinite;
            }

            .workshops-dot.is-active {
              width: 22px;
              background: #8b5cf6;
            }

            .workshops-dot.gold {
              background: #fbbf24;
            }

            .workshops-dot.pink {
              background: #f472b6;
            }

            @keyframes floatDot {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-2px); }
            }
          `,
        }}
      />

      <main className="events-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <section className="events-shell text-center mb-8 md:mb-10 px-5 py-8 md:px-10 md:py-10">
            <div className="flex justify-center">
              <Image
                src="/talentixeventslogo.png"
                alt="Talentix Events"
                width={700}
                height={120}
                className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] h-auto"
                priority
              />
            </div>
            <p className="mt-3 md:mt-4 text-gray-600 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
              Workshops, masterclasses, and sessions built to help you stand out in the working world
            </p>
            <div className="workshops-dots justify-center">
              <span className="workshops-dot is-active" />
              <span className="workshops-dot gold" />
              <span className="workshops-dot pink" />
            </div>
          </section>

          <section className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="pill pill-green">🚀 Current Events</span>
              <span className="pill pill-yellow">Open now</span>
              <span className="pill pill-purple">Limited spots</span>
            </div>

            {currentEvents.length === 0 ? (
              <div className="workshops-testimonial-card text-center border-dashed border-yellow-300">
                <div className="inline-flex flex-wrap gap-2 justify-center mb-3">
                  <span className="pill pill-yellow">No live events</span>
                  <span className="pill pill-pink">Coming soon</span>
                </div>
                <p className="text-xl font-black text-gray-900" style={{ fontFamily: "'Fredoka', 'Inter', sans-serif" }}>
                  There are no current events right now
                </p>
                <p className="mt-1 text-gray-600">Keep a look out for some coming soon ✨</p>
                <div className="workshops-dots justify-center">
                  <span className="workshops-dot is-active" />
                  <span className="workshops-dot" />
                  <span className="workshops-dot pink" />
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:gap-10">
                {currentEvents.map((event) => (
                  <article key={event.id} className="workshops-testimonial-card">
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-purple-100/60 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full bg-yellow-100/80 blur-xl pointer-events-none" />

                    {event.launchBadge ? (
                      <div className="inline-flex flex-wrap items-center gap-1.5 md:gap-2 mb-6 md:mb-8 px-3.5 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm" style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', color: '#1a1200', boxShadow: '0 4px 12px rgba(251,191,36,.4)', fontFamily: "var(--font-fredoka), 'Fredoka', 'Inter', sans-serif", fontWeight: 500 }}>
                        <span aria-hidden="true">🎉</span>
                        <strong style={{ fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          Launching Today
                        </strong>
                        <span>— {event.launchBadge}</span>
                      </div>
                    ) : null}

                    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 md:gap-8 lg:gap-12 items-start">
                      <div>
                        <div className="flex flex-wrap gap-2 md:gap-2.5 mb-5 md:mb-6">
                          <span className="pill pill-purple">🎓 {event.type}</span>
                          <span className="pill pill-blue">💻 {event.format}</span>
                          <span className="pill pill-green">✅ FREE</span>
                          {event.id !== 'interview-series' ? <span className="pill pill-yellow">📅 {event.dateLabel}</span> : null}
                          {event.id === 'interview-series' ? <span className="pill pill-red">⚠️ Limited Spaces</span> : null}
                        </div>

                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-4 md:mb-6 leading-tight" style={{ fontFamily: "'Fredoka', 'Inter', sans-serif" }}>
                          {event.title}
                        </h3>
                        <p className="text-gray-700 mb-4 md:mb-6 leading-relaxed md:leading-[1.8]">{event.shortDescription}</p>
                        <p className="text-sm text-gray-600 leading-relaxed md:leading-[1.8] mb-8 md:mb-10">{event.fullDescription}</p>

                        {event.schedule && event.schedule.length > 0 ? (
                          <div className="mb-8 md:mb-10">
                            <h4 className="text-lg md:text-xl font-black text-gray-900 mb-4 md:mb-5" style={{ fontFamily: "'Fredoka', 'Inter', sans-serif" }}>
                              Sector schedule
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                              {event.schedule.map((item) => (
                                <div key={item.sector} className="rounded-xl md:rounded-2xl border border-yellow-200 px-3 py-2.5 md:px-5 md:py-4" style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)' }}>
                                  <p style={{ fontFamily: "var(--font-fredoka), 'Inter', sans-serif", fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }} className="text-[0.7rem] md:text-[0.85rem]">{item.emoji} {item.sector}</p>
                                  <p style={{ fontFamily: "var(--font-fredoka), 'Inter', sans-serif", fontWeight: 700, color: '#111827', marginTop: '4px' }} className="text-[0.95rem] md:text-[1.05rem]">{item.dates}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {event.speakers.length > 0 ? (
                          <div className="mb-8 md:mb-10">
                            <h4 className="text-xl md:text-2xl font-black text-gray-900 mb-3 md:mb-4" style={{ fontFamily: "'Fredoka', 'Inter', sans-serif" }}>
                              Guest speakers
                            </h4>
                            <div className="flex flex-wrap gap-2 md:gap-2.5">
                              {event.speakers.map((speaker) => (
                                <span key={speaker} className="pill pill-gray">{speaker}</span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <div className="mb-6 md:mb-8">
                          <p className="font-black text-gray-900 mb-2.5 md:mb-3 text-base md:text-lg" style={{ fontFamily: "'Fredoka', 'Inter', sans-serif" }}>
                            What you will learn
                          </p>
                          <div className="flex flex-wrap gap-2 md:gap-2.5">
                            {event.learnings.map((learning) => (
                              <span key={learning} className="pill pill-pink">✨ {learning}</span>
                            ))}
                          </div>
                        </div>

                        {event.bonus ? <p className="pill pill-yellow mb-5 md:mb-6">🔥 Bonus: {event.bonus}</p> : null}

                        <div className="flex flex-wrap items-center gap-3 mt-1 md:mt-2">
                          <Link
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary-purple-small !rounded-full !px-6 !py-3 !font-black hover:scale-[1.03] transition-transform"
                            style={{ fontFamily: "'Fredoka', 'Inter', sans-serif" }}
                          >
                            {event.id === 'interview-series' ? 'Sign Up Now 🎯' : 'Register Now 🚀'}
                          </Link>
                          {event.spotsAvailable ? <span className="pill pill-yellow">⚠️ Only {event.spotsAvailable} spots</span> : null}
                        </div>

                        <div className="workshops-dots">
                          <span className="workshops-dot is-active" />
                          <span className="workshops-dot gold" />
                          <span className="workshops-dot pink" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 lg:sticky lg:top-6 self-start">
                        {event.logo ? (
                          <div className="flex justify-center">
                            <Image
                              src={event.logo}
                              alt={`${event.title} logo`}
                              width={400}
                              height={240}
                              className="w-full max-w-[180px] lg:max-w-[220px] h-auto"
                              priority
                            />
                          </div>
                        ) : null}
                        <div className="p-3 rounded-[22px] bg-gradient-to-br from-yellow-50 via-white to-purple-50 border border-yellow-100 shadow-md">
                          {event.poster ? (
                            <Image
                              src={event.poster}
                              alt={`${event.title} poster`}
                              width={500}
                              height={700}
                              className="w-full max-w-[320px] mx-auto h-auto rounded-2xl border border-yellow-100 shadow-lg"
                              priority
                            />
                          ) : (
                            <div className="text-gray-500 text-sm text-center py-12">Poster coming soon</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="pill pill-gray">🗂️ Past / Sold Out</span>
              <span className="pill pill-purple">Archive</span>
              <span className="pill pill-blue">Previous sessions</span>
            </div>

            {pastOrSoldOutEvents.length === 0 ? (
              <div className="workshops-testimonial-card">
                <p className="text-sm text-gray-600">No past or sold out events yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pastOrSoldOutEvents.map((event) => (
                  <article key={event.id} className="workshops-testimonial-card">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="pill pill-gray">Past / Sold Out</span>
                      <span className="pill pill-purple">{event.type}</span>
                      <span className="pill pill-blue">{event.format}</span>
                      <span className="pill pill-yellow">📅 {event.dateLabel}</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Fredoka', 'Inter', sans-serif" }}>
                      {event.title}
                    </h3>
                    <p className="mt-2 text-gray-600">{event.shortDescription}</p>
                    <div className="workshops-dots">
                      <span className="workshops-dot is-active" />
                      <span className="workshops-dot" />
                      <span className="workshops-dot gold" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}


