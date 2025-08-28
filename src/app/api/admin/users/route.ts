import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Semplice protezione con una password segreta
    if (secret !== 'game-admin-2025') {
      return NextResponse.json(
        { error: 'Secret non valido' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      include: {
        table: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        tableName: user.table.name,
        submissionsCount: user._count.submissions,
        createdAt: user.createdAt,
      })),
      total: users.length,
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        error: 'Errore durante il recupero degli utenti',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
