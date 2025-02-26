import {NotificationStore} from "modable";

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

export type ModeSetting = {
    title: string,
    poses: string[]
}