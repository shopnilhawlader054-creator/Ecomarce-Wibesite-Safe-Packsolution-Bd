console.log('shopnil')
function toggleMenu(event){
    const left_side_drwer = document.getElementById('mobile-menu-drawer')
    const Backdrop_overlay = document.getElementById('mobile-menu-overlay')
    left_side_drwer.classList.toggle('-translate-x-full')

    Backdrop_overlay.classList.toggle('hidden')
    Backdrop_overlay.classList.toggle('opacity-0')
}



  document.addEventListener('DOMContentLoaded', function () {
    const card_size = document.querySelectorAll('.size-card');
    const order_summary = document.getElementById('summary-items-list');
    const total_tk = document.getElementById('grand-total-price');
    

    // ================= ORDER SUMMARY AND TOTAL ORDER LOGIC ====================
    function renderordersummary() {
        let gender_total = 0;
        let summaryhtml = '';

        for (const cards of card_size) {
            const tick_icone = cards.querySelector('.tick-icon');
            const name = cards.dataset.name;
            const price = parseFloat(cards.dataset.price) || 0;
            const qty_input = cards.querySelector('.qty-input');
            
            let qty = 0;
            if (qty_input) {
                qty = parseInt(qty_input.value) || 0;
            } else if (tick_icone && !tick_icone.classList.contains('hidden')) {
                qty = 1;
            }

            if (qty > 0) {
                const item_total = price * qty;
                gender_total += item_total;
                summaryhtml += `
                    <div class="grid grid-cols-12 text-[11px] text-slate-300 items-center text-center py-1 border-b border-slate-800/40">
                        <span class="col-span-5 text-left font-medium text-slate-200 truncate">${name}</span>
                        <span class="col-span-2">৳${price.toFixed(2)}</span>
                        <span class="col-span-2">${qty}</span>
                        <span class="col-span-3 text-right font-semibold text-emerald-400">৳${item_total.toFixed(2)}</span>
                    </div>
                `;
            }
        }

        if (summaryhtml === '') {
            order_summary.innerText = null;
            total_tk.innerText = '৳০.০০';
        } else {
            order_summary.innerHTML = summaryhtml;
            total_tk.innerText = `৳${gender_total.toFixed(2)}`;
        }
    }

    // ================= 2. EVENT LISTENERS SETUP ====================
    for (const card of card_size) {
        const btn_plus = card.querySelector('.btn-plus');
        const btn_mainus = card.querySelector('.btn-minus');
        const qty_input = card.querySelector('.qty-input');
        const tick_icon = card.querySelector('.tick-icon');
        
        if (qty_input) {
            // প্লাস বাটনের ইভেন্ট
            if (btn_plus) {
                btn_plus.addEventListener('click', function (e) {
                    e.stopPropagation();
                    let curent_val = parseInt(qty_input.value) || 0;
                    qty_input.value = curent_val + 1;
                    renderordersummary();
                });
            }

            // মাইনাস বাটনের ইভেন্ট
            if (btn_mainus) {
                btn_mainus.addEventListener('click', function (e) {
                    e.stopPropagation();
                    let curent_val = parseInt(qty_input.value) || 0;
                    if (curent_val > 0) {
                        qty_input.value = curent_val - 1;
                    }
                    renderordersummary();
                });
            }

            // ইনপুট ফিল্ডের ইভেন্ট
            qty_input.addEventListener('input', function () {
                renderordersummary();
            });
        } 
        else {
            // টিক-মার্ক কার্ডের ইভেন্ট
            card.addEventListener('click', function () {
                if (tick_icon) {
                    tick_icon.classList.toggle('hidden');
                    renderordersummary();
                }
            });
        }
    }
});















 