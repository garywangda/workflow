import { FilePlus2, Globe2, Mail, PencilLine, type LucideIcon } from "lucide-react";
import type { ActionPresetId } from "../types/action-preset";
import type { NodeConfig } from "../types/workflow-node";

// 自动化节点的快捷预设；预设只提供默认配置，最终仍由 workflow-node factory 创建 Node。
export interface ActionPresetDefinition {
  id: ActionPresetId;
  label: string;
  description: string;
  icon: LucideIcon;
  actionType: string;
  defaultConfig: NodeConfig;
  keywords: readonly string[];
}

export const ACTION_PRESETS = {
  createRecord: { id: "createRecord", label: "Create Record", description: "Create a record in a connected system.", icon: FilePlus2, actionType: "createRecord", defaultConfig: { action: { presetId: "createRecord" } }, keywords: ["automation", "record", "create"] },
  updateRecord: { id: "updateRecord", label: "Update Record", description: "Update a record in a connected system.", icon: PencilLine, actionType: "updateRecord", defaultConfig: { action: { presetId: "updateRecord" } }, keywords: ["automation", "record", "update"] },
  sendMessage: { id: "sendMessage", label: "Send Message", description: "Send a message to a person or channel.", icon: Mail, actionType: "sendMessage", defaultConfig: { action: { presetId: "sendMessage" } }, keywords: ["automation", "message", "notification"] },
  httpRequest: { id: "httpRequest", label: "HTTP Request", description: "Call an external HTTP endpoint.", icon: Globe2, actionType: "httpRequest", defaultConfig: { action: { presetId: "httpRequest" } }, keywords: ["automation", "http", "api", "request"] },
} satisfies Record<ActionPresetId, ActionPresetDefinition>;
