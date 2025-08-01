export function convertMarkdownToHTML(markdown, styles = {}) {
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