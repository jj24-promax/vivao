-- 1. Criar a tabela de pagamentos
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id TEXT UNIQUE,
  external_id TEXT,
  amount DECIMAL,
  status TEXT DEFAULT 'PENDING',
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (Segurança por Linha)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de acesso (Permitindo operações básicas para o teste)
-- Nota: Em produção, estas políticas devem ser mais restritivas.
DROP POLICY IF EXISTS "Permitir leitura pública de pagamentos" ON public.payments;
CREATE POLICY "Permitir leitura pública de pagamentos" ON public.payments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção de pagamentos" ON public.payments;
CREATE POLICY "Permitir inserção de pagamentos" ON public.payments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização de pagamentos" ON public.payments;
CREATE POLICY "Permitir atualização de pagamentos" ON public.payments FOR UPDATE USING (true);