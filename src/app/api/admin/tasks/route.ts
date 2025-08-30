import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Lista tutti i task
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST - Crea un nuovo task
export async function POST(request: NextRequest) {
  try {
    const { title, description, score, isActive = true } = await request.json();

    if (!title || !description || score === undefined) {
      return NextResponse.json(
        { error: 'Title, description and score are required' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        score: parseInt(score),
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      task,
      message: 'Task creato con successo',
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// PUT - Aggiorna un task esistente
export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, score, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const updateData: { title?: string; description?: string; score?: number; isActive?: boolean } = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (score !== undefined) updateData.score = parseInt(score);
    if (isActive !== undefined) updateData.isActive = isActive;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      task,
      message: 'Task aggiornato con successo',
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE - Elimina un task
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Prima elimina tutte le submission associate
    await prisma.submission.deleteMany({
      where: { taskId: id },
    });

    // Poi elimina il task
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Task eliminato con successo',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
