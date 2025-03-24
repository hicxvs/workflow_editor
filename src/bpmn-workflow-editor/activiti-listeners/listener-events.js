export const ACTIVITI_LISTENER_EVENT_OPTIONS = Object.freeze({
    ['activiti:TaskListener']: [
        {
            value: 'create',
            label: 'Start'
        },
        {
            value: 'complete',
            label: 'End'
        }
    ],
    ['activiti:ExecutionListener']: [
        {
            value: 'start',
            label: 'Start'
        },
        {
            value: 'end',
            label: 'End'
        }
    ]
});