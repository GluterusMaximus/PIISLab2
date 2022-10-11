import { layout } from './layout.js'
import { aStar } from './aStar.js'
import { miniMax } from './miniMax.js'

const GRID_SIZE = 28
const MOVE_INTERVAL_MS = 200

const GOAL_POSITION = {
  i: 13,
  j: 0,
}

const squareClasses = {
  0: 'empty',
  1: 'wall',
  2: 'goal',
}

const createBoard = (layout, grid, squareClasses) => {
  const squares = Array(layout.length)

  for (const i in layout) {
    squares[i] = []

    for (const squareCode of layout[i]) {
      const square = document.createElement('div')
      grid?.appendChild(square)
      squares[i].push(square)

      square.classList.add(squareClasses[squareCode])
    }
  }
  return squares
}

const getRandomPosition = (layout) => {
  let randI, randJ

  while (layout[randI ?? -1]?.[randJ ?? -1] !== 0) {
    ;[randI, randJ] = [layout.length, layout[0].length].map(
      (length) => Math.floor(Math.random() * length)
    )
  }

  return { i: randI, j: randJ }
}

const samePosition = (position1, position2) =>
  position1.i === position2.i && position1.j === position2.j

const displayCharacter = (squares, position, className) => {
  squares[position.i][position.j].classList.add(className)
}

const removeCharacter = (squares, position, className) => {
  squares[position.i][position.j].classList.remove(
    className
  )
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const message =
    document.querySelector('.message') ?? new Element()

  const squares = createBoard(layout, grid, squareClasses)
  let pacmanPosition = getRandomPosition(layout)
  let ghostPosition = getRandomPosition(layout)

  displayCharacter(squares, pacmanPosition, 'pac-man')
  displayCharacter(squares, ghostPosition, 'ghost')
  displayCharacter(squares, GOAL_POSITION, 'goal')

  const makeMove = () => {
    removeCharacter(squares, pacmanPosition, 'pac-man')
    removeCharacter(squares, ghostPosition, 'ghost')

    pacmanPosition = miniMax(layout, {
      pacman: pacmanPosition,
      ghost: ghostPosition,
      goal: GOAL_POSITION,
    })
    ghostPosition = aStar(
      layout,
      { x: ghostPosition.j, y: ghostPosition.i },
      { x: pacmanPosition.j, y: pacmanPosition.i }
    ).nextStep

    displayCharacter(squares, pacmanPosition, 'pac-man')
    displayCharacter(squares, ghostPosition, 'ghost')

    if (samePosition(pacmanPosition, ghostPosition)) {
      message.innerHTML = 'Ghost won!'
      clearInterval(moveInterval)
    }
    if (samePosition(pacmanPosition, GOAL_POSITION)) {
      message.innerHTML = 'Pacman won!'
      clearInterval(moveInterval)
    }
  }

  const moveInterval = setInterval(
    makeMove,
    MOVE_INTERVAL_MS
  )
})
