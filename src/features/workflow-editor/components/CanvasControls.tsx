import { useCallback, useState } from "react";
import { ControlButton, Controls, type Viewport, useOnViewportChange } from "@xyflow/react";

// 画布控制器通过 React Flow 的 viewport hooks 操作视口，不直接修改节点或 Edge。
export function CanvasControls() {
  const [zoom, setZoom] = useState(1);

  const handleViewportChange = useCallback((viewport: Viewport) => {
    setZoom((currentZoom) => {
      if (Math.abs(currentZoom - viewport.zoom) < 0.001) {
        return currentZoom;
      }

      return viewport.zoom;
    });
  }, []);

  useOnViewportChange({
    onChange: handleViewportChange,
  });

  const zoomPercent = Math.round(zoom * 100);

  return (
    <Controls
      className="canvas-controls"
      position="bottom-center"
      orientation="horizontal"
      showZoom
      showFitView
      showInteractive={false}
      aria-label="Canvas zoom controls"
    >
      <ControlButton
        className="canvas-controls__zoom-indicator"
        disabled
        aria-label={`Current zoom ${zoomPercent}%`}
        title={`Current zoom ${zoomPercent}%`}
      >
        {zoomPercent}%
      </ControlButton>
    </Controls>
  );
}
