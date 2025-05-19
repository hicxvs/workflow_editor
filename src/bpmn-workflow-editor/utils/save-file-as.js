export async function saveFileAs(fileName, fileContent) {
    try {
        const options = {
            suggestedName: `${fileName}.bpmn`,
            types: [{
                description: "XML Files",
                accept: { "text/xml": [".xml", ".bpmn"] }
            }]
        };

        const {xml} = fileContent;

        const fileHandle = await window.showSaveFilePicker(options);
        const writable = await fileHandle.createWritable();

        await writable.write(xml);
        await writable.close();

    } catch (error) {
        console.error("Error saving file:", error);
        throw error;
    }
}