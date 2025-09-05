'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Chatbot from '../../components/Chatbot';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('talentix_user');
    if (savedUser) {
      setUserName(savedUser);
    }
  }, []);

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "How to Write Your First CV (Even With No Experience)",
      excerpt: "Don't let lack of experience stop you! Learn how to create a compelling CV that highlights your strengths and potential.",
      content: `Writing your first CV can feel overwhelming, especially when you don't have much work experience. But don't worry - everyone starts somewhere!

**What to Include:**
- Personal details (name, contact info)
- Education (current school, expected graduation)
- Skills (computer skills, languages, soft skills)
- Activities (sports, clubs, volunteer work)
- Any part-time work, babysitting, or odd jobs

**Formatting Tips:**
- Keep it clean and simple
- Use bullet points for easy reading
- Stick to 1-2 pages maximum
- Proofread carefully

**Highlight Transferable Skills:**
Even if you haven't had a "real job," you have valuable skills:
- Teamwork from sports/clubs
- Communication from presentations
- Time management from balancing school activities
- Customer service from helping family businesses

Remember: Employers want to see enthusiasm and willingness to learn more than extensive experience!`,
      author: "Career Coach Sarah",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "CV Writing",
      tags: ["CV", "First Job", "Experience"]
    },
    {
      id: 2,
      title: "Interview Tips That Will Land You the Job",
      excerpt: "Master the art of interviewing with these proven techniques that work for teenagers and adults alike.",
      content: `Interviews can be nerve-wracking, but with the right preparation, you can ace them!

**Before the Interview:**
- Research the company and role
- Practice common questions
- Plan your outfit (business casual is usually safe)
- Get directions and plan to arrive 10 minutes early
- Bring copies of your CV

**Common Questions to Prepare For:**
- "Tell me about yourself"
- "Why do you want this job?"
- "What are your strengths and weaknesses?"
- "Where do you see yourself in 5 years?"
- "Do you have any questions for us?"

**During the Interview:**
- Make eye contact and smile
- Speak clearly and confidently
- Be honest about your experience level
- Show enthusiasm for the role
- Ask thoughtful questions

**After the Interview:**
- Send a thank you email within 24 hours
- Follow up if you haven't heard back in a week
- Reflect on what went well and what you can improve

**Remember:** It's okay to be nervous - employers expect this from teenagers. Focus on showing your enthusiasm and willingness to learn!`,
      author: "Interview Expert Mike",
      date: "2024-01-10",
      readTime: "7 min read",
      category: "Interviewing",
      tags: ["Interview", "Preparation", "Confidence"]
    },
    {
      id: 3,
      title: "Where to Find Your First Job: A Complete Guide",
      excerpt: "Discover the best places to look for your first job, from local businesses to online platforms.",
      content: `Finding your first job requires knowing where to look. Here's your complete guide:

**Local Businesses:**
- Supermarkets and retail stores
- Fast food restaurants and cafes
- Movie theaters and entertainment venues
- Pet stores and veterinary clinics
- Libraries and community centers

**Online Job Boards:**
- Indeed (has teen-friendly filters)
- Snagajob (specializes in hourly work)
- Glassdoor (includes company reviews)
- Local Facebook groups
- School job boards

**Networking:**
- Ask family and friends
- Talk to teachers and counselors
- Join community groups
- Attend job fairs
- Use social media professionally

**Creative Approaches:**
- Offer services to neighbors (pet sitting, lawn care)
- Start a small business (baking, crafts, tutoring)
- Volunteer to gain experience
- Create an online presence showcasing your skills

**Tips for Success:**
- Apply to multiple places
- Follow up after applying
- Be persistent but patient
- Keep track of your applications
- Always be professional

Remember: Your first job is about gaining experience and building skills. Don't be too picky about the role - focus on learning and growing!`,
      author: "Job Search Specialist Emma",
      date: "2024-01-08",
      readTime: "6 min read",
      category: "Job Search",
      tags: ["Job Search", "Networking", "Opportunities"]
    },
    {
      id: 4,
      title: "Building Skills That Employers Actually Want",
      excerpt: "Develop the skills that will make you stand out to employers, even without work experience.",
      content: `Employers look for specific skills, and you can develop many of these without a traditional job!

**Technical Skills:**
- Microsoft Office (Word, Excel, PowerPoint)
- Social media management
- Basic graphic design (Canva, Photoshop)
- Website building (WordPress, Wix)
- Video editing and photography

**Soft Skills:**
- Communication (practice with family, friends, teachers)
- Teamwork (sports, group projects, clubs)
- Problem-solving (puzzles, games, real-life situations)
- Time management (balancing school, activities, personal time)
- Customer service (helping family businesses, volunteering)

**How to Develop These Skills:**
- Take online courses (free on YouTube, Coursera)
- Join clubs and organizations
- Volunteer in your community
- Start a blog or YouTube channel
- Help with family businesses
- Practice public speaking

**Showcasing Your Skills:**
- Include them on your CV
- Create a portfolio of your work
- Mention them in interviews
- Demonstrate them through examples

**Remember:** Skills are more valuable than experience. Focus on developing and showcasing what you can do!`,
      author: "Skills Development Coach Alex",
      date: "2024-01-05",
      readTime: "8 min read",
      category: "Skills Development",
      tags: ["Skills", "Development", "Employability"]
    },
    {
      id: 5,
      title: "Overcoming Nervousness: Your Guide to Confidence",
      excerpt: "Learn how to manage interview anxiety and present yourself with confidence, even when you're nervous.",
      content: `Feeling nervous about job hunting is completely normal! Here's how to build confidence:

**Understanding Your Nervousness:**
- It's natural to feel anxious about new experiences
- Most teenagers feel the same way
- Employers expect some nervousness
- It shows you care about doing well

**Preparation Reduces Anxiety:**
- Research the company thoroughly
- Practice interview questions with family/friends
- Plan your outfit the night before
- Rehearse your journey to the interview
- Prepare questions to ask them

**Confidence-Building Techniques:**
- Power posing (stand tall, hands on hips)
- Deep breathing exercises
- Positive self-talk ("I can do this!")
- Visualize success
- Remember your achievements

**During the Interview:**
- Take deep breaths before speaking
- Pause to collect your thoughts
- Be honest about being nervous
- Focus on the conversation, not your anxiety
- Remember: they want to hire you!

**After the Interview:**
- Celebrate showing up (that's the hardest part!)
- Reflect on what went well
- Learn from any mistakes
- Keep practicing and improving

**Remember:** Confidence comes from preparation and practice. The more you do it, the easier it gets!`,
      author: "Confidence Coach Lisa",
      date: "2024-01-03",
      readTime: "6 min read",
      category: "Confidence",
      tags: ["Confidence", "Nervousness", "Interview"]
    },
    {
      id: 6,
      title: "Salary Negotiation for Teenagers: What You Need to Know",
      excerpt: "Learn how to discuss pay professionally, even for your first job, and understand what's fair for teenagers.",
      content: `Talking about money can be awkward, but it's an important skill to learn early!

**Understanding Teen Wages:**
- Most teen jobs pay minimum wage or slightly above
- Experience and skills can justify higher pay
- Location affects pay rates
- Some jobs include tips or bonuses

**When to Negotiate:**
- You have relevant experience or skills
- The job requires special training
- You're working unusual hours
- You're taking on extra responsibilities
- You've been at the job for a while

**How to Approach Salary Discussion:**
- Research typical pay for the role
- Focus on your value, not just what you need
- Be polite and professional
- Have a specific number in mind
- Be prepared to explain why you deserve it

**What to Say:**
"I'm excited about this opportunity and I believe my [skills/experience] would be valuable to your team. I was wondering if there's any flexibility in the starting salary?"

**When Not to Negotiate:**
- It's your very first job with no experience
- The employer clearly states the pay is non-negotiable
- You're desperate for any job
- The pay is already fair for the role

**Remember:** For your first job, gaining experience is often more valuable than the salary. Focus on learning and building your resume!`,
      author: "Career Advisor David",
      date: "2024-01-01",
      readTime: "5 min read",
      category: "Salary",
      tags: ["Salary", "Negotiation", "First Job"]
    }
  ];

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
    // Add points for reading articles
    const currentScore = parseInt(localStorage.getItem('talentix_score') || '0');
    const newScore = currentScore + 5;
    localStorage.setItem('talentix_score', newScore.toString());
  };

  if (selectedPost) {
    // Detailed Post View
    return (
      <div className="w-full min-h-screen bg-white text-gray-800">
        <main className="max-w-3xl mx-auto px-6 py-12">
          <button
            onClick={() => setSelectedPost(null)}
            className="btn-secondary-outline mb-8"
          >
            &larr; Back to Articles
          </button>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{selectedPost.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
            <span>By {selectedPost.author}</span>
            <span>&bull;</span>
            <span>{selectedPost.date}</span>
            <span>&bull;</span>
            <span>{selectedPost.readTime}</span>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {selectedPost.content}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPost.tags.map((tag) => (
                <span key={tag} className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Blog List View
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800">
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Career Blog</h1>
          <p className="text-lg text-gray-600">Expert advice on getting your first job as a teenager.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-xl border border-gray-200 minimalist-card flex flex-col">
              <div className="mb-4">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{post.category}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                <span>{post.author}</span>
                <span>{post.readTime}</span>
              </div>
              <button
                onClick={() => handleReadMore(post)}
                className="btn-primary-yellow w-full py-2 mt-auto"
              >
                Read Article
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 