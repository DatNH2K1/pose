import {NotificationStyle} from "modable";
import {Notification} from "@/definitions/types.ts";

export default {
    success: (state: Notification, title: string, content: string) => {
        state.actions.dispatchNotification(
            title,
            content,
            NotificationStyle.SUCCESS,
            true)
    },
    error: (state: Notification, title: string, content: string) => {
        state.actions.dispatchNotification(
            title,
            content,
            NotificationStyle.DANGER,
            true)
    },
    warning: (state: any, title: string, content: string) => {
        state.actions.dispatchNotification(
            title,
            content,
            NotificationStyle.WARNING,
            true)
    },
    info: (state: Notification, title: string, content: string) => {
        state.actions.dispatchNotification(
            title,
            content,
            NotificationStyle.PRIMARY,
            true)
    }
}