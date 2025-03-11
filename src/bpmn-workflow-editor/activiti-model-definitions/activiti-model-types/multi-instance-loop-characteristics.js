export default{
  name: 'MultiInstanceLoopCharacteristics',
  superClass: ['bpmn:MultiInstanceLoopCharacteristics'],
  properties: [
    { 
      name: 'collection', 
      isAttr: true,
      type: 'String',
      ns: { prefix: 'activiti', localName: 'collection', name: 'http://activiti.org/bpmn' }
    },
    { 
      name: 'elementVariable', 
      isAttr: true,
      type: 'String',
      ns: { prefix: 'activiti', localName: 'elementVariable', name: 'http://activiti.org/bpmn' }
    },
    { name: 'isSequential', type: 'Boolean', isAttr: true },
    { name: 'loopCardinality', type: 'String' },
    { name: 'completionCondition', type: 'String' }
  ]
};