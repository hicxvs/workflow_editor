export default {
    name: 'ScriptTask',
    superClass: ['bpmn:ScriptTask'],
    properties: [
        { name: 'scriptFormat', type: 'String', isAttr: true },
        { name: 'script', type: 'String' },
        { name: 'autoStoreVariables', type: 'Boolean', isAttr: true, ns: { name: 'activiti' } },
        { name: 'resultVariable', type: 'String', isAttr: true, ns: { name: 'activiti' } }
    ]
};
