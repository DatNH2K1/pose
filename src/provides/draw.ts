import {reactive, provide, inject} from "vue";
import {drawGrid} from "@/provides/actions/draw.ts";

interface DrawStore {
    state: {
        gridValue: number,
        gridRatio: number,
        videoResolution: {
            width: number,
            height: number
        }
    },
    mutations: {
        nextGridValue: () => void
    },
    actions: {
        drawGrid: (canvas: HTMLCanvasElement, size: number, gridRatio: number) => void
    },
}

const gridValues = [0, 6, 12, 24];

// Define state, mutations, and actions
export const createDrawStore = (): DrawStore => {
    // State
    const state = reactive({
        gridValue: 0,
        gridRatio: 10,
        videoResolution: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    });

    // Mutations
    const mutations = {
        nextGridValue: () =>{
            state.gridValue = gridValues[(gridValues.indexOf(state.gridValue) + 1) % gridValues.length]
        }
    };

    // Actions
    const actions = {
        drawGrid
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