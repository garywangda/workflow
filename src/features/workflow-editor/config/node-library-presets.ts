import type { WorkflowNodeToolbarType } from "@/features/workflow-editor/types/node-toolbar";
import type { WorkflowNodePlacement } from "@/features/workflow-editor/types/placement";

export interface NodeLibraryPresetDefinition {
  id: string;
  label: string;
}

type PlacementDefinition = Omit<WorkflowNodePlacement, "kind" | "presetName">;

const PRESET_PLACEMENTS: Record<string, PlacementDefinition> = {
  manual: { type: "trigger", presetId: "manual" },
  schedule: { type: "trigger", presetId: "schedule" },
  completeTask: { type: "task", presetId: "completeTask" },
  fillForm: { type: "form", presetId: "fillForm" },
  uploadDocuments: { type: "task", presetId: "completeTask", presetConfig: { evidence: true } },
  reviewInformation: { type: "task", presetId: "completeTask" },
  completeChecklist: { type: "task", presetId: "completeTask" },
  singleApprover: { type: "approval", presetId: "approval", presetConfig: { approvalRule: "all" } },
  anyApprover: { type: "approval", presetId: "approval", presetConfig: { approvalRule: "any" } },
  allApprovers: { type: "approval", presetId: "approval", presetConfig: { approvalRule: "all" } },
  sendMessage: { type: "action", presetId: "sendMessage" },
  updateRecord: { type: "action", presetId: "updateData" },
  ifElse: { type: "condition", presetId: "ifElse" },
  parallel: { type: "parallel", presetId: "parallel" },
  merge: { type: "merge" },
  duration: { type: "wait", presetId: "duration", presetConfig: { waitMode: "duration" } },
  dateTime: { type: "wait", presetId: "duration", presetConfig: { waitMode: "date" } },
  recordDate: { type: "wait", presetId: "duration", presetConfig: { waitMode: "field" } },
  success: { type: "end", presetId: "success", presetConfig: { result: "Completed" } },
  rejected: { type: "end", presetId: "terminated", presetConfig: { result: "Rejected" } },
  cancelled: { type: "end", presetId: "terminated", presetConfig: { result: "Cancelled" } },
  failed: { type: "end", presetId: "terminated", presetConfig: { result: "Failed" } },
};

const EVENT_PRESETS = new Set(["formSubmitted", "recordCreated", "recordUpdated", "statusChanged", "webhookReceived", "event"]);
const EXTERNAL_PRESETS = new Set(["sendEmail", "createRecord", "createExternalTask", "generateDocument", "httpRequest"]);

export function resolveNodeLibraryPlacement(preset: NodeLibraryPresetDefinition): { placement: WorkflowNodePlacement | null; unavailableReason?: string } {
  if (EVENT_PRESETS.has(preset.id)) return { placement: null, unavailableReason: "Event connections are not available in this round." };
  if (EXTERNAL_PRESETS.has(preset.id)) return { placement: null, unavailableReason: "External service connections are not available in this round." };
  const definition = PRESET_PLACEMENTS[preset.id];
  if (!definition) return { placement: null, unavailableReason: "This preset is not available in the current configuration model." };
  return { placement: { kind: "workflow-node", ...definition, presetName: preset.label } };
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
