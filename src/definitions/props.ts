import type {Side} from "@/definitions/enums.ts";

export type CameraActionsProps = {
    side: Side;
    hasPicture: boolean,
    cameraError: boolean,
};

export type CameraCaptureProps = {
    getOverlayCanvas: () => HTMLCanvasElement | null;
};

export type CameraPreviewProps = {
    src: string,
    alt: string
}