'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/components/store-provider';
import { products } from '@/lib/catalog';
import styles from './lookbook.module.css';

/* Depth tables — ported verbatim from the original campaign engine. */
const KX = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085];
const KF = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59];
const KH = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19];
const KB = [0, 0, 1.5, 4, 8, 12, 17];
const KO = [1, 1, 1, 1, 0.86, 0.5, 0];

const N = products.length;
const wrap = (x: number, n: number) => ((x % n) + n) % n;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

const HEART = (
  <svg viewBox="0 0 24 24">
    <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20.5 9C20.5 15 12 20 12 20Z" />
  </svg>
);

export default function LookbookCampaign() {
  const { items, wishlist, add, toggle, signedIn } = useStore();
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const [gone, setGone] = useState(false);

  const stageRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const rollRef = useRef<HTMLSpanElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const bottleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const rail = railRef.current;
    const ring = ringRef.current;
    const roll = rollRef.current;
    if (!stage || !rail || !ring || !roll) return;

    const bottles = bottleRefs.current.filter((el): el is HTMLDivElement => !!el);
    const cards = cardRefs.current.filter((el): el is HTMLElement => !!el);
    const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;

    let W = 0, H = 0, base = 0, cardS = 0, side = false, dirty = true, fit = 1;
    let p = 0, target = 0, last = 0;
    let mx = 0, my = 0, cx = 0, cy = 0;
    let down = false, sx = 0, st = 0, moved = 0, wheelT = 0;
    const filters = bottles.map(() => '');
    const opacities = bottles.map(() => '');

    const PULL = () => Math.max(150, W * 0.2);

    function size() {
      W = stage!.clientWidth;
      H = stage!.clientHeight;
      side = innerWidth <= 820;
      fit = Math.min(1, (W * 0.5) / (0.832 * H * (bottles[0] ? 413 / 900 : 1) || 1));
      base = H * 1.2;
      bottles.forEach((el, i) => {
        const r = products[i].width / 900;
        el.style.width = `${base * r}px`;
        el.style.height = `${base}px`;
      });
      cardS = side ? 160 : rail!.clientHeight / 3;
      cards.forEach((card) => {
        card.style.height = side ? '100%' : `${cardS}px`;
      });
      dirty = true;
    }

    function paint() {
      bottles.forEach((el, i) => {
        let d = wrap(i - p, N);
        if (d > N - 1) d -= N;
        const k = Math.min(6, Math.max(0, d + 1));
        const a = Math.floor(k);
        const b = Math.min(6, a + 1);
        const t = k - a;
        const mix = (A: number[]) => A[a] + (A[b] - A[a]) * t;

        const r = products[i].width / 900;
        const h = mix(KH) * H * fit;
        const s = h / base;
        const w = h * r;
        const x = mix(KX) * W - w / 2;
        const y = mix(KF) * H - h;

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
        const blur = mix(KB) / s;
        const filter = blur < 0.2 ? 'none' : `blur(${blur.toFixed(1)}px)`;
        const opacity = mix(KO).toFixed(3);
        if (filter !== filters[i]) {
          filters[i] = filter;
          el.style.filter = filter;
        }
        if (opacity !== opacities[i]) {
          opacities[i] = opacity;
          el.style.opacity = opacity;
        }
        el.style.zIndex = String(100 - Math.round(d * 10));
      });

      const all = cardS * products.length;
      cards.forEach((card, i) => {
        let y = wrap(i * cardS - p * 2 * cardS, all);
        if (y > all - cardS) y -= all;
        card.style.transform = side ? `translate3d(${y.toFixed(1)}px, 0, 0)` : `translate3d(0, ${y.toFixed(1)}px, 0)`;
      });

      const lineHeight = roll!.firstChild instanceof HTMLElement ? roll!.firstChild.offsetHeight : 38;
      roll!.style.transform = `translate3d(0, ${-wrap(p, N) * lineHeight}px, 0)`;
    }

    function frame(now: number) {
      const dt = Math.min(50, now - last) || 16;
      last = now;
      const was = p;
      if (calm) {
        p = target;
      } else {
        p += (target - p) * (1 - Math.exp(-dt * 0.0072));
      }
      if (Math.abs(target - p) < 0.0004) p = target;
      if (p !== was || dirty) {
        dirty = false;
        paint();
      }
      cx += (mx - cx) * 0.32;
      cy += (my - cy) * 0.32;
      ring!.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
    }

    let raf = 0;
    function loop(t: number) {
      frame(t);
      raf = requestAnimationFrame(loop);
    }

    function onEnter(e: PointerEvent) {
      if (e.pointerType === 'mouse') ring!.classList.add('show');
    }
    function onLeave() {
      ring!.classList.remove('show');
    }
    function onMove(e: PointerEvent) {
      const r = stage!.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (!down) return;
      const dx = e.clientX - sx;
      moved = Math.max(moved, Math.abs(dx));
      target = st + dx / PULL();
    }
    function onDown(e: PointerEvent) {
      if ((e.target as HTMLElement).closest('a')) return;
      down = true;
      sx = e.clientX;
      st = target;
      moved = 0;
      stage!.setPointerCapture(e.pointerId);
      ring!.classList.add('drag');
    }
    function release(e: PointerEvent) {
      if (!down) return;
      down = false;
      ring!.classList.remove('drag');
      if (moved < 6) {
        const hit = document.elementsFromPoint(e.clientX, e.clientY).find((x) => x.classList && x.classList.contains(styles.m));
        if (hit && hit instanceof HTMLElement && hit.dataset.i) {
          let d = wrap(Number(hit.dataset.i) - target, N);
          d = Math.round(d);
          if (d > 0 && d < N) target = Math.round(target) + d;
        }
      } else {
        target = Math.round(target);
      }
    }
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      target += clamp(e.deltaY + e.deltaX, -120, 120) / 420;
      clearTimeout(wheelT);
      wheelT = window.setTimeout(() => {
        target = Math.round(target);
      }, 150);
    }
    function onKey(e: KeyboardEvent) {
      if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        target = Math.round(target) + 1;
      }
      if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        target = Math.round(target) - 1;
      }
    }

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);
    stage.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', size);

    size();
    raf = requestAnimationFrame(loop);

    void document.fonts.ready.then(() => {
      size();
      paint();
      setGone(true);
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(wheelT);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointerup', release);
      stage.removeEventListener('pointercancel', release);
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', size);
    };
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.r1}>
            <Link className={`${styles.brand} wide`} href="/" aria-label="Maison Vell Beauty">
              Maison Vell Beauty
            </Link>
            <nav className={`${styles.tabs} wide`} aria-label="Sections">
              <Link className={styles.on} href="/" aria-current="page">Collection</Link>
              <Link href="/the-maison">The Maison</Link>
              <Link href="/beauty">Beauty</Link>
              <Link href="/lookbook">Lookbook</Link>
              <Link href="/shop">Shop</Link>
            </nav>
            <div className={`${styles.acct} wide`}>
              <Link href={signedIn ? '/account' : '/auth'}>Login</Link>
              <Link href="/shop" aria-label="Search">
                <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
              </Link>
              <Link href="/wishlist" aria-label="Wishlist">{HEART}</Link>
              <Link href="/bag" aria-label="Bag">
                <svg viewBox="0 0 24 24"><path d="M5 8h14l1 13H4Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>
              </Link>
              <Link href="/bag">Cart (<span>{count}</span>)</Link>
            </div>
          </div>
          <nav className={`${styles.r2} wide`} aria-label="Beauty Departments">
            <Link href="/shop">Nail Colour</Link>
            <Link href="/shop">New Arrivals</Link>
            <Link href="/shop">Best Sellers</Link>
            <Link href="/shop">Collections</Link>
            <Link href="/beauty">Beauty Ritual</Link>
            <Link href="/the-maison">Our World</Link>
          </nav>
        </header>

        <div className={styles.main}>
          <section
            ref={(el) => {
              stageRef.current = el;
            }}
            className={styles.stage}
            aria-label="Nail polish collection. Drag, scroll or use the arrow keys to change shade."
            tabIndex={0}
          >
            <div className={styles.line} ref={lineRef}>
              {products.map((product, i) => (
                <div
                  key={product.id}
                  ref={(el) => {
                    bottleRefs.current[i] = el;
                  }}
                  className={styles.m}
                  data-i={i}
                  aria-label={`${product.name}, ${product.shade}, ${product.finish}. ${product.note}`}
                >
                  <svg viewBox={`${product.x} 0 ${product.width} 900`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                    <svg x={product.x} y="0" width={product.width} height="900" viewBox={`${product.x} 0 ${product.width} 900`}>
                      <image href="/nail-polish-sprite.webp" width="2474" height="900" preserveAspectRatio="none" />
                    </svg>
                  </svg>
                </div>
              ))}
            </div>

            <div className={styles.intro}>
              <h2 className="wide">THE NAIL COLOUR COLLECTION</h2>
              <p>
                A study in colour, light and lacquer. Six signature shades created to capture the quiet luxury of
                Maison Vell Beauty through glass, pigment and high-shine finish.
              </p>
            </div>

            <div className={styles.tag}>
              <div className={`${styles.look} wide`} aria-live="polite">
                <span>Shade</span>
                <span className={styles.win}>
                  <span className={styles.roll} ref={rollRef}>
                    {Array.from({ length: N + 1 }, (_, i) => (
                      <b key={i}>{String((i % N) + 1).padStart(2, '0')}</b>
                    ))}
                  </span>
                </span>
              </div>
              <Link className={`${styles.shop} wide`} href="/shop">
                Explore the shade
              </Link>
            </div>

            <div className={styles.ring} ref={ringRef} />
          </section>

          <aside
            ref={(el) => {
              railRef.current = el;
            }}
            className={styles.rail}
            aria-label="Nail polish collection"
          >
            {products.map((product, i) => (
              <article
                key={product.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`${styles.card} ${i % 2 ? styles.alt : ''}`}
              >
                <button
                  className={styles.fav}
                  aria-pressed={wishlist.includes(product.id)}
                  aria-label={`Save ${product.name}`}
                  onClick={() => toggle(product.id)}
                >
                  {HEART}
                </button>
                <span className={styles.shot}>
                  <svg viewBox={`${product.x} 0 ${product.width} 900`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                    <svg x={product.x} y="0" width={product.width} height="900" viewBox={`${product.x} 0 ${product.width} 900`}>
                      <image href="/nail-polish-sprite.webp" width="2474" height="900" preserveAspectRatio="none" />
                    </svg>
                  </svg>
                </span>
                <div className={styles.meta}>
                  <h3 className="wide">
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                  </h3>
                  <span>{product.shade}</span>
                  <em className={styles.fin} style={{ fontStyle: 'normal' }}>
                    {product.finish} · ${Math.round(product.price / 100)}
                  </em>
                  <button className={styles.add} aria-label={`Add ${product.name} to bag`} onClick={() => add(product.id)} />
                </div>
              </article>
            ))}
          </aside>
        </div>
      </div>

      <div className={`${styles.wait} ${gone ? styles.gone : ''}`} />
    </div>
  );
}
