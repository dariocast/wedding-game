import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      include: {
        users: {
          include: {
            submissions: {
              include: {
                task: true,
              },
            },
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    });

    // Calcola il punteggio totale per ogni tavolo
    const leaderboard = tables.map((table) => {
      const totalScore = table.users.reduce((userScore, user) => {
        const userTaskScore = user.submissions.reduce((subScore, submission) => {
          return subScore + submission.task.score;
        }, 0);
        return userScore + userTaskScore;
      }, 0);

      return {
        id: table.id,
        name: table.name,
        score: totalScore,
        userCount: table.users.length,
      };
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
