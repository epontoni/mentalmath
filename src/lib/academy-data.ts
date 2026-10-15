// Academy Mental Math Courses and Interactive Step-by-Step Breakdown Data

import { AcademyTechniqueData } from '@/types/game';

export const ACADEMY_TECHNIQUES: AcademyTechniqueData[] = [
  {
    id: 'tech_sumas',
    slug: 'sumas',
    title: 'Sumas',
    category: 'Sumas Mentales',
    shortDesc: 'Aprende a sumar dos números fácilmente con el método de izquierda a derecha.',
    fullDesc: 'A diferencia del algoritmo tradicional de papel y lápiz, en cálculo mental sumamos primero las decenas y luego las unidades. Descubre cómo calcular y anticipar el resultado mentalmente con agilidad.',
    difficulty: 'BEGINNER',
    badgeIcon: 'Plus',
    steps: [
      {
        stepNumber: 1,
        title: 'De izquierda a derecha: Suma primero las decenas',
        explanation: 'En el colegio aprendimos a sumar de derecha a izquierda (primero unidades, luego decenas). Pero en la mente es mucho más fácil y rápido sumar de izquierda a derecha: tomamos el primer número y le sumamos las decenas del segundo número. Por ejemplo, en 56 + 21, sumamos primero 56 + 20 = 76.',
        exampleFormula: '56 + 21 = (56 + 20) + 1',
        breakdown: [
          { text: '56', highlight: true, note: '1er número', color: 'teal' },
          { text: '+', highlight: false },
          { text: '20', highlight: true, note: 'Decena de 21', color: 'amber' },
          { text: '=', highlight: false },
          { text: '76', highlight: true, note: 'Subtotal en mente', color: 'emerald' }
        ],
        visualHint: '56 + 20 = 76 (Sumamos la cantidad mayor primero)'
      },
      {
        stepNumber: 2,
        title: 'Suma las unidades al resultado anterior',
        explanation: 'Ahora sólo resta sumar las unidades del segundo número al subtotal que ya tenías en la mente. Tenías 76, le sumas el 1 que faltaba de 21: 76 + 1 = 77.',
        exampleFormula: '76 + 1 = 77',
        breakdown: [
          { text: '76', highlight: true, note: 'Subtotal', color: 'emerald' },
          { text: '+', highlight: false },
          { text: '1', highlight: true, note: 'Unidad de 21', color: 'amber' },
          { text: '=', highlight: false },
          { text: '77', highlight: true, note: '¡Resultado final!', color: 'rose' }
        ],
        visualHint: '(56 + 20) + 1 = 76 + 1 = 77'
      },
      {
        stepNumber: 3,
        title: 'Decir el resultado antes de terminar la cuenta',
        explanation: 'Observa que cuando las unidades no superan 9 (aquí 6 + 1 = 7 < 10), puedes empezar a decir el resultado en voz alta antes de terminar la cuenta: dices "Setenta..." y mientras lo pronuncias, tu mente ya sabe que termina en "...y siete". ¡Hablas al mismo ritmo que calculas!',
        exampleFormula: '56 + 21 → "Setenta... y siete!"',
        breakdown: [
          { text: '56 + 20', highlight: true, color: 'amber', note: '70 garantizado' },
          { text: '→', highlight: false },
          { text: '6 + 1 = 7', highlight: true, color: 'teal', note: 'Sin llevada (< 10)' },
          { text: '→', highlight: false },
          { text: '77', highlight: true, color: 'emerald', note: 'Inmediato' }
        ],
        visualHint: 'Si las unidades no pasan de 10, la decena no cambiará jamás.'
      },
      {
        stepNumber: 4,
        title: '¿Qué ocurre cuando hay llevada? (Ej: 44 + 38)',
        explanation: 'Esto no siempre es posible cuando las unidades suman un número mayor que 10. Por ejemplo en 44 + 38: primero sumamos las decenas (44 + 30 = 74). Luego sumamos las unidades: 74 + 8 = 82. Como las unidades suman 4 + 8 = 12, la llevada cambia la decena de 70 a 80.',
        exampleFormula: '44 + 38 = (44 + 30) + 8 = 74 + 8 = 82',
        breakdown: [
          { text: '44 + 30 = 74', highlight: true, color: 'teal', note: 'Suma decenas' },
          { text: '→', highlight: false },
          { text: '74 + 8', highlight: true, color: 'amber', note: 'Suma unidades (4+8=12)' },
          { text: '=', highlight: false },
          { text: '82', highlight: true, color: 'rose', note: 'Resultado final' }
        ],
        visualHint: '44 + 30 = 74 → 74 + 8 = 82 (o 74 + 6 + 2 = 82)'
      }
    ],
    drillPreset: {
      operations: ['ADDITION'],
      timePerQuestion: 8,
      questionCount: 8
    }
  },
  {
    id: 'tech_productos',
    slug: 'productos',
    title: 'Productos',
    category: 'Multiplicación Rápida',
    shortDesc: 'Aprende a multiplicar mentalmente de izquierda a derecha multiplicando primero decenas y luego unidades.',
    fullDesc: 'Para resolver multiplicaciones mentalmente, al igual que en las sumas, comenzamos de izquierda a derecha: multiplicamos primero las decenas del número mayor, luego las unidades, y sumamos los resultados parciales progresivamente.',
    difficulty: 'BEGINNER',
    badgeIcon: 'Flame',
    steps: [
      {
        stepNumber: 1,
        title: 'De izquierda a derecha: Decenas y luego unidades',
        explanation: 'Para resolver multiplicaciones mentalmente empezamos de izquierda a derecha. Multiplicamos primero las decenas del número mayor y luego las unidades. Por ejemplo, para resolver 23 × 4: comenzamos haciendo 20 × 4 = 80, y luego las unidades 3 × 4 = 12.',
        exampleFormula: '23 × 4 = (20 × 4) + (3 × 4)',
        breakdown: [
          { text: '20 × 4 = 80', highlight: true, note: 'Decenas primero', color: 'teal' },
          { text: '+', highlight: false },
          { text: '3 × 4 = 12', highlight: true, note: 'Unidades', color: 'amber' },
          { text: '=', highlight: false },
          { text: '80 + 12', highlight: true, note: 'Suma parcial', color: 'emerald' }
        ],
        visualHint: '20 × 4 = 80 y 3 × 4 = 12'
      },
      {
        stepNumber: 2,
        title: 'Suma los resultados parciales',
        explanation: 'Finalmente sumamos los dos resultados: 80 + 12 = 92. Esta suma también la hacemos de izquierda a derecha: 80 + 10 = 90, y 90 + 2 = 92.',
        exampleFormula: '80 + 12 = (80 + 10) + 2 = 92',
        breakdown: [
          { text: '80', highlight: true, note: 'Decenas × 4', color: 'teal' },
          { text: '+', highlight: false },
          { text: '10', highlight: true, note: 'Decena de 12', color: 'amber' },
          { text: '+', highlight: false },
          { text: '2', highlight: true, note: 'Unidad de 12', color: 'amber' },
          { text: '=', highlight: false },
          { text: '92', highlight: true, note: '¡Resultado final!', color: 'rose' }
        ],
        visualHint: '80 + 12 = 92'
      },
      {
        stepNumber: 3,
        title: 'Decir el resultado antes de finalizar',
        explanation: 'Recordemos que al sumar los productos parciales de izquierda a derecha podemos, a veces, ir diciendo el resultado antes de finalizar la cuenta: 80 + 10 = "Noventa y...", y luego rematas con "... dos!" (92). ¡Hablas mientras tu mente calcula!',
        exampleFormula: '80 + 10 = 90 → "Noventa y..." → 92',
        breakdown: [
          { text: '80 + 10', highlight: true, color: 'teal', note: 'Noventa seguro' },
          { text: '→', highlight: false },
          { text: '"Noventa y..."', highlight: true, color: 'amber', note: 'Dices en voz alta' },
          { text: '→', highlight: false },
          { text: '92', highlight: true, color: 'emerald', note: '¡Listo!' }
        ],
        visualHint: 'Anticipa la decena mientras terminas de calcular la unidad.'
      },
      {
        stepNumber: 4,
        title: 'Más ejemplos: 27 × 4 y 48 × 9',
        explanation: 'Practica el mismo proceso:\n• En 27 × 4: (20 × 4) + (7 × 4) = 80 + 28 = 108.\n• En 48 × 9: (40 × 9) + (8 × 9) = 360 + 72 = 432.',
        exampleFormula: '27 × 4 = 80 + 28 = 108  |  48 × 9 = 360 + 72 = 432',
        breakdown: [
          { text: '27 × 4', highlight: true, color: 'teal', note: '80 + 28' },
          { text: '=', highlight: false },
          { text: '108', highlight: true, color: 'emerald', note: '1er ejemplo' },
          { text: '|', highlight: false },
          { text: '48 × 9', highlight: true, color: 'amber', note: '360 + 72' },
          { text: '=', highlight: false },
          { text: '432', highlight: true, color: 'rose', note: '2do ejemplo' }
        ],
        visualHint: '20×4=80, 7×4=28 → 108 | 40×9=360, 8×9=72 → 432'
      },
      {
        stepNumber: 5,
        title: 'Números de 3 dígitos (Ej: 834 × 6)',
        explanation: 'Se utiliza el mismo método cuando el número mayor es de 3 o 4 dígitos. Siempre se multiplica de izquierda a derecha y se suman progresivamente los resultados parciales:\n• Centenas: 800 × 6 = 4800\n• Decenas: 30 × 6 = 180 → Sumamos 4800 + 180 = 4980\n• Unidades: 4 × 6 = 24 → Sumamos 4980 + 24 = 5004.\nRecién al final, al realizar la última suma, pudimos decir el resultado final.',
        exampleFormula: '834 × 6 = 4800 + 180 + 24 = 4980 + 24 = 5004',
        breakdown: [
          { text: '800 × 6 = 4800', highlight: true, color: 'teal', note: 'Centenas' },
          { text: '+ 180 = 4980', highlight: true, color: 'amber', note: 'Decenas (30×6)' },
          { text: '+ 24', highlight: true, color: 'rose', note: 'Unidades (4×6)' },
          { text: '=', highlight: false },
          { text: '5004', highlight: true, color: 'emerald', note: '¡Resultado final!' }
        ],
        visualHint: '4800 + 180 = 4980 → 4980 + 24 = 5004'
      }
    ],
    drillPreset: {
      operations: ['MULTIPLICATION'],
      timePerQuestion: 10,
      questionCount: 8
    }
  },
  {
    id: 'tech_potencia_2d',
    slug: 'potencia-2-digitos',
    title: 'Potencia (2 dígitos)',
    category: 'Potencias y Raíces',
    shortDesc: 'Aprende a calcular potencias al cuadrado con la fórmula maestra x² = (x+a)(x-a) + a².',
    fullDesc: 'Aprende a elevar al cuadrado números de 2 dígitos (y la base para 3 y 4 dígitos) utilizando la fórmula x² = (x+a)(x-a) + a², redondeando al múltiplo de 10 más cercano y multiplicando de izquierda a derecha.',
    difficulty: 'INTERMEDIATE',
    badgeIcon: 'Zap',
    steps: [
      {
        stepNumber: 1,
        title: 'La fórmula maestra: x² = (x+a)(x-a) + a²',
        explanation: 'Para elevar al cuadrado cualquier número de dos dígitos x, utilizamos la fórmula x² = (x+a)(x-a) + a² (o también escrita (x-a)(x+a) + a²). Donde x es el número que queremos elevar al cuadrado, y "a" es la diferencia entre x y el múltiplo de 10 más cercano a él. Esta misma fórmula se utiliza como base para elevar números de 3 y 4 dígitos.',
        exampleFormula: 'x² = (x + a)(x - a) + a²',
        breakdown: [
          { text: 'x²', highlight: true, note: 'Número a calcular', color: 'teal' },
          { text: '=', highlight: false },
          { text: '(x + a)', highlight: true, note: 'Subir "a"', color: 'amber' },
          { text: '×', highlight: false },
          { text: '(x - a)', highlight: true, note: 'Bajar "a" (redondo)', color: 'emerald' },
          { text: '+', highlight: false },
          { text: 'a²', highlight: true, note: 'Diferencia²', color: 'rose' }
        ],
        visualHint: 'a = distancia al múltiplo de 10 más cercano.'
      },
      {
        stepNumber: 2,
        title: 'Ejemplo 1: 23² (a = 3)',
        explanation: 'Queremos calcular 23² (x = 23). El múltiplo de 10 más cercano a 23 es 20, por lo que a = 23 - 20 = 3.\nAplicando la fórmula:\n23² = (23 + 3)(23 - 3) + 3² = 26 × 20 + 9.',
        exampleFormula: '23² = (23 + 3)(23 - 3) + 3² = 26 × 20 + 9',
        breakdown: [
          { text: '23 + 3 = 26', highlight: true, note: 'Primer factor', color: 'teal' },
          { text: '×', highlight: false },
          { text: '23 - 3 = 20', highlight: true, note: 'Múltiplo de 10', color: 'emerald' },
          { text: '+', highlight: false },
          { text: '3² = 9', highlight: true, note: 'a²', color: 'rose' }
        ],
        visualHint: '23² = 26 × 20 + 9'
      },
      {
        stepNumber: 3,
        title: 'Multiplica de izquierda a derecha y suma a²',
        explanation: 'Para resolver 26 × 20 aplicamos el método de izquierda a derecha:\n• 20 × 20 = 400\n• 6 × 20 = 120\nSumando: 400 + 120 = 520.\nFinalmente sumamos a² (9): 520 + 9 = 529. ¡23² = 529!',
        exampleFormula: '26 × 20 = 400 + 120 = 520 → 520 + 9 = 529',
        breakdown: [
          { text: '20 × 20 = 400', highlight: true, note: 'Decenas', color: 'teal' },
          { text: '+ 120 = 520', highlight: true, note: '6 × 20', color: 'amber' },
          { text: '+ 9', highlight: true, note: '3²', color: 'rose' },
          { text: '=', highlight: false },
          { text: '529', highlight: true, note: '¡Resultado final!', color: 'emerald' }
        ],
        visualHint: '400 + 120 = 520 → 520 + 9 = 529'
      },
      {
        stepNumber: 4,
        title: 'Ejemplo 2: 36² (a = 4, múltiplo superior)',
        explanation: 'Queremos calcular 36² (x = 36). ¿Quién es "a"? El múltiplo de 10 más cercano a 36 es 40, luego 40 - 36 = 4 (a = 4).\nAplicando la fórmula:\n36² = (36 + 4)(36 - 4) + 4² = 40 × 32 + 16.\nMultiplicamos 40 × 32 de izquierda a derecha: 40 × 30 + 40 × 2 = 1200 + 80 = 1280.\nSumamos 16: 1280 + 16 = 1296.',
        exampleFormula: '36² = (36 + 4)(36 - 4) + 4² = 40 × 32 + 16 = 1280 + 16 = 1296',
        breakdown: [
          { text: '40 × 32 = 1280', highlight: true, note: '(40×30) + (40×2)', color: 'teal' },
          { text: '+', highlight: false },
          { text: '4² = 16', highlight: true, note: 'a²', color: 'amber' },
          { text: '=', highlight: false },
          { text: '1296', highlight: true, note: '¡Resultado final!', color: 'rose' }
        ],
        visualHint: '1200 + 80 = 1280 → 1280 + 16 = 1296'
      },
      {
        stepNumber: 5,
        title: 'Más ejemplos: 12² y 46²',
        explanation: '• Si x = 12 (múltiplo cercano 10 → a = 2):\n12² = (12 + 2)(12 - 2) + 2² = (14 × 10) + 4 = 140 + 4 = 144.\n\n• Si x = 46 (múltiplo cercano 50 → a = 4):\n46² = (46 + 4)(46 - 4) + 4² = (50 × 42) + 16 = 2100 + 16 = 2116.',
        exampleFormula: '12² = 14 × 10 + 4 = 144  |  46² = 50 × 42 + 16 = 2116',
        breakdown: [
          { text: '12² = 14 × 10 + 4', highlight: true, color: 'teal', note: '144' },
          { text: '|', highlight: false },
          { text: '46² = 50 × 42 + 16', highlight: true, color: 'rose', note: '2100 + 16 = 2116' }
        ],
        visualHint: '14 × 10 + 4 = 144  |  50 × 42 + 16 = 2116'
      }
    ],
    drillPreset: {
      operations: ['SQUARE_2DIGIT'],
      timePerQuestion: 12,
      questionCount: 8
    }
  },
  {
    id: 'tech_potencia_3d',
    slug: 'potencia-3-digitos',
    title: 'Potencia (3 dígitos)',
    category: 'Potencias y Raíces',
    shortDesc: 'Aprende a elevar números de 3 dígitos al cuadrado con la fórmula x² = (x+a)(x-a) + a² redondeando a 100.',
    fullDesc: 'Aprende a elevar al cuadrado números de tres dígitos usando la misma fórmula que en 2 dígitos: x² = (x+a)(x-a) + a². Redondeamos al múltiplo de 100 más cercano, multiplicamos de izquierda a derecha y sumamos a².',
    difficulty: 'ADVANCED',
    badgeIcon: 'Flame',
    steps: [
      {
        stepNumber: 1,
        title: 'Elevando al cuadrado con múltiplos de 100',
        explanation: 'Usamos exactamente la misma fórmula aprendida en el curso de 2 dígitos: x² = (x+a)(x-a) + a².\nLa diferencia es que ahora x es un número de 3 dígitos, y "a" es la diferencia entre x y el múltiplo de 100 más cercano a él.\nPor ejemplo, para calcular 423²: el múltiplo de 100 más cercano a 423 es 400. Luego a = 423 - 400 = 23.\n423² = (423 + 23)(423 - 23) + 23² = 446 × 400 + 23².',
        exampleFormula: '423² = (423 + 23)(423 - 23) + 23² = 446 × 400 + 23²',
        breakdown: [
          { text: '423 + 23 = 446', highlight: true, note: 'x + a', color: 'teal' },
          { text: '×', highlight: false },
          { text: '423 - 23 = 400', highlight: true, note: 'Múltiplo de 100', color: 'emerald' },
          { text: '+', highlight: false },
          { text: '23²', highlight: true, note: 'a² (2 dígitos)', color: 'rose' }
        ],
        visualHint: '423² = 446 × 400 + 23²',
        referenceLinks: [
          { text: 'Curso: Potencia (2 dígitos)', url: '/academy/potencia-2-digitos' }
        ]
      },
      {
        stepNumber: 2,
        title: 'Multiplica 446 × 400 de izquierda a derecha',
        explanation: 'Para resolver 446 × 400 usamos el método de izquierda a derecha visto en el curso Productos:\n• 400 × 400 = 160.000\n• 40 × 400 = 16.000\n• 6 × 400 = 2.400\nSumando progresivamente: 160.000 + 16.000 + 2.400 = 178.400.',
        exampleFormula: '446 × 400 = 160.000 + 16.000 + 2.400 = 178.400',
        breakdown: [
          { text: '400 × 400 = 160.000', highlight: true, note: 'Centenas', color: 'teal' },
          { text: '+ 16.000', highlight: true, note: '40 × 400', color: 'amber' },
          { text: '+ 2.400 =', highlight: false },
          { text: '178.400', highlight: true, note: 'Subtotal en mente', color: 'emerald' }
        ],
        visualHint: '160.000 + 16.000 + 2.400 = 178.400',
        referenceLinks: [
          { text: 'Curso: Productos', url: '/academy/productos' }
        ]
      },
      {
        stepNumber: 3,
        title: 'Calcular y sumar 23² (a²)',
        explanation: 'Ahora calculamos 23² usando el método del curso Potencia (2 dígitos): 23² = (26 × 20) + 9 = 520 + 9 = 529.\nRetenemos el resultado 178.400 en mente y le sumamos 529:\n178.400 + 529 = 178.929.\n¡423² = 178.929!\nNota: Retener 178.400 para sumarlo luego requiere práctica, pero con ejercitación constante comenzarás a memorizar los cuadrados pequeños (a²).',
        exampleFormula: '178.400 + 23² = 178.400 + 529 = 178.929',
        breakdown: [
          { text: '178.400', highlight: true, note: 'Subtotal retenido', color: 'teal' },
          { text: '+', highlight: false },
          { text: '23² = 529', highlight: true, note: 'Potencia 2 dígitos', color: 'amber' },
          { text: '=', highlight: false },
          { text: '178.929', highlight: true, note: '¡Resultado final!', color: 'rose' }
        ],
        visualHint: '178.400 + 529 = 178.929',
        referenceLinks: [
          { text: 'Curso: Potencia (2 dígitos)', url: '/academy/potencia-2-digitos' }
        ]
      },
      {
        stepNumber: 4,
        title: 'Ejemplo 2: 574² (Redondeo hacia arriba: a = 26)',
        explanation: 'Si x = 574, el múltiplo de 100 más cercano es 600, luego a = 600 - 574 = 26.\nAplicando la fórmula:\n574² = (574 + 26)(574 - 26) + 26² = 600 × 548 + 26².\nResolvemos 600 × 548 de izquierda a derecha:\n• 600 × 500 = 300.000\n• 600 × 40 = 24.000\n• 600 × 8 = 4.800\nSuma: 300.000 + 24.000 + 4.800 = 328.800.\nCalculamos 26² = 676. Finalmente sumamos: 328.800 + 676 = 329.476.',
        exampleFormula: '574² = (600 × 548) + 26² = 328.800 + 676 = 329.476',
        breakdown: [
          { text: '600 × 548 = 328.800', highlight: true, note: '300k + 24k + 4.8k', color: 'teal' },
          { text: '+', highlight: false },
          { text: '26² = 676', highlight: true, note: 'a²', color: 'amber' },
          { text: '=', highlight: false },
          { text: '329.476', highlight: true, note: '¡Resultado final!', color: 'rose' }
        ],
        visualHint: '328.800 + 676 = 329.476'
      },
      {
        stepNumber: 5,
        title: 'Truco maestro para restar "a" al instante',
        explanation: '¿Cómo calcular 574 - 26 en un segundo sin restar mentalmente?\nPor cómo están construidos los números, dejamos la centena (el 5) y multiplicamos los dos últimos dígitos por 2 (74 × 2 = 148). Tomamos los dos últimos dígitos: 48 → ¡El resultado es 548!\n\nOtro ejemplo: si x = 582 (a = 18). Para resolver 582 - 18, dejamos el 5 y completamos con los dos últimos dígitos de hacer 82 × 2 = 164 → tomamos 64 → ¡564!\n¡Esto funciona SIEMPRE por la estructura decimal de los números!',
        exampleFormula: '574 - 26: Deja 5, y 74 × 2 = 148 → 548  |  582 - 18: Deja 5, y 82 × 2 = 164 → 564',
        breakdown: [
          { text: '574 - 26', highlight: false },
          { text: '→ Deja el 5', highlight: true, color: 'teal', note: 'Centena' },
          { text: '74 × 2 = 148', highlight: true, color: 'amber', note: 'Toma el 48' },
          { text: '→', highlight: false },
          { text: '548', highlight: true, color: 'emerald', note: '¡Al instante!' }
        ],
        visualHint: 'Deja la centena y duplica los dos últimos dígitos.'
      },
      {
        stepNumber: 6,
        title: 'Más ejemplos completos: 512² y 684²',
        explanation: '• Si x = 512 (a = 12):\n512² = (524 × 500) + 12² = 262.000 + 144 = 262.144.\n(Para 12², usamos la técnica de 2 dígitos: 14 × 10 + 4 = 144).\n\n• Si x = 684 (a = 16):\n684² = (700 × 668) + 16² = 467.600 + 256 = 467.856.\n(Para 16², usamos: 20 × 12 + 16 = 256).',
        exampleFormula: '512² = 262.000 + 144 = 262.144  |  684² = 467.600 + 256 = 467.856',
        breakdown: [
          { text: '512² = 262.000 + 144', highlight: true, color: 'teal', note: '262.144' },
          { text: '|', highlight: false },
          { text: '684² = 467.600 + 256', highlight: true, color: 'rose', note: '467.856' }
        ],
        visualHint: '512² = 262.144  |  684² = 467.856'
      }
    ],
    drillPreset: {
      operations: ['SQUARE_3DIGIT'],
      timePerQuestion: 15,
      questionCount: 6
    }
  },
  {
    id: 'tech_potencia_4d',
    slug: 'potencia-4-digitos',
    title: 'Potencia (4 dígitos)',
    category: 'Potencias y Raíces',
    shortDesc: 'Domina la potencia de 4 dígitos con la fórmula cuadrática y el Sistema Mayor para memorizar subtotales.',
    fullDesc: 'Para elevar números de 4 dígitos al cuadrado usamos la fórmula x² = (x+a)(x-a) + a² redondeando a 1000. Aprendemos la garantía de los millones y a utilizar el Sistema Mayor (mnemotecnia) para retener subtotales mientras calculamos a².',
    difficulty: 'MASTER',
    badgeIcon: 'Trophy',
    steps: [
      {
        stepNumber: 1,
        title: 'Elevando al cuadrado con múltiplos de 1000',
        explanation: 'Para números de 4 dígitos usamos la misma fórmula: x² = (x+a)(x-a) + a².\nAhora "a" es la diferencia entre el número x y el múltiplo de 1000 más cercano.\nPor ejemplo, para calcular 4423²: el múltiplo de 1000 más cercano a 4423 es 4000. Luego a = 4423 - 4000 = 423.\n4423² = (4423 + 423)(4423 - 423) + 423² = 4846 × 4000 + 423².',
        exampleFormula: '4423² = (4423 + 423)(4423 - 423) + 423² = 4846 × 4000 + 423²',
        breakdown: [
          { text: '4423 + 423 = 4846', highlight: true, note: 'x + a', color: 'teal' },
          { text: '×', highlight: false },
          { text: '4423 - 423 = 4000', highlight: true, note: 'Múltiplo de 1000', color: 'emerald' },
          { text: '+', highlight: false },
          { text: '423²', highlight: true, note: 'a² (3 dígitos)', color: 'rose' }
        ],
        visualHint: '4423² = 4846 × 4000 + 423²',
        referenceLinks: [
          { text: 'Curso: Potencia (3 dígitos)', url: '/academy/potencia-3-digitos' }
        ]
      },
      {
        stepNumber: 2,
        title: 'Multiplica 4846 × 4000 y la certeza de los millones',
        explanation: 'Comenzamos resolviendo:\n4846 × 4000 = (4846 × 4) × 1000 = 19.384.000.\n¡Ya sabemos con total seguridad que el resultado empieza con 19 millones!\n¿Por qué? Porque "a" nunca es mayor que 500, de modo que a² jamás superará 250.000 (500² = 250.000). Y como 384.000 + 250.000 nunca superará el millón, ¡tenemos la certeza matemática de que ninguna llevada alterará los 19 millones!',
        exampleFormula: '4846 × 4000 = 19.384.000 → 19 Millones garantizados',
        breakdown: [
          { text: '19 Millones', highlight: true, color: 'emerald', note: 'Fijo y seguro' },
          { text: '+', highlight: false },
          { text: '384.000', highlight: true, color: 'teal', note: 'Subtotal a memorizar' },
          { text: '+', highlight: false },
          { text: '423²', highlight: true, color: 'amber', note: 'a² < 250.000' }
        ],
        visualHint: '19 Millones no cambiarán porque a² jamás pasa de 250.000.'
      },
      {
        stepNumber: 3,
        title: 'Memorizar 384 con el Sistema Mayor (Mnemotecnia)',
        explanation: 'Para no olvidar el subtotal 384.000 mientras calculamos a², usamos el Sistema Mayor: un método que convierte números en consonantes para formar palabras e imágenes fáciles de recordar:\n• 3 = M, 8 = G, 4 = C/K → podemos codificar 384 como "Mago Oca" o "LaGo oCa" / "LóGiCa".\nVisualizar una historia vívida (o recordar ciertos dígitos con los dedos de la mano) mantiene el número intacto en tu mente sin sobrecargar la memoria de trabajo.',
        exampleFormula: '384.000 → Codificado como: "Mago Oca" (3=M, 8=G, 4=C)',
        breakdown: [
          { text: '384', highlight: true, color: 'amber', note: 'Dígitos de miles' },
          { text: '→', highlight: false },
          { text: 'M - G - C', highlight: true, color: 'teal', note: 'Consonantes' },
          { text: '→', highlight: false },
          { text: '"Mago Oca"', highlight: true, color: 'emerald', note: 'Palabra mnemotécnica' }
        ],
        visualHint: 'Convierte el número en una imagen mental para recordarlo sin esfuerzo.'
      },
      {
        stepNumber: 4,
        title: 'Calcula 423² y obtén el resultado final',
        explanation: 'Ahora calculamos 423² usando el método del curso Potencia (3 dígitos):\n423² = 178.929.\nRecuperamos nuestra palabra mnemotécnica ("Mago Oca" = 384.000) y le sumamos 178.929:\n384.000 + 178.929 = 562.929.\nFinalmente unimos los 19 millones del inicio:\n¡4423² = 19.562.929!\n(También puedes ayudarte recordando algunos dígitos con los dedos de la mano).',
        exampleFormula: '19.000.000 + 384.000 ("Mago Oca") + 178.929 = 19.562.929',
        breakdown: [
          { text: '19.000.000', highlight: true, color: 'teal', note: 'Millones seguros' },
          { text: '+ 384.000', highlight: true, color: 'amber', note: '"Mago Oca"' },
          { text: '+ 178.929', highlight: true, color: 'rose', note: '423² calculado' },
          { text: '=', highlight: false },
          { text: '19.562.929', highlight: true, color: 'emerald', note: '¡Resultado final!' }
        ],
        visualHint: '19.000.000 + 562.929 = 19.562.929',
        referenceLinks: [
          { text: 'Curso: Potencia (3 dígitos)', url: '/academy/potencia-3-digitos' }
        ]
      },
      {
        stepNumber: 5,
        title: 'Ejemplo 2: 6382² paso a paso',
        explanation: 'Veamos el ejemplo de 6382² (a = 382 hacia 6000):\n• 6382² = (6764 × 6000) + 382² = 40.584.000 + 382².\n• Millones fijos: 40 millones.\n• Codificamos 584 ("LaGo oCa" o "LóGiCa" porque 5=L, 8=G, 4=C).\n• Calculamos 382² con el método de 3 dígitos: (400 × 364) + 18² = 145.600 + 324 = 145.924.\n• Sumamos 584 ("LóGiCa") + 145 = 729 (con los 924 finales: 729.924).\n• Resultado final: ¡40.729.924!',
        exampleFormula: '6382² = 40.584.000 + 382² = 40.000.000 + 584.000 ("LóGiCa") + 145.924 = 40.729.924',
        breakdown: [
          { text: '40 Millones', highlight: true, color: 'teal', note: 'Fijo' },
          { text: '+ 584.000', highlight: true, color: 'amber', note: '"LóGiCa"' },
          { text: '+ 145.924 =', highlight: false },
          { text: '40.729.924', highlight: true, color: 'rose', note: '¡Resultado final!' }
        ],
        visualHint: '40.000.000 + 729.924 = 40.729.924'
      }
    ],
    drillPreset: {
      operations: ['SQUARE_4DIGIT'],
      timePerQuestion: 20,
      questionCount: 5
    }
  },
  {
    id: 'tech_sistema_mayor',
    slug: 'sistema-mayor',
    title: 'Sistema Mayor',
    category: 'Mnemotecnia y Memoria',
    shortDesc: 'Aprende a transformar números aburridos en imágenes visuales inolvidables asociando dígitos con consonantes.',
    fullDesc: 'El Sistema Mayor es la técnica mnemotécnica más poderosa del cálculo mental. Asocia cada dígito del 0 al 9 con consonantes fijas. Rellenando con vocales, convertimos cualquier número en palabras e historias visuales imposibles de olvidar.',
    difficulty: 'BEGINNER',
    badgeIcon: 'BrainCircuit',
    steps: [
      {
        stepNumber: 1,
        title: 'La tabla de conversión: Dígitos a consonantes',
        explanation: 'En el Sistema Mayor, asociamos cada dígito con un sonido de consonante según esta tabla fija:\n• 0 = R, RR (ej: aRo)\n• 1 = T, D (un solo trazo vertical hacia abajo)\n• 2 = N, Ñ (dos trazos verticales)\n• 3 = M (tres trazos verticales)\n• 4 = C, K, Q (suena "k")\n• 5 = L, LL (la mano con 5 dedos extendidos forma una L)\n• 6 = S, Z (y C suave)\n• 7 = F, J (un 7 invertido parece una F)\n• 8 = G, CH (Chico, Gato)\n• 9 = P, B, V (la P invertida parece un 9)\n\nRegla de oro: Las vocales (A, E, I, O, U) y la letra H NO TIENEN VALOR; se usan libremente para rellenar y formar palabras.',
        exampleFormula: '0=R | 1=T,D | 2=N,Ñ | 3=M | 4=C,K | 5=L | 6=S,Z | 7=F,J | 8=G,CH | 9=P,B,V',
        breakdown: [
          { text: '0=R', highlight: true, color: 'teal', note: 'aro' },
          { text: '1=T,D', highlight: true, color: 'amber', note: 'tía' },
          { text: '2=N,Ñ', highlight: true, color: 'emerald', note: 'uña' },
          { text: '3=M', highlight: true, color: 'rose', note: 'humo' },
          { text: '4=C,K', highlight: true, color: 'teal', note: 'oca' },
          { text: '5=L', highlight: true, color: 'amber', note: 'ola' },
          { text: '6=S,Z', highlight: true, color: 'emerald', note: 'oso' },
          { text: '7=F,J', highlight: true, color: 'rose', note: 'hoja' },
          { text: '8=G,CH', highlight: true, color: 'teal', note: 'hacha' },
          { text: '9=P,B', highlight: true, color: 'amber', note: 'boa' }
        ],
        visualHint: 'Las vocales y la H no tienen valor numérico.'
      },
      {
        stepNumber: 2,
        title: 'Formar palabras rellenando con vocales (Ej: LUPA = 59)',
        explanation: 'Tomamos las consonantes en orden y agregamos vocales en el medio para formar una palabra concreta:\n• Por ejemplo, "lupa" representa el número 59 porque "L" es 5, "P" es 9, y las vocales (U, A) no tienen valor numérico.\nSi necesitas recordar el número 59, imaginas una enorme lupa mágica y dorada brillando.',
        exampleFormula: 'L U P A → L(5) + U(voc) + P(9) + A(voc) = 59',
        breakdown: [
          { text: 'L', highlight: true, color: 'teal', note: 'Dígito 5' },
          { text: 'U', highlight: false, note: 'Vocal (0)' },
          { text: 'P', highlight: true, color: 'rose', note: 'Dígito 9' },
          { text: 'A', highlight: false, note: 'Vocal (0)' },
          { text: '=', highlight: false },
          { text: '59', highlight: true, color: 'emerald', note: 'Número codificado' }
        ],
        visualHint: 'L(5) + P(9) = 59 (las vocales no suman valor).'
      },
      {
        stepNumber: 3,
        title: 'Ejemplo 384: MaGo oCa y la imagen mental',
        explanation: 'Para recordar el número 384:\n• 3 → M\n• 8 → G (o CH)\n• 4 → C (o K)\nSeleccionando consonantes y completando con vocales, nos queda: "MaGo oCa" (M=3, G=8, C=4).\nAhora creas una imagen visual vívida: te imaginas a un mago en un escenario sacando una oca blanca de su sombrero de copa. ¡Esa imagen visual te remite al instante al número 384 sin riesgo de olvidarlo!',
        exampleFormula: '384 → M(3) G(8) C(4) → "MaGo oCa"',
        breakdown: [
          { text: '3 = M', highlight: true, color: 'teal', note: '3' },
          { text: '8 = G', highlight: true, color: 'amber', note: '8' },
          { text: '4 = C', highlight: true, color: 'rose', note: '4' },
          { text: '→', highlight: false },
          { text: '"MaGo oCa"', highlight: true, color: 'emerald', note: 'Imagen visual: 384' }
        ],
        visualHint: 'Mago (38) + Oca (4) = 384'
      },
      {
        stepNumber: 4,
        title: 'Tabla fija para el último dígito (0 al 9)',
        explanation: 'Para recordar números de tres cifras, conviene memorizar esta tabla fija de palabras cortas para el último dígito:\n0. ARO (R=0)\n1. TÍA (T=1)\n2. UÑA (Ñ=2)\n3. HUMO (M=3)\n4. OCA (C=4)\n5. OLA (L=5)\n6. OSO (S=6)\n7. HOJA (J=7)\n8. HACHA (CH=8)\n9. BOA (B=9)',
        exampleFormula: '0=ARO | 1=TÍA | 2=UÑA | 3=HUMO | 4=OCA | 5=OLA | 6=OSO | 7=HOJA | 8=HACHA | 9=BOA',
        breakdown: [
          { text: '0: ARO', highlight: true, color: 'teal', note: 'R=0' },
          { text: '1: TÍA', highlight: true, color: 'amber', note: 'T=1' },
          { text: '2: UÑA', highlight: true, color: 'emerald', note: 'Ñ=2' },
          { text: '3: HUMO', highlight: true, color: 'rose', note: 'M=3' },
          { text: '4: OCA', highlight: true, color: 'teal', note: 'C=4' },
          { text: '5: OLA', highlight: true, color: 'amber', note: 'L=5' },
          { text: '6: OSO', highlight: true, color: 'emerald', note: 'S=6' },
          { text: '7: HOJA', highlight: true, color: 'rose', note: 'J=7' },
          { text: '8: HACHA', highlight: true, color: 'teal', note: 'CH=8' },
          { text: '9: BOA', highlight: true, color: 'amber', note: 'B=9' }
        ],
        visualHint: 'Memorizar estas 10 palabras te da el último dígito siempre resuelto.'
      },
      {
        stepNumber: 5,
        title: 'Ejemplo 723: FiNo HUMO',
        explanation: 'Para recordar el número 723:\n• Los dos primeros dígitos son 7 y 2: 7=F, 2=N → formamos la palabra "FiNo" (F=7, N=2).\n• Para el último dígito (3): usamos la palabra fija de la tabla anterior → "HUMO" (M=3).\nNos queda: "FiNo HUMO".\nImagen visual: imaginas un hilo de fino humo aromático saliendo de una taza mágica. ¡Un dato numérico aburrido transformado en una escena que jamás se olvida!',
        exampleFormula: '723 → 7(F) + 2(N) + 3(HUMO) → "FiNo HUMO"',
        breakdown: [
          { text: '7 = F', highlight: true, color: 'teal', note: 'F' },
          { text: '2 = N', highlight: true, color: 'amber', note: 'N' },
          { text: '→ "FiNo" (72)', highlight: true, color: 'emerald', note: '1ra palabra' },
          { text: '+', highlight: false },
          { text: '"HUMO" (3)', highlight: true, color: 'rose', note: 'Palabra fija' },
          { text: '=', highlight: false },
          { text: '723', highlight: true, color: 'teal', note: 'Resultado' }
        ],
        visualHint: 'FiNo (72) + HUMO (3) = 723'
      }
    ],
    drillPreset: {
      operations: ['MAJOR_SYSTEM'],
      timePerQuestion: 10,
      questionCount: 8
    }
  },
  {
    id: 'tech_comparar_fracciones',
    slug: 'comparar-fracciones',
    title: 'Comparar Fracciones',
    category: 'Fracciones y Razones',
    shortDesc: 'Domina la comparación de fracciones usando productos cruzados, puntos de referencia y registros gráfico y decimal.',
    fullDesc: 'Aprende a comparar cualquier par de fracciones sin necesidad de hacer tediosos cálculos de mínimo común múltiplo. Descubre las estrategias más ágiles: comparación visual gráfica, puntos de anclaje (1/2 y 1), productos cruzados en aspa y pasaje rápido a decimal.',
    difficulty: 'BEGINNER',
    badgeIcon: 'Scale',
    steps: [
      {
        stepNumber: 1,
        title: 'Registros de Representación (Fracción, Decimal y Gráfico)',
        explanation: 'Una misma cantidad puede expresarse en tres registros complementarios:\n1. Registro fraccionario: 3/4 (3 partes tomadas de 4).\n2. Registro decimal: 0.75 (el cociente de 3 entre 4).\n3. Registro gráfico: una barra o círculo con 3 partes pintadas de 4: [■■■□].\nSaber saltar de un registro a otro te permite comparar fracciones casi sin calcular.',
        exampleFormula: '3/4 = 0.75 = [■■■□]  frente a  1/2 = 0.50 = [■■□□]',
        breakdown: [
          { text: '3/4', highlight: true, color: 'teal', note: 'Fraccionario' },
          { text: '=', highlight: false },
          { text: '0.75', highlight: true, color: 'amber', note: 'Decimal' },
          { text: '=', highlight: false },
          { text: '[■■■□]', highlight: true, color: 'emerald', note: 'Gráfico' },
          { text: '>', highlight: false },
          { text: '1/2 (0.50)', highlight: true, color: 'rose', note: 'Menor' }
        ],
        visualHint: 'Cambiar de registro matemático simplifica la comparación mental.'
      },
      {
        stepNumber: 2,
        title: 'Estrategia 1: Mismo numerador o mismo denominador',
        explanation: '• Si tienen igual denominador: por ejemplo 5/8 frente a 3/8. Como las porciones son del mismo tamaño (octavos), el que tenga más partes gana: 5/8 > 3/8.\n• Si tienen igual numerador: por ejemplo 3/4 frente a 3/7. Tenemos la misma cantidad de porciones (3), pero los cuartos son trozos mucho más grandes que los séptimos. Menos cortes = porciones más grandes: ¡3/4 > 3/7!',
        exampleFormula: 'Mismo numerador: 3/4 > 3/7  |  Mismo denominador: 5/8 > 3/8',
        breakdown: [
          { text: '3/4', highlight: true, color: 'emerald', note: 'Cuartos (trozos grandes)' },
          { text: '>', highlight: false },
          { text: '3/7', highlight: true, color: 'amber', note: 'Séptimos (trozos chicos)' }
        ],
        visualHint: 'Denominador menor = porciones más grandes.'
      },
      {
        stepNumber: 3,
        title: 'Estrategia 2: Puntos de referencia o anclaje (El truco del 1/2 y 1)',
        explanation: '¿Cuál es mayor entre 3/7 y 5/9? ¡No calcules mínimo común múltiplo!\nUsa 1/2 como punto de anclaje mental:\n• La mitad del denominador 7 es 3.5. Como 3 < 3.5, sabemos que 3/7 < 1/2.\n• La mitad del denominador 9 es 4.5. Como 5 > 4.5, sabemos que 5/9 > 1/2.\nConclusión instantánea sin cuentas: ¡5/9 > 3/7!',
        exampleFormula: '3/7 < 1/2 < 5/9  ⟹  5/9 es mayor',
        breakdown: [
          { text: '3/7', highlight: true, color: 'rose', note: '< 1/2 (3 < 3.5)' },
          { text: '<  1/2  <', highlight: false },
          { text: '5/9', highlight: true, color: 'emerald', note: '> 1/2 (5 > 4.5)' },
          { text: '⟹', highlight: false },
          { text: '5/9 > 3/7', highlight: true, color: 'teal', note: '¡Resuelto!' }
        ],
        visualHint: 'Compara contra la mitad del denominador: si uno está por debajo y otro por encima, ¡ya terminaste!'
      },
      {
        stepNumber: 4,
        title: 'Estrategia 3: Productos cruzados (La regla del aspa mental)',
        explanation: 'Para comparar cualquier par de fracciones a/b y c/d en segundos:\nMultiplica en cruz: a × d frente a b × c.\nEjemplo: 4/7 frente a 3/5.\n1. Multiplicamos el primer numerador por el segundo denominador: 4 × 5 = 20.\n2. Multiplicamos el segundo numerador por el primer denominador: 3 × 7 = 21.\nComo 20 < 21, deducimos inmediatamente que 4/7 < 3/5.',
        exampleFormula: '4/7 vs 3/5  ⟹  (4 × 5 = 20) < (7 × 3 = 21)  ⟹  4/7 < 3/5',
        breakdown: [
          { text: '4 × 5 = 20', highlight: true, color: 'amber', note: 'Lado izquierdo' },
          { text: '<', highlight: false },
          { text: '7 × 3 = 21', highlight: true, color: 'emerald', note: 'Lado derecho' },
          { text: '⟹', highlight: false },
          { text: '4/7 < 3/5', highlight: true, color: 'teal', note: '3/5 es mayor' }
        ],
        visualHint: 'Aspa mental: multiplica numerador izquierdo × denominador derecho vs al revés.'
      },
      {
        stepNumber: 5,
        title: 'Estrategia 4: Conversión decimal rápida',
        explanation: 'Tener grabadas las equivalencias decimales clave te da una ventaja colosal:\n• 1/2 = 0.50 | 1/4 = 0.25 | 3/4 = 0.75\n• 1/5 = 0.20 | 2/5 = 0.40 | 3/5 = 0.60 | 4/5 = 0.80\n• 1/3 ≈ 0.33 | 2/3 ≈ 0.67\nSi te piden comparar 2/5 frente a 0.45:\nComo 2/5 = 0.40, y 0.40 < 0.45, sabes que 0.45 es mayor en medio segundo.',
        exampleFormula: '2/5 = 0.40  vs  0.45  ⟹  0.45 > 2/5',
        breakdown: [
          { text: '2/5', highlight: true, color: 'amber', note: 'Pasa a 0.40' },
          { text: '<', highlight: false },
          { text: '0.45', highlight: true, color: 'emerald', note: 'Mayor' }
        ],
        visualHint: 'Memoriza los cuartos, tercios y quintos en decimal para comparar al vuelo.'
      }
    ],
    drillPreset: {
      operations: ['FRACTION_COMPARE'],
      timePerQuestion: 12,
      questionCount: 8
    }
  },
  {
    id: 'tech_sumar_restar_fracciones',
    slug: 'sumar-restar-fracciones',
    title: 'Sumar y Restar Fracciones',
    category: 'Fracciones y Razones',
    shortDesc: 'Aprende el método mariposa y cálculo mental rápido para sumar y restar fracciones sin frustración.',
    fullDesc: 'Domina la suma y resta de fracciones tanto con igual como con distinto denominador. Aprende la técnica mental de aspa (método mariposa), conversión rápida de enteros y simplificación estratégica.',
    difficulty: 'INTERMEDIATE',
    badgeIcon: 'Divide',
    steps: [
      {
        stepNumber: 1,
        title: 'Mismo denominador: La regla de oro',
        explanation: 'Cuando dos fracciones comparten denominador, las porciones son del mismo tamaño: solo sumas o restas los numeradores.\n¡NUNCA sumes los denominadores!\nEjemplo: 2/7 + 3/7 = (2 + 3)/7 = 5/7.\nSi tienes 2 porciones de una pizza cortada en 7 y te dan 3 porciones más, tienes 5 porciones de pizza cortadas en 7, no en 14.',
        exampleFormula: '2/7 + 3/7 = (2 + 3) / 7 = 5/7',
        breakdown: [
          { text: '2/7', highlight: true, color: 'teal', note: '2 partes' },
          { text: '+', highlight: false },
          { text: '3/7', highlight: true, color: 'amber', note: '3 partes' },
          { text: '=', highlight: false },
          { text: '5/7', highlight: true, color: 'emerald', note: 'Denominador intacto' }
        ],
        visualHint: 'El denominador solo indica el tamaño de la rebanada; no se suma.'
      },
      {
        stepNumber: 2,
        title: 'Denominadores múltiplos: Amplificación mental',
        explanation: 'Si un denominador es múltiplo del otro, solo modificas una fracción:\nEjemplo: 1/2 + 3/8.\nComo 8 = 2 × 4, multiplicamos arriba y abajo en 1/2 por 4: 1/2 = 4/8.\nAhora que tienen el mismo denominador, sumamos directo: 4/8 + 3/8 = 7/8.',
        exampleFormula: '1/2 + 3/8 = 4/8 + 3/8 = 7/8',
        breakdown: [
          { text: '1/2 (×4)', highlight: true, color: 'amber', note: 'Se convierte en 4/8' },
          { text: '+ 3/8 =', highlight: false },
          { text: '7/8', highlight: true, color: 'emerald', note: 'Subtotal directo' }
        ],
        visualHint: 'Lleva el denominador chico al grande multiplicando por el factor correspondiente.'
      },
      {
        stepNumber: 3,
        title: 'El Método Mariposa (Aspa mental para cualquier par)',
        explanation: 'Para sumar o restar a/b ± c/d con denominadores distintos:\nFórmula rápida:\n(a × d ± b × c) / (b × d)\nEjemplo: 2/3 + 1/4.\n1. Ala izquierda: 2 × 4 = 8.\n2. Ala derecha: 3 × 1 = 3.\n3. Numerador: 8 + 3 = 11.\n4. Abajo (cuerpo de la mariposa): 3 × 4 = 12.\n¡Resultado: 11/12!',
        exampleFormula: '2/3 + 1/4 = (2×4 + 3×1) / (3×4) = (8 + 3) / 12 = 11/12',
        breakdown: [
          { text: '2×4 = 8', highlight: true, color: 'teal', note: 'Ala 1' },
          { text: '+', highlight: false },
          { text: '3×1 = 3', highlight: true, color: 'amber', note: 'Ala 2' },
          { text: 'sobre 12 =', highlight: false },
          { text: '11/12', highlight: true, color: 'rose', note: 'Resultado final' }
        ],
        visualHint: 'Multiplica en aspa para el numerador y multiplica las bases para el denominador.'
      },
      {
        stepNumber: 4,
        title: 'Resta de fracciones y el truco de restar a enteros',
        explanation: 'La resta usa el mismo método de aspa: 3/4 - 1/3 = (3×3 - 4×1) / (4×3) = (9 - 4) / 12 = 5/12.\n¿Y para restar a un entero, como 1 - 3/7?\nImagina al 1 como 7/7: 7/7 - 3/7 = (7 - 3)/7 = 4/7.\nRegla ninja: ¡simplemente resta el numerador del denominador (7 - 3 = 4)!',
        exampleFormula: '1 - 3/7 = 7/7 - 3/7 = 4/7  |  3/4 - 1/3 = (9 - 4)/12 = 5/12',
        breakdown: [
          { text: '1 entero = 7/7', highlight: true, color: 'amber', note: 'Conversión mental' },
          { text: '- 3/7 =', highlight: false },
          { text: '4/7', highlight: true, color: 'emerald', note: '¡Inmediato!' }
        ],
        visualHint: 'Para 1 - a/b, el resultado siempre es (b - a)/b.'
      },
      {
        stepNumber: 5,
        title: 'Simplificación inteligente',
        explanation: 'Si el resultado no está en su mínima expresión, busca factores comunes:\n• Si obtuviste 6/8, divide numerador y denominador por 2: 3/4.\n• Si obtuviste 10/15, divide ambos por 5: 2/3.\n• Si el numerador es mayor que el denominador (fracción impropia): 7/4 = 1 entero y 3/4.',
        exampleFormula: '6/8 = 3/4  |  10/15 = 2/3  |  7/4 = 1 3/4',
        breakdown: [
          { text: '6/8', highlight: true, color: 'amber', note: '÷ 2 arriba y abajo' },
          { text: '⟹', highlight: false },
          { text: '3/4', highlight: true, color: 'emerald', note: 'Forma irreductible' }
        ],
        visualHint: 'Siempre verifica si ambos números son pares o múltiplos de 3 o 5.'
      }
    ],
    drillPreset: {
      operations: ['FRACTION_OPS'],
      timePerQuestion: 14,
      questionCount: 8
    }
  },
  {
    id: 'tech_ofertas_supermercado',
    slug: 'ofertas-supermercado',
    title: 'Elegir la Mejor Oferta',
    category: 'Matemática Práctica y Finanzas',
    shortDesc: 'Descubre cuál promo conviene más: 3x2, 2x1 o 70% en la 2da unidad. ¡Aprende a calcular el descuento real!',
    fullDesc: 'Aprende a decodificar las promociones de supermercado en segundos. Descubre por qué "70% en la 2da unidad" NO es un 70% de descuento (sino 35%), cuándo conviene un 3x2 frente a un porcentaje directo, y cómo calcular el costo unitario mentalmente.',
    difficulty: 'BEGINNER',
    badgeIcon: 'Tag',
    steps: [
      {
        stepNumber: 1,
        title: 'La fórmula del descuento real en promos N × M',
        explanation: 'En el supermercado vemos carteles como "3×2 en lácteos" o "4×3 en lavavajillas".\nPara calcular el porcentaje de descuento real de cualquier promo donde llevas N y pagas M:\nDescuento = (N - M) / N = 1 - (M / N)\n• En un 2×1: Llevas 2, pagas 1 ⟹ (2 - 1)/2 = 1/2 = 50% de descuento.\n• En un 3×2: Llevas 3, pagas 2 ⟹ (3 - 2)/3 = 1/3 ≈ 33.3% de descuento.\n• En un 4×3: Llevas 4, pagas 3 ⟹ (4 - 3)/4 = 1/4 = 25% de descuento.',
        exampleFormula: 'Descuento N×M = (N - M) / N  ⟹  3×2 = 1/3 (33.3%)  |  4×3 = 1/4 (25%)',
        breakdown: [
          { text: '2×1', highlight: true, color: 'emerald', note: '50% ahorro' },
          { text: '>', highlight: false },
          { text: '3×2', highlight: true, color: 'teal', note: '33.3% ahorro' },
          { text: '>', highlight: false },
          { text: '4×3', highlight: true, color: 'amber', note: '25% ahorro' }
        ],
        visualHint: 'El descuento es el producto que te regalan dividido el total que te llevas.'
      },
      {
        stepNumber: 2,
        title: 'La trampa de "X% en la 2da unidad"',
        explanation: 'Muchas publicidades anuncian "¡70% de descuento en la 2da unidad!" y la gente cree que ahorra el 70%.\n¡Gran error! Calculemos el costo real:\nLlevas 2 productos:\n• Por el 1ro pagas el 100% (1.00).\n• Por el 2do pagas el 30% (0.30, porque tiene 70% de descuento).\nEn total pagas: 1.00 + 0.30 = 1.30 por los 2 productos.\nCosto promedio por unidad: 1.30 / 2 = 0.65 ⟹ ¡El ahorro real es del 35%!\nRegla mental ninja: El descuento real de la promo en la segunda unidad es simplemente la mitad del porcentaje anunciado.',
        exampleFormula: '70% en 2da unidad  ⟹  Ahorro real = 70% ÷ 2 = 35% de descuento global',
        breakdown: [
          { text: '1.00 (1ro)', highlight: false },
          { text: '+ 0.30 (2do) =', highlight: false },
          { text: '1.30 total', highlight: true, color: 'amber', note: 'Por 2 unidades' },
          { text: '÷ 2 =', highlight: false },
          { text: '0.65', highlight: true, color: 'teal', note: 'Costo unitario' },
          { text: '⟹', highlight: false },
          { text: '35% Ahorro real', highlight: true, color: 'rose', note: '¡La mitad de 70%!' }
        ],
        visualHint: 'Para cualquier "X% en la segunda unidad", divide ese porcentaje entre 2 para saber tu descuento real.'
      },
      {
        stepNumber: 3,
        title: 'Duelo 1: El Centauro (2×1) vs El Dorado (70% en 2da unidad)',
        explanation: 'Analicemos el caso real de los anuncios en chocolates:\n• El Centauro ofrece: "PROMO 2×1 en chocolates".\nDescuento real: 50%.\n• El Dorado ofrece: "Llevando 2 chocolates iguales, 70% de descuento en la 2da unidad".\nDescuento real: 70% ÷ 2 = 35%.\n¿Cuál conviene más?\n¡El Centauro (2×1) es inmensamente más conveniente! Con 2×1 ahorras 50%, mientras que en El Dorado pagas 15% más por chocolate.',
        exampleFormula: 'El Centauro: 2×1 = 50% desc.  vs  El Dorado: 70% en 2da = 35% desc.  ⟹  ¡Gana El Centauro!',
        breakdown: [
          { text: 'El Centauro (2×1)', highlight: true, color: 'emerald', note: '50% de descuento' },
          { text: 'VS', highlight: false },
          { text: 'El Dorado (70% 2da)', highlight: true, color: 'rose', note: '35% de descuento' },
          { text: '⟹', highlight: false },
          { text: '¡Conviene El Centauro!', highlight: true, color: 'teal', note: 'Ahorras 15% más' }
        ],
        visualHint: 'Un 2×1 (50%) siempre supera a cualquier descuento en la segunda unidad menor al 100%.'
      },
      {
        stepNumber: 4,
        title: 'Duelo 2: ¿3×2 o 75% directo?',
        explanation: 'Comparamos ahora una promo por volumen vs descuento directo:\n• Opción A: 3×2 en lácteos.\nLlevas 3, pagas 2 ⟹ Ahorro = 1/3 ≈ 33.3%.\n• Opción B: 75% de descuento directo.\nPagas solo el 25% del precio ⟹ Ahorro = 75%.\nEl 75% directo te ahorra más del doble que un 3×2. ¡La opción B gana por paliza!\n¿Y si el duelo fuera 3×2 (33.3%) vs 70% en la 2da unidad (35%)?\n¡Ahí el 70% en la 2da unidad (35%) gana por poco a un 3×2 (33.3%)!',
        exampleFormula: '3×2 = 33.3%  vs  75% directo  ⟹  ¡Conviene 75% directo por amplia diferencia!',
        breakdown: [
          { text: '3×2 = 33.3%', highlight: true, color: 'amber', note: 'Pagas 2 de 3' },
          { text: 'VS', highlight: false },
          { text: '75% directo', highlight: true, color: 'emerald', note: 'Pagas 0.25' },
          { text: '⟹', highlight: false },
          { text: 'Gana 75% directo', highlight: true, color: 'teal', note: 'Ahorro masivo' }
        ],
        visualHint: 'Calcula siempre el porcentaje efectivo unitario para comparar ofertas heterogéneas.'
      },
      {
        stepNumber: 5,
        title: 'Ranking Maestro de Ofertas de Supermercado',
        explanation: 'Memoriza este ranking de descuentos reales para no dudar nunca en la góndola:\n1. 75% directo ⟹ 75% de ahorro\n2. 2×1 ⟹ 50% de ahorro\n3. 80% en la 2da unidad ⟹ 40% de ahorro\n4. 70% en la 2da unidad ⟹ 35% de ahorro\n5. 3×2 ⟹ 33.3% de ahorro\n6. 4×3 ⟹ 25% de ahorro\n7. 50% en la 2da unidad ⟹ 25% de ahorro (¡igual que un 4×3!).',
        exampleFormula: '75% > 2×1 (50%) > 80% 2da (40%) > 70% 2da (35%) > 3×2 (33.3%) > 4×3 (25%)',
        breakdown: [
          { text: '2×1 = 50%', highlight: true, color: 'emerald', note: 'Top promo' },
          { text: '>', highlight: false },
          { text: '80% 2da = 40%', highlight: true, color: 'teal', note: 'Excelente' },
          { text: '>', highlight: false },
          { text: '70% 2da = 35%', highlight: true, color: 'amber', note: 'Buena' },
          { text: '>', highlight: false },
          { text: '3×2 = 33.3%', highlight: true, color: 'rose', note: 'Clásica' }
        ],
        visualHint: 'Guarda esta jerarquía mental: ¡sé el comprador más inteligente del súper!'
      }
    ],
    drillPreset: {
      operations: ['SUPERMARKET_OFFERS'],
      timePerQuestion: 12,
      questionCount: 8
    }
  },
  {
    id: 'tech_mult_11',
    slug: 'multiplicacion-por-11',
    title: 'Multiplicación por 11',
    category: 'Multiplicación Rápida',
    shortDesc: 'Calcula cualquier número de 2 dígitos por 11 en menos de 2 segundos sin usar papel.',
    fullDesc: 'La regla del 11 es uno de los trucos de cálculo mental más conocidos. Consiste en abrir los dígitos extremos y colocar su suma en el centro.',
    difficulty: 'BEGINNER',
    badgeIcon: 'Sparkles',
    steps: [
      {
        stepNumber: 1,
        title: 'Separa los dígitos extremos',
        explanation: 'Imagina el número que vas a multiplicar (por ejemplo 35). Separa el 3 y el 5 dejando un espacio en medio.',
        exampleFormula: '35 × 11',
        breakdown: [
          { text: '3', highlight: true, note: 'Dígito izquierdo', color: 'emerald' },
          { text: '_', highlight: false, note: 'Espacio vacío' },
          { text: '5', highlight: true, note: 'Dígito derecho', color: 'emerald' }
        ],
        visualHint: '3 _ 5'
      },
      {
        stepNumber: 2,
        title: 'Suma ambos dígitos',
        explanation: 'Suma los dos dígitos del número original: 3 + 5 = 8.',
        exampleFormula: '3 + 5 = 8',
        breakdown: [
          { text: '3 + 5 =', highlight: false },
          { text: '8', highlight: true, note: 'Suma central', color: 'teal' }
        ],
        visualHint: 'Centro = 8'
      },
      {
        stepNumber: 3,
        title: 'Coloca el resultado en el medio',
        explanation: 'Inserta la suma (8) en el espacio que dejaste libre entre el 3 y el 5.',
        exampleFormula: '3 [8] 5 → 385',
        breakdown: [
          { text: '3', highlight: false },
          { text: '8', highlight: true, note: 'Resultado central', color: 'rose' },
          { text: '5', highlight: false }
        ],
        visualHint: 'Resultado: 385'
      },
      {
        stepNumber: 4,
        title: '¿Qué pasa si la suma pasa de 10? (Llevada)',
        explanation: 'Si multiplicas 78 × 11: 7 + 8 = 15. Dejas el 5 en el centro y sumas 1 al dígito izquierdo (7 + 1 = 8) → 858.',
        exampleFormula: '78 × 11 → (7+1) _ 5 _ 8 → 858',
        breakdown: [
          { text: '7+1 = 8', highlight: true, note: 'Decena + llevada', color: 'amber' },
          { text: '5', highlight: true, note: 'Unidad de la suma', color: 'teal' },
          { text: '8', highlight: true, note: 'Unidad original', color: 'emerald' }
        ],
        visualHint: '78 × 11 = 858'
      }
    ],
    drillPreset: {
      operations: ['MULTIPLICATION_11'],
      timePerQuestion: 8,
      questionCount: 8
    }
  },
  {
    id: 'tech_comp_100',
    slug: 'complementos-a-100',
    title: 'Complementos a 100',
    category: 'Restas Mentales',
    shortDesc: 'Resta a 100 al instante usando la regla rápida "Todos a 9, el último a 10".',
    fullDesc: 'Ideal para calcular cambios, porcentajes restantes y diferencias numéricas de forma instantánea sin acarrear mentalmente.',
    difficulty: 'BEGINNER',
    badgeIcon: 'Zap',
    steps: [
      {
        stepNumber: 1,
        title: 'La regla dorada',
        explanation: 'Para restar cualquier número de dos cifras a 100 (ej: 100 - 64), resta el primer dígito a 9 y el segundo dígito a 10.',
        exampleFormula: '100 - 64',
        breakdown: [
          { text: '9 - 6 = 3', highlight: true, note: 'Primer dígito a 9', color: 'teal' },
          { text: 'y', highlight: false },
          { text: '10 - 4 = 6', highlight: true, note: 'Último dígito a 10', color: 'emerald' }
        ],
        visualHint: 'Decenas a 9 | Unidades a 10'
      },
      {
        stepNumber: 2,
        title: 'Une ambos resultados',
        explanation: 'Junta los números obtenidos de izquierda a derecha: 3 y 6 forman 36.',
        exampleFormula: '3 y 6 → 36',
        breakdown: [
          { text: '3', highlight: true, note: '9 - 6', color: 'teal' },
          { text: '6', highlight: true, note: '10 - 4', color: 'emerald' }
        ],
        visualHint: '100 - 64 = 36'
      }
    ],
    drillPreset: {
      operations: ['COMPLEMENT_100'],
      timePerQuestion: 7,
      questionCount: 8
    }
  },
  {
    id: 'tech_square_5',
    slug: 'cuadrados-terminados-en-5',
    title: 'Cuadrados terminados en 5',
    category: 'Potencias y Raíces',
    shortDesc: 'Calcula 35², 65², 85² y más en un parpadeo con el truco del consecutivo.',
    fullDesc: 'Todo cuadrado de un número terminado en 5 siempre termina en 25, y la parte delantera es simplemente el primer dígito multiplicado por el número siguiente.',
    difficulty: 'INTERMEDIATE',
    badgeIcon: 'Flame',
    steps: [
      {
        stepNumber: 1,
        title: 'El final siempre es 25',
        explanation: 'Cualquier número terminado en 5 elevado al cuadrado (15², 25², 65²...) SIEMPRE finaliza con los dígitos 25.',
        exampleFormula: '65² = ____ 25',
        breakdown: [
          { text: 'Parte final: ', highlight: false },
          { text: '25', highlight: true, note: '5² = 25 fijo', color: 'emerald' }
        ],
        visualHint: '... 25'
      },
      {
        stepNumber: 2,
        title: 'Multiplica por su número siguiente',
        explanation: 'Toma la cifra de las decenas (el 6 en 65) y multiplícalo por el número que le sigue (6 × 7 = 42).',
        exampleFormula: '6 × (6 + 1) = 6 × 7 = 42',
        breakdown: [
          { text: '6 × 7 = ', highlight: false },
          { text: '42', highlight: true, note: 'Parte frontal', color: 'rose' }
        ],
        visualHint: '42'
      },
      {
        stepNumber: 3,
        title: 'Junta las dos partes',
        explanation: 'Pon el 42 delante del 25 para obtener 4225.',
        exampleFormula: '42 + 25 → 4225',
        breakdown: [
          { text: '42', highlight: true, note: '6 × 7', color: 'rose' },
          { text: '25', highlight: true, note: '5²', color: 'emerald' }
        ],
        visualHint: '65² = 4225'
      }
    ],
    drillPreset: {
      operations: ['SQUARE_5'],
      timePerQuestion: 8,
      questionCount: 8
    }
  },
  {
    id: 'tech_distributive',
    slug: 'propiedad-distributiva',
    title: 'Descomposición Distributiva',
    category: 'Multiplicación Rápida',
    shortDesc: 'Divide multiplicaciones difíciles en dos operaciones sencillas y súmalas.',
    fullDesc: 'Para calcular 18 × 6, sepáralo en (10 × 6) + (8 × 6) = 60 + 48 = 108. Este método funciona para cualquier multiplicación.',
    difficulty: 'INTERMEDIATE',
    badgeIcon: 'Layers',
    steps: [
      {
        stepNumber: 1,
        title: 'Descompón en decenas y unidades',
        explanation: 'Separa el número más grande en número redondo + sobrante. Por ejemplo, 18 es 10 + 8.',
        exampleFormula: '18 × 6 = (10 + 8) × 6',
        breakdown: [
          { text: '10', highlight: true, note: 'Decena', color: 'teal' },
          { text: ' + ', highlight: false },
          { text: '8', highlight: true, note: 'Unidad', color: 'emerald' }
        ],
        visualHint: '(10 + 8) × 6'
      },
      {
        stepNumber: 2,
        title: 'Multiplica por separado',
        explanation: 'Haz las dos multiplicaciones fáciles: 10 × 6 = 60, y 8 × 6 = 48.',
        exampleFormula: '60 + 48',
        breakdown: [
          { text: '60', highlight: true, note: '10 × 6', color: 'teal' },
          { text: ' + ', highlight: false },
          { text: '48', highlight: true, note: '8 × 6', color: 'emerald' }
        ],
        visualHint: '60 + 48'
      },
      {
        stepNumber: 3,
        title: 'Suma los dos bloques',
        explanation: 'Suma 60 + 48 = 108.',
        exampleFormula: '60 + 48 = 108',
        breakdown: [
          { text: '108', highlight: true, note: 'Resultado final', color: 'rose' }
        ],
        visualHint: '18 × 6 = 108'
      }
    ],
    drillPreset: {
      operations: ['DISTRIBUTIVE'],
      timePerQuestion: 10,
      questionCount: 8
    }
  },
  {
    id: 'tech_double_half',
    slug: 'doble-y-mitad',
    title: 'Técnica de Doble y Mitad',
    category: 'Estrategias de Factorización',
    shortDesc: 'Multiplica un factor por 2 y divide el otro entre 2 para simplificar la cuenta.',
    fullDesc: 'Cuando multiplicas por 5, 15, 25, 35 o 50, duplicar ese número lo convierte en una potencia de 10 o múltiplo limpio, haciendo la cuenta trivial.',
    difficulty: 'ADVANCED',
    badgeIcon: 'Divide',
    steps: [
      {
        stepNumber: 1,
        title: 'Identifica el número fácil de duplicar',
        explanation: 'En 25 × 16, el 25 al multiplicarse por 2 se vuelve 50 (o por 4 se vuelve 100), mientras que el 16 se puede partir a la mitad.',
        exampleFormula: '25 × 16',
        breakdown: [
          { text: '25 (duplica → 50)', highlight: true, color: 'teal' },
          { text: ' × ', highlight: false },
          { text: '16 (mitad → 8)', highlight: true, color: 'rose' }
        ],
        visualHint: 'Doble × Mitad'
      },
      {
        stepNumber: 2,
        title: 'Calcula la nueva multiplicación',
        explanation: 'La cuenta se transforma en 50 × 8 = 400. ¡O incluso vuelve a hacer doble y mitad: 100 × 4 = 400!',
        exampleFormula: '50 × 8 = 400',
        breakdown: [
          { text: '50 × 8 = ', highlight: false },
          { text: '400', highlight: true, note: 'Resultado idéntico', color: 'emerald' }
        ],
        visualHint: '25 × 16 = 400'
      }
    ],
    drillPreset: {
      operations: ['DOUBLE_HALF'],
      timePerQuestion: 10,
      questionCount: 8
    }
  }
];

export function getTechniqueBySlug(slug: string): AcademyTechniqueData | undefined {
  return ACADEMY_TECHNIQUES.find((t) => t.slug === slug);
}
