import imageCompression from 'browser-image-compression';

// Configurazioni di compressione ottimizzate per 1GB storage
export const COMPRESSION_CONFIG = {
  image: {
    maxSizeMB: 0.5, // 500KB max per immagine
    maxWidthOrHeight: 1200, // Risoluzione massima
    useWebWorker: true,
    quality: 0.8, // 80% qualità (ottimo compromesso)
    fileType: 'image/jpeg' as const, // Forza JPEG per dimensioni minori
  },
  video: {
    maxSizeMB: 20, // Limite upload originale
    maxDurationSeconds: 30, // Durata massima
    targetSizeMB: 3, // Dimensione target dopo compressione
  },
  limits: {
    maxUploadSizeMB: 20, // Limite iniziale upload
    maxImageSizeMB: 0.5, // Limite finale immagini
    maxVideoSizeMB: 5, // Limite finale video
  }
};

export interface CompressionResult {
  success: boolean;
  file?: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  error?: string;
}

/**
 * Comprimi un'immagine mantenendo qualità accettabile
 */
export async function compressImage(file: File): Promise<CompressionResult> {
  const originalSize = file.size;
  
  try {
    // Verifica che sia un'immagine
    if (!file.type.startsWith('image/')) {
      throw new Error('File non è un\'immagine');
    }

    // Verifica dimensione iniziale
    if (originalSize > COMPRESSION_CONFIG.limits.maxUploadSizeMB * 1024 * 1024) {
      throw new Error(`File troppo grande. Massimo ${COMPRESSION_CONFIG.limits.maxUploadSizeMB}MB`);
    }

    console.log(`🖼️ Comprimendo immagine: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);

    const compressedFile = await imageCompression(file, COMPRESSION_CONFIG.image);
    const compressedSize = compressedFile.size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    console.log(`✅ Compressione completata: ${(compressedSize / 1024).toFixed(0)}KB (${compressionRatio.toFixed(1)}% riduzione)`);

    return {
      success: true,
      file: compressedFile,
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (error) {
    console.error('❌ Errore compressione immagine:', error);
    return {
      success: false,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0,
      error: error instanceof Error ? error.message : 'Errore sconosciuto',
    };
  }
}

/**
 * Valida e prepara un video per l'upload
 * Nota: La compressione video client-side è complessa, per ora solo validazione
 */
export async function validateVideo(file: File): Promise<CompressionResult> {
  const originalSize = file.size;
  
  try {
    // Verifica che sia un video
    if (!file.type.startsWith('video/')) {
      throw new Error('File non è un video');
    }

    // Verifica dimensione
    if (originalSize > COMPRESSION_CONFIG.limits.maxUploadSizeMB * 1024 * 1024) {
      throw new Error(`Video troppo grande. Massimo ${COMPRESSION_CONFIG.limits.maxUploadSizeMB}MB`);
    }

    // Verifica durata (approssimativa basata su dimensione)
    const estimatedDurationMB = originalSize / (1024 * 1024);
    if (estimatedDurationMB > COMPRESSION_CONFIG.video.targetSizeMB) {
      console.warn(`⚠️ Video potrebbe essere troppo lungo. Dimensione: ${estimatedDurationMB.toFixed(1)}MB`);
    }

    console.log(`🎥 Video validato: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);

    return {
      success: true,
      file,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0, // Nessuna compressione per ora
    };
  } catch (error) {
    console.error('❌ Errore validazione video:', error);
    return {
      success: false,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0,
      error: error instanceof Error ? error.message : 'Errore sconosciuto',
    };
  }
}

/**
 * Comprimi automaticamente un file basato sul tipo
 */
export async function compressFile(file: File): Promise<CompressionResult> {
  if (file.type.startsWith('image/')) {
    return await compressImage(file);
  } else if (file.type.startsWith('video/')) {
    return await validateVideo(file);
  } else {
    return {
      success: false,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 0,
      error: 'Tipo di file non supportato',
    };
  }
}

/**
 * Calcola lo spazio storage utilizzato e rimanente
 */
export function calculateStorageUsage(submissions: Array<{ fileUrl: string }>) {
  // Stima basata sui placeholder SVG vs file reali
  const realFiles = submissions.filter(s => 
    !s.fileUrl.startsWith('data:image/svg+xml') && 
    !s.fileUrl.includes('placeholder')
  );
  
  // Stima conservativa: 300KB per immagine, 2MB per video
  const estimatedUsageMB = realFiles.length * 0.3; // Assumendo principalmente immagini
  const totalStorageGB = 1;
  const usagePercentage = (estimatedUsageMB / (totalStorageGB * 1024)) * 100;
  
  return {
    estimatedUsageMB: Math.round(estimatedUsageMB),
    totalStorageGB,
    usagePercentage: Math.round(usagePercentage),
    remainingMB: Math.round((totalStorageGB * 1024) - estimatedUsageMB),
  };
}
