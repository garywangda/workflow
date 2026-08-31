import type { WorkflowNodeToolbarType } from "@/features/workflow-editor/types/node-toolbar";

export interface NodeLibraryPresetDefinition {
  id: string;
  label: string;
}

export const NODE_LIBRARY_PRESETS = {
  trigger: [
    { id: "manual", label: "Manual" },
    { id: "schedule", label: "On a schedule" },
    { id: "formSubmitted", label: "Form submitted" },
    { id: "recordCreated", label: "Record created" },
    { id: "recordUpdated", label: "Record updated" },
    { id: "statusChanged", label: "Status changed" },
    { id: "webhookReceived", label: "Webhook received" },
  ],
  humanTask: [
    { id: "completeTask", label: "Complete a task" },
    { id: "fillForm", label: "Fill out a form" },
    { id: "uploadDocuments", label: "Upload documents" },
    { id: "reviewInformation", label: "Review information" },
    { id: "completeChecklist", label: "Complete checklist" },
  ],
  approval: [
    { id: "singleApprover", label: "Single approver" },
    { id: "anyApprover", label: "Any approver" },
    { id: "allApprovers", label: "All approvers" },
  ],
  action: [
    { id: "sendEmail", label: "Send email" },
    { id: "sendMessage", label: "Send message" },
    { id: "createRecord", label: "Create record" },
    { id: "updateRecord", label: "Update record" },
    { id: "createExternalTask", label: "Create task in another system" },
    { id: "generateDocument", label: "Generate document" },
    { id: "httpRequest", label: "HTTP request" },
  ],
  logic: [
    { id: "ifElse", label: "If / Else" },
    { id: "switch", label: "Switch" },
    { id: "parallel", label: "Parallel" },
    { id: "merge", label: "Merge" },
  ],
  wait: [
    { id: "duration", label: "For a duration" },
    { id: "dateTime", label: "Until date or time" },
    { id: "recordDate", label: "Until record date" },
    { id: "event", label: "For an event" },
    { id: "condition", label: "Until condition" },
  ],
  end: [
    { id: "success", label: "Success" },
    { id: "rejected", label: "Rejected" },
    { id: "cancelled", label: "Cancelled" },
    { id: "failed", label: "Failed" },
  ],
} satisfies Record<WorkflowNodeToolbarType, readonly NodeLibraryPresetDefinition[]>;
