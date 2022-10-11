const DESTINATION_UNREACHABLE_MESSAGE =
  'Destination unreachable!'

class Node {
  constructor(x, y, h = 0, g = 0, parent = null) {
    this.x = x
    this.y = y
    this.g = g
    this.h = h
    this.parent = parent
  }

  get f() {
    return this.g + this.h
  }
}

export const aStar = (
  maze,
  source,
  destination,
  heuristic = manhattanH
) => {
  if (
    maze[source.y]?.[source.x] !== 0 ||
    maze[destination.y]?.[destination.x] !== 0
  )
    throw new Error(DESTINATION_UNREACHABLE_MESSAGE)

  const closed = []
  const opened = [
    new Node(
      source.x,
      source.y,
      heuristic(source, destination)
    ),
  ]

  while (opened.length > 0) {
    const currentNode = opened
      .sort((a, b) => a.f - b.f)
      .shift()

    const successors = getSuccessors(
      maze,
      currentNode,
      destination,
      heuristic
    )

    // console.dir({ opened, closed, successors })

    for (const successor of successors) {
      if (closed.find(sameCoords.bind(null, successor)))
        continue

      if (sameCoords(successor, destination)) {
        const path = backtrack(successor)
        const nextStep = {
          i: path[path.length - 2].y,
          j: path[path.length - 2].x,
        }
        return { nextStep, path }
      }

      // console.dir({ successor })

      const sameOpened = opened.find(
        sameCoords.bind(null, successor)
      )
      if (sameOpened) {
        if (sameOpened.f > successor.f)
          sameOpened.g = successor.g
        continue
      }

      opened.push(successor)
    }

    closed.push(currentNode)
  }

  throw new Error(DESTINATION_UNREACHABLE_MESSAGE)
}

const getSuccessors = (
  matrix,
  node,
  destination,
  heuristic
) => {
  const successors = []
  const xShift = [-1, 0, 0, 1, 1, 1, -1, -1]
  const yShift = [0, -1, 1, 0, 1, -1, 1, -1]

  for (let i = 0; i < xShift.length; i++) {
    const newX = node.x + xShift[i]
    const newY = node.y + yShift[i]

    // console.dir({
    //   cell,
    //   newX,
    //   newY,
    //   successors,
    //   queue,
    //   visited,
    // })

    if (matrix[newY]?.[newX] === 0) {
      const isDiagonal = newX !== node.x && newY !== node.y
      const newNode = new Node(
        newX,
        newY,
        node.h + isDiagonal ? 14 : 10
      )
      newNode.h = heuristic(newNode, destination)
      newNode.parent = node

      successors.push(newNode)
    }
  }

  return successors
}

const backtrack = (node) => {
  const path = []
  let currNode = node

  while (currNode) {
    path.push(currNode)
    currNode = currNode.parent
  }

  // console.log(path)
  return path
}

const manhattanH = (node, destination) =>
  [node.x - destination.x, node.y - destination.y]
    .map((val) => Math.abs(val) * 10)
    .reduce((sum, val) => sum + val)

const sameCoords = (node1, node2) =>
  node1.x === node2.x && node1.y === node2.y
