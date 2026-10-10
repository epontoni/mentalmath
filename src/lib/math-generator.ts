// Procedural Mental Math Question Generator
// Generates verified calculations with detailed step-by-step mental math explanations

import { QuestionData, OperationType, GameDifficulty } from '@/types/game';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateQuestion(
  order: number,
  operation: OperationType,
  difficulty: GameDifficulty = 'MEDIUM',
  timeLimitSec: number = 10
): QuestionData {
  const id = `q_${Date.now()}_${order}_${Math.random().toString(36).substring(2, 7)}`;

  // Handle specific mental math tricks & standard operations
  switch (operation) {
    case 'MULTIPLICATION_11': {
      // 2-digit number * 11
      const isCarry = difficulty === 'ADVANCED' || difficulty === 'MASTER' || Math.random() > 0.5;
      let n: number;
      if (isCarry) {
        // e.g. 67 -> 6+7 = 13 >= 10
        const d1 = randomInt(5, 9);
        const d2 = randomInt(5, 9);
        n = d1 * 10 + d2;
      } else {
        // e.g. 35 -> 3+5 = 8 < 10
        const d1 = randomInt(1, 5);
        const d2 = randomInt(1, 4);
        n = d1 * 10 + d2;
      }
      const answer = n * 11;
      const tens = Math.floor(n / 10);
      const units = n % 10;
      const sum = tens + units;
      
      let explanation = '';
      if (sum < 10) {
        explanation = `Truco del 11: Separa ${tens} y ${units}. En medio coloca (${tens} + ${units} = ${sum}) → ${tens}${sum}${units} = ${answer}`;
      } else {
        const carry = Math.floor(sum / 10);
        const middle = sum % 10;
        explanation = `Truco del 11 con llevada: ${tens} y ${units}. Suma central: ${tens}+${units} = ${sum}. Deja el ${middle} y suma el ${carry} al ${tens} (${tens}+${carry}=${tens + carry}) → ${tens + carry}${middle}${units} = ${answer}`;
      }

      return {
        id,
        order,
        expression: `${n} × 11`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'MULTIPLICATION_11',
        difficulty,
      };
    }

    case 'COMPLEMENT_100': {
      // 100 - X
      const sub = difficulty === 'BEGINNER' ? randomInt(11, 89) : randomInt(12, 98);
      const answer = 100 - sub;
      const tens = Math.floor(sub / 10);
      const units = sub % 10;
      const compTens = 9 - tens;
      const compUnits = 10 - units;
      const explanation = `Regla "Todos a 9, último a 10": 9 - ${tens} = ${compTens}, y 10 - ${units} = ${compUnits} → Resultado: ${compTens}${compUnits} = ${answer}`;

      return {
        id,
        order,
        expression: `100 - ${sub}`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'COMPLEMENT_100',
        difficulty,
      };
    }

    case 'SQUARE_5': {
      // Numbers ending in 5 squared (15, 25, 35, 45, ..., 95)
      const tens = difficulty === 'BEGINNER' ? randomChoice([1, 2, 3, 4]) : randomChoice([3, 4, 5, 6, 7, 8, 9]);
      const n = tens * 10 + 5;
      const answer = n * n;
      const mult = tens * (tens + 1);
      const explanation = `Cuadrado que termina en 5: Multiplica las decenas por su consecutivo (${tens} × ${tens + 1} = ${mult}) y añade 25 al final → ${mult}25 = ${answer}`;

      return {
        id,
        order,
        expression: `${n}²`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'SQUARE_5',
        difficulty,
      };
    }

    case 'DISTRIBUTIVE': {
      // e.g. 18 * 6 = (10*6) + (8*6)
      const base = randomChoice([14, 16, 17, 18, 19, 23, 24, 32, 42]);
      const mult = randomInt(3, 8);
      const answer = base * mult;
      const tens = Math.floor(base / 10) * 10;
      const units = base % 10;
      const part1 = tens * mult;
      const part2 = units * mult;
      const explanation = `Descomposición: (${tens} × ${mult}) + (${units} × ${mult}) = ${part1} + ${part2} = ${answer}`;

      return {
        id,
        order,
        expression: `${base} × ${mult}`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'DISTRIBUTIVE',
        difficulty,
      };
    }

    case 'DOUBLE_HALF': {
      // e.g. 25 * 16 -> 50 * 8 = 400
      const pair = randomChoice([
        { a: 25, b: randomChoice([12, 14, 16, 18, 24, 28]) },
        { a: 15, b: randomChoice([12, 14, 16, 18, 22, 26]) },
        { a: 35, b: randomChoice([12, 14, 16, 18]) },
        { a: 45, b: randomChoice([12, 14, 16]) },
        { a: 50, b: randomChoice([14, 18, 24, 32, 48]) },
      ]);
      const a = pair.a;
      const b = pair.b;
      const answer = a * b;
      const aDouble = a * 2;
      const bHalf = b / 2;
      const explanation = `Doble y Mitad: Multiplica ${a} × 2 = ${aDouble} y divide ${b} ÷ 2 = ${bHalf}. Luego ${aDouble} × ${bHalf} = ${answer}`;

      return {
        id,
        order,
        expression: `${a} × ${b}`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'DOUBLE_HALF',
        difficulty,
      };
    }

    case 'ADDITION': {
      let a: number;
      let b: number;
      if (difficulty === 'BEGINNER') {
        a = randomInt(11, 49);
        b = randomInt(11, 49);
      } else if (difficulty === 'INTERMEDIATE') {
        a = randomInt(35, 99);
        b = randomInt(28, 99);
      } else {
        a = randomInt(125, 489);
        b = randomInt(85, 399);
      }
      const answer = a + b;
      const tensA = Math.floor(a / 10) * 10;
      const unitsA = a % 10;
      const explanation = `Suma de izquierda a derecha: (${a} + ${Math.floor(b/10)*10}) + ${b%10} = ${a + Math.floor(b/10)*10} + ${b%10} = ${answer}`;

      return {
        id,
        order,
        expression: `${a} + ${b}`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'ADDITION',
        difficulty,
      };
    }

    case 'SUBTRACTION': {
      let a: number;
      let b: number;
      if (difficulty === 'BEGINNER') {
        a = randomInt(40, 99);
        b = randomInt(11, a - 5);
      } else if (difficulty === 'INTERMEDIATE') {
        a = randomInt(52, 150);
        b = randomInt(18, a - 10);
      } else {
        a = randomInt(210, 850);
        b = randomInt(95, a - 25);
      }
      const answer = a - b;
      const explanation = `Resta por tramos: ${a} - ${Math.floor(b/10)*10} = ${a - Math.floor(b/10)*10}, luego - ${b%10} = ${answer}`;

      return {
        id,
        order,
        expression: `${a} - ${b}`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'SUBTRACTION',
        difficulty,
      };
    }

    case 'MULTIPLICATION': {
      let a: number;
      let b: number;
      if (difficulty === 'BEGINNER') {
        a = randomInt(4, 9);
        b = randomInt(4, 9);
      } else if (difficulty === 'INTERMEDIATE') {
        a = randomInt(12, 35);
        b = randomInt(4, 9);
      } else {
        a = randomInt(13, 29);
        b = randomInt(12, 19);
      }
      const answer = a * b;
      const explanation = `${a} × ${b} = ${answer}`;

      return {
        id,
        order,
        expression: `${a} × ${b}`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'MULTIPLICATION',
        difficulty,
      };
    }

    case 'DIVISION': {
      const divisor = randomInt(3, 15);
      const quotient = difficulty === 'BEGINNER' ? randomInt(4, 12) : randomInt(8, 25);
      const dividend = divisor * quotient;
      const answer = quotient;
      const explanation = `${dividend} ÷ ${divisor} = ${answer}`;

      return {
        id,
        order,
        expression: `${dividend} ÷ ${divisor}`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'DIVISION',
        difficulty,
      };
    }

    case 'MIXED':
    default: {
      const allowedOps: OperationType[] = [
        'ADDITION',
        'SUBTRACTION',
        'MULTIPLICATION',
        'MULTIPLICATION_11',
        'COMPLEMENT_100',
        'SQUARE_5',
        'DISTRIBUTIVE',
      ];
      const selected = randomChoice(allowedOps);
      return generateQuestion(order, selected, difficulty, timeLimitSec);
    }
  }
}

export function generateQuestionSet(
  count: number,
  operations: OperationType[],
  difficulty: GameDifficulty = 'MEDIUM',
  timeLimitSec: number = 10
): QuestionData[] {
  const questions: QuestionData[] = [];
  const pool = operations.length > 0 ? operations : (['MIXED'] as OperationType[]);

  for (let i = 1; i <= count; i++) {
    const op = randomChoice(pool);
    questions.push(generateQuestion(i, op, difficulty, timeLimitSec));
  }

  return questions;
}
