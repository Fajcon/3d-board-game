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
        this.observers = []
        this.dice = new Dice();
    }

    attachObserver(observer){
        this.observers.push(observer)
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

    highlight(fields){
        fields.forEach(el=>{
            this.observers.forEach(obs=>obs.observeHighlight(el))
            el.state = "active"
        })
        this.highlighted.push(...fields)
    }

    highlightOffAll(){
        this.highlighted.forEach(el=>{
            this.observers.forEach(obs=>obs.observeHighlightOff(el))
            el.state = "empty"
        })
        this.highlighted = []
    }

    click(field){
        switch (field.state) {
            case "empty":
                this.highlightOffAll()
                this.selected = null
                break;
            case "red":
            case "blue":
                if (field === this.selected){
                    this.highlightOffAll()
                    this.selected = null
                } else {
                    this.selected = field
                    this.highlightOffAll()
                    this.highlight(field.neighbours().filter(n => n.state === "empty"))
                }
                break;
            case "active":
                this.highlightOffAll()
                field.state = this.selected.state
                this.selected.state = "empty"
                this.observers.forEach(obs=>obs.observeMove(this.selected, field))
                this.selected = null
        }
    }
    
}

export class Field {
    constructor(board, x, y, z) {
        this.board = board
        this.x = x
        this.y = y
        this.z = z
        this.state = 'empty'
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

    click(){
        this.board.click(this)
    }
}

export class BoardObserver { //interface
    observeMove(from, to){};
    observeHighlight(field){};
    observeHighlightOff(field){};
    observeKill(killed, enemies){};
    observeFailedEscape(from, to, enemies){};
    observeFighting(defending, enemies){};
}

export class Dice {
    roll(){
        return Math.floor(Math.random() * 5 + 1);
    }
}