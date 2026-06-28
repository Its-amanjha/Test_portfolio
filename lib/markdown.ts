/**
 * A lightweight, zero-dependency Markdown-to-HTML converter.
 * Supports headings, bold, italics, code blocks, inline code, list items,
 * and blockquotes with custom class hooks for Neobrutalist styling.
 */
export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return ''

  // 1. Escape basic HTML tags to prevent XSS
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 2. Code blocks: ```javascript ... ```
  html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, (_, lang, code) => {
    return `<pre class="neo-code-block"><code class="language-${lang}">${code.trim()}</code></pre>`
  })

  // 3. Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="neo-inline-code">$1</code>')

  // 4. Headings (H1 to H3)
  html = html.replace(/^### (.*?)$/gm, '<h3 class="neo-md-h3">$1</h3>')
  html = html.replace(/^## (.*?)$/gm, '<h2 class="neo-md-h2">$1</h2>')
  html = html.replace(/^# (.*?)$/gm, '<h1 class="neo-md-h1">$1</h1>')

  // 5. Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  // 6. Italic: *text*
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  // 7. Blockquotes: > quote
  // Re-enable gt symbol for parsing blockquotes
  html = html.replace(/^&gt;\s?(.*?)$/gm, '<blockquote class="neo-md-quote">$1</blockquote>')

  // 8. Lists: - item or * item
  html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li class="neo-md-li">$1</li>')

  // 9. Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="neo-md-link">$1</a>')

  // 10. Paragraphs (split double newlines and wrap remaining plain text lines)
  const segments = html.split(/\n\n+/)
  html = segments
    .map((seg) => {
      const trimmed = seg.trim()
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<li')
      ) {
        return seg
      }
      return `<p class="neo-md-p">${seg.replace(/\n/g, '<br />')}</p>`
    })
    .join('\n')

  return html
}
