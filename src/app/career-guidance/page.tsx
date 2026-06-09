'use client';

import { useState, useEffect } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useAuth } from '../../contexts/AuthContext';
import PaywallGuard from '../../components/PaywallGuard';
import AuthGuard from '../../components/AuthGuard';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  emoji: string;
  tags: string[];
  publishDate: string;
  quiz: QuizQuestion[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The CV Mistake Almost Every Teenager Makes',
    excerpt: "Padding your CV with soft skills like \"good communicator\" and \"team player\" doesn't help you. It signals that you have nothing real to say.",
    content: `A CV is not a list of traits. It's a short argument that you're worth meeting. Most teenage CVs fail because they're built around self-description rather than evidence.

"Good communicator." "Works well independently and in a team." "Motivated and enthusiastic." These phrases appear on roughly 90% of all CVs sent in for entry-level roles. They convey nothing. Any hiring manager who reads them skips straight past.

The fix is simpler than most CV guides make it sound. For every bullet point, ask yourself: can I show this rather than say it? Instead of "responsible," write that you've been a prefect, a team captain, or that you regularly look after younger siblings. Instead of "good with people," mention that you volunteered at a community event and handled enquiries from members of the public.

Even small things count when you frame them properly. Helping run a school stall is customer service experience. Organising a revision group is coordination experience. Completing your Duke of Edinburgh award shows follow-through on a long commitment.

You've done more than you think. The problem is most teens either omit these things or bury them under vague descriptions.

Keep the CV to one page. Hiring managers for part-time roles spend about 20 seconds on each application. A two-page CV from someone with no work history reads as poor judgement.

Your email address is either professional or it isn't. "pizzalover2008@gmail.com" ends applications before they start. Set up a plain firstname.lastname address and use it for job hunting only.

One last thing: don't lie. Not even small lies about grades or responsibilities. Managers ask follow-up questions in interviews. If what you say doesn't match what you wrote, you won't get the job, and word travels fast in local hiring networks.`,
    category: 'CV & Applications',
    readTime: '3 min read',
    emoji: '📄',
    tags: ['CV', 'Applications', 'Tips'],
    publishDate: '2025-06-03',
    quiz: [
      {
        question: 'What do phrases like "good communicator" and "hard worker" signal to a hiring manager?',
        options: ['That you are confident and self-aware', 'That you have nothing specific to show — they get skipped', 'That you understand what employers want'],
        correctIndex: 1,
        explanation: 'These phrases appear on ~90% of CVs and are so common that hiring managers skip past them entirely.',
      },
      {
        question: 'Instead of writing "responsible" on your CV, what should you do?',
        options: ['Remove it and leave it out', 'Bold the word to draw attention', 'Show it with evidence — e.g. "prefect", "team captain", or caring for younger siblings'],
        correctIndex: 2,
        explanation: 'Evidence always beats self-description. Specific examples give hiring managers something real to remember you by.',
      },
      {
        question: 'How long should your CV be if you have no work history?',
        options: ['One page', 'Two pages — to show you\'re thorough', 'As long as needed to cover everything'],
        correctIndex: 0,
        explanation: 'Hiring managers spend ~20 seconds per application. A two-page CV from someone with no work experience signals poor judgement.',
      },
      {
        question: 'What is the one thing you should NEVER do on your CV?',
        options: ['Use a personal email address', 'Include hobbies', 'Lie — even about small details'],
        correctIndex: 2,
        explanation: 'Managers ask follow-up questions in interviews. If what you say doesn\'t match what you wrote, you won\'t get the job.',
      },
    ],
  },
  {
    id: 2,
    title: 'What Actually Happens in the First Five Minutes of a Job Interview',
    excerpt: "The questions haven't started yet and the interviewer has already formed an opinion. Here's what they're noticing.",
    content: `Job interviews don't start when the first question gets asked. They start when you walk through the door.

This isn't about mystical first impressions. It's about something more specific: hiring managers are watching to see how you behave when you think you're not being assessed yet. How you greet the receptionist. Whether you look at your phone while you wait. Whether you say thank you when someone brings you water. These things get noticed and mentioned.

By the time you sit down, the interviewer has already answered two questions in their head: does this person seem reasonably relaxed, and do they seem like someone I'd want to spend a shift with? Your answers to the formal questions are there to confirm or challenge that early read.

Nerves are expected and they don't hurt you. Interviewers for entry-level roles have interviewed hundreds of nervous teenagers. What they find off-putting isn't nerves — it's the behaviours nerves sometimes produce: very short answers, no eye contact, or the opposite problem, rambling to fill silence.

Short answers are the most common issue. When someone asks "tell me about yourself," most teens give a two-sentence answer and stop. The silence that follows feels excruciating and they assume they've failed. They haven't. They just need to say more.

A good answer to that question is about 90 seconds long. It covers who you are, what you're interested in, and why you're here. Practise saying it out loud before the interview — not to memorise it word for word, just to know you can fill the space comfortably.

Questions at the end of the interview matter more than most people think. "Do you have any questions for us?" is not a polite formality. It's a test of whether you've thought about the role.

Ask something specific: what does a typical shift look like, what would the first few weeks involve, what do they look for in someone they'd want to keep on long-term. Saying "no, I think you've covered everything" is a small miss that costs you credibility with almost no upside.`,
    category: 'Interviews',
    readTime: '3 min read',
    emoji: '🎭',
    tags: ['Interviews', 'Tips', 'First Impressions'],
    publishDate: '2025-05-27',
    quiz: [
      {
        question: 'When does a job interview actually begin?',
        options: ['When the first formal question is asked', 'When you sit down at the table', 'When you walk through the door'],
        correctIndex: 2,
        explanation: 'Hiring managers watch how you behave before the questions start — how you greet staff, whether you check your phone, how you carry yourself.',
      },
      {
        question: 'How long should a good answer to "tell me about yourself" be?',
        options: ['Around 90 seconds — covering who you are, your interests, and why you\'re here', 'One or two sentences — keep it short and snappy', 'As long as it takes to cover your full background'],
        correctIndex: 0,
        explanation: 'One or two sentences leaves uncomfortable silence and reads as unprepared. A 90-second answer fills the space naturally.',
      },
      {
        question: 'Do nerves hurt your chances in an entry-level interview?',
        options: ['Yes — confident candidates always win', 'No — nerves are expected. What matters is what they make you do', 'Yes — any visible nerves are a red flag'],
        correctIndex: 1,
        explanation: 'Interviewers for entry-level roles have seen hundreds of nervous teenagers. It\'s the knock-on behaviours — short answers, no eye contact — that cost you.',
      },
      {
        question: 'What does "do you have any questions for us?" actually test?',
        options: ['Whether you\'re polite', 'Whether you\'ve thought seriously about the role', 'How confident you are'],
        correctIndex: 1,
        explanation: 'Saying "no, you\'ve covered everything" costs you credibility with almost no upside. Ask something specific about the role or the team.',
      },
    ],
  },
  {
    id: 3,
    title: "Why You're Not Hearing Back From Job Applications (And the Specific Fix)",
    excerpt: 'Sending more applications rarely solves the problem. The issue is almost always one of three things, and each one has a fix.',
    content: `If you've sent out applications and heard nothing back, the instinct is to send more. That usually doesn't help. It just multiplies the same problem across more employers.

The actual issue is almost always one of three things.

The first is a CV that looks like everyone else's. If your CV opens with a personal statement full of soft-skill descriptions, you've already lost the reader's attention before they've seen anything useful. Cut the personal statement entirely or replace it with two sentences that name something specific: what you're good at, and what kind of role you're looking for. Then get to your experience and education fast.

The second is applying to roles where you're obviously not a fit for the listed requirements. Some job adverts ask for previous experience in the industry or specific certifications. If you don't have those, applying anyway is not always a waste of time, but you need to address the gap directly in your cover note. Pretending it isn't there doesn't work. Acknowledging it and explaining why you're worth considering anyway sometimes does.

The third is no cover note at all. Many teenage applicants skip it because it feels unnecessary or they don't know what to write. A brief, specific paragraph explaining why you want this particular job and what you'd bring to it takes ten minutes to write and puts you ahead of the majority of your competition.

One practical check: ask a teacher or careers advisor to read your CV and give you honest feedback. Not "does this look okay" feedback, which almost always gets a yes. Ask them to read it as if they were a hiring manager and tell you what they'd cut. Most people are too polite to do this without being pushed. Push.

If you've been applying for more than four weeks with no response, change your approach rather than repeating it. The definition of a wasted job hunt is doing the same thing and expecting a different result.`,
    category: 'Job Hunting',
    readTime: '3 min read',
    emoji: '🔍',
    tags: ['Job Applications', 'CV', 'Job Hunting'],
    publishDate: '2025-05-20',
    quiz: [
      {
        question: 'If you\'ve sent lots of applications with no replies, what\'s the best next step?',
        options: ['Send even more to improve your odds', 'Wait — employers are usually just slow', 'Change your approach — more applications won\'t fix the underlying problem'],
        correctIndex: 2,
        explanation: 'Sending more of the same just multiplies the problem. Diagnose what\'s going wrong first.',
      },
      {
        question: 'What should you do if your CV opens with a soft-skills personal statement?',
        options: ['Cut it or replace it with two specific sentences about what you\'re good at', 'Expand it to make your personality clearer', 'Add more bullet points to it'],
        correctIndex: 0,
        explanation: 'A generic personal statement loses the reader\'s attention before they\'ve seen anything useful about you.',
      },
      {
        question: 'Should you include a cover note even if the job advert doesn\'t ask for one?',
        options: ['No — employers skip them anyway', 'Only if you\'re applying to a big company', 'Yes — a specific paragraph puts you ahead of most applicants'],
        correctIndex: 2,
        explanation: 'Most applicants skip it. A brief, targeted cover note takes 10 minutes and gives you a real edge over the competition.',
      },
      {
        question: 'What kind of CV feedback should you ask for?',
        options: ['"Does this look okay to you?"', '"What would you cut if you were a hiring manager?"', '"Is my formatting right?"'],
        correctIndex: 1,
        explanation: '"Does this look okay?" almost always gets a polite yes. You need to push for genuinely critical feedback.',
      },
    ],
  },
];

export default function CareerGuidance() {
  const { subscription } = useSubscription();
  const { user } = useAuth();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [postsViewed, setPostsViewed] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  // Initialize posts viewed from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.email) {
      const viewedCount = parseInt(localStorage.getItem(`career_articles_viewed_${user.email}`) || '0');
      setPostsViewed(viewedCount);
    }
  }, [user?.email]);

  const allPosts = blogPosts;

  const allPostsComplete = allPosts;

  const categories = ['All', ...Array.from(new Set(allPostsComplete.map(post => post.category)))];

  const filteredPosts = allPostsComplete.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (selectedPost) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #facc15 100%)',
        padding: '40px 20px',
        fontFamily: 'Fredoka'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '3px solid #fbbf24'
        }}>
          <button
            onClick={() => setSelectedPost(null)}
            className="back-button"
            style={{
              marginBottom: '20px',
              padding: '10px 20px',
              backgroundColor: '#f3f4f6',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
          >
            ← Back to Articles
          </button>

          <div style={{ marginBottom: '20px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              {selectedPost.category}
            </span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            {selectedPost.emoji} {selectedPost.title}
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '30px',
            fontSize: '0.9rem',
            color: '#6b7280'
          }}>
            <span>📅 {new Date(selectedPost.publishDate).toLocaleDateString()}</span>
            <span>⏱️ {selectedPost.readTime}</span>
          </div>

          <div style={{
            fontSize: '1.1rem',
            lineHeight: '1.7',
            color: '#374151',
            whiteSpace: 'pre-line'
          }}>
            {selectedPost.content}
          </div>

          {/* Quiz */}
          {selectedPost.quiz && selectedPost.quiz.length > 0 && (
            <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: '2px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#000', marginBottom: '6px', fontFamily: "'Fredoka', sans-serif" }}>
                🧠 Test Your Knowledge
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '24px' }}>
                Answer these questions to check your understanding.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {selectedPost.quiz.map((q, qi) => {
                  const answered = quizAnswers[qi] !== undefined;
                  const selected = quizAnswers[qi];
                  const correct = q.correctIndex;
                  return (
                    <div key={qi} style={{ background: '#fafafa', borderRadius: '16px', padding: '20px 22px', border: '2px solid #f3f4f6' }}>
                      <p style={{ fontWeight: '700', fontSize: '1rem', color: '#111827', marginBottom: '14px', lineHeight: '1.4' }}>
                        {qi + 1}. {q.question}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {q.options.map((opt, oi) => {
                          let bg = '#ffffff';
                          let border = '2px solid #e5e7eb';
                          let color = '#374151';
                          if (answered) {
                            if (oi === correct) { bg = '#d1fae5'; border = '2px solid #10b981'; color = '#065f46'; }
                            else if (oi === selected && oi !== correct) { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#991b1b'; }
                          }
                          return (
                            <button
                              key={oi}
                              onClick={() => { if (!answered) setQuizAnswers(prev => ({ ...prev, [qi]: oi })); }}
                              style={{
                                background: bg, border, color,
                                borderRadius: '10px', padding: '10px 14px',
                                textAlign: 'left', cursor: answered ? 'default' : 'pointer',
                                fontSize: '0.92rem', fontFamily: 'inherit',
                                transition: 'all 0.15s ease',
                                fontWeight: answered && oi === correct ? '700' : '400',
                              }}
                            >
                              {answered && oi === correct && '✓ '}{answered && oi === selected && oi !== correct && '✗ '}{opt}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef3c7', borderRadius: '10px', border: '1px solid #fbbf24' }}>
                          <p style={{ margin: 0, fontSize: '0.88rem', color: '#92400e', lineHeight: '1.5' }}>
                            💡 {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '2px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              color: '#000',
              marginBottom: '12px'
            }}>
              Tags:
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedPost.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    border: '1px solid #d1d5db'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #facc15 100%)',
      padding: '40px 20px',
      fontFamily: 'Fredoka'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 40px auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          color: '#000',
          margin: '0 0 16px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          📚 Career Guidance Hub
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#374151',
          maxWidth: '600px',
          margin: '0 auto 16px auto'
        }}>
          Expert advice, tips, and strategies to accelerate your career journey and land your dream job
        </p>

        {/* Usage Limits Display */}
        {subscription.tier === 'free' && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '24px',
            maxWidth: '600px',
            margin: '24px auto 0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <p style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#92400e',
                margin: '0 0 4px 0'
              }}>
                Free Tier Limit: {postsViewed}/6 articles accessed
              </p>
              <p style={{
                fontSize: '14px',
                color: '#92400e',
                margin: '0'
              }}>
                {postsViewed >= 6 ? 'Upgrade to Pro for unlimited access to all career articles!' : `You can access ${6 - postsViewed} more article${6 - postsViewed === 1 ? '' : 's'}.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 40px auto',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search articles... 🔍"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '300px',
            padding: '12px 20px',
            border: '2px solid #fbbf24',
            borderRadius: '25px',
            fontSize: '1rem',
            fontFamily: 'inherit',
            backgroundColor: '#ffffff',
            outline: 'none'
          }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: selectedCategory === category ? '#fbbf24' : '#ffffff',
                color: selectedCategory === category ? '#000' : '#374151',
                border: `2px solid ${selectedCategory === category ? '#f59e0b' : '#e5e7eb'}`,
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Usage Counter for Free Tier */}
      {subscription.tier === 'free' && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 30px auto',
          backgroundColor: postsViewed >= 6 ? '#fef2f2' : '#f0f9ff',
          border: `2px solid ${postsViewed >= 6 ? '#fecaca' : '#bae6fd'}`,
          borderRadius: '16px',
          padding: '16px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: postsViewed >= 6 ? '#dc2626' : '#0369a1',
            marginBottom: '4px'
          }}>
            {postsViewed >= 6 ? (
              <>🔒 Free article limit reached ({postsViewed}/6 articles viewed)</>
            ) : (
              <>📚 Free tier: {postsViewed}/6 articles viewed</>
            )}
          </div>
          {postsViewed >= 6 && (
            <div style={{
              fontSize: '14px',
              color: '#dc2626'
            }}>
              Upgrade to Pro for unlimited access to all career guidance articles!
            </div>
          )}
        </div>
      )}

      {/* Articles Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        {filteredPosts.map((post, index) => (
          <article
            key={post.id}
            onClick={() => {
              // Check paywall for free tier users
              if (subscription.tier === 'free' && index >= 6 && postsViewed >= 6) {
                window.dispatchEvent(new CustomEvent('openPricingModal'));
                return;
              }

              // If free tier and viewing a new post, increment counter in localStorage
              if (subscription.tier === 'free' && index >= postsViewed && user?.email) {
                const newCount = Math.max(postsViewed, index + 1);
                localStorage.setItem(`career_articles_viewed_${user.email}`, newCount.toString());
                setPostsViewed(newCount);

                // Notify other components of usage update
                window.dispatchEvent(new CustomEvent('talentix-usage-update'));
              }

              setSelectedPost(post);
              setQuizAnswers({});
            }}
            className="article-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '30px',
              position: 'relative',
              opacity: (subscription.tier === 'free' && index >= 6 && postsViewed >= 6) ? 0.6 : 1,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '3px solid #fbbf24',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Premium Badge for locked posts */}
            {subscription.tier === 'free' && index >= 6 && postsViewed >= 6 && (
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                zIndex: 1
              }}>
                🔒 PRO
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {post.category}
              </span>
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#000',
              marginBottom: '12px',
              lineHeight: '1.3'
            }}>
              {post.emoji} {post.title}
            </h2>

            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              {post.excerpt}
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              color: '#9ca3af'
            }}>
              <span>📅 {new Date(post.publishDate).toLocaleDateString()}</span>
              <span>⏱️ {post.readTime}</span>
            </div>

            <div style={{
              marginTop: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px'
            }}>
              {post.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '2px 8px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    borderRadius: '12px',
                    fontSize: '0.7rem'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: '1200px',
        margin: '60px auto 0 auto',
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '3px solid #fbbf24'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '16px'
        }}>
          🚀 Ready to Start Your Career Journey?
        </h3>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          marginBottom: '20px'
        }}>
          Explore our other tools: CV Reviewer, Interview Prep, Job Search, and Talentix Points!
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openSignUpModal'))}
          className="dashboard-button"
          style={{
            padding: '14px 36px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: '#111827',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.05rem',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'Fredoka', sans-serif",
            boxShadow: '0 4px 16px rgba(251,191,36,0.45)',
            letterSpacing: '0.01em'
          }}
        >
          Sign Up Now 🚀
        </button>
      </div>

      <style jsx>{`
        .back-button:hover {
          background-color: #e5e7eb !important;
          border-color: #9ca3af !important;
        }

        .category-button:not(.active):hover {
          background-color: #f9fafb !important;
          border-color: #d1d5db !important;
        }

        .article-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15) !important;
        }

        .dashboard-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4) !important;
        }
      `}</style>
    </div>
    </AuthGuard>
  );
}
