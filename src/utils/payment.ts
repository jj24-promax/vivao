import { supabase } from "@/integrations/supabase/client";

/**
 * Chama a Edge Function pixup-proxy para realizar operações seguras com a API Pixup.
 */
export const callPixupAPI = async (action: string, body: any = {}) => {
  try {
    const { data, error } = await supabase.functions.invoke('pixup-proxy', {
      body: { action, body }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao chamar API Pixup:", error);
    throw error;
  }
};