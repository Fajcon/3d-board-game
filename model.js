export class Board {
    constructor(x = 8, y = 8, z = 3) {
        this.sizeX = x
        this.sizeY = y
        this.sizeZ = z
        this.highlighted = []
        this.selected = null
        this.fields = Array(x)
        for (let i = 0; i < x; i++) {
            this.fields[i] = Array(y)
            for (let j = 0; j < y; j++) {
                this.fields[i][j] = Array(z)
                for (let k = 0; k < z; k++) {
                    this.fields[i][j][k] = new Field(this, i, j, k)
                }
            }
        }

    }

    at(x, y ,z){
        return this.fields[x][y][z]
    }

    *flat(){
        for (let i = 0; i < this.sizeX; i++) {
            for (let j = 0; j < this.sizeY; j++) {
                yield* this.fields[i][j]
            }
        }
    }

    forEach(fn){
        for (let el of this.flat()) {
            fn(el)
        }
    }

    click(field){

    }

    makeBoard(parent){
        for (let k = 0; k < this.sizeZ; k++) {
            let elementBoard2d = document.createElement("div")
            parent.appendChild(elementBoard2d)
            elementBoard2d.className = "board2d"
            for (let j = 0; j < this.sizeY; j++) {
                for (let i = 0; i < this.sizeX; i++) {
                    let div = document.createElement("div")
                    div.className = "field"
                    div.classList.toggle((i + j)%2 ? "color1": "color2")
                    this.fields[i][j][k].div = div
                    div.addEventListener("click", ()=>this.fields[i][j][k].onClick())
                    elementBoard2d.appendChild(div)
                }
            }
        }
    }

    addPawn(color, x, y, z){
        let field = this.at(x, y, z)
        let pawn = document.createElement("div")
        pawn.className = color === "blue" ? "bluePawn" : "redPawn"
        field.div?.appendChild(pawn)
        field.state = color
    }

}

export class Field {
    constructor(board, x, y, z) {
        this.board = board
        this.x = x
        this.y = y
        this.z = z
        this.state = 'empty'
        this.div = null
    }

    neighbours() {
        let result = []
        if (this.x + 1 < this.board.sizeX)   result.push(this.board.at(this.x + 1,    this.y,     this.z))
        if (this.x - 1 >= 0)                 result.push(this.board.at(this.x - 1,    this.y,     this.z))
        if (this.y + 1 < this.board.sizeY)   result.push(this.board.at(   this.x,     this.y + 1, this.z))
        if (this.y - 1 >= 0)                 result.push(this.board.at(   this.x,     this.y - 1, this.z))
        if (this.z + 1 < this.board.sizeZ)   result.push(this.board.at(   this.x,        this.y,  this.z + 1))
        if (this.z - 1 >= 0)                 result.push(this.board.at(   this.x,        this.y,  this.z - 1))
        return result
    }

    toString() {
        return `${this.x}, ${this.y}, ${this.z}`
    }

    toggleActive(){
        this.div.classList.toggle("activated")
        if (this.state==="active"){
            this.state="empty"
        } else {
            this.state="active"
        }
    }

    onClick() {
        console.log(this.toString())
        switch (this.state) {
            case "empty":
                this.board.highlighted.forEach(el=>el.toggleActive())
                this.board.selected = null
                this.board.highlighted = []
                break
            case "red":
            case "blue":
                if (this === this.board.selected){
                    this.board.highlighted.forEach(el=>el.toggleActive())
                    this.board.selected = null
                    this.board.highlighted = []
                } else {
                    this.board.selected = this
                    this.board.highlighted.forEach(el => el.toggleActive())
                    this.board.highlighted = this.neighbours().filter(n => n.state === "empty")
                    this.board.highlighted.forEach(el => el.toggleActive())
                }
                break
            case "active":
                this.board.highlighted.forEach(el=>el.toggleActive())
                this.state = this.board.selected.state
                this.board.selected.state = "empty"
                let oldDiv = this.board.selected.div
                let pawn = oldDiv.firstChild
                this.div.appendChild(pawn)
                this.board.selected = null
                this.board.highlighted = []
        }
    }
}