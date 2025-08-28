import { NextRequest, NextResponse } from 'next/server';

// TODO: Implementare un sistema di stato del gioco persistente
// Per ora simuliamo il controllo con una variabile in memoria
let gamePaused = false;

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    // TODO: Verificare se l'utente è admin
    // Per ora permette il controllo a tutti gli utenti autenticati

    if (action === 'pause') {
      gamePaused = true;
      return NextResponse.json({
        success: true,
        message: 'Gioco messo in pausa',
        gameState: 'paused',
      });
    } else if (action === 'resume') {
      gamePaused = false;
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
