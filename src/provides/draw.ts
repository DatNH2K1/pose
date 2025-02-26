import {reactive, watch, provide, inject} from "vue";
import {drawGrid, drawCountdown} from "@/provides/actions/draw.ts";
import {Option, Resolution} from "@/definitions/types.ts";
import {useI18n} from "vue-i18n";

interface DrawStore {
    state: {
        gridValue: number,
        timer: number,
        displayTimer: boolean,
        timeCounter: number,
        gridValueOptions: Option<number>[],
        timerValueOptions: Option<number>[],
        videoResolution: Resolution,
        flash: boolean,
    },
    mutations: {
        setGridValue: (gridValue: number) => void,
        setTimer: (timer: number) => void,
        setDisplayTimer: (displayTimer: boolean) => void,
        resetTimeCounter: () => void,
        decreaseTimeCounter: () => void,
        showFlash: () => void,
    },
    actions: {
        drawGrid: (canvas: HTMLCanvasElement, size: number, gridRatio: number) => void,
        drawCountdown: (canvas: HTMLCanvasElement, countdown: number, gridRatio: number) => void
    },
}

export const gridRatio = 10;
export const gridValues = [0, 6, 12, 24];
export const timerValues = [0, 5, 10, 15];

// Define state, mutations, and actions
export const createDrawStore = (): DrawStore => {
    const {t} = useI18n();

    // State
    const state = reactive({
        gridValue: 0,
        timer: 0,
        displayTimer: false,
        timeCounter: 0,
        gridValueOptions: gridValues.map(item => {
            return {
                label: item === 0 ? t('label.off') : (item + " x " + item),
                value: item,
                selected: item === 0
            }
        }),
        timerValueOptions: timerValues.map(item => {
            return {
                label: item === 0 ? t('label.off') : (item + " s"),
                value: item,
                selected: item === 0
            }
        }),
        videoResolution: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        flash: false
    });

    watch(() => state.gridValue, (value) => {
        state.gridValueOptions = gridValues.map(item => {
            return {
                label: item === 0 ? t('label.off') : (item + " x " + item),
                value: item,
                selected: item === value
            }
        })
    })

    watch(() => state.timer, (value) => {
        state.timerValueOptions = timerValues.map(item => {
            return {
                label: item === 0 ? t('label.off') : (item + " s"),
                    value: item,
                selected: item === value
            }
        })
    })

    // Mutations
    const mutations = {
        setGridValue: (gridValue: number) =>{
            state.gridValue = gridValue
        },
        setTimer: (timer: number) => {
            state.timer = timer
        },
        setDisplayTimer: (displayTimer: boolean) => {
            state.displayTimer = displayTimer
        },
        resetTimeCounter: () => {
            state.timeCounter = state.timer
        },
        decreaseTimeCounter: () => {
            state.timeCounter -= 1;
        },
        showFlash: () => {
            state.flash = true;
            setTimeout(() => {
                state.flash = false
            }, 100);
        }
    };

    // Actions
    const actions = {
        drawGrid,
        drawCountdown
    };

    return { state, mutations, actions };
};

// Define a key for provide/inject
export const DRAW_STORE_KEY = Symbol("drawStore");

// Provider
export const provideDrawStore = () => {
    const store = createDrawStore();
    provide(DRAW_STORE_KEY, store);
    return store;
};

// Consumer
export const useDrawStore = () : DrawStore => {
    const store = inject(DRAW_STORE_KEY);
    if (!store) {
        throw new Error("useDrawStore must be used inside a provider!");
    }
    return store as DrawStore;
};