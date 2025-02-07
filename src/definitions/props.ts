import type {Side} from "@/definitions/enums.ts";

export type CameraActionsProps = {
    side: Side;
    hasPicture: boolean,
    cameraError: boolean,
};

export type CameraPreviewProps = {
    src: string,
    alt: string
}