document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL: Update Cart Counter ---
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            badge.innerText = cart.length;
            // Optionally hide badge if 0
            badge.style.display = cart.length > 0 ? 'inline-block' : 'none';
        });
    }

    // Call immediately on page load to update navbar
    updateCartCount();

    // --- LOGIC FOR MENU PAGE (TOASTS & ADDING) ---
    const addButtons = document.querySelectorAll('.add-btn');
    
    // Function to create and show a toast
    function showToast(productName) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerText = `Added ${productName} to your bag.`;
        
        container.appendChild(toast);

        // Remove the toast from the DOM after animation finishes (3 seconds)
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    if (addButtons.length > 0) {
        addButtons.forEach(button => {
            button.addEventListener('click', function() {
                const item = {
                    id: this.getAttribute('data-id'),
                    name: this.getAttribute('data-name'),
                    price: parseFloat(this.getAttribute('data-price')),
                    image: this.getAttribute('data-image')
                };

                let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
                cart.push(item);
                localStorage.setItem('aura_cart', JSON.stringify(cart));

                // Trigger UI updates
                updateCartCount();
                showToast(item.name);

                // Change button state
                this.innerText = 'Added';
                this.classList.add('added');
                this.disabled = true;
                this.style.cursor = 'default';
            });
        });
    }

    // --- LOGIC FOR ORDER (CART) PAGE ---
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');

    if (cartContainer) {
        let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Your bag is currently empty.</p>';
        } else {
            cart.forEach(item => {
                total += item.price;
                const itemHTML = `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                            <div>
                                <h4 style="font-family: 'Montserrat', sans-serif; margin-bottom: 0.2rem;">${item.name}</h4>
                                <p style="color: var(--text-muted); font-size: 0.9rem;">Qty: 1</p>
                            </div>
                        </div>
                        <div style="font-weight: 600;">$${item.price.toFixed(2)}</div>
                    </div>
                `;
                cartContainer.insertAdjacentHTML('beforeend', itemHTML);
            });
        }

        totalElement.innerText = `$${total.toFixed(2)}`;
    }
});