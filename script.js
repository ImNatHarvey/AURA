document.addEventListener('DOMContentLoaded', () => {

    // Local Storage
    const getCart = () => JSON.parse(localStorage.getItem('aura_cart')) || [];
    const saveCart = (cart) => localStorage.setItem('aura_cart', JSON.stringify(cart));

    // Cart Badge
    const updateCartCount = () => {
        const count = getCart().length;
        document.querySelectorAll('.cart-badge').forEach(badge => {
            // Badge inner count
            badge.innerText = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        });
    };
    
    updateCartCount();

    // Collection Page
    const showToast = (name) => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        // Toast Notification
        container.innerHTML
        setTimeout(() => container.lastChild?.remove(), 3000); 
    };
    
    // Add to Cart button
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const b = e.target;
            const cart = getCart();
            
            // Transfer to Cart Page(order.html)
            cart.push({
                id: b.dataset.id, name: b.dataset.name, 
                price: parseFloat(b.dataset.price), image: b.dataset.image
            });
            
            // Saves added item
            saveCart(cart);
            updateCartCount();
            showToast(b.dataset.name);
        });
    });

    // Cart Page Logic
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');

    // Cart Page
    const renderCart = () => {
        if (!cartContainer) return; 
        
        const cart = getCart();
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem 0;">Your bag is currently empty.</p>';
        } else {
            cartContainer.innerHTML = cart.map((item, index) => {
                total += item.price;
                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                            <div>
                                <h4 style="font-family: 'Montserrat', sans-serif; margin-bottom: 0.2rem;">${item.name}</h4>
                                <p style="color: var(--text-muted); font-size: 0.9rem;">Qty: 1</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1.5rem;">
                            <span style="font-weight: 600;">₱${item.price.toFixed(2)}</span>
                            <button class="remove-btn" data-index="${index}" style="background: none; border: none; color: #cc0000; cursor: pointer; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; transition: opacity 0.3s;">Remove</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // Peso Sign
        totalElement.innerText = `₱${total.toFixed(2)}`;
    };

    // Render the cart initially
    renderCart();

    // Event "Remove" buttons
    if (cartContainer) {
        cartContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const itemIndex = e.target.dataset.index; 
                const cart = getCart();
                
                cart.splice(itemIndex, 1);
                saveCart(cart);
                
                renderCart(); 
                updateCartCount(); 
            }
        });
    }
});