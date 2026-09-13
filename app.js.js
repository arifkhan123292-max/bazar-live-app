// ১. ডেমো ডাটা বা ডিফল্ট প্রোডাক্ট (যদি লোকাল স্টোরেজ খালি থাকে)
const defaultProducts = [
    {
        id: 1,
        name: "ইলিশ মাছ (বড়)",
        weight: "১ কেজি",
        oldPrice: 1500,
        newPrice: 1200,
        discount: 20,
        category: "কাঁচা বাজার",
        image: "https://unsplash.com"
    },
    {
        id: 2,
        name: "গরুর মাংস (প্রিমিয়াম)",
        weight: "১ কেজি",
        oldPrice: 850,
        newPrice: 780,
        discount: 8,
        category: "কাঁচা বাজার",
        image: "https://unsplash.com"
    }
];

// LocalStorage থেকে প্রোডাক্ট ডাটা ও কার্ট ডাটা তুলে আনা
let products = JSON.parse(localStorage.getItem('khanshop_products')) || defaultProducts;
let cart = JSON.parse(localStorage.getItem('khanshop_cart')) || [];

// ডাটা পরিবর্তন হলে LocalStorage-এ সেভ করার ফাংশন
function saveToStorage() {
    localStorage.setItem('khanshop_products', JSON.stringify(products));
}

function saveCartToStorage() {
    localStorage.setItem('khanshop_cart', JSON.stringify(cart));
}

// ==========================================
// কাস্টমার পেজ রেন্ডারিং (`index.html` এর জন্য)
// ==========================================
function renderCustomerProducts(productsToRender) {
    const container = document.getElementById('product-container');
    if (!container) return; // কাস্টমার পেজে না থাকলে স্কিপ করবে

    container.innerHTML = '';

    if (productsToRender.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #9ca3af; padding: 40px 0;">এই ক্যাটাগরিতে কোনো পণ্য নেই।</div>`;
        return;
    }

    productsToRender.forEach(prod => {
        const card = document.createElement('div');
        card.className = "product-card";
        
        card.innerHTML = `
            <!-- Discount Badge -->
            ${prod.discount ? `<span class="discount-badge">${prod.discount}% ছাড়</span>` : ''}
            
            <!-- Product Image -->
            <div class="img-container">
                <img src="${prod.image}" alt="${prod.name}">
            </div>

            <!-- Product Body -->
            <div class="card-body">
                <div>
                    <h3 class="p-title">${prod.name}</h3>
                    <p class="p-weight">${prod.weight}</p>
                </div>

                <div>
                    <!-- Pricing Structure -->
                    <div class="price-box">
                        <span class="new-price">৳${prod.newPrice}</span>
                        <span class="old-price">৳${prod.oldPrice}</span>
                    </div>

                    <!-- Action Buttons -->
                    <div class="btn-group">
                        <button onclick="addToCart(${prod.id})" class="buy-btn">কিনুন</button>
                        <button class="details-btn">বিস্তারিত</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// কার্টে আইটেম যোগ করার ফাংশন
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        cart.push(product);
        saveCartToStorage();
        updateCartCount();
        alert(`"${product.name}" কার্টে যোগ করা হয়েছে!`);
    }
}

// কার্ট সংখ্যা আপডেট করার ফাংশন
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.innerText = cart.length;
    });
}

// কাস্টমার পেজের ক্যাটাগরি ফিল্টার
function filterProducts(category) {
    if (category === 'সব') {
        renderCustomerProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderCustomerProducts(filtered);
    }
}

// ==========================================
// অ্যাডমিন পেজ লজিক (`admin.html` এর জন্য)
// ==========================================
function renderAdminProducts() {
    const tableBody = document.getElementById('admin-product-list');
    const alertBox = document.getElementById('no-product-alert');
    if (!tableBody) return; // অ্যাডমিন পেজে না থাকলে স্কিপ করবে

    tableBody.innerHTML = '';

    if (products.length === 0) {
        alertBox.classList.remove('hidden');
        return;
    } else {
        alertBox.classList.add('hidden');
    }

    products.forEach((prod) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${prod.image}" class="p-thumb"></td>
            <td><strong>${prod.name}</strong><br><span style="font-size:12px; color:#94a3b8;">${prod.weight}</span></td>
            <td><span class="cat-tag">${prod.category}</span></td>
            <td>
                <span style="color:#0d9488; font-weight:bold;">৳${prod.newPrice}</span><br>
                <span style="font-size:12px; text-decoration:line-through; color:#94a3b8;">৳${prod.oldPrice}</span>
            </td>
            <td style="text-align: center;">
                <button onclick="deleteProduct(${prod.id})" class="delete-btn">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// নতুন পণ্য যুক্ত করার সাবমিট হ্যান্ডলার
const productForm = document.getElementById('product-form');
if (productForm) {
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const newProduct = {
            id: Date.now(), // ইউনিক আইডি জেনারেশন
            name: document.getElementById('p-name').value,
            weight: document.getElementById('p-weight').value,
            oldPrice: Number(document.getElementById('p-old-price').value),
            newPrice: Number(document.getElementById('p-new-price').value),
            discount: Number(document.getElementById('p-discount').value) || 0,
            category: document.getElementById('p-category').value,
            image: document.getElementById('p-image').value
        };

        products.push(newProduct);
        saveToStorage();
        renderAdminProducts();
        productForm.reset();
        alert('সফলভাবে পণ্যটি যুক্ত করা হয়েছে! লাইভ শপে চেক করুন।');
    });
}

// পণ্য ডিলিট করার ফাংশন
function deleteProduct(id) {
    if (confirm('আপনি কি নিশ্চিতভাবেই এই পণ্যটি ডিলিট করতে চান?')) {
        products = products.filter(p => p.id !== id);
        saveToStorage();
        renderAdminProducts();
    }
}

// পেজ লোড হওয়ার সাথে সাথে সব ফাংশন ট্রিগার করা
document.addEventListener('DOMContentLoaded', () => {
    if(!localStorage.getItem('khanshop_products')) {
        saveToStorage();
    }
    renderCustomerProducts(products);
    renderAdminProducts();
    updateCartCount();
});
