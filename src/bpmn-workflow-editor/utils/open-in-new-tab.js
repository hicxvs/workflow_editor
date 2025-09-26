export function openInNewTab(url) {
    if (typeof url !== 'string' || !url.trim()) {
        console.error('A valid URL must be provided');
        return;
    }

    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(formattedUrl, '_blank');
}