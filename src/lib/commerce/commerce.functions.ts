import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { orderSchema } from './catalog';
export const placeOrder = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input: unknown) => orderSchema.parse(input)).handler(async ({ data, context }) => {
  const { data: id, error } = await context.supabase.rpc('place_cod_order', { p_request_id: data.requestId, p_items: data.items, p_address: data.address });
  if (error) throw new Error(error.message);
  return { id };
});
