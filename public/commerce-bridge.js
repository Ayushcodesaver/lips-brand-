(() => {
 const origin=location.origin;
 document.querySelectorAll('.acct a').forEach(a=>{if(a.textContent.trim()==='Login'){a.href='/auth';a.target='_top';a.dataset.account='true';}if(a.getAttribute('aria-label')==='Bag'||a.textContent.includes('Cart (')){a.href='/bag';a.target='_top';}if(a.getAttribute('aria-label')==='Wishlist'){a.href='/wishlist';a.target='_top';}if(a.getAttribute('aria-label')==='Search'){a.href='/search';a.target='_top';}});
 const cards=[...document.querySelectorAll('.card')].filter(c=>c.querySelector('.add'));
 cards.forEach((card,id)=>{card.dataset.productId=String(id);const heading=card.querySelector('h3');if(heading){const a=document.createElement('a');a.href='/product/'+['velvet-rouge','nude-cashmere','rose-silk','champagne-veil','midnight-noir','pearl-ivory'][id];a.target='_top';a.textContent=heading.textContent;heading.replaceChildren(a);}});
 document.addEventListener('click',e=>{const el=e.target.closest('.add,.fav');if(!el)return;const card=el.closest('[data-product-id]');if(!card)return;e.preventDefault();e.stopImmediatePropagation();parent.postMessage({type:el.classList.contains('add')?'mv-add':'mv-save',id:Number(card.dataset.productId)},origin);},true);
 addEventListener('message',e=>{if(e.origin!==origin||e.source!==parent||e.data?.type!=='mv-state')return;const cart=document.getElementById('cart');if(cart)cart.textContent=e.data.count;document.querySelectorAll('[data-account]').forEach(a=>{a.textContent=e.data.signedIn?'Account':'Login';a.href=e.data.signedIn?'/account':'/auth';});cards.forEach((card,id)=>card.querySelector('.fav')?.setAttribute('aria-pressed',String(e.data.wishlist.includes(id))));});
 parent.postMessage({type:'mv-ready'},origin);
})();
