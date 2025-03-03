import {Pose, Side} from "@/definitions/enums.ts";
import {DetailedPoseSetting, ImageData, PoseData} from "@/definitions/types.ts";

export type CameraProps = {
    pose?: Pose,
    imageData?: ImageData;
    autoStopCamera?: boolean,
    isLoading?: boolean
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

export type GalleryProps = {
    pose: Pose,
    isVisible: boolean,
    poses: DetailedPoseSetting[],
    imageData: Record<string, PoseData>
}