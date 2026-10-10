// Academy Mental Math Courses and Interactive Step-by-Step Breakdown Data

import { AcademyTechniqueData } from '@/types/game';

export const ACADEMY_TECHNIQUES: AcademyTechniqueData[] = [
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
