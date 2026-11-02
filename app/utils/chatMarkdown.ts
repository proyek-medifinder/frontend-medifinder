import MarkdownIt from 'markdown-it'

// AI replies may contain Markdown, but must never execute raw HTML.
const markdown = new MarkdownIt({ html: false, breaks: true, linkify: true })

const defaultLinkOpen = markdown.renderer.rules.link_open
markdown.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
    tokens[index]!.attrSet('target', '_blank')
    tokens[index]!.attrSet('rel', 'noopener noreferrer')
    return defaultLinkOpen
        ? defaultLinkOpen(tokens, index, options, env, renderer)
        : renderer.renderToken(tokens, index, options)
}

// Keep image descriptions without loading remote images inside a reply.
markdown.renderer.rules.image = (tokens, index) =>
    markdown.utils.escapeHtml(tokens[index]!.content)

markdown.renderer.rules.table_open = () => '<div class="chat-table-scroll"><table>'
markdown.renderer.rules.table_close = () => '</table></div>'

export const renderChatMarkdown = (text: string) => markdown.render(text)
