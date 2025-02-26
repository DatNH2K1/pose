const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export const drawGrid = (canvas: HTMLCanvasElement, size: number, gridRatio: number) => {
    if (size === 0) return
    // handle grid drawing on the canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw Error('Unable to get 2d context');
    }
    const row = size
    const col = size
    const w = (canvas.width - gridRatio) / col
    const h = (canvas.height - gridRatio) / row
    let x = 0
    let y = 0
    for (x = 0; x < row; x++) {
        for (y = 0; y < col; y++) {
            ctx.strokeStyle = 'rgba(255,255,255,0.5)'
            ctx.lineWidth = 0.5
            ctx.strokeRect(w * x + gridRatio, h * y, w, h)
        }
    }
    ctx.strokeStyle = '#000080'
    ctx.lineWidth = 0.5
    ctx.fillStyle = 'black'
    ctx.font = 'bold 14px Arial'
    for (x = 1; x < row; x++) {
        ctx.fillText(x.toString(), w * x - 4 + gridRatio, canvas.height)
    }
    for (y = 1; y < col; y++) {
        ctx.fillText(alphabet[y - 1], 0, h * y - 2)
    }
}

export const drawCountdown = (canvas: HTMLCanvasElement, countdown: number) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw Error('Unable to get 2d context');
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 100px Arial';
    ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
}
