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
    
        svgString = svgString.replace(/<!--[\s\S]*?-->/g, '');
        return svgString.trim();
    }

    function applyViewboxPadding(svgString, padding = 60) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
    
        const viewBox = svgEl.getAttribute("viewBox");
        if (viewBox) {
          const [x, y, width, height] = viewBox.split(" ").map(Number);
          const paddedViewBox = [
            x - padding,
            y - padding,
            width + padding * 2,
            height + padding * 2
          ];
          svgEl.setAttribute("viewBox", paddedViewBox.join(" "));
          svgEl.setAttribute("width", paddedViewBox[2]);
          svgEl.setAttribute("height", paddedViewBox[3]);
        }
    
        return new XMLSerializer().serializeToString(svgEl);
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
        const paddedSvg = applyViewboxPadding(svgString);
        const { width, height } = getSvgDimensions(paddedSvg);
        const { img, url } = await loadImageFromSvg(paddedSvg);
    
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
    
        const ctx = canvas.getContext('2d');
    
        if (format === 'jpg') {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    
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
            const cleandedSvg = cleanSvg(svgString);
            const dataUrl = await convertSvgToImage(cleandedSvg, format);
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