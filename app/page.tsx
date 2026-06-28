import TagBadge from '../components/TagBadge'
import HomeContactQR from '../components/HomeContactQR'
import HeroTitle from '../components/HeroSection'
import Typewriter from '../components/Typewriter'
import ContactCard from '../components/ContactCard'
import Link from 'next/link'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { SiHuggingface } from 'react-icons/si'
import SvgIcon from '@/components/icons/SvgIcon'
import { sql } from '@/lib/db'
import { profile } from '@/lib/profile'
import { iconRegistry } from '@/lib/iconRegistry'
import { techIcons } from '@/lib/techIcons'
import ExpertiseCardAnimation from '@/components/ExpertiseCardAnimation'
import { Empty } from '@/components/retroui'

// Revalidate page every hour
export const revalidate = 3600

// Fetch data from Neon
async function getProjects() {
  try {
    const data = await sql`SELECT * FROM projects ORDER BY created_at DESC`
    return data || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

async function getExperiences() {
  try {
    const data = await sql`SELECT * FROM experiences`
    
    // Sort with "Present" entries first, then by start_date descending
    const sorted = (data || []).sort((a, b) => {
      // If both are "Present" or both are not, sort by start_date
      if ((a.end_date === 'Present' && b.end_date === 'Present') || 
          (a.end_date !== 'Present' && b.end_date !== 'Present')) {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      }
      // Otherwise, "Present" comes first
      return a.end_date === 'Present' ? -1 : 1
    })
    
    return sorted
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
}

async function getBlogs() {
  try {
    const data = await sql`SELECT * FROM blogs ORDER BY published_date DESC`
    return data || []
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

async function getSiteCards() {
  try {
    const data = await sql`SELECT * FROM site_cards ORDER BY sort_order ASC`
    return data || []
  } catch (error) {
    console.error('Error fetching site cards:', error)
    return []
  }
}

// Mock data removed - now using real DB queries
const mockProjects = [
  {
    id: 1,
    title: "AI-Powered Sentiment Analysis",
    description: "Deep learning model for real-time sentiment analysis using BERT transformers",
    image: "https://via.placeholder.com/400x300?text=Sentiment+Analysis",
    demo_video: null,
    url: "https://github.com/your-github-username/sentiment-analysis",
    tags: ["PyTorch", "BERT", "NLP", "Deep Learning"],
    created_at: "2025-12-01"
  },
  {
    id: 2,
    title: "Computer Vision Object Detection",
    description: "Custom YOLOv8 model for multi-class object detection with real-time inference",
    image: "https://via.placeholder.com/400x300?text=Object+Detection",
    demo_video: null,
    url: "https://github.com/your-github-username/object-detection",
    tags: ["YOLOv8", "OpenCV", "Python", "Computer Vision"],
    created_at: "2025-11-15"
  },
  {
    id: 3,
    title: "Full-Stack Chat Application",
    description: "Real-time chat app with WebSocket integration, MongoDB backend, and React frontend",
    image: "https://via.placeholder.com/400x300?text=Chat+App",
    demo_video: null,
    url: "https://github.com/your-github-username/chat-app",
    tags: ["React", "Node.js", "MongoDB", "WebSocket"],
    created_at: "2025-10-20"
  },
  {
    id: 4,
    title: "Time Series Forecasting Model",
    description: "LSTM neural network for stock price prediction with 94% accuracy",
    image: "https://via.placeholder.com/400x300?text=Time+Series",
    demo_video: null,
    url: "https://github.com/your-github-username/time-series",
    tags: ["LSTM", "TensorFlow", "Time Series", "Forecasting"],
    created_at: "2025-09-10"
  },
  {
    id: 5,
    title: "Generative AI Image Editor",
    description: "AI-powered image manipulation tool using Stable Diffusion with inpainting",
    image: "https://via.placeholder.com/400x300?text=Image+Editor",
    demo_video: null,
    url: "https://github.com/your-github-username/image-editor",
    tags: ["Stable Diffusion", "Python", "FastAPI", "AI/ML"],
    created_at: "2025-08-05"
  },
  {
    id: 6,
    title: "Recommendation Engine",
    description: "Collaborative filtering recommendation system serving 100K+ users",
    image: "https://via.placeholder.com/400x300?text=Recommendation",
    demo_video: null,
    url: "https://github.com/your-github-username/rec-engine",
    tags: ["Recommendation Systems", "Scikit-learn", "Python", "ML"],
    created_at: "2025-07-15"
  }
]

const mockExperiences = [
  {
    id: 1,
    title: "AI/ML Engineer",
    organization: "Tech Innovations Ltd",
    location: "Ajman, UAE",
    start_date: "2024-06-01",
    end_date: "Present",
    description: "Leading AI/ML initiatives for enterprise automation and data pipeline optimization",
    highlights: [
      "Developed and deployed 5+ machine learning models in production",
      "Optimized data pipelines reducing processing time by 60%",
      "Led a team of 3 junior engineers on computer vision projects",
      "Implemented real-time inference system handling 10K+ requests/sec"
    ],
    tags: ["Python", "TensorFlow", "PyTorch", "AWS", "Kubernetes"]
  },
  {
    id: 2,
    title: "Full-Stack Developer",
    organization: "Digital Solutions Corp",
    location: "Dubai, UAE",
    start_date: "2023-03-15",
    end_date: "2024-05-30",
    description: "Built scalable web applications and microservices for 50+ enterprise clients",
    highlights: [
      "Developed 15+ full-stack applications using Next.js and Node.js",
      "Improved application performance by 45% through optimization",
      "Implemented CI/CD pipelines reducing deployment time by 80%",
      "Designed and maintained MongoDB database schemas"
    ],
    tags: ["Next.js", "Node.js", "React", "MongoDB", "Docker"]
  },
  {
    id: 3,
    title: "Junior Data Scientist",
    organization: "Analytics Hub",
    location: "Abu Dhabi, UAE",
    start_date: "2022-01-10",
    end_date: "2023-03-10",
    description: "Conducted statistical analysis and built predictive models for business insights",
    highlights: [
      "Created 20+ analytical reports for C-level decision making",
      "Built predictive models achieving 92% accuracy on test set",
      "Automated data collection reducing manual work by 70%",
      "Trained stakeholders on data literacy and analytics best practices"
    ],
    tags: ["Python", "SQL", "Pandas", "Scikit-learn", "Tableau"]
  }
]

const mockCertificates = [
  {
    id: 1,
    title: "Deep Learning Specialization",
    issuer: "Coursera (Andrew Ng)",
    issue_date: "2025-06-15",
    description: "5-course specialization in neural networks and deep learning",
    credential_url: "https://coursera.org/verify/specialization/deep-learning",
    tags: ["Deep Learning", "Neural Networks", "TensorFlow"]
  },
  {
    id: 2,
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    issue_date: "2025-05-20",
    description: "Professional certification for AWS cloud architecture design",
    credential_url: "https://aws.amazon.com/certification/certified-solutions-architect",
    tags: ["AWS", "Cloud", "Architecture"]
  },
  {
    id: 3,
    title: "Google Cloud Professional Data Engineer",
    issuer: "Google Cloud",
    issue_date: "2025-03-10",
    description: "Professional certification in Google Cloud data engineering",
    credential_url: "https://cloud.google.com/certification/data-engineer",
    tags: ["GCP", "Data Engineering", "BigQuery"]
  }
]

const defaultTechCategories = [
  {
    title: 'Agentic Coding & Multi-Agent Systems',
    cls: 'acc-pink',
    bgColor: 'bg-neo-pink',
    description: 'Engineering autonomous software agents that can read codebases, write code, run test suites, and self-correct using LLM reasoning loops.',
    example: 'Developer bots that auto-resolve GitHub issues, generate unit tests, and refactor legacy code.',
    animationType: 'coding'
  },
  {
    title: 'AI Workflows & LLM Orchestration',
    cls: 'acc-blue',
    bgColor: 'bg-neo-blue',
    description: 'Designing intelligent, multi-step workflows that string together LLMs, vector search, and API integrations to automate complex business processes.',
    example: 'Automation loops that ingest incoming support emails, query a vector database, and draft replies.',
    animationType: 'workflow'
  },
  {
    title: 'Full-Stack AI Application Development',
    cls: 'acc-lime',
    bgColor: 'bg-neo-lime',
    description: 'Building clean, highly interactive web applications that connect deep learning models and data dashboards to end-users.',
    example: 'Responsive Next.js applications with voice transcription, real-time sentiment analysis, and tag extraction.',
    animationType: 'fullstack'
  },
  {
    title: 'GTM Tech Stack & Growth Engineering',
    cls: 'acc-yellow',
    bgColor: 'bg-neo-yellow',
    description: 'Connecting tracking scripts, marketing automation tools, and CRM pipelines to build a unified analytics infrastructure for Go-To-Market teams.',
    example: 'Syncing user actions between Stripe, Segment, and HubSpot to automate onboarding and track CAC.',
    animationType: 'gtm'
  },
  {
    title: 'Programmatic SEO & Content Engines',
    cls: 'acc-orange',
    bgColor: 'bg-neo-orange',
    description: 'Building template-driven content engines that programmatically generate thousands of SEO-optimized pages based on structured data.',
    example: 'Systems generating unique local service landing pages using structured DB records and AI summaries.',
    animationType: 'seo'
  },
  {
    title: 'Intelligent Automation & Cognitive AI',
    cls: 'acc-pink',
    bgColor: 'bg-neo-pink',
    description: 'Designing intelligent automation frameworks and cognitive pipelines that ingest unstructured data, automate decision-making, and orchestrate complex business processes.',
    example: 'Cognitive search systems, auto-classification pipelines, and metadata enrichment engines.',
    animationType: 'cognitive'
  }
]

export default async function Home() {
  // Fetch all data from database in parallel
  const [projects, experiences, blogs, siteCards] =
    await Promise.all([
      getProjects(),
      getExperiences(),
      getBlogs(),
      getSiteCards(),
    ])

  // Replace base64 images with Supabase Storage URLs so the ISR page stays
  // under Vercel's 19 MB limit — images are served directly from CDN instead.
  // Run `node scripts/migrate-base64-to-storage.mjs` once to upload any
  // existing base64 images that are still stored inline in the database.
  const replaceBase64Images = <T extends { id: number; image?: string }>(
    items: T[],
    table: string
  ): T[] =>
    items.map(item => {
      if (typeof item.image === 'string' && item.image.startsWith('data:')) {
        return { ...item, image: `/api/media/${table}/${item.id}` }
      }
      return item
    })

  const safeProjects = replaceBase64Images(projects as any[], 'projects') as typeof projects

  // Parse contact and QR card data from the database
  const contactRow = siteCards.find((c: { section: string }) => c.section === 'contact')
  const contactData = contactRow?.card_data as { links?: Array<{ label: string; href: string; icon: string; displayText: string }>; cvPath?: string } | undefined
  const contactLinks = contactData?.links
  const contactCvPath = contactData?.cvPath

  const qrRows = siteCards.filter((c: { section: string }) => c.section === 'qr')
  const qrCards = qrRows.length > 0
    ? qrRows.map((r: { card_data: Record<string, unknown> }) => {
        const card = r.card_data as { label: string; imageSrc: string; borderColor: string; textColor: string; buttonType: 'cv' | 'whatsapp'; linkUrl: string }
        // Strip base64 data URLs to prevent oversized ISR pages
        if (card.imageSrc?.startsWith('data:')) {
          card.imageSrc = card.buttonType === 'cv'
            ? '/qr_code/CV.svg'
            : '/qr_code/WhatsApp.svg'
        }
        return card
      })
    : undefined

  const expertiseCards = siteCards.filter((c: { section: string }) => c.section === 'expertise')
  const techCategories = expertiseCards.length > 0
    ? expertiseCards
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((c: any) => ({
          ...(c.card_data as any),
          animationType: c.card_data.animationType || 'coding'
        }))
    : defaultTechCategories

  // Extract Hero Section configurations from siteCards
  const heroRow = siteCards.find((c: { section: string }) => c.section === 'hero')
  const heroData = heroRow?.card_data as {
    badge?: string
    headingPrefix?: string
    headingHighlight?: string
    bio?: string
    typewriterSentences?: string[]
  } | undefined

  const heroBadge = heroData?.badge || profile.title
  const heroHeadingPrefix = heroData?.headingPrefix || 'Welcome to my'
  const heroHeadingHighlight = heroData?.headingHighlight || 'Portfolio'
  const heroBio = heroData?.bio || profile.bio
  const typewriterPhrases = heroData?.typewriterSentences || profile.typewriterSentences

  return (
    <div id="top" className="space-y-20">
      {/* Preload ALL card images so the browser fetches them in parallel during
          HTML parse — cards appear together, not gradually one-by-one. */}
      {safeProjects.map((p: any) =>
        p.image ? (
          <link key={`preload-p-${p.id}`} rel="preload" as="image" href={p.image} fetchPriority="high" />
        ) : null
      )}
      {/* Hero Section */}
      <section id="hero" className="py-20 fade-in overflow-visible" aria-label="Welcome section">
        <Typewriter 
          sentences={typewriterPhrases}
          typingSpeed={80}
          deletingSpeed={40}
          pauseDuration={2500}
        />
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 items-stretch w-full overflow-visible">
          <div className="neo-card w-full">
            <div className="relative z-10 h-full p-6 sm:p-8 md:p-10 flex flex-col">
              <HeroTitle 
                badge={heroBadge}
                headingPrefix={heroHeadingPrefix}
                headingHighlight={heroHeadingHighlight}
                description={heroBio}
              />
              <div className="flex flex-wrap gap-3">
                <a href="#expertise" className="neo-btn neo-btn-pink min-h-[44px]" aria-label="Navigate to expertise section">
                  Expertise
                </a>
                <a href="#projects" className="neo-btn neo-btn-blue min-h-[44px]" aria-label="Navigate to projects section">
                  Projects
                </a>
                <a href="#experience" className="neo-btn neo-btn-lime min-h-[44px]" aria-label="Navigate to experience section">
                  See Experience
                </a>
                <a href="#certifications" className="neo-btn neo-btn-yellow min-h-[44px]" aria-label="Navigate to certifications section">
                  Certifications
                </a>
              </div>
            </div>
          </div>

          <ContactCard initialLinks={contactLinks} initialCvPath={contactCvPath} />
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="fade-in overflow-visible" aria-label="Expertise">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-neo-pink border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">Expertise</h2>
          <div className="neo-rule"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full overflow-visible">
          {techCategories.map((cat, idx) => (
            <div
              key={cat.title}
              className={`group neo-card neo-tilt ${cat.cls} p-5 sm:p-6 flex flex-col w-full`}
              suppressHydrationWarning
            >
              {/* Animation at the top */}
              <div className="mb-5 h-[130px] w-full border-2 border-neo-border neo-panel overflow-hidden relative shadow-neo-sm">
                <ExpertiseCardAnimation index={idx} title={cat.title} animationType={cat.animationType} />
              </div>
              <div className="card-top mb-3">
                <span className="card-cat font-extrabold">{cat.title}</span>
              </div>
              <p className="text-sm font-semibold text-[color:var(--neo-ink-soft)] leading-relaxed flex-grow">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="fade-in overflow-visible" aria-label="Projects">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-neo-blue border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">Projects</h2>
          <div className="neo-rule"></div>
        </div>
        
        {safeProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full overflow-visible" role="list">
            {safeProjects.map((p: any, idx: number) => (
              <div
                key={String(p.id)}
                className="group neo-card neo-tilt acc-blue p-5 sm:p-6 flex flex-col w-full"
                role="listitem"
                suppressHydrationWarning
              >
                <div className="card-top">
                  <span className="card-cat">Project</span>
                </div>
                {/* Project Image - No autoplay */}
                {p.image ? (
                  <div className="mb-4 rounded-neo overflow-hidden h-40 sm:h-48 border-neo border-neo-border bg-[color:var(--neo-surface-2)] flex items-center justify-center">
                    <img src={p.image} alt={`Screenshot of ${p.title} project`} className="w-full h-full object-cover" decoding="async" fetchPriority="high" />
                  </div>
                ) : p.demo_video ? (
                  <div className="mb-4 rounded-neo overflow-hidden h-40 sm:h-48 border-neo border-neo-border bg-[color:var(--neo-surface-2)] flex items-center justify-center">
                    <svg className="w-16 h-16 text-[color:var(--neo-ink)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                ) : (
                  <div className="mb-4 rounded-neo overflow-hidden h-40 sm:h-48 bg-neo-blue border-neo border-neo-border flex items-center justify-center">
                    <span className="text-center px-4 font-extrabold">{p.title}</span>
                  </div>
                )}
                
              <div className="mb-4">
                <h3 className="text-xl font-extrabold group-hover:text-[color:var(--neo-blue)] transition duration-200 break-words" id={`project-${p.id}`}>
                  {p.title}
                </h3>
              </div>
                {p.description && (
                  <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                )}
                
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.tags.map((tag: string, tIdx: number) => (
                      <TagBadge key={tIdx} tag={tag} variant="blue" />
                    ))}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-3 mt-auto items-center">
                  {/* Details Link */}
                  <Link href={`/projects/${p.id}`} prefetch className="neo-btn neo-btn-blue text-sm py-1.5 px-3">
                    Details →
                  </Link>
                  
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-bold text-sm hover:bg-neo-yellow px-1 transition-colors"
                      aria-label={`View ${p.title} repository`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0.5C5.5 0.5 0.5 5.5 0.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6.8 1.6.8.9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.5-.3-5.1-1.2-5.1-5.3 0-1.2.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1.8-.2 1.7-.4 2.6-.4s1.8.1 2.6.4c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.6 1.1 2.8 0 4-2.6 5-5.1 5.3.4.4.8 1 .8 2v3c0 .3.2.7.8.6C20.7 21.4 24 17.1 24 12c0-6.5-5-11.5-12-11.5z" />
                      </svg>
                      <span>Repo</span>
                    </a>
                  )}
                  {p.huggingface_url && (
                    <a
                      href={p.huggingface_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition duration-300 text-sm font-semibold"
                      aria-label={`View ${p.title} live project`}
                    >
                      <SiHuggingface className="w-4 h-4" />
                      <span>Live Project</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty className="acc-blue">
            <Empty.Content>
              <Empty.Icon className="size-10 md:size-12 text-[color:var(--neo-blue)]" />
              <Empty.Title>No Projects Found</Empty.Title>
              <Empty.Separator />
              <Empty.Description>
                No projects are loaded yet. Please check back soon or add some from the console!
              </Empty.Description>
            </Empty.Content>
          </Empty>
        )}
      </section>



      {/* Experience Section */}
      <section id="experience" className="fade-in" aria-label="Work experience">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-neo-lime border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">Experience</h2>
          <div className="neo-rule"></div>
        </div>
        
        {experiences.length > 0 ? (
          <div className="relative" role="list">
            {/* Vertical lime line — centered behind the dot column */}
            <div
              className="absolute top-0 bottom-0 w-[3px] rounded-full z-0"
              style={{ left: 'calc(14px - 1.5px)', background: 'var(--neo-lime)' }}
              aria-hidden="true"
            />

            {experiences.map((exp: any, idx: number) => {
              const isCurrent = exp.end_date === 'Present'
              return (
                <div key={String(exp.id)} className="flex gap-5 mb-6 last:mb-0" role="listitem">
                  {/* Dot column */}
                  <div className="relative w-7 flex-shrink-0 flex flex-col items-center">
                    {/* Spacer above dot */}
                    <div className="flex-1 min-h-[12px]" />
                    {/* Dot with background halo that breaks the line */}
                    <div
                      className={`relative z-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCurrent ? 'w-6 h-6' : 'w-5 h-5'
                      }`}
                      style={{ background: 'var(--neo-bg)' }}
                      aria-hidden="true"
                    >
                      <div
                        className={`rounded-full border-neo border-neo-border ${
                          isCurrent ? 'w-4 h-4' : 'w-3 h-3'
                        }`}
                        style={{
                          background: 'var(--neo-lime)',
                          animation: isCurrent ? 'neoTimelinePulse 2.4s ease-in-out infinite' : 'none',
                        }}
                      />
                    </div>
                    {/* Spacer below dot */}
                    <div className="flex-1 min-h-[12px]" />
                  </div>

                  {/* Experience Card */}
                  <div className="flex-1 neo-card neo-tilt acc-lime p-6" suppressHydrationWarning>
                    <div className="card-top">
                      <span className="card-cat">Experience</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-white">{exp.title}</h3>
                        <p className="text-green-400 font-semibold text-lg">{exp.organization}</p>
                        {exp.location && <p className="text-gray-400 text-sm">{exp.location}</p>}
                      </div>
                      <p className="text-sm text-gray-400 whitespace-nowrap">
                        {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {exp.end_date === 'Present' ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {exp.description && (
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">{exp.description}</p>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {exp.highlights.map((highlight: string, hIdx: number) => (
                          <li key={hIdx} className="text-gray-400 text-sm flex items-start gap-3">
                            <span className="text-green-400 font-bold mt-0.5">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.tags && exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                        {exp.tags.map((tag: string, tIdx: number) => (
                          <TagBadge key={tIdx} tag={tag} variant="green" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Empty className="acc-lime">
            <Empty.Content>
              <Empty.Icon className="size-10 md:size-12 text-[color:var(--neo-lime)]" />
              <Empty.Title>No Experience Logged</Empty.Title>
              <Empty.Separator />
              <Empty.Description>
                Work experience details are not available yet. Check back later!
              </Empty.Description>
            </Empty.Content>
          </Empty>
        )}
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="fade-in overflow-visible" aria-label="Blog posts and articles">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-neo-yellow border-neo border-neo-border px-4 py-2 shadow-neo -rotate-1">Blogs</h2>
          <div className="neo-rule"></div>
        </div>
        
        {blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible" role="list">
            {blogs.map((blog: any) => {
              const readUrl = blog.content ? `/blogs/${blog.id}` : (blog.url || '#')
              return (
                <div
                  key={String(blog.id)}
                  className="group neo-card neo-tilt acc-yellow p-6 flex flex-col justify-between"
                  role="listitem"
                  suppressHydrationWarning
                >
                  <div>
                    <div className="card-top mb-3 flex items-center justify-between">
                      <span className="card-cat">Article</span>
                      {blog.published_date && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[color:var(--neo-bg-alt)] border border-black px-1.5 py-0.5 rounded text-black shadow-neo-sm">
                          {blog.published_date}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-extrabold group-hover:text-yellow-400 transition duration-300 mb-2">
                      {blog.title}
                    </h3>
                    
                    {blog.summary && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">{blog.summary}</p>
                    )}

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.map((tag: string, tIdx: number) => (
                          <TagBadge key={tIdx} tag={tag} variant="yellow" />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-dashed border-neo-border flex items-center justify-between">
                    <Link
                      href={readUrl}
                      target={blog.content ? undefined : '_blank'}
                      rel={blog.content ? undefined : 'noopener noreferrer'}
                      className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition duration-300 text-sm font-semibold"
                      aria-label={`Read ${blog.title}`}
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Empty className="acc-yellow">
            <Empty.Content>
              <Empty.Icon className="size-10 md:size-12 text-[color:var(--neo-yellow)]" />
              <Empty.Title>No Blogs Published Yet</Empty.Title>
              <Empty.Separator />
              <Empty.Description>
                Aman hasn't published any blogs yet. Check back soon!
              </Empty.Description>
            </Empty.Content>
          </Empty>
        )}
      </section>



      {/* Bottom Section Grid - Contact & QR Codes Side by Side (lazy-mounted) */}
      <HomeContactQR qrCards={qrCards as any} />
    </div>
  )
}
