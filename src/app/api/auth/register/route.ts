import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { username, password, tableId } = await request.json();

    // Validazioni
    if (!username || !password || !tableId) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username deve essere di almeno 3 caratteri' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password deve essere di almeno 6 caratteri' },
        { status: 400 }
      );
    }

    // Verifica se l'username esiste già
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username già in uso' },
        { status: 409 }
      );
    }

    // Verifica se il tavolo esiste
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      return NextResponse.json(
        { error: 'Tavolo non valido' },
        { status: 400 }
      );
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crea l'utente
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        tableId,
      },
      include: {
        table: {
          select: {
            name: true,
          },
        },
      },
    });

    // Rimuovi la password dalla risposta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Utente registrato con successo',
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
