import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { username, secret } = await request.json();

    // Semplice protezione con una password segreta
    if (secret !== 'wedding-admin-2024') {
      return NextResponse.json(
        { error: 'Secret non valido' },
        { status: 403 }
      );
    }

    if (!username) {
      return NextResponse.json(
        { error: 'Username richiesto' },
        { status: 400 }
      );
    }

    // Trova e aggiorna l'utente
    const user = await prisma.user.update({
      where: { username },
      data: { isAdmin: true },
      include: {
        table: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Utente ${username} è ora amministratore`,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        tableName: user.table.name,
      },
    });

  } catch (error) {
    console.error('Error making user admin:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento dell\'utente' },
      { status: 500 }
    );
  }
}
