import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const taskId = formData.get('taskId') as string;
    const userId = formData.get('userId') as string;
    const file = formData.get('file') as File;

    if (!taskId || !userId || !file) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verifica se l'utente ha già completato questo task
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        taskId,
        userId,
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'Hai già completato questo task!' },
        { status: 409 }
      );
    }

    // Determina il tipo di file
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    
    // Genera un nome file unico
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
    const filePath = `submissions/${taskId}/${fileName}`;

    try {
      // Upload del file su Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        // Se l'upload fallisce, salviamo comunque la submission con un URL mock
        const mockFileUrl = `https://via.placeholder.com/400x300?text=File+Upload+Failed`;
        
        const submission = await prisma.submission.create({
          data: {
            taskId,
            userId,
            fileUrl: mockFileUrl,
            fileType,
          },
          include: {
            task: true,
            user: {
              include: {
                table: true,
              },
            },
          },
        });

        // Aggiorna il punteggio del tavolo
        await prisma.table.update({
          where: { id: submission.user.tableId },
          data: {
            score: {
              increment: submission.task.score,
            },
          },
        });

        return NextResponse.json({
          success: true,
          submission: {
            id: submission.id,
            taskId: submission.taskId,
            userId: submission.userId,
            fileUrl: submission.fileUrl,
            fileType: submission.fileType,
            createdAt: submission.createdAt,
          },
          message: 'Task completato! (File upload fallito ma punti assegnati)',
          points: submission.task.score,
        });
      }

      // Ottieni l'URL pubblico del file
      const { data: urlData } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);

      // Salva la submission nel database
      const submission = await prisma.submission.create({
        data: {
          taskId,
          userId,
          fileUrl: urlData.publicUrl,
          fileType,
        },
        include: {
          task: true,
          user: {
            include: {
              table: true,
            },
          },
        },
      });

      // Aggiorna il punteggio del tavolo
      await prisma.table.update({
        where: { id: submission.user.tableId },
        data: {
          score: {
            increment: submission.task.score,
          },
        },
      });

      return NextResponse.json({
        success: true,
        submission: {
          id: submission.id,
          taskId: submission.taskId,
          userId: submission.userId,
          fileUrl: submission.fileUrl,
          fileType: submission.fileType,
          createdAt: submission.createdAt,
        },
        message: 'Task completato con successo!',
        points: submission.task.score,
      });

    } catch (uploadError) {
      console.error('Supabase error:', uploadError);
      
      // Fallback: salva senza file upload
      const mockFileUrl = `https://via.placeholder.com/400x300?text=Task+Completed`;
      
      const submission = await prisma.submission.create({
        data: {
          taskId,
          userId,
          fileUrl: mockFileUrl,
          fileType,
        },
        include: {
          task: true,
          user: {
            include: {
              table: true,
            },
          },
        },
      });

      // Aggiorna il punteggio del tavolo
      await prisma.table.update({
        where: { id: submission.user.tableId },
        data: {
          score: {
            increment: submission.task.score,
          },
        },
      });

      return NextResponse.json({
        success: true,
        submission: {
          id: submission.id,
          taskId: submission.taskId,
          userId: submission.userId,
          fileUrl: submission.fileUrl,
          fileType: submission.fileType,
          createdAt: submission.createdAt,
        },
        message: 'Task completato! (File salvato come placeholder)',
        points: submission.task.score,
      });
    }

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
