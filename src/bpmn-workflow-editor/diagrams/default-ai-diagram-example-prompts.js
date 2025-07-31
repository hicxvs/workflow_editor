export const DEFAULT_AI_DIAGRAM_EXAMPLE_PROMPTS = Object.freeze({
    generate_examples: [
        {
            process_name: 'Simple supplier onboarding process',
            process_definition: 'This is a supplier onboarding process.It should start with a request from a user to onboard a new supplier. This should collect initial data about the supplier including a contact person to send requests to. This should then route for approval, if no approval then send back as rejected, if approved, email the supplier asking for more data to be provided. Once the supplier has submitted their data an email should be sent to the requestor informing them . The requestor should then validate the data and if appropriate approve the supplier, if more data is needed the email supplier and ask for additional data. If the supplier is not suitable then the supplier should be marked as Rejected.'
        },
        {
            process_name: 'PTO appoval process',
            process_definition: 'This is a PTO approval process. It should start with a request from a user to book PTO. If the request is less than 10 days then route to their manager otherwise route to the department leaders. After the request has been made, please email the appropriate approver. The approval should the ask for additional information, approve or reject the request, all outcomes should email the initial requestor.'
        }
    ],
    analyze_examples: [
        {
            process_name: 'Provide a detailed description of this business process',
            process_definition: `You are a business analyst expert in bpmn and activiti, 
    please provide a detailed description of this business process,
    please also add a list of all scripts being called, they are referenced like so:
    scripts.execute('SM2.REQUEST_ONBOARD.update_partner_local_partner',execution);
    where the script name = SM2.REQUEST_ONBOARD.update_partner_local_partner.
    Also please add as section detailing call outs to other workflows, Please add a section detailing the fields in use`
        }
    ]
});