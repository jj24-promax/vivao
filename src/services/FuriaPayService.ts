"use client";

import { supabase } from "@/integrations/supabase/client";

/**
 * Interface padronizada para respostas de pagamento da aplicação.
 * Evita o acoplamento com o JSON bruto do gateway.
 */
export interface PaymentResponse {
  success: boolean;
  pixCode?: string;
  qrCodeBase64?: string;
  transactionId?: string;
  error?: string;
}

/**
 * GatewayPaymentService - Adapter para o Gateway Furia Pay.
 * Segue o padrão de isolamento e inversão de dependência.
 */
export class FuriaPayService {
  private static instance: FuriaPayService;

  private constructor() {}

  public static getInstance(): FuriaPayService {
    if (!FuriaPayService.instance) {
      FuriaPayService.instance = new FuriaPayService();
    }
    return FuriaPayService.instance;
  }

  /**
   * Gera uma cobrança Pix utilizando o gateway.
   * @param amount Valor da recarga (ex: 50.00)
   * @param phone Telefone do cliente
   */
  async generatePixCharge(amount: number, phone: string): Promise<PaymentResponse> {
    try {
      // Chamada para a Edge Function para manter a API KEY segura no servidor
      const { data, error } = await supabase.functions.invoke('furiapay-payment', {
        body: { 
          action: 'create_pix',
          amount, 
          phone,
          external_id: `recarga_${Date.now()}`
        },
      });

      if (error) throw error;

      // Adaptação da resposta do Gateway para o formato padrão da aplicação
      return {
        success: true,
        pixCode: data.pix_code || data.qrcode_text,
        qrCodeBase64: data.qrcode_base64,
        transactionId: data.id || data.txid
      };
    } catch (err: any) {
      console.error("[FuriaPayService] Erro ao gerar cobrança:", err);
      return {
        success: false,
        error: err.message || "Erro interno ao processar pagamento"
      };
    }
  }

  /**
   * Lógica de validação de assinatura do Webhook.
   * @param payload Corpo bruto da requisição (string)
   * @param signature Assinatura enviada no header (ex: x-furia-signature)
   * @param secret Chave secreta do webhook
   */
  async validateWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
    if (!signature || !secret) return false;
    
    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
      );

      const verified = await crypto.subtle.verify(
        "HMAC",
        key,
        this.hexToBuffer(signature),
        encoder.encode(payload)
      );

      return verified;
    } catch (e) {
      return false;
    }
  }

  private hexToBuffer(hex: string): ArrayBuffer {
    const matches = hex.match(/[\da-f]{2}/gi) || [];
    const view = new Uint8Array(matches.length);
    for (let i = 0; i < matches.length; i++) {
      view[i] = parseInt(matches[i], 16);
    }
    return view.buffer;
  }
}

export const paymentService = FuriaPayService.getInstance();