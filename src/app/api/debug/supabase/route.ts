import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Verifica se le variabili d'ambiente sono configurate
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const debug = {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
      keyPreview: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING',
    };

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Supabase environment variables not configured',
        debug,
      });
    }

    // Testa la connessione a Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test 1: Verifica connessione base
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to Supabase Storage',
        details: bucketsError.message,
        debug,
      });
    }

    // Test 2: Verifica se il bucket "submissions" esiste
    const submissionsBucket = buckets?.find(bucket => bucket.name === 'submissions');
    
    if (!submissionsBucket) {
      return NextResponse.json({
        success: false,
        error: 'Bucket "submissions" not found',
        availableBuckets: buckets?.map(b => b.name) || [],
        debug,
      });
    }

    // Test 3: Verifica permessi del bucket
    const { error: listError } = await supabase.storage
      .from('submissions')
      .list('', { limit: 1 });

    if (listError) {
      return NextResponse.json({
        success: false,
        error: 'Cannot access submissions bucket',
        details: listError.message,
        bucketInfo: submissionsBucket,
        debug,
      });
    }

    // Test 4: Prova a creare un file di test
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Test upload from Wedding Game';
    
    const { error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(`test/${testFileName}`, testContent, {
        contentType: 'text/plain',
      });

    if (uploadError) {
      return NextResponse.json({
        success: false,
        error: 'Cannot upload to submissions bucket',
        details: uploadError.message,
        bucketInfo: submissionsBucket,
        debug,
      });
    }

    // Test 5: Prova a eliminare il file di test
    await supabase.storage
      .from('submissions')
      .remove([`test/${testFileName}`]);

    return NextResponse.json({
      success: true,
      message: 'Supabase Storage is working correctly!',
      bucketInfo: submissionsBucket,
      totalBuckets: buckets?.length || 0,
      debug,
    });

  } catch (error) {
    console.error('Supabase debug error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error during Supabase test',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
