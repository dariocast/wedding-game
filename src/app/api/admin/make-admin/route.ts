import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { username, secret } = await request.json();

    // Semplice protezione con una password segreta
    if (secret !== 'game-admin-2025') {
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

    // Prima verifica se l'utente esiste
    const existingUser = await prisma.user.findUnique({
      where: { username },
      include: {
        table: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: `Utente '${username}' non trovato. Assicurati che l'utente sia registrato prima.` },
        { status: 404 }
      );
    }

    if (existingUser.isAdmin) {
      return NextResponse.json(
        { 
          success: true,
          message: `Utente ${username} è già amministratore`,
          user: {
            id: existingUser.id,
            username: existingUser.username,
            isAdmin: existingUser.isAdmin,
            tableName: existingUser.table.name,
          },
        }
      );
    }

    // Aggiorna l'utente per renderlo admin
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
      { 
        error: 'Errore durante l\'aggiornamento dell\'utente',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
