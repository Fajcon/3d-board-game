import {BoardDisplay3d} from "./board3d.js"
import {Board, Field, Dice} from "./model.js";
import {BoardDisplay2d} from "./board2d.js"


document.addEventListener('clickField', () => {
    console.log('success');
})

let board = new Board()
for (let i = 0; i <= 7; i++){
    board.at(i, 0, 0).state = "red"
    board.at(i, 0, 1).state = "red"
    board.at(i, 0, 2).state = "red"
    board.at(i, 7, 0).state = "blue"
    board.at(i, 7, 1).state = "blue"
    board.at(i, 7, 2).state = "blue"
}
let c = document.querySelector("#c")

let boardDisplay2d = new BoardDisplay2d(c, board)

let boardDisplay3d = new BoardDisplay3d(board);

document.onload = function () {
    // Handle mouseover event on a shape
    const boardFields = document.querySelectorAll('shape.boardField');
    boardFields.forEach(field => {
        field.setAttribute('onclick', 'changeColor(event)');
    })
};

/** Initializes an <x3d> root element that was added after document load. */
// x3dom.reload = function() {
//     onload();
// };