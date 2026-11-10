'use client';

import { useState } from 'react';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes('@') || !form.message.trim()) {
      toast.error('Please complete every field');
      return;
    }
    setSent(true);
    toast.success('Message received — we reply within one business day');
  }

  return (
    <StoreLayout>
      <PageTitle eyebrow="Customer care" title="Contact us" />
      <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-24 md:grid-cols-2">
        <section className="panel">
          <h2>Write to us</h2>
          {sent ? (
            <p className="text-sm leading-relaxed text-[var(--mid)]">
              Thank you, {form.name}. Your message is with our concierge team — expect a reply at {form.email} within one business day.
            </p>
          ) : (
            <form className="field-grid" onSubmit={submit}>
              <label>
                <span>Name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" required />
              </label>
              <label className="col-span-full">
                <span>Message</span>
                <textarea
                  className="min-h-32 rounded-lg border border-[var(--line)] bg-white p-3 font-[inherit] text-sm outline-none focus:border-[var(--ink)]"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </label>
              <button className="btn col-span-full" type="submit">Send message</button>
            </form>
          )}
        </section>
        <section className="panel h-fit">
          <h2>The concierge</h2>
          <p className="text-sm leading-relaxed text-[var(--mid)]">
            <strong className="text-[var(--ink)]">Email</strong> — care@maisonvell.example
            <br />
            <strong className="text-[var(--ink)]">Hours</strong> — Monday to Friday, 10:00–18:00 CET
            <br />
            <strong className="text-[var(--ink)]">Order questions</strong> — include your order number for the fastest reply.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--mid)]">
            For press and partnerships, write to press@maisonvell.example.
          </p>
        </section>
      </div>
    </StoreLayout>
  );
}
