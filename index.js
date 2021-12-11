import {BoardDisplay3d} from "./board3d.js"

document.addEventListener('clickField', () => {
    console.log('success');
})

let boardDisplay3d = new BoardDisplay3d();

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