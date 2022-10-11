const heuristic = (layout, positions) => {
  const { ghost, pacman, goal } = positions

  if (sameCoords(ghost, pacman)) {
    console.log('Danger!!!')
    return Number.NEGATIVE_INFINITY
  }
  if (sameCoords(goal, pacman))
    return Number.POSITIVE_INFINITY

  return (
    -1 * manhattanDist(pacman, goal) +
    manhattanDist(pacman, ghost) * 3
  )
}

const sameCoords = (cell1, cell2) =>
  cell1.i === cell2.i && cell1.j === cell2.j

const manhattanDist = (cell, destination) =>
  [cell.i - destination.i, cell.j - destination.j]
    .map((val) => Math.abs(val) * 10)
    .reduce((sum, val) => sum + val)
