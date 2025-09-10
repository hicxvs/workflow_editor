export function formatMarkdown(markdown) {
    return markdown
        // Trim extra spaces
        .trim()
        // Normalize line breaks
        .replace(/\r\n|\r/g, '\n')
        // Ensure a newline before each header (if missing)
        .replace(/(?<!\n)\n?(?=##? )/g, '\n\n')
        // Add newline after headers
        .replace(/(##? .+?)\n(?!\n)/g, '$1\n\n')
        // Ensure code blocks are surrounded by newlines
        .replace(/```([\s\S]*?)```/g, (match, code) => `\n\`\`\`\n${code.trim()}\n\`\`\`\n`)
        // Normalize numbered lists
        .replace(/\n\d+\. /g, '\n\n$&')
        // Normalize spacing around bullet points (if any)
        .replace(/\n- /g, '\n\n- ')
        // Remove multiple consecutive empty lines
        .replace(/\n{3,}/g, '\n\n');
}