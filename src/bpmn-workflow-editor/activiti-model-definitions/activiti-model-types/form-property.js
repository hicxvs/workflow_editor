export const FormPropertyType = 'FormProperty';

export default {
    name: 'FormProperty',
    superClass: ['Element'],
    properties: [
        { name: 'id', type: 'String', isAttr: true },
        { name: 'name', type: 'String', isAttr: true },
        { name: 'type', type: 'String', isAttr: true },
        { name: 'expression', type: 'String', isAttr: true },
        { name: 'variable', type: 'String', isAttr: true },
        { name: 'default', type: 'String', isAttr: true },
        { name: 'patten', type: 'String', isAttr: true },
        { name: 'required', type: 'String', isAttr: true },
        { name: 'writable', type: 'String', isAttr: true },
        { name: 'readable', type: 'String', isAttr: true },
        { name: 'formValue', type: 'Value', isMany: true }
    ]
};