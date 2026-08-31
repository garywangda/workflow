import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MousePointer2 } from "lucide-react";
import { ReactFlowProvider } from "@xyflow/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppIconButton } from "@/components/app/AppIconButton";
import { NodeLibrary } from "@/features/workflow-editor/components/library/NodeLibrary";
import { WorkflowDeleteDialog } from "@/features/workflow-editor/components/menus/WorkflowDeleteDialog";
import { BaseWorkflowNode } from "@/features/workflow-editor/components/nodes/BaseWorkflowNode";

afterEach(cleanup);

describe("workflow editor shadcn boundaries", () => {
  it("renders a compact human task card with semantic metadata and four connection points", () => {
    render(<ReactFlowProvider><BaseWorkflowNode
      type="task"
      semanticLabel="Human task"
      name="Review purchase request"
      description="Check the request details before finance review."
      assignee="Maya Chen"
      summary={{ label: "Due", value: "2 business days" }}
      configStatus="Needs setup"
      icon={MousePointer2}
    /></ReactFlowProvider>);

    expect(screen.getByText("Human task")).toBeInTheDocument();
    expect(screen.getByText("Review purchase request")).toBeInTheDocument();
    expect(screen.getByText("Check the request details before finance review.")).toBeInTheDocument();
    expect(screen.getByText("Maya Chen")).toBeInTheDocument();
    expect(screen.getByText("Due")).toBeInTheDocument();
    expect(screen.getByText("2 business days")).toBeInTheDocument();
    expect(screen.getByText("Needs setup")).toBeInTheDocument();
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
  });

  it("opens a placeholder in the same toolbar and restores focus on return", async () => {
    const user = userEvent.setup();
    render(<NodeLibrary />);

    await user.click(screen.getByRole("button", { name: "Action" }));

    expect(screen.queryByRole("navigation", { name: "Workflow node types" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Action" })).toHaveFocus();
    expect(screen.getByText("Options for this node type will appear here.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByRole("button", { name: "Action" })).toHaveFocus();
  });

  it("cancels the controlled delete dialog with Escape", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<WorkflowDeleteDialog nodeCount={1} edgeCount={0} onCancel={onCancel} onConfirm={vi.fn()} />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus());
    await user.keyboard("{Escape}");

    expect(onCancel).toHaveBeenCalledOnce();
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
