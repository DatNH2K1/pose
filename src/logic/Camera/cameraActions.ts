import {ref} from "vue";
import {playBeep, playShutterSound} from "@/utils/sound.ts";
import {useDrawStore} from "@/provides/draw.ts";

export const useCameraActions = () => {
    const drawStore = useDrawStore();

    const openModal = ref(false);
    const canToggleModal = ref(true);
    const menuSelected = ref<number>();

    const prepareCapture = async () => {
        if (drawStore.state.timer !== 0) {
            const setIntervalTimes = function(callback: Function, delay: number, repetitions: number) {
                let x = 0
                const intervalID = setInterval(function() {
                    playBeep()
                    callback()
                    if (++x === repetitions) clearInterval(intervalID)
                }, delay)
            }
            drawStore.mutations.setDisplayTimer(true);
            drawStore.mutations.resetTimeCounter();
            setIntervalTimes(() => {
                drawStore.mutations.decreaseTimeCounter();
                if (drawStore.state.timeCounter === 0) drawStore.mutations.setDisplayTimer(false)
            }, 1000, drawStore.state.timer)
            await new Promise(resolve => setTimeout(resolve, drawStore.state.timer * 1000))
        }

        playShutterSound();
        drawStore.mutations.showFlash();
    }

    const onTriggerModal = () => {
        if (canToggleModal.value) {
            openModal.value = !openModal.value
            menuSelected.value = undefined
        }

        if (openModal.value) {
            canToggleModal.value = false

            setTimeout(() => {
                canToggleModal.value = true;
            }, 100);
        }
    }

    const clickMenuItem = (index: number) => {
        setTimeout(() => {
            menuSelected.value = index
        }, 70);
    }

    const clickOutSideMenu = () => {
        if (openModal.value && canToggleModal.value) {
            openModal.value = false

            canToggleModal.value = false

            setTimeout(() => {
                canToggleModal.value = true;
            }, 100);
        }
    }

    return {
        openModal,
        menuSelected,
        prepareCapture,
        onTriggerModal,
        clickMenuItem,
        clickOutSideMenu
    }
}