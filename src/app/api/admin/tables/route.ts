import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Lista tutti i tavoli
export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      include: {
        users: {
          select: {
            id: true,
            username: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    });

    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tables' },
      { status: 500 }
    );
  }
}

// POST - Crea un nuovo tavolo
export async function POST(request: NextRequest) {
  try {
    const { name, score = 0 } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Table name is required' },
        { status: 400 }
      );
    }

    const table = await prisma.table.create({
      data: {
        name,
        score: parseInt(score),
      },
    });

    return NextResponse.json({
      success: true,
      table,
      message: 'Tavolo creato con successo',
    });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json(
      { error: 'Failed to create table' },
      { status: 500 }
    );
  }
}

// PUT - Aggiorna un tavolo esistente
export async function PUT(request: NextRequest) {
  try {
    const { id, name, score } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Table ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (score !== undefined) updateData.score = parseInt(score);

    const table = await prisma.table.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      table,
      message: 'Tavolo aggiornato con successo',
    });
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json(
      { error: 'Failed to update table' },
      { status: 500 }
    );
  }
}

// DELETE - Elimina un tavolo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Table ID is required' },
        { status: 400 }
      );
    }

    // Verifica se ci sono utenti associati al tavolo
    const usersCount = await prisma.user.count({
      where: { tableId: id },
    });

    if (usersCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete table with associated users' },
        { status: 400 }
      );
    }

    await prisma.table.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Tavolo eliminato con successo',
    });
  } catch (error) {
    console.error('Error deleting table:', error);
    return NextResponse.json(
      { error: 'Failed to delete table' },
      { status: 500 }
    );
  }
}
