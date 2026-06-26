import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import LoginForm from "./LoginForm"
import { sql } from "../../lib/db"
import type { Session } from "next-auth"

export default async function AdminPage() {
  const session: Session | null = await getServerSession(authOptions)

  // Check login session
  if (!session?.user?.email) {
    return (
      <section className="py-12">
        <LoginForm />
      </section>
    )
  }

  // Fetch counts from Neon Postgres Database
  let projects: any[] = []
  let experiences: any[] = []
  let certificates: any[] = []
  let expertise: any[] = []

  try {
    projects = await sql`SELECT id FROM projects`
  } catch (err) {
    console.error('Failed to fetch projects count:', err)
  }

  try {
    experiences = await sql`SELECT id FROM experiences`
  } catch (err) {
    console.error('Failed to fetch experiences count:', err)
  }

  try {
    certificates = await sql`SELECT id FROM certificates`
  } catch (err) {
    console.error('Failed to fetch certificates count:', err)
  }

  try {
    expertise = await sql`SELECT id FROM site_cards WHERE section = 'expertise'`
  } catch (err) {
    console.error('Failed to fetch expertise count:', err)
  }

  let messages: any[] = []
  try {
    messages = await sql`SELECT id FROM contact_messages`
  } catch (err) {
    console.error('Failed to fetch messages count:', err)
  }

  return (
    <section className="text-center py-12 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold inline-block bg-neo-yellow border-neo border-neo-border px-6 py-3 shadow-neo -rotate-1 text-black">
        Admin Console
      </h1>
      <p className="mt-8 text-lg font-bold text-[color:var(--neo-ink-soft)] max-w-xl mx-auto leading-relaxed">
        Welcome back, Aman! Use the navigation tabs directly below the header logo to manage your projects, work experience, certifications, expertise cards, and read contact messages.
      </p>

      {/* Neat workspace welcome grid */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="neo-card p-6 bg-[color:var(--neo-surface)] border-neo flex flex-col items-center hover:scale-[1.02] transition-transform">
          <span className="text-4xl mb-3">📁</span>
          <h3 className="font-bold text-lg mb-1">Projects</h3>
          <p className="text-xs text-[color:var(--neo-ink-soft)] text-center mb-4">Update your featured and sub-projects</p>
          <a href="/console/projects" className="neo-btn neo-btn-blue text-xs py-1.5 px-3">Go to Projects</a>
        </div>

        <div className="neo-card p-6 bg-[color:var(--neo-surface)] border-neo flex flex-col items-center hover:scale-[1.02] transition-transform">
          <span className="text-4xl mb-3">💼</span>
          <h3 className="font-bold text-lg mb-1">Experience</h3>
          <p className="text-xs text-[color:var(--neo-ink-soft)] text-center mb-4">Manage your work history timeline</p>
          <a href="/console/experience" className="neo-btn neo-btn-lime text-xs py-1.5 px-3">Go to Experience</a>
        </div>

        <div className="neo-card p-6 bg-[color:var(--neo-surface)] border-neo flex flex-col items-center hover:scale-[1.02] transition-transform">
          <span className="text-4xl mb-3">⚡</span>
          <h3 className="font-bold text-lg mb-1">Expertise</h3>
          <p className="text-xs text-[color:var(--neo-ink-soft)] text-center mb-4">Edit expertise cards & tech animations</p>
          <a href="/console/expertise" className="neo-btn neo-btn-pink text-xs py-1.5 px-3">Go to Expertise</a>
        </div>
      </div>
    </section>
  )
}