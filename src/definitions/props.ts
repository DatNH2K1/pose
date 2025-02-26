import type {Side} from "@/definitions/enums.ts";
import {ImageData} from "@/definitions/types.ts";

export type CameraProps = {
    imageData?: ImageData | undefined;
    autoStopCamera?: boolean,
};

export type CameraActionsProps = {
    side: Side;
    hasPicture: boolean,
    cameraError: boolean,
};

export type CameraCaptureProps = {
    getOverlayCanvas: () => HTMLCanvasElement | null;
};

export type CameraPreviewProps = {
    src: string | undefined,
    alt: string
}