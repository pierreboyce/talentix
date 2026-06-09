export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  categoryColor: 'yellow' | 'purple' | 'pink' | 'blue' | 'green';
  readTime: string;
  author: string;
  body: string[];
  quiz: QuizQuestion[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'cv-mistake-teenagers-make',
    title: 'The CV Mistake Almost Every Teenager Makes',
    excerpt: 'Padding your CV with soft skills like "good communicator" and "team player" doesn\'t help you. It signals that you have nothing real to say.',
    date: '3 June 2025',
    category: 'CV & Applications',
    categoryColor: 'purple',
    readTime: '3 min',
    author: 'Talentix Team',
    body: [
      'A CV is not a list of traits. It\'s a short argument that you\'re worth meeting. Most teenage CVs fail because they\'re built around self-description rather than evidence.',
      '"Good communicator." "Works well independently and in a team." "Motivated and enthusiastic." These phrases appear on roughly 90% of all CVs sent in for entry-level roles. They convey nothing. Any hiring manager who reads them skips straight past.',
      'The fix is simpler than most CV guides make it sound. For every bullet point, ask yourself: can I show this rather than say it? Instead of "responsible," write that you\'ve been a prefect, a team captain, or that you regularly look after younger siblings. Instead of "good with people," mention that you volunteered at a community event and handled enquiries from members of the public.',
      'Even small things count when you frame them properly. Helping run a school stall is customer service experience. Organising a revision group is coordination experience. Completing your Duke of Edinburgh award shows follow-through on a long commitment.',
      'You\'ve done more than you think. The problem is most teens either omit these things or bury them under vague descriptions.',
      'Keep the CV to one page. Hiring managers for part-time roles spend about 20 seconds on each application. A two-page CV from someone with no work history reads as poor judgement.',
      'Your email address is either professional or it isn\'t. "pizzalover2008@gmail.com" ends applications before they start. Set up a plain firstname.lastname address and use it for job hunting only.',
      'One last thing: don\'t lie. Not even small lies about grades or responsibilities. Managers ask follow-up questions in interviews. If what you say doesn\'t match what you wrote, you won\'t get the job, and word travels fast in local hiring networks.',
    ],
    quiz: [
      {
        question: 'What do phrases like "good communicator" and "hard worker" signal to a hiring manager?',
        options: [
          'That you are confident and self-aware',
          'That you have nothing specific to show — they get skipped',
          'That you understand what employers want',
        ],
        correctIndex: 1,
        explanation: 'These phrases appear on ~90% of CVs and are so common that hiring managers skip past them entirely.',
      },
      {
        question: 'Instead of writing "responsible" on your CV, what should you do?',
        options: [
          'Remove it and leave it out',
          'Bold the word to draw attention',
          'Show it with evidence — e.g. "prefect", "team captain", or caring for younger siblings',
        ],
        correctIndex: 2,
        explanation: 'Evidence always beats self-description. Specific examples give hiring managers something real to remember you by.',
      },
      {
        question: 'How long should your CV be if you have no work history?',
        options: [
          'One page',
          'Two pages — to show you\'re thorough',
          'As long as needed to cover everything',
        ],
        correctIndex: 0,
        explanation: 'Hiring managers spend ~20 seconds per application. A two-page CV from someone with no work experience signals poor judgement.',
      },
      {
        question: 'What is the one thing you should NEVER do on your CV?',
        options: [
          'Use a personal email address',
          'Include hobbies',
          'Lie — even about small details',
        ],
        correctIndex: 2,
        explanation: 'Managers ask follow-up questions in interviews. If what you say doesn\'t match what you wrote, you won\'t get the job.',
      },
    ],
  },
  {
    slug: 'what-happens-first-five-minutes-interview',
    title: 'What Actually Happens in the First Five Minutes of a Job Interview',
    excerpt: 'The questions haven\'t started yet and the interviewer has already formed an opinion. Here\'s what they\'re noticing.',
    date: '27 May 2025',
    category: 'Interviews',
    categoryColor: 'pink',
    readTime: '3 min',
    author: 'Talentix Team',
    body: [
      'Job interviews don\'t start when the first question gets asked. They start when you walk through the door.',
      'This isn\'t about mystical first impressions. It\'s about something more specific: hiring managers are watching to see how you behave when you think you\'re not being assessed yet. How you greet the receptionist. Whether you look at your phone while you wait. Whether you say thank you when someone brings you water. These things get noticed and mentioned.',
      'By the time you sit down, the interviewer has already answered two questions in their head: does this person seem reasonably relaxed, and do they seem like someone I\'d want to spend a shift with? Your answers to the formal questions are there to confirm or challenge that early read.',
      'Nerves are expected and they don\'t hurt you. Interviewers for entry-level roles have interviewed hundreds of nervous teenagers. What they find off-putting isn\'t nerves — it\'s the behaviours nerves sometimes produce: very short answers, no eye contact, or the opposite problem, rambling to fill silence.',
      'Short answers are the most common issue. When someone asks "tell me about yourself," most teens give a two-sentence answer and stop. The silence that follows feels excruciating and they assume they\'ve failed. They haven\'t. They just need to say more.',
      'A good answer to that question is about 90 seconds long. It covers who you are, what you\'re interested in, and why you\'re here. Practise saying it out loud before the interview — not to memorise it word for word, just to know you can fill the space comfortably.',
      'Questions at the end of the interview matter more than most people think. "Do you have any questions for us?" is not a polite formality. It\'s a test of whether you\'ve thought about the role.',
      'Ask something specific: what does a typical shift look like, what would the first few weeks involve, what do they look for in someone they\'d want to keep on long-term. Saying "no, I think you\'ve covered everything" is a small miss that costs you credibility with almost no upside.',
    ],
    quiz: [
      {
        question: 'When does a job interview actually begin?',
        options: [
          'When the first formal question is asked',
          'When you sit down at the table',
          'When you walk through the door',
        ],
        correctIndex: 2,
        explanation: 'Hiring managers watch how you behave before the questions start — how you greet staff, whether you check your phone, how you carry yourself.',
      },
      {
        question: 'How long should a good answer to "tell me about yourself" be?',
        options: [
          'Around 90 seconds — covering who you are, your interests, and why you\'re here',
          'One or two sentences — keep it short and snappy',
          'As long as it takes to cover your full background',
        ],
        correctIndex: 0,
        explanation: 'One or two sentences leaves uncomfortable silence and reads as unprepared. A 90-second answer fills the space naturally.',
      },
      {
        question: 'Do nerves hurt your chances in an entry-level interview?',
        options: [
          'Yes — confident candidates always win',
          'No — nerves are expected. What matters is what they make you do',
          'Yes — any visible nerves are a red flag',
        ],
        correctIndex: 1,
        explanation: 'Interviewers for entry-level roles have seen hundreds of nervous teenagers. It\'s the knock-on behaviours — short answers, no eye contact — that cost you.',
      },
      {
        question: 'What does "do you have any questions for us?" actually test?',
        options: [
          'Whether you\'re polite',
          'Whether you\'ve thought seriously about the role',
          'How confident you are',
        ],
        correctIndex: 1,
        explanation: 'Saying "no, you\'ve covered everything" costs you credibility with almost no upside. Ask something specific about the role or the team.',
      },
    ],
  },
  {
    slug: 'why-not-hearing-back-job-applications',
    title: 'Why You\'re Not Hearing Back From Job Applications (And the Specific Fix)',
    excerpt: 'Sending more applications rarely solves the problem. The issue is almost always one of three things, and each one has a fix.',
    date: '20 May 2025',
    category: 'Job Hunting',
    categoryColor: 'yellow',
    readTime: '3 min',
    author: 'Talentix Team',
    body: [
      'If you\'ve sent out applications and heard nothing back, the instinct is to send more. That usually doesn\'t help. It just multiplies the same problem across more employers.',
      'The actual issue is almost always one of three things.',
      'The first is a CV that looks like everyone else\'s. If your CV opens with a personal statement full of soft-skill descriptions, you\'ve already lost the reader\'s attention before they\'ve seen anything useful. Cut the personal statement entirely or replace it with two sentences that name something specific: what you\'re good at, and what kind of role you\'re looking for. Then get to your experience and education fast.',
      'The second is applying to roles where you\'re obviously not a fit for the listed requirements. Some job adverts ask for previous experience in the industry or specific certifications. If you don\'t have those, applying anyway is not always a waste of time, but you need to address the gap directly in your cover note. Pretending it isn\'t there doesn\'t work. Acknowledging it and explaining why you\'re worth considering anyway sometimes does.',
      'The third is no cover note at all. Many teenage applicants skip it because it feels unnecessary or they don\'t know what to write. A brief, specific paragraph explaining why you want this particular job and what you\'d bring to it takes ten minutes to write and puts you ahead of the majority of your competition.',
      'One practical check: ask a teacher or careers advisor to read your CV and give you honest feedback. Not "does this look okay" feedback, which almost always gets a yes. Ask them to read it as if they were a hiring manager and tell you what they\'d cut. Most people are too polite to do this without being pushed. Push.',
      'If you\'ve been applying for more than four weeks with no response, change your approach rather than repeating it. The definition of a wasted job hunt is doing the same thing and expecting a different result.',
    ],
    quiz: [
      {
        question: 'If you\'ve sent lots of applications with no replies, what\'s the best next step?',
        options: [
          'Send even more to improve your odds',
          'Wait — employers are usually just slow',
          'Change your approach — more applications won\'t fix the underlying problem',
        ],
        correctIndex: 2,
        explanation: 'Sending more of the same just multiplies the problem. Diagnose what\'s going wrong first.',
      },
      {
        question: 'What should you do if your CV opens with a soft-skills personal statement?',
        options: [
          'Cut it or replace it with two specific sentences about what you\'re good at',
          'Expand it to make your personality clearer',
          'Add more bullet points to it',
        ],
        correctIndex: 0,
        explanation: 'A generic personal statement loses the reader\'s attention before they\'ve seen anything useful about you.',
      },
      {
        question: 'Should you include a cover note even if the job advert doesn\'t ask for one?',
        options: [
          'No — employers skip them anyway',
          'Only if you\'re applying to a big company',
          'Yes — a specific paragraph puts you ahead of most applicants',
        ],
        correctIndex: 2,
        explanation: 'Most applicants skip it. A brief, targeted cover note takes 10 minutes and gives you a real edge over the competition.',
      },
      {
        question: 'What kind of CV feedback should you ask for?',
        options: [
          '"Does this look okay to you?"',
          '"What would you cut if you were a hiring manager?"',
          '"Is my formatting right?"',
        ],
        correctIndex: 1,
        explanation: '"Does this look okay?" almost always gets a polite yes. You need to push for genuinely critical feedback.',
      },
    ],
  },
];
