document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ১. ঠিকানা ও সেটিংস লোড এবং আপডেট করার লজিক
    // ==========================================
    const savedSettings = JSON.parse(localStorage.getItem('shopSettings'));
    if (savedSettings) {
        if (document.getElementById('shopName')) document.getElementById('shopName').value = savedSettings.shopName || '';
        if (document.getElementById('shopAddress')) document.getElementById('shopAddress').value = savedSettings.shopAddress || '';
        if (document.getElementById('shopPhone')) document.getElementById('shopPhone').value = savedSettings.shopPhone || '';
    }

    // সেটিংস বা ঠিকানা সেভ করার গ্লোবাল ফাংশন
    window.saveSettings = function() {
        const settings = {
            shopName: document.getElementById('shopName') ? document.getElementById('shopName').value : '',
            shopAddress: document.getElementById('shopAddress') ? document.getElementById('shopAddress').value : '',
            shopPhone: document.getElementById('shopPhone') ? document.getElementById('shopPhone').value : ''
        };
        localStorage.setItem('shopSettings', JSON.stringify(settings));
        alert('✅ সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!');
    };


    // ==========================================
    // ২. নতুন প্রোডাক্ট যোগ করার লজিক (অ্যাডমিন ফর্ম)
    // ==========================================
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const newProduct = {
                id: Date.now(),
                name: document.getElementById('p-name') ? document.getElementById('p-name').value : '',
                price: document.getElementById('p-price') ? document.getElementById('p-price').value : '',
                discount: document.getElementById('p-discount') ? document.getElementById('p-discount').value : '0',
                category: document.getElementById('p-category') ? document.getElementById('p-category').value : '',
                stock: document.getElementById('p-stock') ? document.getElementById('p-stock').value : '0'
            };

            let products = JSON.parse(localStorage.getItem('adminProducts')) || [];
            products.push(newProduct);
            localStorage.setItem('adminProducts', JSON.stringify(products));

            alert('✅ পণ্য সফলভাবে যোগ করা হয়েছে!');
            productForm.reset();
            
            // প্রোডাক্ট লিস্ট রিফ্রেশ করা
            loadProductList();
        });
    }


    // ==========================================
    // ৩. প্রোডাক্ট লিস্ট বা কাস্টমার পেজে পণ্য দেখানোর লজিক
    // ==========================================
    function loadProductList() {
        const productList = document.getElementById('product-list');
        if (productList) {
            const products = JSON.parse(localStorage.getItem('adminProducts')) || [];
            productList.innerHTML = '';

            if (products.length === 0) {
                productList.innerHTML = '<p>কোনো পণ্য পাওয়া যায়নি।</p>';
                return;
            }

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>মূল্য: ৳${product.price}</p>
                    <p>ছাড়: ${product.discount}%</p>
                    <p>ক্যাটাগরি: ${product.category}</p>
                    <p>স্টক: ${product.stock} পিস</p>
                `;
                productList.appendChild(card);
            });
        }
    }

    // পেজ লোড হওয়ার সাথে সাথে প্রোডাক্ট লিস্ট রান করা
    loadProductList();

});
