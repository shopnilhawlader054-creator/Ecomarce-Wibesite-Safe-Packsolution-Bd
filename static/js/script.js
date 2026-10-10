/* =====================================================================
   shop.js  (menu + product page + cart page + checkout page)
   Ekta file-i sob page-e load korun, element na thakle oi part skip hobe.
   ===================================================================== */

// ---------- Mobile menu ----------
function toggleMenu() {
  const drawer = document.getElementById('mobile-menu-drawer');
  const overlay = document.getElementById('mobile-menu-overlay');
  if (!drawer || !overlay) return;
  drawer.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
  overlay.classList.toggle('opacity-0');
}

document.addEventListener('DOMContentLoaded', function () {


  
    const slider = document.getElementById('hero-slider');
    if (slider) {
      const slides = slider.children;
      let currentIndex = 0;
      const totalSlides = slides.length;

      function showNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      // প্রতি ৩.৫ সেকেন্ড পর পর স্লাইড অটোমেটিক পরিবর্তন হবে
      setInterval(showNextSlide, 3500);
    }
  
  // ================= CONFIG & HELPERS =================
  const CART_KEY = 'cart';              // localStorage  : Add to Cart data
  const BUY_NOW_KEY = 'buy_now_items';  // sessionStorage: Buy Now data
  const MIN_QTY = 50, MAX_QTY = 100;
  const ORDER_URL = '/order_form/';

  const $ = (id) => document.getElementById(id);
  const clamp = (v) => Math.min(MAX_QTY, Math.max(MIN_QTY, v));
  const taka = (n) => '৳' + Number(n).toFixed(2);
  const fmtWeight = (g) => (g >= 1000 ? (g / 1000).toFixed(2) + ' Kg' : g + ' Grams');
  // innerHTML-e boshanor age escape (XSS theke bachte)
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function readJSON(storage, key) {
    try { return JSON.parse(storage.getItem(key)) || []; } catch { return []; }
  }
  // item format: {product_name, name, img, price, qty, unit_weight}
  function normalize(list) {
    return list
      .map((i) => ({
        product_name: i.product_name || '',
        name: i.name || '',
        img: i.img || '',
        price: Number(i.price) || 0,
        qty: Number(i.qty) || 0,
        unit_weight: Number(i.unit_weight) || 0,
      }))
      .filter((i) => i.qty > 0);
  }
  const getCart = () => normalize(readJSON(localStorage, CART_KEY));
  const saveCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));
  const getBuyNow = () => normalize(readJSON(sessionStorage, BUY_NOW_KEY));

  function calcTotals(items) {
    let subtotal = 0, weight = 0;
    items.forEach((i) => { subtotal += i.price * i.qty; weight += i.unit_weight * i.qty; });
    return { subtotal, weight };
  }

  function getCookie(name) {
    const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? decodeURIComponent(m[2]) : '';
  }

  function showCartCount() {
    const badge = $('show-add-to-cart-count');
    if (!badge) return;
    const n = getCart().length;
    badge.classList.toggle('hidden', n === 0);
    badge.innerText = n;
  }
  showCartCount();

  // ================= MODAL (common) =================
  function openModal(id, innerHTML) {
    $(id)?.remove();
    document.body.insertAdjacentHTML('beforeend', `
      <div id="${id}" class="fixed inset-0 bg-[#0a0b0e]/80 backdrop-blur-md flex items-center justify-center z-[99999] opacity-0 transition-opacity duration-300">
        <div class="modal-card bg-[#12141c] border border-[#d4af37]/40 p-6 sm:p-8 rounded-2xl text-center max-w-sm w-[90%] shadow-[0_20px_50px_rgba(0,0,0,0.9)] transform scale-90 transition-transform duration-300">
          ${innerHTML}
        </div>
      </div>`);
    const overlay = $(id);
    const card = overlay.querySelector('.modal-card');
    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      card.classList.replace('scale-90', 'scale-100');
    });
    const close = (after) => {
      overlay.classList.add('opacity-0');
      card.classList.replace('scale-100', 'scale-90');
      setTimeout(() => { overlay.remove(); if (after) after(); }, 300);
    };
    return { overlay, close };
  }

  function showAddToCartModal(productName, viewcarts) {
    const { overlay, close } = openModal('cart-modal-overlay', `
      <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🛒</div>
      <h2 class="text-white text-lg sm:text-xl font-black mb-1 tracking-wide">Added to Cart!</h2>
      <p class="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
        <span class="text-[#d4af37] font-semibold">${esc(productName)}</span> has been successfully added to your shopping cart.
      </p>
      <div class="flex flex-col sm:flex-row gap-3">
        <button id="keep-shopping-btn" class="flex-1 bg-[#090a0d] hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all cursor-pointer">Keep Shopping</button>
        <button id="view-cart-btn" class="flex-1 bg-[#d4af37] hover:bg-[#e6c553] text-[#0a0b0e] font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-[0_5px_15px_rgba(212,175,55,0.3)] active:scale-95 cursor-pointer">View Cart</button>
      </div>`);
    $('keep-shopping-btn').addEventListener('click', () => close());
    $('view-cart-btn').addEventListener('click', () => { window.location.href = viewcarts || '/cart/'; });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  }

  function showSuccessModal(homepage) {
    const { close } = openModal('success-modal-overlay', `
      <div class="w-16 h-16 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🎉</div>
      <h2 class="text-white text-xl sm:text-2xl font-black mb-2 tracking-wide">Congratulations!</h2>
      <p class="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">Your order has been successfully placed. We will contact you soon to confirm delivery.</p>
      <button id="close-success-modal" class="w-full bg-[#d4af37] hover:bg-[#e6c553] text-[#0a0b0e] font-extrabold text-sm py-3.5 px-6 rounded-xl transition-all shadow-[0_5px_15px_rgba(212,175,55,0.3)] active:scale-95 cursor-pointer">Okay / Back to Home</button>`);
    $('close-success-modal').addEventListener('click', () => close(() => { window.location.href = homepage || '/'; }));
  }

  // ================= PRODUCT PAGE =================
  // .size-card-e data-name, data-price, data-weight (gram) thakte hobe
  const sizeCards = document.querySelectorAll('.size-card');

  function collectSelected() {
    const img = $('main-product-img')?.src || '';
    const product_name = $('img-size-badge')?.innerText.trim() || '';
    const lines = [];
    sizeCards.forEach((card) => {
      const input = card.querySelector('.qty-input');
      const tick = card.querySelector('.tick-icon');
      let qty = 0;
      if (input) qty = parseInt(input.value) || 0;
      else if (tick && !tick.classList.contains('hidden')) qty = 1;
      if (qty > 0) {
        lines.push({
          product_name,
          name: card.dataset.name || '',
          img,
          price: parseFloat(card.dataset.price) || 0,
          qty,
          unit_weight: parseFloat(card.dataset.weight) || 0,
        });
      }
    });
    return lines;
  }

  function renderOrderSummary() {
    const list = $('summary-items-list');
    if (!list) return;
    const lines = collectSelected();
    list.innerHTML = lines.map((i) => `
      <div class="grid grid-cols-12 text-[11px] text-slate-300 items-center text-center py-1 border-b border-slate-800/40">
        <span class="col-span-5 text-left font-medium text-slate-200 truncate">${esc(i.name)}</span>
        <span class="col-span-2">${taka(i.price)}</span>
        <span class="col-span-2">${i.qty}</span>
        <span class="col-span-3 text-right font-semibold text-emerald-400">${taka(i.price * i.qty)}</span>
      </div>`).join('');
    if ($('grand-total-price')) $('grand-total-price').innerText = taka(calcTotals(lines).subtotal);
  }

  sizeCards.forEach((card) => {
    const input = card.querySelector('.qty-input');
    if (input) {
      const fix = () => {
        const v = Number(input.value) || 0;
        input.value = v === 0 ? 0 : clamp(v);   // 0 = select kora nai
        renderOrderSummary();
      };
      card.querySelector('.btn-plus')?.addEventListener('click', () => {
        input.value = clamp((Number(input.value) || 0) + 1);
        renderOrderSummary();
      });
      card.querySelector('.btn-minus')?.addEventListener('click', () => {
        const v = Number(input.value) || 0;
        input.value = v <= MIN_QTY ? 0 : v - 1;   // MIN_QTY-te minus = deselect
        renderOrderSummary();
      });
      input.addEventListener('blur', fix);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); fix(); } });
    } else {
      card.addEventListener('click', () => {
        card.querySelector('.tick-icon')?.classList.toggle('hidden');
        renderOrderSummary();
      });
    }
  });

  // ---------- Add to Cart ----------
  // <button id="add-to-cart" data-cart-url="{% url 'add_to_cart' %}">
  const addToCartBtn = $('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const lines = collectSelected();
      if (!lines.length) { alert('অনুগ্রহ করে অন্তত একটি সাইজ সিলেক্ট করুন!'); return; }

      const cart = getCart();                    // ager item thakbe (clear kora hoy na)
      lines.forEach((line) => {
        const found = cart.find((c) => c.product_name === line.product_name && c.name === line.name);
        if (found) found.qty = clamp(found.qty + line.qty);
        else cart.push(line);
      });
      saveCart(cart);
      showCartCount();
      showAddToCartModal(lines[0].product_name,viewcarts,homepage);
    });
  }

  // ---------- Buy Now ----------
  // <a id="by_now" href="#" data-url="{% url 'checkout' %}">
  const buyNow = $('by_now');
  if (buyNow) {
    buyNow.addEventListener('click', function (e) {
      e.preventDefault();
      const lines = collectSelected();
      if (!lines.length) { alert('অনুগ্রহ করে অন্তত একটি সাইজ সিলেক্ট করুন!'); return; }
      sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(lines));
      const url = this.getAttribute('data-url') || this.getAttribute('href');
      if (url && url !== '#') window.location.href = url;
    });
  }

  // ================= CART PAGE =================
  const cartSection = $('card-section');

  function cartRowHTML(item, index) {
    return `
    <div class="cart-item relative grid grid-cols-12 items-center gap-4 bg-[#090a0d] p-3.5 pt-8 sm:pt-3.5 rounded-xl border border-slate-800/80" data-index="${index}">
      <button type="button" class="delete-item-btn absolute top-2.5 right-2.5 w-5 h-5 bg-[#12141c] hover:bg-red-600/20 text-slate-400 hover:text-red-400 rounded-md border border-slate-800 flex items-center justify-center text-[10px] transition-all cursor-pointer z-10" title="Remove Item">✕</button>
      <div class="col-span-6 flex items-center gap-3 pr-4">
        <div class="w-14 h-14 bg-[#12141c] rounded-lg border border-slate-800 flex items-center justify-center p-1 flex-shrink-0">
          <img src="${esc(item.img)}" alt="Product Image" class="max-h-full max-w-full object-contain">
        </div>
        <div>
          <h3 class="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-1">${esc(item.product_name)}</h3>
          <span class="text-xs text-slate-400 bg-[#12141c] px-2 py-0.5 rounded border border-slate-800 mt-1 inline-block">SIZE: ${esc(item.name)}</span>
        </div>
      </div>
      <div class="col-span-2 text-center"><span class="text-xs sm:text-sm font-bold text-emerald-400">${taka(item.price)}</span></div>
      <div class="col-span-2 flex items-center justify-center">
        <div class="flex items-center border border-slate-800 rounded-lg bg-[#12141c] px-1 py-1">
          <button type="button" class="btn-minus cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg border border-slate-700 bg-[#12141c] text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-bold transition-all">-</button>
          <input type="text" inputmode="numeric" value="${item.qty}" class="qty-input w-12 text-center text-slate-100 font-bold text-sm bg-transparent focus:outline-none">
          <button type="button" class="btn-plus cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg bg-[#d4af37] hover:bg-[#c29f31] text-slate-950 text-sm font-bold shadow-md transition-all">+</button>
        </div>
      </div>
      <div class="col-span-2 text-right"><span class="row-subtotal text-sm sm:text-base font-bold text-slate-200">${taka(item.price * item.qty)}</span></div>
    </div>`;
  }

  function updateCartTotals(cart) {
    const { subtotal, weight } = calcTotals(cart);
    if ($('summary-grand-total')) $('summary-grand-total').innerText = taka(subtotal);   // total taka
    if ($('addtocard_subtotal')) $('addtocard_subtotal').innerText = fmtWeight(weight);  // total weight
    const btn = $('add-to-cart-button');
    if (btn) btn.classList.toggle('opacity-50', cart.length === 0);
    if (btn) btn.classList.toggle('cursor-not-allowed', cart.length === 0);
  }

  function renderCart() {
    const cart = getCart();
    cartSection.innerHTML = cart.length
      ? cart.map(cartRowHTML).join('')
      : '<p class="text-center text-slate-400 py-6">আপনার কার্ট খালি</p>';
    updateCartTotals(cart);
    showCartCount();
  }

  // qty change korar common function (re-render chhara live update)
  function setQty(row, newQty) {
    const index = Number(row.dataset.index);
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].qty = clamp(newQty);
    saveCart(cart);
    row.querySelector('.qty-input').value = cart[index].qty;
    row.querySelector('.row-subtotal').innerText = taka(cart[index].price * cart[index].qty);
    updateCartTotals(cart);
  }

  if (cartSection) {
    renderCart();

    cartSection.addEventListener('click', (e) => {
      const row = e.target.closest('.cart-item');
      if (!row) return;
      const index = Number(row.dataset.index);

      if (e.target.closest('.delete-item-btn')) {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
        return;
      }
      const cur = Number(row.querySelector('.qty-input').value) || MIN_QTY;
      if (e.target.closest('.btn-plus')) setQty(row, cur + 1);
      else if (e.target.closest('.btn-minus')) setQty(row, cur - 1);
    });

    cartSection.addEventListener('change', (e) => {
      if (!e.target.classList.contains('qty-input')) return;
      setQty(e.target.closest('.cart-item'), parseInt(e.target.value) || MIN_QTY);
    });
  }

  // Cart page -> Checkout button
  // <a id="add-to-cart-button" href="{% url 'checkout' %}">
  const goCheckout = $('add-to-cart-button');
  if (goCheckout) {
    goCheckout.addEventListener('click', function (e) {
      e.preventDefault();                         // sob somoy age thamaw
      if (!getCart().length) {                    // cart khali -> ei page-i thakbe
        alert('আপনার কার্ট খালি! আগে কিছু যোগ করুন।');
        return;
      }
      sessionStorage.removeItem(BUY_NOW_KEY);     // checkout-e cart-er data-i dekhabe
    window.location.href = chackouturl    // cart-e item thakle-i checkout-e jabe
    });
  }

  // ================= CHECKOUT PAGE =================
  const checkoutBox = $('checkout-items-container');
  let checkoutItems = [];

  function updateCheckoutTotals() {
    const zone = document.querySelector('input[name="delivery_zone"]:checked')?.value || 'inside_dhaka';
    const base = zone === 'inside_dhaka' ? 80 : 130;
    const { subtotal, weight } = calcTotals(checkoutItems);
    const shipping = base + Math.floor(weight / 1000) * 20;   // protit 1 Kg-te +20 tk
    const total = subtotal + shipping;
    if ($('summary-subtotal')) $('summary-subtotal').innerText = taka(subtotal);
    if ($('weight')) $('weight').innerText = fmtWeight(weight);
    if ($('shiping')) $('shiping').innerText = taka(shipping);
    if ($('summary-grand-total')) $('summary-grand-total').innerText = taka(total);
    if ($('cod-total')) $('cod-total').innerText = taka(total);
    return { subtotal, weight, shipping, total, zone };
  }

  if (checkoutBox) {
    const buy = getBuyNow();
    checkoutItems = buy.length ? buy : getCart();   // Buy Now thakle oita, na hole cart

    checkoutBox.innerHTML = checkoutItems.length
      ? checkoutItems.map((i) => `
      <div class="cart-item flex items-center justify-between gap-4 bg-[#090a0d] p-3.5 rounded-xl border border-slate-800/80">
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 bg-[#12141c] rounded-lg border border-slate-800 flex items-center justify-center p-1 flex-shrink-0">
            <img src="${esc(i.img)}" alt="Product Image" class="max-h-full max-w-full object-contain">
          </div>
          <div>
            <h3 class="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-1">${esc(i.product_name)} - ${esc(i.name)}</h3>
            <span class="text-xs text-slate-400 bg-[#12141c] px-2 py-0.5 rounded border border-slate-800 mt-1 inline-block">Qty: ${i.qty}</span>
          </div>
        </div>
        <span class="text-sm sm:text-base font-bold text-emerald-400">${taka(i.price * i.qty)}</span>
      </div>`).join('')
      : '<p class="text-center text-slate-400 py-6">কোনো আইটেম নেই</p>';

    if ($('cart-item-count')) $('cart-item-count').innerText = `${checkoutItems.length} item(s)`;
    if (!checkoutItems.length && $('confrim-order')) {
      $('confrim-order').disabled = true;
      $('confrim-order').classList.add('opacity-50', 'cursor-not-allowed');
    }
    updateCheckoutTotals();

    // Delivery zone (style + total update)
    document.querySelectorAll('.delivery-option').forEach((opt) => {
      opt.addEventListener('click', function () {
        document.querySelectorAll('.delivery-option').forEach((o) => {
          o.classList.remove('border-[#d4af37]'); o.classList.add('border-slate-800');
        });
        this.classList.remove('border-slate-800'); this.classList.add('border-[#d4af37]');
        const r = this.querySelector('input[type="radio"]');
        if (r) r.checked = true;
        updateCheckoutTotals();
      });
    });

    // Payment method (style only; value form theke nibo)
    document.querySelectorAll('.payment-method').forEach((pm) => {
      pm.addEventListener('click', function () {
        document.querySelectorAll('.payment-method').forEach((p) => {
          p.classList.remove('border-[#d4af37]/50'); p.classList.add('border-slate-800');
        });
        this.classList.remove('border-slate-800'); this.classList.add('border-[#d4af37]/50');
        const r = this.querySelector('input[type="radio"]');
        if (r) r.checked = true;
      });
    });
  }

  // ================= CONFIRM ORDER -> Django =================
  const confirmBtn = $('confrim-order');
  const orderForm = confirmBtn?.closest('form');
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = (n) => orderForm.querySelector(`input[name="${n}"]`)?.value.trim() || '';
      const customer_name = val('customer_name');
      const phone_number = val('phone_number');
      const address = val('adders_line');
      const city = val('thana_or_area');

      if (!customer_name) { alert('❌ দয়া করে আপনার পূর্ণ নাম (Full Name) লিখুন!'); return; }
      if (!/^01\d{9}$/.test(phone_number)) { alert('❌ সঠিক ফোন নম্বর দিন (01XXXXXXXXX)!'); return; }
      if (!address) { alert('❌ দয়া করে আপনার সঠিক ঠিকানা (Street Address) লিখুন!'); return; }
      if (!city) { alert('❌ দয়া করে আপনার শহরের নাম (City) লিখুন!'); return; }
      if (!checkoutItems.length) { alert('আপনার কার্ট খালি!'); return; }

      const t = updateCheckoutTotals();
      const payload = {
        customer_name, phone_number, address, city,
        delivery_zone: t.zone,
        payment_method: orderForm.querySelector('input[name="payment_method"]:checked')?.value || 'Cash on Delivery',
        subtotal: t.subtotal, weight: t.weight, shipping: t.shipping, total: t.total,
        items: checkoutItems.map((i) => ({
          product_name: i.product_name, size: i.name, price: i.price, qty: i.qty, unit_weight: i.unit_weight,
        })),
      };

      const csrf = orderForm.querySelector('input[name="csrfmiddlewaretoken"]')?.value || getCookie('csrftoken');
      confirmBtn.disabled = true;   // double click theke bachar jonno
      try {
        const res = await fetch(ORDER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await res.json().catch(() => ({}));

        // Success hole-i storage full clear
        localStorage.clear();
        sessionStorage.clear();
        checkoutItems = [];
        showCartCount();
        showSuccessModal(confirmBtn.dataset.homeUrl || '/');
      } catch (err) {
        console.error(err);
        alert('অর্ডার সাবমিট হয়নি, আবার চেষ্টা করুন।');
        confirmBtn.disabled = false;   // fail hole cart thakbe, abar try kora jabe
      }
    });
  }
});