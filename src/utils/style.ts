import {Side} from "@/definitions/enums.ts";

export const getFlexDirectionActionClass = (side: string) => {
    switch (side) {
        case Side.LEFT:
            return 'flex-row';
        case Side.RIGHT:
            return 'flex-row-reverse';
        case Side.TOP:
            return 'flex-col';
        case Side.BOTTOM:
            return 'flex-col-reverse';
        default:
            return '';
    }
};

export const getFlexDirectionButtonGroupClass = (side: string) => {
    return [['left', 'right'].includes(side) ? 'flex-col' : 'flex-rol']
};