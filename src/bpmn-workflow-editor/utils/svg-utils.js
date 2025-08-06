export function SVGUtils() {

    function cleanSvg(svgString) {
        // Remove XML and DOCTYPE declarations
        svgString = svgString.replace(/<\?xml[^>]*\?>\s*/i, '');
        svgString = svgString.replace(/<!DOCTYPE[^>]*>\s*/i, '');
    
        // Decode common escaped characters
        svgString = svgString.replace(/\\x3C/g, '<')
                                .replace(/\\n/g, '')
                                .replace(/\\'/g, "'")
                                .replace(/\\"/g, '"');
    
        // Optional: strip comments
        svgString = svgString.replace(/<!--[\s\S]*?-->/g, '');
    
        return svgString.trim();
    }

    function getSvgDimensions(svgString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        
        let width = svgEl.getAttribute("width");
        let height = svgEl.getAttribute("height");
        
        if (!width || !height) {
            const viewBox = svgEl.getAttribute("viewBox");
            if (viewBox) {
            const [, , vbWidth, vbHeight] = viewBox.split(" ");
            width = vbWidth;
            height = vbHeight;
            } else {
            width = 300;
            height = 150;
            }
        }
        
        return {
            width: parseInt(width),
            height: parseInt(height)
        };
    }

    function loadImageFromSvg(svgString) {
        return new Promise((resolve, reject) => {
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const img = new Image();
        
            img.onload = () => resolve({ img, url });
            img.onerror = reject;
            img.src = url;
        });
    }
      
    async function convertSvgToImage(svgString, format) {
        const { width, height } = getSvgDimensions(svgString);
        const { img, url } = await loadImageFromSvg(svgString);
    
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
    
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
    
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        return canvas.toDataURL(mimeType);
    }

    function downloadImage(dataUrl, filename = 'image.png') {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    async function downloadDiagramImage(svgString, imageName, format) {
        if(!svgString) {
            return;
        }

        try {
            const dataUrl = await convertSvgToImage(svgString, format);
            downloadImage(dataUrl, `${imageName}.${format}`);
        } catch(error) {
            console.error("Error during diagram download:", error);
            throw error;            
        }
    }
      
    return {
        cleanSvg,
        downloadDiagramImage
    };
}