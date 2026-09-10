// ১. ফুটারের ঠিকানা পরিবর্তন করার কোড
window.addEventListener("DOMContentLoaded", () => {
    const addressElement = document.getElementById("shop-address");
    if (addressElement) {
        addressElement.innerText = "ঠিকানা: আপনার নতুন ঠিকানা, বাংলাদেশ";
    }
});

// ২. অ্যাডমিন প্যানেল থেকে আইটেম সেভ করে হোম পেজে দেখানোর কোড
document.addEventListener("DOMContentLoaded", () => {
    // অ্যাডমিন পেজের ফর্ম সাবমিট হ্যান্ডেল করা
    const productForm = document.getElementById("product-form");
    if (productForm) {
        productForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const newProduct = {
                name: document.getElementById("p-name").value,
                price: document.getElementById("p-price").value,
                discount: document.getElementById("p-discount").value,
                category: document.getElementById("p-category").value,
                stock: document.getElementById("p-stock").value
            };

            let products = JSON.parse(localStorage.getItem("adminProducts")) || [];
            products.push(newProduct);
            localStorage.setItem("adminProducts", JSON.stringify(products));

            alert("পণ্য সফলভাবে যোগ করা হয়েছে!");
            productForm.reset();
        });
    }

    // হোম পেজে পণ্যগুলো লোড করে দেখানো
    const productList = document.getElementById("product-list");
    if (productList) {
        let products = JSON.parse(localStorage.getItem("adminProducts")) || [];
        
        if (products.length > 0) {
            productList.innerHTML = "";
            products.forEach(product => {
                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>মূল্য: ৳${product.price}</p>
                    <p>ডিসকাউন্ট: ${product.discount}%</p>
                    <p>ক্যাটাগরি: ${product.category}</p>
                    <p>স্টক: ${product.stock} পিস</p>
                `;
                productList.appendChild(card);
            });
        }
    }
});
