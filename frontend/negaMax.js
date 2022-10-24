import { aStar } from './aStar.js'

const MAX_DEPTH = 3

export const negaMaxRecursive = (
  depth,
  maxDepth,
  heuristic,
  layout,
  color,
  positions
) => {
  if (sameCoords(positions.ghost, positions.pacman)) {
    return color * Number.NEGATIVE_INFINITY
  }
  if (sameCoords(positions.goal, positions.pacman))
    return color * Number.POSITIVE_INFINITY

  if (depth === maxDepth) {
    try {
      return color * heuristic(layout, positions)
    } catch (error) {
      return color * Number.NEGATIVE_INFINITY
    }
  }

  const character = color > 0 ? 'pacman' : 'ghost'

  return Math.max(
    ...getAdjacent(layout, positions[character]).map(
      (cell) => {
        const positionsCopy = JSON.parse(
          JSON.stringify(positions)
        )
        return (
          -1 *
          negaMaxRecursive(
            depth + 1,
            maxDepth,
            heuristic,
            layout,
            -color,
            { ...positionsCopy, [character]: cell }
          )
        )
      }
    )
  )
}

export const negaMax = (layout, positions) => {
  const adjacent = getAdjacent(layout, positions.pacman)
  console.log(positions)
  const negaMaxBound = negaMaxRecursive.bind(
    null,
    0,
    MAX_DEPTH,
    heuristic,
    layout,
    -1
  )
  const sortedVals = adjacent.sort(
    (a, b) =>
      -1 * negaMaxBound({ ...positions, pacman: b }) -
      -1 * negaMaxBound({ ...positions, pacman: a })
  )
  console.log(
    sortedVals.map((cell) =>
      negaMaxBound({ ...positions, pacman: cell })
    )
  )
  console.log(sortedVals)
  return sortedVals[0]
}

const getAdjacent = (matrix, cell) => {
  const adjacent = []
  const jShift = [-1, 0, 0, 1, 1, 1, -1, -1]
  const iShift = [0, -1, 1, 0, 1, -1, 1, -1]

  for (let k = 0; k < jShift.length; k++) {
    const newJ = cell.j + jShift[k]
    const newI = cell.i + iShift[k]

    // console.dir({
    //   cell,
    //   newJ,
    //   newI,
    //   adjacent
    // })

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

  const distToGoal = aStar(
    ghostBlockLayout,
    { x: pacman.j, y: pacman.i },
    { x: goal.j, y: goal.i }
  ).path.length
  const distToGhost = aStar(
    layout,
    { x: pacman.j, y: pacman.i },
    { x: ghost.j, y: ghost.i }
  ).path.length

  // console.dir({ distToGhost, distToGoal })

  return -5 * distToGoal + distToGhost * 1
}

const sameCoords = (cell1, cell2) =>
  cell1.i === cell2.i && cell1.j === cell2.j
