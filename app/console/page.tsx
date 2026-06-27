import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import { AuthForms } from "@/components/blocks/application"
import { sql } from "../../lib/db"
import type { Session } from "next-auth"
import { Suspense } from "react"

export default async function AdminPage() {
  const session: Session | null = await getServerSession(authOptions)

  // Check login session
  if (!session?.user?.email) {
    return (
      <section className="py-12">
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-neo-border border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <AuthForms.Login />
        </Suspense>
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
      <p className="mt-3 text-sm font-bold text-[color:var(--neo-muted)] max-w-xl mx-auto bg-[color:var(--neo-surface-2)] border-2 border-dashed border-neo-border p-2 rounded">
        💡 To edit your <strong>Contact Details</strong> or <strong>QR Codes</strong>, simply visit the <a href="/" className="underline hover:text-black">Public Home Page</a>. Since you are logged in as admin, you will see a settings gear icon (⚙️) on those cards to edit and save them directly!
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