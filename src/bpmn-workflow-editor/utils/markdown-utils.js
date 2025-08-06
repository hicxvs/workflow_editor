export function MarkdownUtils() {

    function formatMarkdown(markdown) {
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

    function extracTitle(text) {
        const match = text.match(/^# (.+): (.+)/m);
        return match ? `${match[2]}` : null;
    }

    function convertMarkdownToHTML(markdown, styles = {}) {
        const styleTag = (tag) => {
          const styleObj = styles[tag];
          if (!styleObj) return '';
          const styleString = Object.entries(styleObj)
            .map(([key, value]) => `${key}: ${value};`)
            .join(' ');
          return ` style="${styleString}"`;
        };
      
        return markdown
          .replace(/^###### (.*$)/gim, (_, text) => `<h6${styleTag('h6')}>${text}</h6>`)
          .replace(/^##### (.*$)/gim, (_, text) => `<h5${styleTag('h5')}>${text}</h5>`)
          .replace(/^#### (.*$)/gim, (_, text) => `<h4${styleTag('h4')}>${text}</h4>`)
          .replace(/^### (.*$)/gim, (_, text) => `<h3${styleTag('h3')}>${text}</h3>`)
          .replace(/^## (.*$)/gim, (_, text) => `<h2${styleTag('h2')}>${text}</h2>`)
          .replace(/^# (.*$)/gim, (_, text) => `<h1${styleTag('h1')}>${text}</h1>`)
      
          .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
          .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      
          .replace(/`([^`\n]+)`/gim, '<code>$1</code>')
          .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
          .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
          .replace(/\n{2,}/g, '</p><p>')
          .replace(/\n/g, '<br />')
          .replace(/^/, '<p>')
          .concat('</p>');
    }

    function downloadMarkdown(markdownContent, filename) {
        if (!filename.endsWith('.md')) {
            filename += '.md';
        }
        
        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }
      
    return {
        formatMarkdown,
        extracTitle,
        convertMarkdownToHTML,
        downloadMarkdown
    };
}