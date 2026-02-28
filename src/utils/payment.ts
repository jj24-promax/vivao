import { supabase } from "@/integrations/supabase/client";

/**
 * Chama a Edge Function pixup-proxy para realizar operações seguras com a API Pixup.
 */
export const callPixupAPI = async (action: string, body: any = {}) => {
  try {
    const { data, error } = await supabase.functions.invoke('pixup-proxy', {
      body: { action, body }
    });

    // Se houver erro na invocação (ex: 401, 500), o Supabase retorna no objeto error
    if (error) {
      console.error("Erro detalhado da Edge Function:", error);
      // Tenta extrair a mensagem de erro do corpo da resposta se disponível
      const errorMsg = error.message || "Erro desconhecido na Edge Function";
      throw new Error(errorMsg);
    }

    return data;
  } catch (error: any) {
    console.error("Erro ao chamar API Pixup:", error);
    throw error;
  }
};