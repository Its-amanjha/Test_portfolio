import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manage Blogs',
  description: 'Add, edit, or delete portfolio blog posts.',
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
