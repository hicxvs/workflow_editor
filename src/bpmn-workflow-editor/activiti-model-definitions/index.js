import Value from './activiti-model-types/value';
import Message from './activiti-model-types/message';
import Error from './activiti-model-types/error';
import FormProperty from './activiti-model-types/form-property';
import UserTask from './activiti-model-types/user-task';
import StartEvent from './activiti-model-types/start-event';
import In from './activiti-model-types/in';
import Out from './activiti-model-types/out';
import ServiceTask from './activiti-model-types/service-task';
import MultiInstanceLoopCharacteristics from './activiti-model-types/multi-instance-loop-characteristics';
import TaskListener from './activiti-model-types/task-listener';
import ExecutionListener from './activiti-model-types/execution-listener';
import Field from './activiti-model-types/field';
import ScriptTask from './activiti-model-types/script-task';

export default {
    name: 'Activiti',
    uri: 'http://activiti.org/bpmn',
    prefix: 'activiti',
    xml: {
      tagAlias: 'lowerCase'
    }, 
    associations: [],
    types: [
        Value,
        Message,
        Error,
        FormProperty,
        UserTask,
        StartEvent,
        In,
        Out,
        ServiceTask,
        MultiInstanceLoopCharacteristics,
        TaskListener,
        ExecutionListener,
        Field,
        ScriptTask
    ]
};