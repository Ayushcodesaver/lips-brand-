'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAction, useQuery } from 'convex/react';
import { useAuth, useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { AddressFields } from '@/components/address-form';
import { useStore } from '@/components/store-provider';
import { addressSchema, emptyAddress, money, totals, type Address } from '@/lib/catalog';

type Step = 'shipping' | 'payment';
type SavedAddress = { _id: string } & Address;

/* Cashfree drop-in loader */
declare global {
  interface Window {
    Cashfree?: new (mode?: string) => {
      checkout: (opts: { paymentSessionId: string; redirectTarget?: string }) => Promise<{ redirect?: boolean; error?: unknown }>;
    };
  }
}

function loadCashfreeSdk(): Promise<NonNullable<Window['Cashfree']>> {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) return resolve(window.Cashfree);
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => (window.Cashfree ? resolve(window.Cashfree) : reject(new Error('Cashfree SDK did not initialise')));
    script.onerror = () => reject(new Error('Could not load the payment SDK. Check your connection.'));
    document.head.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const { items } = useStore();
  const router = useRouter();

  const placeCodOrder = useAction(api.orders.placeCodOrder);
  const createCashfreeOrder = useAction(api.orders.createCashfreeOrder);
  const verifyOrder = useAction(api.orders.verifyAndPlaceOnlineOrder);
  const checkPayments = useAction(api.payments.enabled);

  const savedAddresses = useAddresses();
  const [step, setStep] = useState<Step>('shipping');
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [errors, setErrors] = useState<string[]>([]);
  const [method, setMethod] = useState<'online' | 'cod'>('online');
  const [onlineEnabled, setOnlineEnabled] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const modalOpen = useRef(false);

  useEffect(() => {
    void checkPayments({})
      .then((r) => setOnlineEnabled(r.onlineEnabled))
      .catch(() => setOnlineEnabled(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (onlineEnabled === false && method === 'online') setMethod('cod');
  }, [onlineEnabled, method]);

  const t = totals(items);

  const validateShipping = useCallback((): Address | null => {
    const parsed = addressSchema.safeParse(address);
    if (parsed.success) return parsed.data;
    setErrors(parsed.error.issues.map((i) => `${i.path.join('.') || 'Field'}: ${i.message}`));
    return null;
  }, [address]);

  const finish = useCallback(
    async (orderId: string) => {
      toast.success('Order placed');
      router.push(`/order/${orderId}`);
    },
    [router],
  );

  async function placeOrder() {
    if (busy || items.length === 0) return;
    if (!isSignedIn) {
      router.push('/auth');
      return;
    }
    const valid = validateShipping();
    if (!valid) {
      setStep('shipping');
      return;
    }
    if (method === 'online' && onlineEnabled === false) {
      toast.error('Online payments are not configured yet. Choose cash on delivery.');
      setMethod('cod');
      return;
    }

    setBusy(true);
    setErrors([]);
    const requestId = crypto.randomUUID();
    const payload = { requestId, items, address: valid };
    const email = clerkUser?.primaryEmailAddress?.emailAddress ?? 'guest@maisonvell.example';

    try {
      if (method === 'cod') {
        const orderId = await placeCodOrder(payload);
        await finish(orderId);
        return;
      }

      const created = await createCashfreeOrder({ ...payload, customerEmail: email });
      const Cashfree = await loadCashfreeSdk();
      const cashfree = new Cashfree('sandbox');
      modalOpen.current = true;
      const result = await cashfree.checkout({
        paymentSessionId: created.paymentSessionId,
        redirectTarget: '_modal',
      });
      modalOpen.current = false;

      if (result?.error) {
        toast.error('The payment window was closed or failed. No charge was made to a pending order.');
        return;
      }
      const orderId = await verifyOrder({ ...payload, customerEmail: email, gatewayOrderId: created.gatewayOrderId });
      await finish(orderId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      modalOpen.current = false;
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <StoreLayout>
        <div className="empty">
          <h2>Your bag is empty</h2>
          <p>Add a lacquer to your bag before checking out.</p>
          <Link className="btn" href="/shop">Shop the collection</Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <PageTitle eyebrow="Secure checkout" title="Checkout" />
      <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-24 md:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {/* Step 1 — shipping */}
          <section className="panel">
            <h2>1 · Shipping details</h2>
            {savedAddresses.length > 0 && (
              <div className="mb-4 flex flex-col gap-2">
                {savedAddresses.map((saved: SavedAddress) => (
                  <button
                    key={saved._id}
                    className="pay-option"
                    onClick={() => {
                      const { _id, ...rest } = saved;
                      void _id;
                      setAddress(rest);
                    }}
                  >
                    <span className="text-sm">
                      <strong>{saved.full_name}</strong> — {saved.line1}, {saved.city} {saved.postal_code}, {saved.country}
                    </span>
                  </button>
                ))}
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--dim)]">Or enter a new address below</p>
              </div>
            )}
            <AddressFields value={address} onChange={setAddress} />
            {errors.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1">
                {errors.map((e) => (
                  <li className="field-error" key={e}>{e}</li>
                ))}
              </ul>
            )}
            <button className="btn mt-5" onClick={() => { setErrors([]); if (validateShipping()) setStep('payment'); }}>
              Continue to payment
            </button>
          </section>

          {/* Step 2 — payment */}
          <section className="panel" style={{ opacity: step === 'payment' ? 1 : 0.6 }}>
            <h2>2 · Payment</h2>
            <div className="flex flex-col gap-3">
              <label className={`pay-option ${method === 'online' ? 'selected' : ''} ${onlineEnabled === false ? 'disabled' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={method === 'online'}
                  disabled={onlineEnabled === false}
                  onChange={() => setMethod('online')}
                />
                <div>
                  <p className="title">Pay online — UPI · Cards · Netbanking</p>
                  <p className="sub">Secure payment via Cashfree. Amounts are charged in INR.</p>
                  {onlineEnabled === false && (
                    <p className="sub mt-2">
                      Not configured yet — add CASHFREE_APP_ID and CASHFREE_SECRET_KEY to your Convex deployment (see SETUP.md §3).
                    </p>
                  )}
                  {onlineEnabled === true && process.env.NEXT_PUBLIC_CASHFREE_MODE !== 'production' && (
                    <p className="sub mt-2">Sandbox mode — test cards only, nothing is actually charged.</p>
                  )}
                </div>
              </label>
              <label className={`pay-option ${method === 'cod' ? 'selected' : ''}`}>
                <input type="radio" name="payment" checked={method === 'cod'} onChange={() => setMethod('cod')} />
                <div>
                  <p className="title">Cash on delivery</p>
                  <p className="sub">Pay in cash when your order arrives.</p>
                </div>
              </label>
            </div>
          </section>

          {/* Step 3 — review */}
          <section className="panel">
            <h2>3 · Review &amp; place order</h2>
            <div className="totals">
              <div className="row"><span>Deliver to</span><span>{address.full_name || '—'}, {address.line1 || '—'}</span></div>
              <div className="row"><span>Payment</span><span>{method === 'online' ? 'Pay online (Cashfree)' : 'Cash on delivery'}</span></div>
              <div className="row grand"><span>To pay</span><span>{money(t.total)}{method === 'online' ? ' (≈ ₹' + Math.round(t.total / 100 * 83).toLocaleString('en-IN') + ')' : ''}</span></div>
            </div>
            <button className="btn mt-6 w-full" onClick={placeOrder} disabled={busy || step !== 'payment'}>
              {busy ? 'Placing your order…' : method === 'online' ? 'Pay securely & place order' : 'Place order — cash on delivery'}
            </button>
          </section>
        </div>

        <aside className="panel h-fit">
          <h2>Order summary</h2>
          <div className="totals">
            <div className="row"><span>Subtotal</span><span>{money(t.subtotal)}</span></div>
            <div className="row"><span>Shipping</span><span>{t.shipping ? money(t.shipping) : 'Complimentary'}</span></div>
            <div className="row grand"><span>Total</span><span>{money(t.total)}</span></div>
          </div>
          <p className="mt-4 text-xs text-[var(--dim)]">
            By placing an order you agree to our <Link href="/shipping" className="underline">shipping &amp; returns</Link> policy.
          </p>
        </aside>
      </div>
    </StoreLayout>
  );
}

/** Subscribes to saved addresses; [] until signed in. */
function useAddresses(): SavedAddress[] {
  const { isSignedIn } = useAuth();
  const data = useQuery(api.addresses.list, {});
  return isSignedIn ? (data ?? []) : [];
}
