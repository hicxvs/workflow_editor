export default {
    name: 'ServiceTask',
    extends: ['bpmn:ServiceTask'],
    properties: [
        { name: 'expression', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'delegateExpression', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'class', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'resultVariable', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'exclusive', type: 'Boolean', isAttr: true, ns: { name: 'activiti' } },
        { name: 'skipExpression', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'serviceTaskExpressionType', type: 'String', isAttr: true, ns: { name: 'activiti' } },
    ]
};
