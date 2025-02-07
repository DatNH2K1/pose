const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export const drawGrid = (canvas: HTMLCanvasElement, size: number, gridRatio: number) => {
    if (size === 0) return
    // handle grid drawing on the canvas
    var ctx = canvas.getContext('2d')
    if (!ctx) {
        throw Error('Unable to get 2d context');
    }
    var row = size
    var col = size
    var w = (canvas.width - gridRatio) / col
    var h = (canvas.height - gridRatio) / row
    var x = 0
    var y = 0
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
