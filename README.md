# Workflow UI - HICX Workflow Editor
The Workflow UI provides an intuitive, web-based interface for the creation, management, and collaboration of BPMN workflows. Users can now easily create new workflows, load existing ones, and manage drafts directly within the UI, eliminating the need for external tools like Eclipse & Activiti Designer.

[Learn more about Workflow UI and its capabilities](https://hicxsolutions.atlassian.net/wiki/spaces/RN/pages/5358616583/Workflow+UI+-+HICX+Workflow+Editor)
---

## Architertural approach - Observer Pattern & Event-Driven Architecture

- **Loose Coupling**: Components can communicate without directly depending on each other, making the codebase more modular and easier to maintain.

- **Scalability**: New features or listeners can be added without modifying existing logic, which supports growth and flexibility.

- **Improved Responsiveness**: Event-driven systems react to user actions, server responses, or other triggers in real time, enhancing user experience.

- **Code Reusability**: Observers and event handlers can be reused across different parts of the application, reducing duplication.

- **Simplified State Management**: Observers can track changes in state and update the UI or logic accordingly, which is especially useful in reactive frameworks Vue.
---

## Language
- Javascript

#### Tools
- Build tool ( vite )
- Workflow Framework ( bpmn-js )
- UI Framework ( vue )
- UI Component Framework ( vuetify )
- UI Code Editor Framework ( monaco-editor )
- Application State Manager ( pinia )
- Eventbus ( mitt )
- APIs Integration ( axios )

#### How to run locally
- **npm install** ( to install the required project dependencies )
- **npm run dev** ( to run the project locally )

#### How to check lint
- **npm run lint**
- **npm run lint:fix**

#### How to check application health
- **npm run audit**
