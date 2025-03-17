export function downloadDiagram(fileName, fileContent) {

    try {
        const blob = new Blob([fileContent], { type: 'text/xml' });
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

