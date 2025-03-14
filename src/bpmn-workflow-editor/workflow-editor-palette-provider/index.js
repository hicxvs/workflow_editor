import 'bpmn-js/dist/assets/diagram-js.css';

import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';

function WorkflowEditorPaletteProvider(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate ) {

    PaletteProvider.call(
      this, palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate
    );
  
    this.getPaletteEntries = function() {
      const entries = PaletteProvider.prototype.getPaletteEntries.call(this);
      ['create.data-store', 'create.data-object'].forEach(entry => delete entries[entry]);
      return entries;
    };
}

WorkflowEditorPaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'spaceTool',
    'lassoTool',
    'handTool',
    'globalConnect',
    'translate',
];
  
export default WorkflowEditorPaletteProvider;