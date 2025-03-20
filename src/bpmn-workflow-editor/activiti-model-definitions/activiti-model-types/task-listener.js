export const TaskListenerType = 'TaskListener';

export default {
    name: 'TaskListener',
    superClass: ['Element'],
    properties: [
        { name: 'event', type: 'String', isAttr: true },
        { name: 'class', type: 'String', isAttr: true },
        { name: 'fields', type: 'Field', isMany: true },
        { name: 'expression', type: 'String', isAttr: true },
        { name: 'delegateExpression', type: 'String', isAttr: true }  
    ]
};