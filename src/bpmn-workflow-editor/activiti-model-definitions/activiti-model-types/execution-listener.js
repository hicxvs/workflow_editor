export default {
    name: 'ExecutionListener',
    superClass: ['Element'],
    properties: [
        { name: 'event', type: 'String', isAttr: true },
        { name: 'class', type: 'String', isAttr: true },
        { name: 'expression', type: 'String', isAttr: true },
        { name: 'delegateExpression', type: 'String', isAttr: true },
        { name: 'fields', type: 'Field', isMany: true }
    ]
};
