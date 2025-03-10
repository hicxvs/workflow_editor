import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';

function WorkflowEditorPaletteProvider(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate ) {

    PaletteProvider.call(
      this, palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate
    );
  
    this.getPaletteEntries = function() {
      const entries = PaletteProvider.prototype.getPaletteEntries.call(this);
  
      // Example: Remove existing entries
      delete entries['create.data-store'];
      delete entries['create.data-object'];
    
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