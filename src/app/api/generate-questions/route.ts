import { NextRequest, NextResponse } from 'next/server';
import { generateQuestionSet, generateQuestion } from '@/lib/math-generator';
import { OperationType, GameDifficulty, QuestionData } from '@/types/game';

interface GenerateRequest {
  prompt?: string;
  count?: number;
  operations?: OperationType[];
  difficulty?: GameDifficulty;
  timeLimitSec?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const count = Math.min(Math.max(body.count || 10, 1), 50);
    const difficulty = body.difficulty || 'MEDIUM';
    const timeLimitSec = body.timeLimitSec || 10;

    // If a natural language prompt is supplied, parse intent
    let targetOperations: OperationType[] = body.operations || [];

    if (body.prompt && targetOperations.length === 0) {
      const p = body.prompt.toLowerCase();
      if (p.includes('11') || p.includes('once')) targetOperations.push('MULTIPLICATION_11');
      if (p.includes('100') || p.includes('cien') || p.includes('complemento')) targetOperations.push('COMPLEMENT_100');
      if (p.includes('5') || p.includes('cuadrado') || p.includes('potencia')) targetOperations.push('SQUARE_5');
      if (p.includes('distributiva') || p.includes('descomposicion')) targetOperations.push('DISTRIBUTIVE');
      if (p.includes('doble') || p.includes('mitad')) targetOperations.push('DOUBLE_HALF');
      if (p.includes('suma') || p.includes('adicion')) targetOperations.push('ADDITION');
      if (p.includes('resta') || p.includes('llevada') || p.includes('sustraccion')) targetOperations.push('SUBTRACTION');
      if (p.includes('multiplic') || p.includes('tablas')) targetOperations.push('MULTIPLICATION');
      if (p.includes('divis') || p.includes('cociente')) targetOperations.push('DIVISION');
    }

    if (targetOperations.length === 0) {
      targetOperations = ['MIXED'];
    }

    // Generate strict mathematically verified questions
    const questions: QuestionData[] = generateQuestionSet(
      count,
      targetOperations,
      difficulty,
      timeLimitSec
    );

    return NextResponse.json({
      success: true,
      count: questions.length,
      questions,
      metadata: {
        operations: targetOperations,
        difficulty,
        timeLimitSec,
        prompt: body.prompt || null
      }
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message || 'Error generating questions' },
      { status: 500 }
    );
  }
}
