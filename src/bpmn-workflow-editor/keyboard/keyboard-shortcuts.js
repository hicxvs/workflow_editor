export function KeyboardShortCuts(shortcuts = {}) {

    const keyboardShortcuts = {
        ...shortcuts,
       
    };

    function getKeyboardCombination(event) {
        const keys = [];

        if (event.ctrlKey) {
            keys.push('ctrl');
        }

        if (event.shiftKey) {
            keys.push('shift');
        }

        if (event.altKey) {
            keys.push('alt');
        }

        keys.push(event.key.toLowerCase());
        return keys.join('+');
    }
        
    function handleKeydown(event) {
        const selectedKeyboardCombination = getKeyboardCombination(event);
        const handler = keyboardShortcuts[selectedKeyboardCombination];
        if (handler) {
            event.preventDefault();
            handler();
        }
    }
    
    window.addEventListener('keydown', handleKeydown);

    function destroy() {
        window.removeEventListener('keydown', handleKeydown);
    }

    return {
        destroy
    };
    
}