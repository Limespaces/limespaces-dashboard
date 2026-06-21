"use client";

import { API, ApiVersion } from "@/api/API";
import { LoadingScreen } from "@/components/screens/loading";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const VncScreen = dynamic(async () => (await import("react-vnc")).VncScreen, {
  ssr: false,
  loading: LoadingScreen,
});

interface IVncProps {
  token: string;
  readonly?: boolean;
}

export function Vnc(props: IVncProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vncRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Capture and stop mouseleave/mouseout events in the capture phase
    // to prevent vnc lib from blurring the vnc canvas.
    // This is here to fix keyboard not working after clicking inside the vnc session
    const handleMouseLeave = (e: MouseEvent) => {
      e.stopPropagation();
    };

    container.addEventListener("mouseleave", handleMouseLeave, true);
    container.addEventListener("mouseout", handleMouseLeave, true);

    return () => {
      container.removeEventListener("mouseleave", handleMouseLeave, true);
      container.removeEventListener("mouseout", handleMouseLeave, true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      onMouseDown={() => {
        vncRef.current?.focus();
      }}
    >
      {props.readonly && (
        <div className="absolute top-0 left-0 bg-transparent w-full h-full"></div>
      )}
      <VncScreen
        ref={vncRef}
        url={API.getWsUrl(ApiVersion.v1, `/workspace-vnc?token=${props.token}`)}
        rfbOptions={{
          credentials: {
            password: "lemonade",
          },
        }}
        scaleViewport
        focusOnClick
        qualityLevel={props.readonly ? 0 : undefined}
        viewOnly={props.readonly}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
