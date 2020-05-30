document.addEventListener('DOMContentLoaded', () => {
    
    // find .grid on document
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))

    const scoreDisplay = document.querySelector('#score')
    
    const startButton = document.querySelector('#start-button')

    const width = 10

    let nextRandom = 0
    let timerId
    let score = 0

    const colors = [
        'orange',
        'purple',
        'green',
        'blue',
        'pink'
    ]

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
    // console.log(currentRotation)
    
    // randomly select a tetromino
    let random = Math.floor(Math.random()*theTetrominoes.length)
    // console.log(random)

    // theTetromino[shape][rotation]
    let current = theTetrominoes[random][currentRotation]
    // console.log(current)
    
    // draw the tetromino
    function draw() {
        current.forEach(index => {
            // console.log(index)
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }
    // draw()

    // undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }
    // undraw()

    // make the tetromino move down every second
    // timerId = setInterval(moveDown, 1000)

    // assign function to keyboard
    function control(e) {
        // console.log(e.keyCode)
        if(e.keyCode === 37) {
            moveLeft()
        } else if(e.keyCode === 38) {
            // rotate when press up
            rotate()
        } else if(e.keyCode === 39) {
            moveRight()
        } else if(e.keyCode === 40) {
            moveDown()
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
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)

            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
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

    // show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    // the Tetrominoes without rotations
    const upNextTetrominoes = [
        [1, 2, displayWidth+1, displayWidth*2+1], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    // display the shape in the mini-grid
    function displayShape() {
        // remove the tetromino inside
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    // start and pause buttons
    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    // add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                // console.log(squaresRemoved)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }
})