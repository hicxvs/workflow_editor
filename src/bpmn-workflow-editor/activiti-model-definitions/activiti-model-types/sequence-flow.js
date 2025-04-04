export default {
    name: 'SequenceFlow',
    extends: ['bpmn:SequenceFlow'],
    properties: [
        { name: 'labelWith', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'skipExpression', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'condition', type: 'String', isAttr: true, ns: { name: 'activiti' } }
    ]
};
