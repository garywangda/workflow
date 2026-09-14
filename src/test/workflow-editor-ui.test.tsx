import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MousePointer2 } from "lucide-react";
import { ReactFlowProvider } from "@xyflow/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";

import { AppIconButton } from "@/components/app/AppIconButton";
import { NodeLibrary } from "@/features/workflow-editor/components/library/NodeLibrary";
import { WorkflowDeleteDialog } from "@/features/workflow-editor/components/menus/WorkflowDeleteDialog";
import { BaseWorkflowNode } from "@/features/workflow-editor/components/nodes/BaseWorkflowNode";
import { workflowNodeTypes } from "@/features/workflow-editor/components/nodes/node-types";
import { WorkflowCanvas } from "@/features/workflow-editor/components/WorkflowCanvas";

afterEach(cleanup);

describe("workflow editor shadcn boundaries", () => {
  it("registers a dedicated condition branch node type", () => {
    expect(workflowNodeTypes).toHaveProperty("condition-branch");
  });

  it("keeps the parent input hidden while exposing three continuation points on a condition branch", () => {
    const BranchNode = workflowNodeTypes["condition-branch"];
    const branchProps = {
      id: "branch-yes",
      type: "condition-branch",
      data: { label: "Yes" },
      selected: false,
      dragging: false,
      zIndex: 0,
      selectable: true,
      deletable: true,
      draggable: true,
      isConnectable: true,
      positionAbsoluteX: 0,
      positionAbsoluteY: 0,
    } as ComponentProps<typeof BranchNode>;

    render(<ReactFlowProvider><BranchNode {...branchProps} /></ReactFlowProvider>);

    expect(screen.getByRole("group", { name: "Yes condition branch" })).toHaveTextContent("Yes");
    const inputAnchor = screen.getByLabelText("Condition branch input");
    expect(inputAnchor).toHaveClass("condition-branch-target-handle");
    expect(inputAnchor).not.toHaveClass("workflow-connection-handle");
    for (const position of ["left", "right", "bottom"]) {
      expect(screen.getByLabelText(`${position} branch connection point`)).toHaveClass("workflow-connection-handle");
    }
    expect(screen.queryByLabelText("top branch connection point")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Configuration status")).not.toBeInTheDocument();
  });

  it("shows yes and no branch children in the canvas example", () => {
    render(
      <ReactFlowProvider>
        <div style={{ width: 900, height: 700 }}>
          <WorkflowCanvas
            activeEditorTool="select"
            placementItem={null}
            onEditorToolChange={vi.fn()}
            onPlacementItemChange={vi.fn()}
          />
        </div>
      </ReactFlowProvider>,
    );

    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("renders a headed node card ordered as category, title, metadata, then description", () => {
    render(<ReactFlowProvider><BaseWorkflowNode
      type="task"
      semanticLabel="Human task"
      name="Review purchase request"
      description="Check the request details before finance review."
      assignee="Maya Chen"
      configStatus="Needs setup"
    /></ReactFlowProvider>);

    const category = screen.getByLabelText("Node category");
    const title = screen.getByText("Review purchase request");
    const owner = screen.getByText("Maya Chen");
    const description = screen.getByText("Check the request details before finance review.");

    expect(category).toHaveTextContent("Human task");
    expect(category.compareDocumentPosition(title)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(title.compareDocumentPosition(owner)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(owner.compareDocumentPosition(description)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.queryByText("Due")).not.toBeInTheDocument();
    expect(screen.queryByText("2 business days")).not.toBeInTheDocument();
    const configurationStatus = screen.getByLabelText("Configuration status");
    expect(configurationStatus).toHaveTextContent("Needs setup");
    expect(configurationStatus).toHaveAttribute("data-tone", "warning");
    expect(category).toContainElement(configurationStatus);
    expect(screen.queryByText(/pending|running|completed|failed/i)).not.toBeInTheDocument();
    expect(screen.getAllByLabelText(/connection point$/i)).toHaveLength(4);
  });

  it("gives icon-only application buttons an accessible name", () => {
    render(<AppIconButton label="Select tool"><MousePointer2 /></AppIconButton>);
    expect(screen.getByRole("button", { name: "Select tool" })).toBeInTheDocument();
  });

  it("shows only the seven workflow responsibility types initially", () => {
    render(<NodeLibrary />);

    const toolbar = screen.getByRole("navigation", { name: "Workflow node types" });
    expect(within(toolbar).getAllByRole("button").map((button) => button.textContent)).toEqual([
      "Trigger",
      "Human Task",
      "Approval",
      "Action",
      "Logic",
      "Wait",
      "End",
    ]);
    expect(screen.queryByRole("textbox", { name: "Search nodes" })).not.toBeInTheDocument();
    expect(screen.queryByText("Favorites")).not.toBeInTheDocument();
    expect(screen.queryByText("Choose a type")).not.toBeInTheDocument();
  });

  it.each([
    ["Trigger", ["Manual", "On a schedule", "Form submitted", "Record created", "Record updated", "Status changed", "Webhook received"]],
    ["Human Task", ["Complete a task", "Fill out a form", "Upload documents", "Review information", "Complete checklist"]],
    ["Approval", ["Single approver", "Any approver", "All approvers"]],
    ["Action", ["Send email", "Send message", "Create record", "Update record", "Create task in another system", "Generate document", "HTTP request"]],
    ["Logic", ["If / Else", "Switch", "Parallel", "Merge"]],
    ["Wait", ["For a duration", "Until date or time", "Until record date", "For an event", "Until condition"]],
    ["End", ["Success", "Rejected", "Cancelled", "Failed"]],
  ])("shows the %s presets in its second-level menu", async (toolbarType, presetNames) => {
    const user = userEvent.setup();
    render(<NodeLibrary />);

    await user.click(screen.getByRole("button", { name: toolbarType }));

    const presetList = screen.getByRole("list", { name: `${toolbarType} presets` });
    expect(within(presetList).getAllByRole("listitem").map((item) => item.textContent)).toEqual(
      presetNames,
    );
  });

  it("opens presets in the same toolbar and restores focus on return", async () => {
    const user = userEvent.setup();
    render(<NodeLibrary />);

    await user.click(screen.getByRole("button", { name: "Action" }));

    expect(screen.queryByRole("navigation", { name: "Workflow node types" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Action" })).toHaveFocus();
    expect(screen.getByRole("list", { name: "Action presets" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByRole("button", { name: "Action" })).toHaveFocus();
  });

  it("filters the open node preset list from the search field", async () => {
    const user = userEvent.setup();
    render(<NodeLibrary />);

    await user.click(screen.getByRole("button", { name: "Trigger" }));
    await user.type(screen.getByRole("searchbox", { name: "Search nodes" }), "record");

    const presetList = screen.getByRole("list", { name: "Trigger presets" });
    expect(within(presetList).getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Record created",
      "Record updated",
    ]);
  });

  it("marks the first preset as selected and lets the user select another preset", async () => {
    const user = userEvent.setup();
    render(<NodeLibrary />);

    await user.click(screen.getByRole("button", { name: "Trigger" }));

    expect(screen.getByRole("button", { name: "Manual" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "On a schedule" }));
    expect(screen.getByRole("button", { name: "Manual" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "On a schedule" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("cancels the controlled delete dialog with Escape", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<WorkflowDeleteDialog nodeCount={1} edgeCount={0} onCancel={onCancel} onConfirm={vi.fn()} />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus());
    await user.keyboard("{Escape}");

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("renders the delete confirmation on an opaque white surface", () => {
    render(<WorkflowDeleteDialog nodeCount={1} edgeCount={0} onCancel={vi.fn()} onConfirm={vi.fn()} />);

    expect(screen.getByRole("alertdialog")).toHaveClass("bg-white");
  });

  it("disables delete actions while asynchronous confirmation is pending", async () => {
    const user = userEvent.setup();
    let resolveConfirmation: (() => void) | undefined;
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => { resolveConfirmation = resolve; }));
    render(<WorkflowDeleteDialog nodeCount={2} edgeCount={1} onCancel={vi.fn()} onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.getByRole("button", { name: "Deleting…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    resolveConfirmation?.();
    await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce());
  });
});
