import { aStar } from './aStar.js'

const MAX_DEPTH = 5

export const negaPruningRecursive = (
  depth,
  alpha,
  beta,
  maxDepth,
  heuristic,
  layout,
  color,
  positions
) => {
  if (sameCoords(positions.ghost, positions.pacman)) {
    console.dir({ positions, color, alpha, beta, depth })
    return {
      score: color * Number.NEGATIVE_INFINITY,
      move: positions.pacman,
    }
  }
  if (sameCoords(positions.goal, positions.pacman))
    return {
      score: color * Number.POSITIVE_INFINITY,
      move: positions.pacman,
    }

  if (depth === maxDepth) {
    return {
      score: color * heuristic(layout, positions),
      move: positions.pacman,
    }
  }

  let value = Number.NEGATIVE_INFINITY
  let bestMove = null
  const character = color > 0 ? 'pacman' : 'ghost'
  const adjacent = getAdjacent(layout, positions[character])

  for (const cell of adjacent) {
    const positionsCopy = JSON.parse(
      JSON.stringify(positions)
    )

    let { score: childScore, move: childMove } =
      negaPruningRecursive(
        depth + 1,
        -beta,
        -alpha,
        maxDepth,
        heuristic,
        layout,
        -color,
        { ...positionsCopy, [character]: cell }
      )

    value = Math.max(value, -childScore)
    alpha = Math.max(alpha, value)

    if (depth === 0) {
      bestMove =
        value === -childScore
          ? childMove
          : bestMove ?? childMove
    }

    if (beta <= alpha) break
  }

  return {
    score: value,
    move: depth === 0 ? bestMove : positions.pacman,
  }
}

export const negaPruning = (layout, positions) =>
  negaPruningRecursive(
    0,
    Number.NEGATIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    MAX_DEPTH,
    heuristic,
    layout,
    1,
    positions
  ).move

const getAdjacent = (matrix, cell) => {
  const adjacent = []
  const jShift = [-1, 0, 0, 1, 1, 1, -1, -1]
  const iShift = [0, -1, 1, 0, 1, -1, 1, -1]

  for (let k = 0; k < jShift.length; k++) {
    const newJ = cell.j + jShift[k]
    const newI = cell.i + iShift[k]

    if (matrix[newI]?.[newJ] === 0) {
      adjacent.push({ i: newI, j: newJ })
    }
  }

  return adjacent
}

const heuristic = (layout, positions) => {
  const { ghost, pacman, goal } = positions
  const ghostBlockLayout = JSON.parse(
    JSON.stringify(layout)
  )
  ghostBlockLayout[ghost.i][ghost.j] = 1

  let distToGoal
  try {
    distToGoal = aStar(
      ghostBlockLayout,
      { x: pacman.j, y: pacman.i },
      { x: goal.j, y: goal.i }
    ).path.length
  } catch (error) {
    distToGoal = 1000
  }

  const distToGhost = aStar(
    layout,
    { x: pacman.j, y: pacman.i },
    { x: ghost.j, y: ghost.i }
  ).path.length

  return -5 * distToGoal + distToGhost * 1
}

const sameCoords = (cell1, cell2) =>
  cell1.i === cell2.i && cell1.j === cell2.j
