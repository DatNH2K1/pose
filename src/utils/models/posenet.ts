import * as tfjs from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import * as posenet from '@tensorflow-models/posenet'

let model: posenet.PoseNet | null = null;
let modelLoading = false;

/**
 * Load PoseNet model if not already loaded
 */
const loadPosenet = async (settings?: posenet.ModelConfig) => {
    if (model || modelLoading) return;
    try {
        modelLoading = true;
        await tfjs.ready();
        model = await posenet.load(settings);
    } catch (error) {
        console.error('Error loading PoseNet:', error);
        throw error;
    } finally {
        modelLoading = false;
    }
}

/**
 * Dispose PoseNet model
 */
const disposePosenet = () => {
    model?.dispose();
    model = null;
}

/**
 * Analyse image using PoseNet
 * @param {HTMLImageElement | HTMLCanvasElement} image
 */
export const analysePoseImage = async (image: HTMLImageElement | HTMLCanvasElement) => {
    if (!model) await loadPosenet();
    try {
        const pose = await model!.estimateSinglePose(image, {
            flipHorizontal: false,
        });

        disposePosenet()
        return pose.keypoints.filter(item => item.score > 0.01);
    } catch (error) {
        disposePosenet()
        console.error('Error in analysePoseImage:', error);
        return undefined;
    }
}
