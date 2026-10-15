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

    case 'SQUARE_2DIGIT': {
      // 2-digit squaring with formula: x^2 = (x+a)(x-a) + a^2
      const n = difficulty === 'BEGINNER'
        ? randomChoice([12, 13, 14, 21, 22, 23, 31, 32])
        : difficulty === 'INTERMEDIATE'
        ? randomChoice([16, 24, 26, 34, 36, 42, 46, 52])
        : randomInt(16, 89);

      const lastDigit = n % 10;
      const a = lastDigit <= 5 ? (lastDigit === 0 ? 1 : lastDigit) : 10 - lastDigit;
      const higher = n + a;
      const lower = n - a;
      const multRound = higher % 10 === 0 ? higher : lower;
      const multOther = multRound === higher ? lower : higher;
      const prod = multRound * multOther;
      const aSq = a * a;
      const answer = n * n;
      const explanation = `x² = (x+a)(x-a) + a² (a=${a}): (${higher} × ${lower}) + ${a}² = ${prod} + ${aSq} = ${answer}`;

      return {
        id,
        order,
        expression: `${n}²`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'SQUARE_2DIGIT',
        difficulty,
      };
    }

    case 'SQUARE_3DIGIT': {
      // 3-digit squaring with formula: x^2 = (x+a)(x-a) + a^2
      const n = difficulty === 'BEGINNER'
        ? randomChoice([104, 108, 112, 206, 212, 305, 412, 512])
        : difficulty === 'INTERMEDIATE'
        ? randomChoice([124, 216, 318, 423, 526, 574, 684, 715])
        : randomInt(112, 895);

      const rem = n % 100;
      const a = rem <= 50 ? (rem === 0 ? 5 : rem) : 100 - rem;
      const round100 = rem <= 50 ? n - a : n + a;
      const other = rem <= 50 ? n + a : n - a;
      const prod = round100 * other;
      const aSq = a * a;
      const answer = n * n;
      const explanation = `x² = (x+a)(x-a) + a² (a=${a}): (${round100} × ${other}) + ${a}² = ${prod} + ${aSq} = ${answer}`;

      return {
        id,
        order,
        expression: `${n}²`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'SQUARE_3DIGIT',
        difficulty,
      };
    }

    case 'SQUARE_4DIGIT': {
      // 4-digit squaring with formula: x^2 = (x+a)(x-a) + a^2
      const n = difficulty === 'BEGINNER'
        ? randomChoice([1012, 1024, 2015, 3012, 4021, 5018])
        : difficulty === 'INTERMEDIATE'
        ? randomChoice([1210, 2150, 3214, 4423, 5120, 6382])
        : randomInt(1120, 8950);

      const rem = n % 1000;
      const a = rem <= 500 ? (rem === 0 ? 10 : rem) : 1000 - rem;
      const round1000 = rem <= 500 ? n - a : n + a;
      const other = rem <= 500 ? n + a : n - a;
      const prod = round1000 * other;
      const aSq = a * a;
      const answer = n * n;
      const explanation = `x² = (x+a)(x-a) + a² (a=${a}): (${round1000} × ${other}) + ${a}² = ${prod} + ${aSq} = ${answer}`;

      return {
        id,
        order,
        expression: `${n}²`,
        correctAnswer: answer,
        explanation,
        timeLimitSec,
        operationType: 'SQUARE_4DIGIT',
        difficulty,
      };
    }

    case 'MAJOR_SYSTEM': {
      // Decode mnemonic word to number using Major System
      const majorWords = [
        { word: 'ARO', num: 0, hint: 'R = 0 (las vocales no tienen valor)' },
        { word: 'TÍA', num: 1, hint: 'T = 1 (las vocales no tienen valor)' },
        { word: 'UÑA', num: 2, hint: 'Ñ = 2 (las vocales no tienen valor)' },
        { word: 'HUMO', num: 3, hint: 'M = 3 (H y vocales no tienen valor)' },
        { word: 'OCA', num: 4, hint: 'C = 4 (las vocales no tienen valor)' },
        { word: 'OLA', num: 5, hint: 'L = 5 (las vocales no tienen valor)' },
        { word: 'OSO', num: 6, hint: 'S = 6 (las vocales no tienen valor)' },
        { word: 'HOJA', num: 7, hint: 'J = 7 (H y vocales no tienen valor)' },
        { word: 'HACHA', num: 8, hint: 'CH = 8 (H y vocales no tienen valor)' },
        { word: 'BOA', num: 9, hint: 'B = 9 (las vocales no tienen valor)' },
        { word: 'LUPA', num: 59, hint: 'L = 5, P = 9 → 59' },
        { word: 'MAGO', num: 38, hint: 'M = 3, G = 8 → 38' },
        { word: 'FINO', num: 72, hint: 'F = 7, N = 2 → 72' },
        { word: 'CAMA', num: 43, hint: 'C = 4, M = 3 → 43' },
        { word: 'TAZA', num: 16, hint: 'T = 1, Z = 6 → 16' },
        { word: 'BOLA', num: 95, hint: 'B = 9, L = 5 → 95' },
        { word: 'GATO', num: 81, hint: 'G = 8, T = 1 → 81' },
        { word: 'SAPO', num: 69, hint: 'S = 6, P = 9 → 69' },
        { word: 'PUMA', num: 93, hint: 'P = 9, M = 3 → 93' },
        { word: 'LODO', num: 51, hint: 'L = 5, D = 1 → 51' },
        { word: 'FARO', num: 70, hint: 'F = 7, R = 0 → 70' }
      ];

      const item = randomChoice(majorWords);
      const expression = `Palabra: ${item.word}`;
      const explanation = `Sistema Mayor: En "${item.word}", ${item.hint}.`;

      return {
        id,
        order,
        expression,
        correctAnswer: item.num,
        explanation,
        timeLimitSec,
        operationType: 'MAJOR_SYSTEM',
        difficulty,
      };
    }

    case 'FRACTION_COMPARE': {
      // Comparison of fractions using cross products, benchmarks (1/2), decimals, and visual registers
      type FractionCompareTemplate = {
        expression: string;
        options: Array<{ id: number; label: string; value: number }>;
        correctAnswer: number;
        explanation: string;
      };

      const compareTemplates: FractionCompareTemplate[] = [
        // 1. Cross multiplication
        {
          expression: '¿Cuál es mayor? 4/7  o  3/5',
          options: [
            { id: 1, label: '4/7', value: 1 },
            { id: 2, label: 'Son iguales (=)', value: 2 },
            { id: 3, label: '3/5', value: 3 },
          ],
          correctAnswer: 3,
          explanation: 'Regla del aspa: 4 × 5 = 20 frente a 7 × 3 = 21. Como 21 > 20, la fracción 3/5 es mayor.',
        },
        {
          expression: '¿Cuál es mayor? 5/8  o  2/3',
          options: [
            { id: 1, label: '5/8', value: 1 },
            { id: 2, label: 'Son iguales (=)', value: 2 },
            { id: 3, label: '2/3', value: 3 },
          ],
          correctAnswer: 3,
          explanation: 'Productos cruzados: 5 × 3 = 15 frente a 8 × 2 = 16. Como 16 > 15, 2/3 es mayor.',
        },
        {
          expression: '¿Cuál es mayor? 3/4  o  6/8',
          options: [
            { id: 1, label: '3/4', value: 1 },
            { id: 2, label: 'Son iguales (=)', value: 2 },
            { id: 3, label: '6/8', value: 3 },
          ],
          correctAnswer: 2,
          explanation: 'Son fracciones equivalentes: 3 × 8 = 24 y 4 × 6 = 24. Representan la misma cantidad.',
        },
        {
          expression: '¿Cuál es mayor? 5/6  o  7/9',
          options: [
            { id: 1, label: '5/6', value: 1 },
            { id: 2, label: 'Son iguales (=)', value: 2 },
            { id: 3, label: '7/9', value: 3 },
          ],
          correctAnswer: 1,
          explanation: 'Aspa mental: 5 × 9 = 45 frente a 6 × 7 = 42. Como 45 > 42, 5/6 es mayor.',
        },
        // 2. Benchmark with 1/2
        {
          expression: 'Punto de referencia (1/2): ¿Cuál es mayor entre 3/7 y 5/9?',
          options: [
            { id: 1, label: '3/7 (< 1/2)', value: 1 },
            { id: 2, label: 'Son iguales (=)', value: 2 },
            { id: 3, label: '5/9 (> 1/2)', value: 3 },
          ],
          correctAnswer: 3,
          explanation: 'La mitad de 7 es 3.5 (3 < 3.5, luego 3/7 < 1/2). La mitad de 9 es 4.5 (5 > 4.5, luego 5/9 > 1/2). Por tanto, 5/9 es mayor.',
        },
        {
          expression: 'Punto de referencia (1/2): ¿Cuál es mayor entre 4/9 y 5/8?',
          options: [
            { id: 1, label: '4/9 (< 1/2)', value: 1 },
            { id: 2, label: 'Son iguales (=)', value: 2 },
            { id: 3, label: '5/8 (> 1/2)', value: 3 },
          ],
          correctAnswer: 3,
          explanation: '4/9 es menor a 1/2 (4 < 4.5) y 5/8 es mayor a 1/2 (5 > 4). Inmediatamente 5/8 es mayor.',
        },
        // 3. Decimal register vs fraction
        {
          expression: 'Registro decimal: ¿Cuál es mayor entre 2/5 y 0.45?',
          options: [
            { id: 1, label: '2/5 (= 0.40)', value: 1 },
            { id: 2, label: 'Son iguales (=)', value: 2 },
            { id: 3, label: '0.45', value: 3 },
          ],
          correctAnswer: 3,
          explanation: '2/5 equivale a 0.40. Al comparar 0.40 frente a 0.45, vemos que 0.45 es mayor.',
        },
        {
          expression: 'Registro decimal: ¿Cuál es mayor entre 3/4 y 0.72?',
          options: [
            { id: 1, label: '3/4 (= 0.75)', value: 1 },
            { id: 2, label: 'Son iguales (=)', value: 2 },
            { id: 3, label: '0.72', value: 3 },
          ],
          correctAnswer: 1,
          explanation: '3/4 equivale a 0.75. Como 0.75 > 0.72, 3/4 es mayor.',
        },
        // 4. Graphical / bar register
        {
          expression: 'Registro gráfico: ¿Qué fracción representa la barra [■■■□□]?',
          options: [
            { id: 1, label: '3/5 (= 0.60)', value: 1 },
            { id: 2, label: '2/5 (= 0.40)', value: 2 },
            { id: 3, label: '3/2 (= 1.50)', value: 3 },
          ],
          correctAnswer: 1,
          explanation: 'La barra tiene 5 partes totales y 3 sombreadas: representa 3/5 (o 0.60 en decimal).',
        },
        {
          expression: 'Registro gráfico: ¿Cuál barra es mayor? A: [■■■□] (3/4) vs B: [■■□] (2/3)',
          options: [
            { id: 1, label: 'Barra A: 3/4 (0.75)', value: 1 },
            { id: 2, label: 'Son iguales (=)', value: 2 },
            { id: 3, label: 'Barra B: 2/3 (≈ 0.67)', value: 3 },
          ],
          correctAnswer: 1,
          explanation: '3/4 = 0.75 (75% lleno) frente a 2/3 ≈ 0.67 (66.7% lleno). Barra A (3/4) es mayor.',
        },
      ];

      const item = randomChoice(compareTemplates);
      return {
        id,
        order,
        expression: item.expression,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        timeLimitSec,
        operationType: 'FRACTION_COMPARE',
        difficulty,
        options: item.options,
      };
    }

    case 'FRACTION_OPS': {
      // Sums and subtractions of fractions with same/different denominators and butterfly method
      type FractionOpTemplate = {
        expression: string;
        options: Array<{ id: number; label: string; value: number }>;
        correctAnswer: number;
        explanation: string;
      };

      const opTemplates: FractionOpTemplate[] = [
        {
          expression: '2/7 + 3/7 = ?',
          options: [
            { id: 1, label: '5/7', value: 1 },
            { id: 2, label: '5/14', value: 2 },
            { id: 3, label: '6/7', value: 3 },
            { id: 4, label: '1', value: 4 },
          ],
          correctAnswer: 1,
          explanation: 'Mismo denominador: sumamos directamente los numeradores: (2 + 3)/7 = 5/7. ¡Los denominadores no se suman!',
        },
        {
          expression: '7/9 - 2/9 = ?',
          options: [
            { id: 1, label: '5/9', value: 1 },
            { id: 2, label: '5/0', value: 2 },
            { id: 3, label: '9/9', value: 3 },
            { id: 4, label: '1/2', value: 4 },
          ],
          correctAnswer: 1,
          explanation: 'Mismo denominador: restamos los numeradores: (7 - 2)/9 = 5/9.',
        },
        {
          expression: '1/2 + 3/8 = ?',
          options: [
            { id: 1, label: '7/8', value: 1 },
            { id: 2, label: '4/10', value: 2 },
            { id: 3, label: '5/8', value: 3 },
            { id: 4, label: '1', value: 4 },
          ],
          correctAnswer: 1,
          explanation: 'Denominadores múltiplos: amplificamos 1/2 multiplicando por 4 → 4/8. Sumamos 4/8 + 3/8 = 7/8.',
        },
        {
          expression: '2/3 + 1/4 = ?',
          options: [
            { id: 1, label: '11/12', value: 1 },
            { id: 2, label: '3/7', value: 2 },
            { id: 3, label: '9/12', value: 3 },
            { id: 4, label: '7/12', value: 4 },
          ],
          correctAnswer: 1,
          explanation: 'Método mariposa: (2 × 4 + 3 × 1) / (3 × 4) = (8 + 3) / 12 = 11/12.',
        },
        {
          expression: '3/4 - 1/3 = ?',
          options: [
            { id: 1, label: '5/12', value: 1 },
            { id: 2, label: '2/1', value: 2 },
            { id: 3, label: '1/12', value: 3 },
            { id: 4, label: '7/12', value: 4 },
          ],
          correctAnswer: 1,
          explanation: 'Método mariposa: (3 × 3 - 4 × 1) / (4 × 3) = (9 - 4) / 12 = 5/12.',
        },
        {
          expression: '1 - 3/7 = ?',
          options: [
            { id: 1, label: '4/7', value: 1 },
            { id: 2, label: '2/7', value: 2 },
            { id: 3, label: '5/7', value: 3 },
            { id: 4, label: '3/7', value: 4 },
          ],
          correctAnswer: 1,
          explanation: 'Resta a un entero: pensamos en 1 como 7/7. Luego 7/7 - 3/7 = 4/7.',
        },
        {
          expression: '1/3 + 2/5 = ?',
          options: [
            { id: 1, label: '11/15', value: 1 },
            { id: 2, label: '3/8', value: 2 },
            { id: 3, label: '7/15', value: 3 },
            { id: 4, label: '9/15', value: 4 },
          ],
          correctAnswer: 1,
          explanation: 'Método mariposa: (1 × 5 + 3 × 2) / (3 × 5) = (5 + 6) / 15 = 11/15.',
        },
        {
          expression: '5/6 - 1/2 = ?',
          options: [
            { id: 1, label: '1/3 (simplificado)', value: 1 },
            { id: 2, label: '4/4', value: 2 },
            { id: 3, label: '1/6', value: 3 },
            { id: 4, label: '2/3', value: 4 },
          ],
          correctAnswer: 1,
          explanation: '1/2 amplificado es 3/6. Restamos 5/6 - 3/6 = 2/6. Simplificando entre 2 queda 1/3.',
        },
      ];

      const item = randomChoice(opTemplates);
      return {
        id,
        order,
        expression: item.expression,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        timeLimitSec,
        operationType: 'FRACTION_OPS',
        difficulty,
        options: item.options,
      };
    }

    case 'SUPERMARKET_OFFERS': {
      // Supermarket promos: 2x1, 3x2, 4x3, 70% on 2nd unit, 80% on 2nd unit, direct percentage
      type OfferTemplate = {
        expression: string;
        options: Array<{ id: number; label: string; value: number }>;
        correctAnswer: number;
        explanation: string;
      };

      const offerTemplates: OfferTemplate[] = [
        {
          expression: 'El Centauro (2×1) vs El Dorado (70% en 2da unidad): ¿Cuál conviene más?',
          options: [
            { id: 1, label: 'El Centauro: Promo 2×1 (50% ahorro)', value: 1 },
            { id: 2, label: 'El Dorado: 70% en 2da (35% ahorro)', value: 2 },
            { id: 3, label: 'Ambas ofertas son idénticas', value: 3 },
          ],
          correctAnswer: 1,
          explanation: '2×1 es 50% de descuento total. 70% en la 2da unidad representa sólo 35% de ahorro total (la mitad del 70%). ¡Gana claramente 2×1!',
        },
        {
          expression: '¿Cuál oferta es más conveniente? 3×2 en lácteos  vs  75% de descuento directo',
          options: [
            { id: 1, label: '3×2 en lácteos (33.3% ahorro)', value: 1 },
            { id: 2, label: '75% de descuento directo', value: 2 },
            { id: 3, label: 'Ambas son iguales', value: 3 },
          ],
          correctAnswer: 2,
          explanation: '3×2 equivale a pagar 2 de 3 (ahorro de 1/3 = 33.3%). El 75% directo ahorra más del doble. ¡Conviene 75% directo!',
        },
        {
          expression: 'Lácteos en promo 3×2 (llevá 3 al precio de 2): ¿Qué % de descuento real representa?',
          options: [
            { id: 1, label: '33.3% de descuento', value: 1 },
            { id: 2, label: '50% de descuento', value: 2 },
            { id: 3, label: '66.7% de descuento', value: 3 },
            { id: 4, label: '25% de descuento', value: 4 },
          ],
          correctAnswer: 1,
          explanation: 'Llevas 3 y pagas 2: Descuento = (3 - 2)/3 = 1/3 ≈ 33.3% de ahorro real.',
        },
        {
          expression: 'Lavavajillas en promo 4×3 (llevá 4 al precio de 3): ¿Qué % de descuento real representa?',
          options: [
            { id: 1, label: '25% de descuento', value: 1 },
            { id: 2, label: '33.3% de descuento', value: 2 },
            { id: 3, label: '75% de descuento', value: 3 },
            { id: 4, label: '20% de descuento', value: 4 },
          ],
          correctAnswer: 1,
          explanation: 'Llevas 4 y pagas 3: Descuento = (4 - 3)/4 = 1/4 = 25% de ahorro real.',
        },
        {
          expression: 'Duelo de ofertas: ¿Cuál descuento es mayor? 3×2  vs  70% de descuento en la 2da unidad',
          options: [
            { id: 1, label: '3×2 (33.3% de ahorro)', value: 1 },
            { id: 2, label: '70% en la 2da unidad (35% de ahorro)', value: 2 },
            { id: 3, label: 'Son exactamente equivalentes', value: 3 },
          ],
          correctAnswer: 2,
          explanation: '70% en la 2da unidad es 35% de descuento global (70% ÷ 2), que supera ligeramente al 33.3% del 3×2.',
        },
        {
          expression: 'Si un cartel ofrece "80% de descuento en la 2da unidad", ¿cuál es el ahorro real por unidad?',
          options: [
            { id: 1, label: '40% de descuento real', value: 1 },
            { id: 2, label: '80% de descuento real', value: 2 },
            { id: 3, label: '20% de descuento real', value: 3 },
            { id: 4, label: '50% de descuento real', value: 4 },
          ],
          correctAnswer: 1,
          explanation: 'Pagas 1 + 0.20 = 1.20 por 2 productos (0.60 por unidad). El ahorro real es del 40% (la mitad de 80%).',
        },
        {
          expression: '¿Cuál conviene más? 2×1 en pastas  vs  40% de descuento directo',
          options: [
            { id: 1, label: '2×1 en pastas (50% ahorro)', value: 1 },
            { id: 2, label: '40% directo', value: 2 },
            { id: 3, label: 'Son equivalentes', value: 3 },
          ],
          correctAnswer: 1,
          explanation: '2×1 otorga 50% de descuento, superando ampliamente al 40% directo.',
        },
        {
          expression: '¿Qué promo equivale exactamente a un descuento del 25%?',
          options: [
            { id: 1, label: '4×3 (o 50% en la 2da unidad)', value: 1 },
            { id: 2, label: '3×2', value: 2 },
            { id: 3, label: '2×1', value: 3 },
            { id: 4, label: '70% en la 2da unidad', value: 4 },
          ],
          correctAnswer: 1,
          explanation: 'En 4×3 pagas 3 de 4 (ahorras 1/4 = 25%). Y 50% en la 2da es 50% ÷ 2 = 25% global.',
        },
      ];

      const item = randomChoice(offerTemplates);
      return {
        id,
        order,
        expression: item.expression,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        timeLimitSec,
        operationType: 'SUPERMARKET_OFFERS',
        difficulty,
        options: item.options,
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
        a = randomInt(12, 38);
        b = randomInt(3, 7);
      } else if (difficulty === 'INTERMEDIATE') {
        a = randomInt(24, 85);
        b = randomInt(4, 9);
      } else {
        a = randomInt(112, 450);
        b = randomInt(4, 8);
      }
      const answer = a * b;
      let explanation = '';
      if (a >= 10 && a < 100 && b < 10) {
        const tens = Math.floor(a / 10) * 10;
        const units = a % 10;
        explanation = `De izquierda a derecha: (${tens} × ${b}) + (${units} × ${b}) = ${tens * b} + ${units * b} = ${answer}`;
      } else if (a >= 100 && b < 10) {
        const hundreds = Math.floor(a / 100) * 100;
        const rem = a % 100;
        const tens = Math.floor(rem / 10) * 10;
        const units = rem % 10;
        explanation = `De izquierda a derecha: (${hundreds}×${b}) + (${tens}×${b}) + (${units}×${b}) = ${hundreds * b} + ${tens * b} + ${units * b} = ${answer}`;
      } else {
        explanation = `${a} × ${b} = ${answer}`;
      }

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
