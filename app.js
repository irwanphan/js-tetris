document.addEventListener('DOMContentLoaded', () => {
    
    // find .grid on document
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))

    const scoreDisplay = document.querySelector('#score')
    
    const startButton = document.querySelector('#start-button')

    const width = 10

    // check squares
    // console.log(squares)

    // the Tetrominoes shapes' rotations
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
    ]
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    // console.log(theTetrominoes)

    let currentPosition = 4
    // console.log(currentPosition)
    let currentRotation = 0
    console.log(currentRotation)
    
    // randomly select a tetromino
    let random = Math.floor(Math.random()*theTetrominoes.length)
    console.log(random)

    // theTetromino[shape][rotation]
    let current = theTetrominoes[random][currentRotation]
    console.log(current)
    
    // draw the tetromino
    function draw() {
        current.forEach(index => {
            console.log(index)
            squares[currentPosition + index].classList.add('tetromino')
        })
    }
    // draw()

    // undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }
    // undraw()

    // make the tetromino move down every second
    timerId = setInterval(moveDown, 1000)

    // assign function to keyboard
    function control(e) {
        console.log(e.keyCode)
        if(e.keyCode === 37) {
            moveLeft()
        } else if(e.keyCode === 38) {
            // rotate when press up
            rotate()
        } else if(e.keyCode === 39) {
            moveRight()
        } else if(e.keyCode === 40) {
            // moveDown()
        }
    }
    document.addEventListener('keyup', control)

    // move down
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // freeze
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // start a new falling tetromino
            random = Math.floor(Math.random()*theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
        }
    }

    // move left, until no block left
    function moveLeft() {
        undraw()
        // check if on edge, 0 mod 10 = 0
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        // if not on edge, go left
        if(!isAtLeftEdge) currentPosition -=1
        // now check again
        // check if the new block is taken
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            // if yes, then go back to last position
            currentPosition +=1
        }
        draw()
    }

    function moveRight() {
        undraw()
        // check if on edge, 9 mod 10 = width(10) - 1
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        // if not on edge, go right
        if(!isAtRightEdge) currentPosition +=1
        // now check again
        // check if the new block is taken
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            // if yes, then go back to last position
            currentPosition -=1
        }
        draw()
    }

    // rotate the tetromino
    function rotate() {
        undraw()
        currentRotation++
        // if rotation = 4, rotation back to 0
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }
})