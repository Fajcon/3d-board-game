

function changeColor() {
    if(document.getElementById("color").getAttribute('diffuseColor')=="1 0 0")
        document.getElementById("color").setAttribute('diffuseColor', '0 0 1');
    else
        document.getElementById("color").setAttribute('diffuseColor', '1 0 0');
}


document.onload = function() {
    // Handle mouseover event on a shape
    let redBox = document.querySelector('shape#redBox');

    redBox.addEventListener('click', changeColor,  false);
};