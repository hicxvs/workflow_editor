export default {
    name: 'UserTask',
    extends: ['bpmn:UserTask'],
    properties: [
        { name: 'candidateGroups', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'candidateUsers', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'formKey', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'assignee', type: 'String', isAttr: true, ns: { name: 'activiti' } },
        { name: 'dueDate', type: 'String', isAttr: true, ns: { name: 'activiti' } }
    ]
};
