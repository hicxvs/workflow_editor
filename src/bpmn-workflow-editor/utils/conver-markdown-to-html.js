export function convertMarkdownToHTML(markdown) {
    return markdown
      // Convert headers
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
      // Convert bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
  
      // Convert inline code
      .replace(/`([^`\n]+)`/gim, '<code>$1</code>')
  
      // Convert code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
  
      // Convert blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
  
      // Convert line breaks
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br />')
  
      // Wrap the whole thing in a paragraph for structure
      .replace(/^/, '<p>')
      .concat('</p>');
}