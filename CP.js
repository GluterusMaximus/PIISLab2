//prettier-ignore

if (depth === maxDepth) { // Якщо досягнуто максимальної глибини (листок дерева ходів)
    return heuristic(currentCell) //обчислюємо ціну ходу за допомогою евристичної функції
}

//return Math.max(
  //Завжди вибираємо максимальне значення з наявних, незалежно від типу гравця
  ...getAdjacent(currentCell) //Отримуємо всі можливі наступні ходи
    .map((cell) => {
      //для кожного ходу виконуємо функцію
      return -1 * NegaMax(depth + 1, maxDepth, cell) //Рекурсивно викливаємо алгоритм, змінюючи знак результату на протилежний
    })
)

if (depth === maxDepth) {
  // Якщо досягнуто максимальної глибини (листок дерева ходів)
  return heuristic(currentCell) //обчислюємо ціну ходу за допомогою евристичної функції
}

let best = Number.NEGATIVE_INFINITY // Змінна з найкращим (найбільшим) значення на даному рівні.
//Оскільки ми не обчислили ще ні одного значення ця змінна = -Нескінченність
const adjacent = getAdjacent(currentCell) // Отримуємо суміхні ходи

for (const cell of adjacent) { //Для кожного ходу виконуємо
  const value = NegaAlphaBeta( //Оцінюємо хід, викликаючи алгоритм рекурсивно
    depth + 1, //Збільшуємо глибину
    -beta, //У змінну альфа для наступного рівня підставляємо значення бета з протилежним знаком
    -alpha, //У змінну бета для наступного рівня підставляємо значення альфа з протилежним знаком
    maxDepth,
    cell
  )

  best = Math.max(best, value) //Оновлюємо найкраще значення на рівні, якщо було знайдено більше значення
  alpha = Math.max(alpha, best) //Оновлюємо альфа (мінімальне гарантоване), якщо знайдене більше значення

  if (beta <= alpha) break //Вийти з циклу якщо мінімальне >= максимального
}

return best //Повертаємо найбільший результат 