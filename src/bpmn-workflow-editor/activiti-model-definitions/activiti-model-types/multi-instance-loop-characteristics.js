export default {
    name: 'MultiInstanceLoopCharacteristics',
    superClass: ['bpmn:MultiInstanceLoopCharacteristics'],
    properties: [
      { 
        name: 'collection', 
        type: 'String', 
        isAttr: true, 
        ns: { prefix: 'activiti', localName: 'collection', name: 'http://activiti.org/bpmn' }
      },
      { 
        name: 'elementVariable', 
        type: 'String', 
        isAttr: true, 
        ns: { prefix: 'activiti', localName: 'elementVariable', name: 'http://activiti.org/bpmn' }
      },
      { 
        name: 'isSequential', 
        type: 'Boolean', 
        isAttr: true 
      },
      { 
        name: 'loopCardinality', 
        type: 'String', 
        isAttr: true 
      },
      { 
        name: 'completionCondition', 
        type: 'String', 
        isAttr: true 
      }
    ]
};