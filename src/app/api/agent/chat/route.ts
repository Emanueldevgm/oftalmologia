/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/agent/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

const AGENT_API_URL = process.env.AGENT_API_URL;
const AGENT_API_KEY = process.env.AGENT_API_KEY;
const REQUEST_TIMEOUT = 30000;

export async function POST(req: NextRequest) {
  try {
    if (!AGENT_API_URL) {
      console.error('AGENT_API_URL não definida no ambiente');
      return NextResponse.json(
        { error: 'Configuração do agente ausente' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mensagem inválida ou vazia' },
        { status: 400 }
      );
    }

    // ⚡ Correção: mapear para os nomes esperados pelo agente externo
    const payload = {
      mensagem: message.trim(),
      session_id: sessionId || 'anonymous',
    };

    console.log('📤 Enviando para agente:', {
      url: AGENT_API_URL,
      payload,
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (AGENT_API_KEY) {
      headers['Authorization'] = `Bearer ${AGENT_API_KEY}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    let response: Response;
    try {
      response = await fetch(AGENT_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Tempo limite excedido ao aguardar resposta do agente' },
          { status: 504 }
        );
      }
      throw fetchError;
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro do agente (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Erro ao processar requisição: ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/event-stream')) {
      return new NextResponse(response.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const data = await response.json();
    
    // 🔍 DEBUG: Log da resposta completa
    console.log('📨 Resposta completa do agente:', JSON.stringify(data, null, 2));
    
    // Extrai a resposta com suporte a múltiplos formatos
    let reply = '';
    if (typeof data === 'string') {
      reply = data;
    } else if (data.resposta) {
      reply = data.resposta;
    } else if (data.reply) {
      reply = data.reply;
    } else if (data.message) {
      reply = data.message;
    } else if (data.response) {
      reply = data.response;
    } else if (data.answer) {
      reply = data.answer;
    } else if (data.text) {
      reply = data.text;
    } else if (data.result) {
      reply = data.result;
    } else if (data.content) {
      reply = data.content;
    } else {
      // Se nada foi encontrado, tenta extrair o primeiro valor de string do objeto
      const firstValue = Object.values(data).find(v => typeof v === 'string');
      reply = firstValue || JSON.stringify(data);
    }

    if (!reply || typeof reply !== 'string' || reply.trim().length === 0) {
      console.warn('⚠️ Resposta vazia ou em formato inesperado:', data);
      reply = 'Desculpe, não consegui processar a resposta.';
    }

    console.log('✅ Resposta extraída:', reply);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('❌ Erro no proxy do agente:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { error: 'Erro interno ao processar a requisição' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};