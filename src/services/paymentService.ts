import { supabase } from "@/integrations/supabase/client";

export interface PixResponse {
  charge: {
    qrCodeStaticCode: string;
    qrCodeImage: string;
    paymentLinkUrl: string;
    identifier: string;
  }
}

export const generatePixCharge = async (amount: string, phoneNumber: string) => {
  const { data, error } = await supabase.functions.invoke('process-pix', {
    body: { 
      amount, 
      phoneNumber,
      description: `Recarga Vivo - R$ ${amount}`
    },
  });

  if (error) {
    console.error("Erro ao chamar Edge Function:", error);
    throw new Error(error.message || "Erro ao processar pagamento");
  }

  return data as PixResponse;
};