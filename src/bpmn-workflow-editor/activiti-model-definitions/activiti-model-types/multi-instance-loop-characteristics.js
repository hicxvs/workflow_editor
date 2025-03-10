export default {
    name: 'MultiInstanceLoopCharacteristics',
    superClass: ['bpmn:MultiInstanceLoopCharacteristics'],
    properties: [
        { name: 'collection', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'elementVariable', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'loopCardinality', type: 'String', isAttr: true },
        { name: 'completionCondition', type: 'String' },
        { name: 'isSequential', type: 'Boolean', isAttr: true }
    ]
};
