import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { bagSchema, type BagItem } from '@/lib/commerce/catalog';
import { toast } from 'sonner';
import { useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
type Store = { user: User | null; ready: boolean; items: BagItem[]; wishlist: number[]; add: (id: number) => void; quantity: (id: number, n: number) => void; toggle: (id: number) => void; clear: () => void; signOut: () => Promise<void> };
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false); const [items, setItems] = useState<BagItem[]>([]); const [wishlist, setWishlist] = useState<number[]>([]);
  const router = useRouter(); const queryClient = useQueryClient(); const owner = useRef<string | null>(null); const loaded = useRef(false); const queue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    async function hydrate(next: User | null) {
      loaded.current = false; owner.current = next?.id ?? null; setUser(next);
      let guest: BagItem[] = []; let saved: number[] = [];
      try { guest = bagSchema.parse(JSON.parse(localStorage.getItem('mv-bag') || '[]')); saved = JSON.parse(localStorage.getItem('mv-wishlist') || '[]').filter((n: unknown) => typeof n === 'number' && n >= 0 && n < 6); } catch { /* Ignore invalid old storage. */ }
      if (next) {
        const { data, error } = await supabase.from('shopping_bags').select('items,wishlist').eq('user_id', next.id).maybeSingle();
        if (!active || owner.current !== next.id) return;
        if (error) { toast.error('Could not load your bag. Please refresh.'); return; }
        const parsed = bagSchema.safeParse(data?.items); const previous = parsed.success ? parsed.data : [];
        const merged = [...previous]; guest.forEach(g => { const found = merged.find(i => i.productId === g.productId); if (found) found.quantity = Math.min(20, found.quantity + g.quantity); else merged.push(g); });
        const wishes = [...new Set([...(Array.isArray(data?.wishlist) ? data.wishlist.filter((n): n is number => typeof n === 'number') : []), ...saved])];
        await supabase.from('shopping_bags').upsert({ user_id: next.id, items: merged, wishlist: wishes });
        if (!active || owner.current !== next.id) return;
        localStorage.removeItem('mv-bag'); localStorage.removeItem('mv-wishlist'); setItems(merged); setWishlist(wishes);
      } else { setItems(guest); setWishlist(saved); }
      loaded.current = true; setReady(true);
    }
    supabase.auth.getUser().then(({ data }) => hydrate(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event)) return;
      if (event === 'USER_UPDATED') setUser(session?.user ?? null);
      else if (owner.current !== (session?.user.id ?? null)) setTimeout(() => { void hydrate(session?.user ?? null); }, 0);
      void router.invalidate(); if (event !== 'SIGNED_OUT') void queryClient.invalidateQueries();
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [router, queryClient]);
  useEffect(() => {
    if (!ready || !loaded.current) return;
    localStorage.setItem('mv-cart', String(items.reduce((n,i) => n+i.quantity,0)));
    if (user) { const id = user.id; queue.current = queue.current.then(async () => { if (owner.current !== id) return; const { error } = await supabase.from('shopping_bags').upsert({ user_id: id, items, wishlist }); if (error) toast.error('Your bag could not be saved.'); }); }
    else { localStorage.setItem('mv-bag', JSON.stringify(items)); localStorage.setItem('mv-wishlist', JSON.stringify(wishlist)); }
    const state = { type: 'mv-state', count: items.reduce((n,i)=>n+i.quantity,0), wishlist, signedIn: !!user };
    document.querySelectorAll('iframe').forEach(frame => frame.contentWindow?.postMessage(state, window.location.origin));
  }, [items, wishlist, user, ready]);
  function add(id: number) { if (id < 0 || id > 5 || !Number.isInteger(id)) return; setItems(old => { const found=old.find(i=>i.productId===id); return found ? old.map(i=>i.productId===id ? {...i,quantity:Math.min(20,i.quantity+1)} : i) : [...old,{productId:id,quantity:1}]; }); toast.success('Added to your bag'); }
  function toggle(id: number) { if (!Number.isInteger(id) || id<0 || id>5) return; setWishlist(old=>old.includes(id)?old.filter(n=>n!==id):[...old,id]); }
  useEffect(() => { function receive(e: MessageEvent) { if (e.origin!==window.location.origin || ![...document.querySelectorAll('iframe')].some(f=>f.contentWindow===e.source)) return; if(e.data?.type==='mv-add') add(e.data.id); if(e.data?.type==='mv-save') toggle(e.data.id); if(e.data?.type==='mv-ready') (e.source as Window)?.postMessage({ type:'mv-state',count:items.reduce((n,i)=>n+i.quantity,0),wishlist,signedIn:!!user },window.location.origin); } window.addEventListener('message',receive); return ()=>window.removeEventListener('message',receive); },[items,wishlist,user]);
  async function signOut() { await queryClient.cancelQueries(); queryClient.clear(); await queue.current; localStorage.removeItem('mv-bag'); localStorage.removeItem('mv-wishlist'); setItems([]); setWishlist([]); await supabase.auth.signOut(); await router.navigate({to:'/auth',replace:true}); }
  return <Context.Provider value={{user,ready,items,wishlist,add,toggle,quantity:(id,n)=>setItems(old=>n<=0?old.filter(i=>i.productId!==id):old.map(i=>i.productId===id?{...i,quantity:Math.min(20,n)}:i)),clear:()=>setItems([]),signOut}}>{children}</Context.Provider>;
}
export function useStore() { const value=useContext(Context); if(!value) throw new Error('Store provider missing'); return value; }
