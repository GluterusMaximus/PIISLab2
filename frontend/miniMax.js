const MAX_DEPTH = 3

export const miniMaxRecursive = (
  depth,
  isMax,
  maxDepth,
  heuristic,
  layout,
  positions
) => {
  if (depth === maxDepth)
    return heuristic(layout, positions)

  if (isMax)
    return Math.max(
      ...getAdjacent(layout, positions.pacman).map(
        (cell) => {
          const positionsCopy = JSON.parse(
            JSON.stringify(positions)
          )
          return miniMaxRecursive(
            depth + 1,
            false,
            maxDepth,
            heuristic,
            layout,
            { ...positionsCopy, pacman: cell }
          )
        }
      )
    )
  else
    return Math.min(
      ...getAdjacent(layout, positions.ghost).map(
        (cell) => {
          const positionsCopy = JSON.parse(
            JSON.stringify(positions)
          )
          return miniMaxRecursive(
            depth + 1,
            true,
            maxDepth,
            heuristic,
            layout,
            { ...positionsCopy, ghost: cell }
          )
        }
      )
    )
}

export const miniMax = (layout, positions) => {
  const adjacent = getAdjacent(layout, positions.pacman)
  // console.log(positions)
  const miniMaxBound = miniMaxRecursive.bind(
    null,
    0,
    false,
    MAX_DEPTH,
    heuristic,
    layout
  )
  const sortedVals = adjacent.sort(
    (a, b) =>
      miniMaxBound({ ...positions, pacman: b }) -
      miniMaxBound({ ...positions, pacman: a })
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

  if (sameCoords(ghost, pacman)) {
    return Number.NEGATIVE_INFINITY
  }
  if (sameCoords(goal, pacman))
    return Number.POSITIVE_INFINITY

  return (
    -1 * manhattanDist(pacman, goal) * (Math.random() + 1) +
    manhattanDist(pacman, ghost) * 3
  )
}

const sameCoords = (cell1, cell2) =>
  cell1.i === cell2.i && cell1.j === cell2.j

const manhattanDist = (cell, destination) =>
  [cell.i - destination.i, cell.j - destination.j]
    .map((val) => Math.abs(val) * 10)
    .reduce((sum, val) => sum + val)
