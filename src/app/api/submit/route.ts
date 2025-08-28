import { NextRequest, NextResponse } from 'next/server';

// TODO: Configurare Supabase quando le variabili d'ambiente saranno disponibili
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

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

    // Determina il tipo di file
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    
    // Genera un nome file unico
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
    const filePath = `submissions/${taskId}/${fileName}`;

    // TODO: Implementare upload su Supabase Storage quando configurato
    // Upload del file su Supabase Storage
    // const { data: uploadData, error: uploadError } = await supabase.storage
    //   .from('submissions')
    //   .upload(filePath, file);

    // if (uploadError) {
    //   console.error('Upload error:', uploadError);
    //   return NextResponse.json(
    //     { error: 'Failed to upload file' },
    //     { status: 500 }
    //   );
    // }

    // Ottieni l'URL pubblico del file
    // const { data: urlData } = supabase.storage
    //   .from('submissions')
    //   .getPublicUrl(filePath);

    // Per ora simuliamo un upload di successo
    const mockFileUrl = `https://example.com/mock-upload/${fileName}`;

    // TODO: Salvare la submission nel database usando Prisma
    // Per ora restituiamo solo l'URL del file caricato
    const submission = {
      id: `sub_${Date.now()}`,
      taskId,
      userId,
      fileUrl: mockFileUrl,
      fileType,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      submission,
      message: 'Task completato con successo!'
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
