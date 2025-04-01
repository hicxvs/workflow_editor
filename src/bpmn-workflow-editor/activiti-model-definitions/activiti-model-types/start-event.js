export default {
    name: 'StartEvent',
    extends: ['bpmn:StartEvent'],
    properties: [
        { name: 'async', type: 'Boolean', isAttr: true, ns: { name: 'activiti' } },
        { name: 'formKey', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'initiator', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'priority', type: 'String', isAttr: true, ns: { name: 'activiti' } },

    ]
};
