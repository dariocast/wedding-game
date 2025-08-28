import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

// Verifica se le variabili d'ambiente di Supabase sono configurate
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isSupabaseConfigured = supabaseUrl && supabaseKey;

const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;

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

    let fileUrl: string;
    let uploadMessage: string;

    if (!isSupabaseConfigured || !supabase) {
      // Supabase non configurato - usa un placeholder più descrittivo
      console.log('Supabase Storage not configured, using placeholder');
      fileUrl = `data:image/svg+xml;base64,${Buffer.from(`
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
          <rect width="400" height="300" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2" stroke-dasharray="10,5"/>
          <text x="200" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6c757d">
            ${fileType === 'image' ? '📷' : '🎥'}
          </text>
          <text x="200" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6c757d">
            Task Completato!
          </text>
          <text x="200" y="190" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#adb5bd">
            File caricato: ${file.name}
          </text>
        </svg>
      `).toString('base64')}`;
      uploadMessage = 'Task completato! (Storage non configurato)';
    } else {
      try {
        // Upload del file su Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('submissions')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          // Se l'upload fallisce, usa un placeholder informativo
          fileUrl = `data:image/svg+xml;base64,${Buffer.from(`
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
              <rect width="400" height="300" fill="#fff3cd" stroke="#ffeaa7" stroke-width="2"/>
              <text x="200" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#856404">
                ⚠️
              </text>
              <text x="200" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#856404">
                Upload Fallito
              </text>
              <text x="200" y="190" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#856404">
                Task completato comunque!
              </text>
            </svg>
          `).toString('base64')}`;
          uploadMessage = 'Task completato! (Upload fallito ma punti assegnati)';
        } else {
          // Ottieni l'URL pubblico del file
          const { data: urlData } = supabase.storage
            .from('submissions')
            .getPublicUrl(filePath);
          
          fileUrl = urlData.publicUrl;
          uploadMessage = 'Task completato con successo!';
        }
      } catch (error) {
        console.error('Supabase error:', error);
        // Fallback per errori di Supabase
        fileUrl = `data:image/svg+xml;base64,${Buffer.from(`
          <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
            <rect width="400" height="300" fill="#f8d7da" stroke="#f5c6cb" stroke-width="2"/>
            <text x="200" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#721c24">
              ❌
            </text>
            <text x="200" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#721c24">
              Errore Storage
            </text>
            <text x="200" y="190" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#721c24">
              Task completato comunque!
            </text>
          </svg>
        `).toString('base64')}`;
        uploadMessage = 'Task completato! (Errore storage ma punti assegnati)';
      }
    }

    // Salva la submission nel database
    const submission = await prisma.submission.create({
      data: {
        taskId,
        userId,
        fileUrl,
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
      message: uploadMessage,
      points: submission.task.score,
    });

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
