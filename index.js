import {BoardDisplay3d} from "./board3d.js"

document.addEventListener('clickField', () => {
    console.log('success');
    var transform = document.createElement("Transform");
    var inline = document.createElement("Inline");
    inline.setAttribute("SpaceShip", "Inline");
    inline.setAttribute("mapDEFToID", true);
    transform.setAttribute("scale", "0.12 0.15 0.12");
    transform.setAttribute("rotation", "0.0 1.0 0.0 1.5708");
    transform.setAttribute("translation", "-0.25 0.0 0.0");
    transform.appendChild(inline);
    inline.setAttribute("url", "SpaceShip.x3d");
    document.querySelector('scene').appendChild(transform);
})

let boardDisplay3d = new BoardDisplay3d();

document.onload = function () {
    // Handle mouseover event on a shape
    const boardFields = document.querySelectorAll('shape.boardField');
    boardFields.forEach(field => {
        field.setAttribute('onclick', 'changeColor()');
    })
};

/** Initializes an <x3d> root element that was added after document load. */
// x3dom.reload = function() {
//     onload();
// };