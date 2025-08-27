import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export function EditorEngine() {

    let engine = null;

    function createCodeEditor(container, editorLanguage, editorValue, editorReadOnly=true) {
        try {
            engine = monaco.editor.create(container, {
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
                readOnly: editorReadOnly,
                theme: 'vs-dark'
            });

            return engine;
        } catch (error) {
            console.error("Error during code editor initialization:", error);
        }
    }

    function getValue() {
        if(!engine) {
            return;
        }

        return engine.getValue();
    }

    return {
        createCodeEditor,
        getValue
    };
}