import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await params;

    // TODO: Verificare se l'utente è admin
    // Per ora permette l'eliminazione a tutti gli utenti autenticati

    // Elimina la submission
    await prisma.submission.delete({
      where: { id: submissionId },
    });

    return NextResponse.json({
      success: true,
      message: 'Submission eliminata con successo',
    });

  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione della submission' },
      { status: 500 }
    );
  }
}
