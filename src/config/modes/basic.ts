import {BasePoseSetting, DetailedPoseSetting, ModeSetting} from "@/definitions/types.ts";
import {translate} from "@/plugins/i18n.ts";
import {Pose} from "@/definitions/enums.ts";

const frontSetting: BasePoseSetting = {
    type: Pose.FRONT,
}

const leftSideSetting: BasePoseSetting = {
    type: Pose.LEFT_SIDE,
}

const rightSideSetting: BasePoseSetting = {
    type: Pose.RIGHT_SIDE,
}

const leftSitSetting: BasePoseSetting = {
    type: Pose.LEFT_SIT,
}

const rightSitSetting: BasePoseSetting = {
    type: Pose.RIGHT_SIT,
}

const backSetting: BasePoseSetting = {
    type: Pose.BACK
}

const config: ModeSetting = {
    title: 'Basic',
    poses: [
        frontSetting,
        leftSideSetting,
        rightSideSetting,
        leftSitSetting,
        rightSitSetting,
        backSetting
    ].map(item => {
        return {
            ... item,
            label: translate(`pose.${item.type}.label`)
        } as DetailedPoseSetting
    })
}

export default config;