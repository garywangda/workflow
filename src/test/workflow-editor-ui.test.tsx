import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MousePointer2 } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppIconButton } from "@/components/app/AppIconButton";
import { NodeLibrary } from "@/features/workflow-editor/components/library/NodeLibrary";
import { WorkflowDeleteDialog } from "@/features/workflow-editor/components/menus/WorkflowDeleteDialog";

afterEach(cleanup);

describe("workflow editor shadcn boundaries", () => {
  it("gives icon-only application buttons an accessible name", () => {
    render(<AppIconButton label="Select tool"><MousePointer2 /></AppIconButton>);
    expect(screen.getByRole("button", { name: "Select tool" })).toBeInTheDocument();
  });

  it("keeps Node Library search and PlacementItem output unchanged", async () => {
    const user = userEvent.setup();
    const onPlacementItemChange = vi.fn();
    render(<NodeLibrary placementItem={null} onPlacementItemChange={onPlacementItemChange} />);

    await user.type(screen.getByRole("textbox", { name: "Search nodes" }), "http");
    await user.click(screen.getByRole("button", { name: "HTTP Request" }));

    expect(onPlacementItemChange).toHaveBeenCalledWith({ kind: "action-preset", presetId: "httpRequest" });
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
