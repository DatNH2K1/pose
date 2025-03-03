import {NotificationStore} from "modable";
import {Pose} from "@/definitions/enums.ts";

export type Notification = typeof NotificationStore;

export type Resolution = {
    width: number,
    height: number
}

export type ImageData = {
    imageUrl: string,
    width: number,
    height: number
}

export type Option<T> = {
    label: string,
    value: T,
    selected?: boolean
}

export type BasePoseSetting = {
    type: Pose,
}

export type DetailedPoseSetting = BasePoseSetting & {
    label: string,
    description: string,
}

export type PoseData = {
    pose: Pose,
    imageData: ImageData,
}

export type ModeSetting = {
    title: string,
    poses: DetailedPoseSetting[]
}