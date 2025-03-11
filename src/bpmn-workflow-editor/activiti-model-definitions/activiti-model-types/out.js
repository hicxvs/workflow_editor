export default {
    name: 'Out',
    superClass: ['Element'],
    properties: [
        { name: 'source', type: 'String', isAttr: true },
        { name: 'sourceExpression', type: 'String', isAttr: true },
        { name: 'target', type: 'String', isAttr: true },
        { name: 'targetExpression', type: 'String', isAttr: true }
    ]
};
