export function downloadDiagram(fileName, fileContent) {

    try {
        const {xml} = fileContent;
        const blob = new Blob([xml], { type: 'text/xml' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.bpmn`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error("Error during diagram download:", error);
        throw error;
    }
}

