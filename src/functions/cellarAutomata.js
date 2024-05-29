import * as sd from '../functions/cellarAutomata2D';
import * as td from "../functions/cellarAutomata3D";

export function runSimulation(space, lato, matrix, customRule) {
    switch (space) {
        case "2D":
            return sd.runSimulation(lato, matrix, customRule)

        case "3D":
        default:
            return td.runSimulation(lato, matrix, customRule)
    }
}

export function currentPoint(space, matrix, lato, index) {
    switch (space) {
        case "2D":
            return sd.currentPoint(matrix, index, lato)
        case "3D":
        default:
            return td.currentPoint(matrix, index, lato)
    }
}
export function generationMatrix(space, lato) {
    switch (space) {
        case "2D":
            return sd.generationMatrix(lato)
        case "3D":
        default:
            return td.generationMatrix(lato)
    }
}

export function generationPosition(space, lato) {
    switch (space) {
        case "2D":
            return sd.generationPosition(lato)
        case "3D":
        default:
            return td.generationPosition(lato)
    }
}
export function generationRandomMatrix(space, lato) {
    console.log("EIGI")
    switch (space) {
        case "2D":
            return sd.generationRandomMatrix(lato)
        case "3D":
        default:
            return td.generationRandomMatrix(lato)
    }
}