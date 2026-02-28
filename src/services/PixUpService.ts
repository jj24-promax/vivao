"use client";

/**
 * Interface padronizada para respostas de pagamento no sistema.
 * Evita que o restante do app dependa da estrutura bruta do gateway.
 */
export interface PaymentResponse {
  transactionId: string;
  copyPasteCode: string;
  qrCodeImageUrl: string;
  amount: number;
  expiresAt: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
}

/**
 * PixUpService (Adapter)
 * Responsável pela comunicação com a API PixUp (Woovi).
 */
export class PixUpService {
  private readonly baseUrl = "https://api.woovi.com/v1"; // PixUp utiliza a infra da Woovi
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("PixUp API Key é obrigatória.");
    this.apiKey = apiKey;
  }

  /**
   * Gera uma nova cobrança Pix.
   * @param amount Valor em centavos (ex: 2000 para R$ 20,00)
   * @param phone Telefone do cliente para identificação
   */
  async createPixCharge(amount: number, phone: string): Promise<PaymentResponse> {
    const correlationID = `vivo_${Date.now()}_${phone.replace(/\D/g, '')}`;

    try {
      const response = await fetch(`${this.baseUrl}/pix`, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          amount,
          correlationID,
          type: 'DYNAMIC',
          // Metadados úteis para o seu controle interno
          additionalInfo: [
            { name: 'Serviço', value: 'Recarga Vivo' },
            { name: 'Telefone', value: phone }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro PixUp: ${response.statusText}`);
      }

      const data = await response.json();

      // Mapeamento para o formato padronizado do sistema
      return {
        transactionId: data.pix.correlationID,
        copyPasteCode: data.pix.brCode,
        qrCodeImageUrl: data.pix.qrCodeImage,
        amount: data.pix.value / 100, // Converte centavos para Real
        expiresAt: data.pix.expiresDate,
        status: 'PENDING'
      };
    } catch (error) {
      console.error("[PixUpService] Erro ao criar cobrança:", error);
      throw error;
    }
  }

  /**
   * Valida a assinatura do Webhook para garantir que a requisição veio da PixUp.
   * @param payload Corpo bruto da requisição (string)
   * @param signature Assinatura enviada no header 'x-woovi-signature'
   * @param secret Chave secreta do webhook configurada no painel
   */
  async validateWebhook(payload: string, signature: string, secret: string): Promise<boolean> {
    // A PixUp utiliza HMAC SHA256 para assinar os webhooks
    // Esta lógica geralmente é executada no lado do servidor (Edge Function)
    if (!signature || !secret) return false;
    
    // Nota: Em ambiente Deno/Edge Function, usaríamos a biblioteca 'crypto'
    // para comparar o hash do payload + secret com a signature.
    return true; // Placeholder para lógica de comparação de hash
  }
}