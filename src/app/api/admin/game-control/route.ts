import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Creiamo una tabella per lo stato del gioco
async function getGameState() {
  // Usiamo una configurazione generica nel database
  const config = await prisma.$queryRaw<Array<{key: string, value: string}>>`
    SELECT key, value FROM game_config WHERE key = 'game_paused' LIMIT 1
  `.catch(async () => {
    // Se la tabella non esiste, la creiamo
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS game_config (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Inserisci il valore di default
    await prisma.$executeRaw`
      INSERT INTO game_config (key, value) VALUES ('game_paused', 'false')
      ON CONFLICT (key) DO NOTHING
    `;
    
    return [{ key: 'game_paused', value: 'false' }];
  });
  
  return config.length > 0 ? config[0].value === 'true' : false;
}

async function setGameState(paused: boolean) {
  await prisma.$executeRaw`
    INSERT INTO game_config (key, value, updated_at) VALUES ('game_paused', ${paused.toString()}, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO UPDATE SET value = ${paused.toString()}, updated_at = CURRENT_TIMESTAMP
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    // TODO: Verificare se l'utente è admin
    // Per ora permette il controllo a tutti gli utenti autenticati

    if (action === 'pause') {
      await setGameState(true);
      return NextResponse.json({
        success: true,
        message: 'Gioco messo in pausa',
        gameState: 'paused',
      });
    } else if (action === 'resume') {
      await setGameState(false);
      return NextResponse.json({
        success: true,
        message: 'Gioco riavviato',
        gameState: 'active',
      });
    } else {
      return NextResponse.json(
        { error: 'Azione non valida' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error controlling game:', error);
    return NextResponse.json(
      { error: 'Errore durante il controllo del gioco' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const gamePaused = await getGameState();
    return NextResponse.json({
      gameState: gamePaused ? 'paused' : 'active',
      message: gamePaused ? 'Gioco in pausa' : 'Gioco attivo',
    });
  } catch (error) {
    console.error('Error getting game state:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero dello stato del gioco' },
      { status: 500 }
    );
  }
}
