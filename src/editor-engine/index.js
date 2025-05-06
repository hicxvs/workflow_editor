import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';


export function EditorEngine() {

    function createCodeEditor(container, editorLanguage, editorValue) {
        try {
            return  monaco.editor.create(container, {
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 18,
                automaticLayout: true,
                scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible'
                },
                lineNumbers: 'on',
                roundedSelection: false,
                renderLineHighlight: 'all',
                wordWrap: 'on',
                language: editorLanguage || 'java',
                value: editorValue || '',
                readOnly: true,
                theme: 'vs-dark'
            });
        } catch (error) {
            console.error("Error during code editor initialization:", error);
        }
    }


    return {
        createCodeEditor,
    };

}