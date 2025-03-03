import {ModeSetting, BasePoseSetting, DetailedPoseSetting} from "@/definitions/types.ts";
import {translate} from "@/plugins/i18n.ts";

const frontSetting: BasePoseSetting = {
    type: 'front',
}

const leftSideSetting: BasePoseSetting = {
    type: 'leftSide',
}

const rightSideSetting: BasePoseSetting = {
    type: 'rightSide',
}

const leftSitSetting: BasePoseSetting = {
    type: 'leftSit',
}

const rightSitSetting: BasePoseSetting = {
    type: 'rightSit',
}

const backSetting: BasePoseSetting = {
    type: 'back'
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