import {reactive, ref} from "vue";
import type {Resolution} from "@/definitions/types.ts";
import {gridRatio, useDrawStore} from "@/provides/draw.ts";
import {CameraCaptureProps} from "@/definitions/props.ts";

export const DEFAULT = {
    maxVideoWidth: window.innerWidth,
    maxVideoHeight: window.innerHeight,
    width: 800,
    height: 600,
    facingMode: 'environment',
    jpegQuality: 1
}

export const useCameraCapture = (props: CameraCaptureProps) => {
    const drawStore = useDrawStore();

    const cameraMode = ref('environment');
    const cameraSwitching = ref(false);
    const videoEnabled = ref<boolean>(false);
    const isOverlayEnabled = ref(false);
    const lastAnimationRequest = ref<number | null>(null);
    const aspectRatio = ref(1);
    const videoOption = ref<MediaTrackConstraints>();

    const videoResolution = reactive<Resolution>({
        width: DEFAULT.width,
        height: DEFAULT.height
    })
    const captureSize = reactive<Resolution>({
        width: DEFAULT.width,
        height: DEFAULT.height
    })

    const isVideoEnabled = () => {
        return videoEnabled.value
    }

    const isCameraSwitching = () => {
        return cameraSwitching.value
    }

    /**
     * Draws an image to overlay on the video display.
     * All drawn content is cleared and redrawn each time.
     *
     * Called from requestAnimationFrame() and always executed while isOverlayEnabled = true
     */
    const drawVideoOverlay = () => {
        lastAnimationRequest.value = null

        if (!isOverlayEnabled.value) {
            return
        }

        if (!isVideoEnabled()) {
            triggerDrawVideoOverlay()
        }

        const overlay = props.getOverlayCanvas();
        if (overlay === null) {
            throw Error('Not found canvas video overlay')
        }

        const context = overlay.getContext('2d');
        if (context === null) {
            throw Error('Not found canvas video overlay context')
        }
        context.clearRect(0, 0, overlay.width, overlay.height)

        let guideOffset = 0
        if (drawStore.state.gridValue !== 0) {
            guideOffset = gridRatio
        }

        drawStore.actions.drawGrid(overlay, drawStore.state.gridValue, guideOffset)
        if (drawStore.state.displayTimer) {
            drawStore.actions.drawCountdown(overlay, drawStore.state.timeCounter, guideOffset);
        }

        triggerDrawVideoOverlay();
    }

    /**
     * Start drawing
     */
    const triggerDrawVideoOverlay = () => {
        if (lastAnimationRequest.value === null) {
            lastAnimationRequest.value = requestAnimationFrame(drawVideoOverlay)
        } else {
            console.warn('drawVideoOverlay is scheduled. ignore request')
        }
    }

    const changeVideoOverlay = (isEnable: boolean) => {
        if (isEnable) {
            if (isOverlayEnabled.value) {
                return
            }
            isOverlayEnabled.value = true
            triggerDrawVideoOverlay()
        } else {
            isOverlayEnabled.value = false
            if (lastAnimationRequest.value !== null) {
                cancelAnimationFrame(lastAnimationRequest.value)
                lastAnimationRequest.value = null
            }
        }
    }

    return {
        cameraMode,
        videoOption,
        videoResolution,
        aspectRatio,
        captureSize,
        videoEnabled,
        cameraSwitching,
        isVideoEnabled,
        isCameraSwitching,
        changeVideoOverlay
    }
}