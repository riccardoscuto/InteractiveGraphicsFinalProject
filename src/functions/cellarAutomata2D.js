export const generationPosition = (lato) => {
    const toRet = [];
    let currentRow = 0;
    for (let i = 0; i < lato * lato; i++) {
        if (i % lato == 0) {
            currentRow++;

        }
        toRet.push([i % lato * 2.1, currentRow * 2.1, 0])

    }
    return toRet;
}

export const generationMatrix = (lato) => {
    const toRet = []
    for (let i = 0; i < lato; i++) {
        toRet[i] = new Array(lato + 1).fill(false);
    }
    return toRet;
}

function getNeighborhood(x, y, lato) {

    //w= sinistra, negativo
    //s = giù, negativo
    //e=destra, positivo
    //n=su, positivo

    let w, e, s, n;
    w = null;
    e = null;
    s = null;
    n = null;
    if (x != 0) {
        w = [x - 1, y];
    }
    if (x != lato - 1) {
        e = [x + 1, y];
    }
    if (y != 0) {
        s = [x, y - 1];
    }
    if (y != lato - 1) {
        n = [x, y + 1];
    }
    return [w, e, s, n]
}

function isLive(cell, matrix) {
    //PRIAMA X E POI Y 
    if (cell === null) {
        return false;
    }

    return matrix[cell[0]][cell[1]];
}

export function simulation(x, y, matrix, lato) {
    const [w, e, s, n] = getNeighborhood(x, y, lato);
    const alive = isLive([x, y], matrix);
    const wAlive = isLive(w, matrix);
    const eAlive = isLive(e, matrix);
    const sAlive = isLive(s, matrix);
    const nAlive = isLive(n, matrix);
    let numberAlive = 0;
    if (wAlive) numberAlive++;
    if (eAlive) numberAlive++;
    if (sAlive) numberAlive++;
    if (nAlive) numberAlive++;
    if (alive) numberAlive++;
    //false muore
    //true viva e Vegeta
    if (alive && numberAlive < 2) return false;
    if (alive && (numberAlive == 3 || numberAlive == 2)) return true;
    if (alive && numberAlive > 3) return false;
    if (!alive && numberAlive == 3) return true;
}
// Any live cell with fewer than two live neighbors dies as if caused by underpopulation.
// Any live cell with two or three live neighbors lives on to the next generation.
// Any live cell with more than three live neighbors dies as if by overpopulation.
// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

export function currentPoint(matrix, index, lato) {

    return matrix[index % lato][Math.floor(index / lato)];
}