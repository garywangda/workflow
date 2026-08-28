import type { NodeCapabilityId } from "../types/workflow-node";

export interface NodeCapabilityDefinition {
  id: NodeCapabilityId;
  label: string;
  description: string;
}

export const NODE_CAPABILITY_DEFINITIONS = {
  setup: { id: "setup", label: "Setup", description: "Core identity and setup for this node." },
  assignment: { id: "assignment", label: "Assignment", description: "Who owns or completes this step." },
  form: { id: "form", label: "Form", description: "The form or fields used by this step." },
  input: { id: "input", label: "Input", description: "Data consumed by this node." },
  output: { id: "output", label: "Output", description: "Data produced by this node." },
  completion: { id: "completion", label: "Completion", description: "How a human step is completed." },
  approvalPolicy: { id: "approvalPolicy", label: "Approval Policy", description: "How approval decisions are collected." },
  rules: { id: "rules", label: "Rules", description: "Rules that govern this node." },
  branches: { id: "branches", label: "Branches", description: "Future workflow paths from this node." },
  timing: { id: "timing", label: "Timing", description: "Timing, due dates, or waiting behavior." },
  action: { id: "action", label: "Action", description: "The automated operation to perform." },
  notification: { id: "notification", label: "Notification", description: "Messages sent during this step." },
  retry: { id: "retry", label: "Retry", description: "Future retry policy for failures." },
  escalation: { id: "escalation", label: "Escalation", description: "Future escalation behavior." },
  exception: { id: "exception", label: "Exception", description: "Future exception handling behavior." },
  permissions: { id: "permissions", label: "Permissions", description: "Future visibility and access settings." },
  appearance: { id: "appearance", label: "Appearance", description: "Visual presentation of the semantic node." },
} satisfies Record<NodeCapabilityId, NodeCapabilityDefinition>;
