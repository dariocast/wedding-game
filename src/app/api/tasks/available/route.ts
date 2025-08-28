import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Ottieni tutti i task attivi
    const allTasks = await prisma.task.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        score: 'desc',
      },
    });

    // Ottieni i task già completati dall'utente
    const completedSubmissions = await prisma.submission.findMany({
      where: {
        userId: userId,
      },
      select: {
        taskId: true,
      },
    });

    const completedTaskIds = new Set(completedSubmissions.map(s => s.taskId));

    // Filtra i task disponibili (non ancora completati)
    const availableTasks = allTasks.filter(task => !completedTaskIds.has(task.id));

    return NextResponse.json({
      availableTasks,
      completedCount: completedTaskIds.size,
      totalCount: allTasks.length,
    });
  } catch (error) {
    console.error('Error fetching available tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available tasks' },
      { status: 500 }
    );
  }
}
