// Element references
const productForm = document.getElementById('productForm');
const productNameInput = document.getElementById('productName');
const stockStatusInput = document.getElementById('stockStatus');
const priceInput = document.getElementById('price');
const descriptionInput = document.getElementById('description');
const quantityInput = document.getElementById('quantity');
const colorInput = document.getElementById('color');
const materialInput = document.getElementById('material');
const brandInput = document.getElementById('brand');
const saveButton = document.getElementById('saveButton');
const productDetails = document.getElementById('productDetails');
const productsList = document.getElementById('productsList');

// Error message elements
const productNameError = document.getElementById('productNameError');
const stockStatusError = document.getElementById('stockStatusError');
const priceError = document.getElementById('priceError');
const descriptionError = document.getElementById('descriptionError');
const quantityError = document.getElementById('quantityError');
const colorError = document.getElementById('colorError');
const materialError = document.getElementById('materialError');
const brandError = document.getElementById('brandError');

// Global variables
let products = [];
let editingProductId = null;
let currentProductId = 1;

// Check if products exist in localStorage and load them
function loadProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        
        // Find the highest ID to continue from there
        if (products.length > 0) {
            const maxId = Math.max(...products.map(p => p.id));
            currentProductId = maxId + 1;
        }
        
        displayAllProducts();
    }
}

// Initialize the app
function init() {
    migrateLocalStorageData();
    loadProductsFromLocalStorage();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Real-time validation
    productNameInput.addEventListener('input', validateProductName);
    stockStatusInput.addEventListener('change', handleStockStatusChange);
    priceInput.addEventListener('input', validatePrice);
    descriptionInput.addEventListener('input', validateDescription);
    quantityInput.addEventListener('input', validateQuantity);
    colorInput.addEventListener('input', validateColor);
    materialInput.addEventListener('input', validateMaterial);
    brandInput.addEventListener('input', validateBrand);
    
    // Save button
    saveButton.addEventListener('click', handleSaveProduct);
}

// Handle stock status change
function handleStockStatusChange() {
    validateStockStatus();
    
    // Disable quantity input if out of stock
    if (stockStatusInput.value === 'Out of Stock') {
        quantityInput.disabled = true;
        quantityInput.value = 0;
    } else {
        quantityInput.disabled = false;
    }
}

// Validation functions
function validateProductName() {
    if (!productNameInput.value.trim()) {
        productNameError.textContent = 'Nama produk harus diisi';
        return false;
    }
    productNameError.textContent = '';
    return true;
}

function validateStockStatus() {
    if (!stockStatusInput.value) {
        stockStatusError.textContent = 'Status stok harus dipilih';
        return false;
    }
    stockStatusError.textContent = '';
    return true;
}

function validatePrice() {
    const price = parseFloat(priceInput.value);
    if (isNaN(price) || price <= 0) {
        priceError.textContent = 'Harga harus berupa angka positif';
        return false;
    }
    priceError.textContent = '';
    return true;
}

function validateDescription() {
    if (!descriptionInput.value.trim()) {
        descriptionError.textContent = 'Deskripsi harus diisi';
        return false;
    }
    descriptionError.textContent = '';
    return true;
}

function validateQuantity() {
    if (stockStatusInput.value === 'In Stock') {
        const quantity = parseInt(quantityInput.value);
        if (isNaN(quantity) || quantity <= 0) {
            quantityError.textContent = 'Jumlah harus berupa angka positif';
            return false;
        }
    }
    quantityError.textContent = '';
    return true;
}

function validateColor() {
    if (!colorInput.value.trim()) {
        colorError.textContent = 'Warna harus diisi';
        return false;
    }
    colorError.textContent = '';
    return true;
}

function validateMaterial() {
    if (!materialInput.value.trim()) {
        materialError.textContent = 'Bahan harus diisi';
        return false;
    }
    materialError.textContent = '';
    return true;
}

function validateBrand() {
    if (!brandInput.value.trim()) {
        brandError.textContent = 'Merek harus diisi';
        return false;
    }
    brandError.textContent = '';
    return true;
}

// Validate all fields
function validateAllFields() {
    const isNameValid = validateProductName();
    const isStockValid = validateStockStatus();
    const isPriceValid = validatePrice();
    const isDescriptionValid = validateDescription();
    const isQuantityValid = validateQuantity();
    const isColorValid = validateColor();
    const isMaterialValid = validateMaterial();
    const isBrandValid = validateBrand();
    
    return isNameValid && isStockValid && isPriceValid && 
           isDescriptionValid && isQuantityValid && 
           isColorValid && isMaterialValid && isBrandValid;
}

// Handle save product button click
async function handleSaveProduct() {
    // Validate all fields first
    if (!validateAllFields()) {
        return;
    }
    
    // Create product object
    const product = {
        id: editingProductId || currentProductId++,
        name: productNameInput.value.trim(),
        stockStatus: stockStatusInput.value,
        price: parseFloat(priceInput.value),
        description: descriptionInput.value.trim(),
        quantity: parseInt(quantityInput.value) || 0,
        color: colorInput.value.trim(),
        material: materialInput.value.trim(),
        brand: brandInput.value.trim(),
        image: 'https://placehold.co/300'
    };
    
    try {
        // Tampilkan loading indicator
        productDetails.innerHTML = '<div class="loading"></div>';
        
        // Make API request to get additional data
        const additionalData = await fetchAdditionalData(product);
        
        // Combine product data with API data
        const combinedProduct = {
            ...product,
            additionalInfo: additionalData,
            lastUpdated: new Date().toISOString()
        };
        
        // Add or update product in the products array
        if (editingProductId) {
            const index = products.findIndex(p => p.id === editingProductId);
            products[index] = combinedProduct;
            editingProductId = null;
        } else {
            products.push(combinedProduct);
        }
        
        // Save to localStorage
        saveProductsToLocalStorage();
        
        // Display the product
        displayProductDetails(combinedProduct);
        displayAllProducts();
        
        // Reset the form
        resetForm();
        
    } catch (error) {
        console.error('Error saving product:', error);
        alert(`Terjadi kesalahan saat menyimpan produk: ${error.message}. Silakan coba lagi.`);
    }
}

// Fetch additional data from JSONPlaceholder API
async function fetchAdditionalData(product) {
    try {
        // Tampilkan pesan loading
        productDetails.innerHTML = '<div class="loading"></div>';
        productsList.innerHTML = '<div class="loading"></div>';
        
        let apiData;
        let apiMethod;
        
        // Pilih metode pengambilan data secara acak
        const fetchMethod = Math.floor(Math.random() * 4); // 0-3
        
        switch (fetchMethod) {
            case 0: // GET post dengan ID acak
                const randomId = Math.floor(Math.random() * 100) + 1;
                const response1 = await fetch(`https://jsonplaceholder.typicode.com/posts/${randomId}`);
                
                if (!response1.ok) throw new Error(`API Error: ${response1.status}`);
                
                apiData = await response1.json();
                apiMethod = `GET single post (ID: ${randomId})`;
                break;
                
            case 1: // GET komentar untuk post acak
                const postId = Math.floor(Math.random() * 100) + 1;
                const response2 = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
                
                if (!response2.ok) throw new Error(`API Error: ${response2.status}`);
                
                const comments = await response2.json();
                if (comments.length === 0) throw new Error('No comments found');
                
                // Ambil komentar pertama
                apiData = comments[0];
                // Ubah nama field agar sesuai dengan yang diharapkan
                apiData.title = apiData.name;
                apiData.body = apiData.body || apiData.email;
                apiMethod = `GET comment for post ${postId}`;
                break;
                
            case 2: // POST data produk
                const response3 = await fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    body: JSON.stringify({
                        title: product.name,
                        body: product.description,
                        userId: 1
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                });
                
                if (!response3.ok) throw new Error(`API Error: ${response3.status}`);
                
                apiData = await response3.json();
                apiMethod = 'POST new data';
                break;
                
            case 3: // GET user data
                const userId = Math.floor(Math.random() * 10) + 1;
                const response4 = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
                
                if (!response4.ok) throw new Error(`API Error: ${response4.status}`);
                
                const userData = await response4.json();
                apiData = {
                    id: userData.id,
                    userId: userData.id,
                    title: userData.name,
                    body: `${userData.email}\n${userData.phone}\n${userData.website}\n${userData.company.catchPhrase}`
                };
                apiMethod = `GET user data (ID: ${userId})`;
                break;
        }
        
        // Pastikan body adalah string
        if (apiData.body && typeof apiData.body === 'string') {
            // Perbaikan: Tangani escape karakter dalam body text
            apiData.body = apiData.body.replace(/\\n/g, '\n');
        } else {
            apiData.body = 'Tidak tersedia';
        }
        
        console.log(`Fetched API data using method: ${apiMethod}`, apiData);
        
        // Kembalikan data API dengan status sukses
        return {
            id: apiData.id,
            title: apiData.title || 'Tidak tersedia',
            body: apiData.body || 'Tidak tersedia',
            userId: apiData.userId,
            method: apiMethod,
            apiSuccess: true
        };
    } catch (error) {
        console.error('Error fetching additional data:', error);
        // Tampilkan pesan error ke pengguna
        alert(`Gagal mendapatkan data tambahan dari API: ${error.message}`);
        return { 
            error: 'Gagal mendapatkan data tambahan',
            errorMessage: error.message,
            apiSuccess: false
        };
    }
}

// Display product details in the right section
function displayProductDetails(product) {
    const stockStatusClass = product.stockStatus === 'In Stock' ? 'in-stock' : 'out-of-stock';
    const apiData = product.additionalInfo;
    
    // Tampilkan informasi API dengan lebih detail
    let apiInfoHtml = '';
    if (apiData && apiData.apiSuccess) {
        // Format body text dengan mengganti newline dengan <br>
        const bodyText = apiData.body || '';
        const formattedBody = typeof bodyText === 'string' 
            ? bodyText.replace(/\n/g, '<br>')
            : 'Tidak tersedia';
        
        apiInfoHtml = `
            <div class="mt-4">
                <h5>Informasi Tambahan dari API:</h5>
                        <div class="mb-3">
                            <strong>Title:</strong>
                            <div class="p-2 bg-light rounded mb-2">
                                ${apiData.title || 'Tidak tersedia'}
                            </div>
                        </div>
                        <div class="mb-3">
                            <strong>Description:</strong>
                            <div class="p-2 bg-light rounded mb-2">
                                ${apiData.body || 'Tidak tersedia'}
                            </div>
                        </div>
            </div>
        `;
    } else {
        apiInfoHtml = `
            <div class="mt-4">
                <h5>Informasi API:</h5>
                <div class="alert alert-danger">
                    ${apiData?.errorMessage || 'Gagal mendapatkan data dari API'}
                </div>
            </div>
        `;
    }
    
    productDetails.innerHTML = `
        <div class="product-detail-header" data-id="${product.id}">
            <h3>${product.name}</h3>
        </div>
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" class="product-image">
        </div>
        <div class="row">
            <div class="col-md-6">
                <p><strong>Status Stok:</strong> <span class="${stockStatusClass}">${product.stockStatus}</span></p>
                <p><strong>Harga:</strong> Rp${product.price.toLocaleString('id-ID')}</p>
                <p><strong>Jumlah:</strong> ${product.quantity}</p>
                <p><strong>Warna:</strong> ${product.color}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Bahan:</strong> ${product.material}</p>
                <p><strong>Merek:</strong> ${product.brand}</p>
            </div>
        </div>
        <div class="mt-3">
            <h5>Deskripsi:</h5>
            <p>${product.description}</p>
        </div>
        ${apiInfoHtml}
    `;
}

// Display all products in the list
function displayAllProducts() {
    if (products.length === 0) {
        productsList.innerHTML = '<p class="text-muted">Belum ada produk yang ditambahkan</p>';
        return;
    }
    
    let html = '';
    products.forEach(product => {
        const stockStatusClass = product.stockStatus === 'In Stock' ? 'in-stock' : 'out-of-stock';
        const apiData = product.additionalInfo;
        
        // Tampilkan status API untuk setiap produk
        let apiStatusHtml = '';
        if (apiData && apiData.apiSuccess) {
            // Format body dengan memotong text dan mengganti newline dengan spasi
            const bodyText = apiData.body || '';
            const formattedBody = typeof bodyText === 'string' 
                ? bodyText.replace(/\n/g, ' ').substring(0, 70) + (bodyText.length > 70 ? '...' : '')
                : 'Tidak tersedia';
            
            apiStatusHtml = `
                <div class="mt-2 api-info">
                    <p class="mb-1"><small><strong>Title:</strong> ${apiData.title || 'Tidak tersedia'}</small></p>
                    <p class="mb-1"><small><strong>Description:</strong> ${apiData.body || 'Tidak tersedia'}</small></p>
                </div>
            `;
        } else {
            apiStatusHtml = `
                <div class="mt-2 api-error">
                    <p class="mb-1 text-danger"><small>API Error: ${apiData?.errorMessage || 'Tidak dapat mengambil data API'}</small></p>
                </div>
            `;
        }
        
        html += `
            <div class="list-group-item product-card" data-id="${product.id}">
                <div class="product-header">
                    <h5>${product.name}</h5>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-warning edit-product" data-id="${product.id}">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}">
                            Hapus
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <img src="${product.image}" alt="${product.name}" class="img-fluid rounded mb-2" style="max-height: 100px;">
                    </div>
                    <div class="col-md-8">
                        <p><strong>Status:</strong> <span class="${stockStatusClass}">${product.stockStatus}</span></p>
                        <p><strong>Harga:</strong> Rp${product.price.toLocaleString('id-ID')}</p>
                        <p><strong>Deskripsi:</strong> ${product.description}</p>
                        <p><strong>Jumlah:</strong> ${product.quantity}</p>
                        <p><strong>Merek:</strong> ${product.brand}</p>
                    </div>
                </div>
                ${apiStatusHtml}
            </div>
        `;
    });
    
    productsList.innerHTML = html;
    
    // Add event listeners to the edit and delete buttons
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', handleEditProduct);
    });
    
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', handleDeleteProduct);
    });
}

// Handle edit product button click
function handleEditProduct(event) {
    const productId = parseInt(event.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Fill the form with product data
        productNameInput.value = product.name;
        stockStatusInput.value = product.stockStatus;
        priceInput.value = product.price;
        descriptionInput.value = product.description;
        quantityInput.value = product.quantity;
        colorInput.value = product.color;
        materialInput.value = product.material;
        brandInput.value = product.brand;
        
        // Handle quantity field based on stock status
        if (product.stockStatus === 'Out of Stock') {
            quantityInput.disabled = true;
        } else {
            quantityInput.disabled = false;
        }
        
        // Set editing product ID
        editingProductId = productId;
        
        // Change button text
        saveButton.textContent = 'Perbarui Produk';
        
        // Display product details in the right section
        displayProductDetails(product);
        
        // Scroll to top of form
        productForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle delete product button click
function handleDeleteProduct(event) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        const productId = parseInt(event.target.dataset.id);
        
        // Remove product from array
        products = products.filter(p => p.id !== productId);
        
        // Save to localStorage
        saveProductsToLocalStorage();
        
        // Update display
        displayAllProducts();
        
        // If the displayed product is being deleted, reset the product details
        if (editingProductId === productId) {
            resetForm();
        }
        
        // Reset product details if it's the currently shown product
        const currentDetailProductId = parseInt(productDetails.querySelector('.product-detail-header')?.dataset?.id);
        if (currentDetailProductId === productId) {
            productDetails.innerHTML = `
                <div class="text-center">
                    <div class="product-image-container">
                        <img src="https://placehold.co/400" alt="Product Image" class="product-image">
                    </div>
                    <p class="text-muted">Belum ada produk yang ditambahkan</p>
                </div>
            `;
        }
    }
}

// Reset the form
function resetForm() {
    productForm.reset();
    editingProductId = null;
    saveButton.textContent = 'Simpan Produk';
    quantityInput.disabled = false;
    
    // Clear error messages
    productNameError.textContent = '';
    stockStatusError.textContent = '';
    priceError.textContent = '';
    descriptionError.textContent = '';
    quantityError.textContent = '';
    colorError.textContent = '';
    materialError.textContent = '';
    brandError.textContent = '';
}

// Save products to localStorage
function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Tambahkan fungsi migrasi untuk memperbaiki data yang sudah tersimpan di localStorage
function migrateLocalStorageData() {
    const storedProducts = localStorage.getItem('products');
    
    if (storedProducts) {
        try {
            const parsedProducts = JSON.parse(storedProducts);
            
            // Periksa dan perbaiki setiap produk
            parsedProducts.forEach(product => {
                // Pastikan additionalInfo ada
                if (!product.additionalInfo) {
                    product.additionalInfo = {
                        apiSuccess: false,
                        errorMessage: 'Data API tidak tersedia (format lama)'
                    };
                }
                
                // Pastikan lastUpdated ada
                if (!product.lastUpdated) {
                    product.lastUpdated = new Date().toISOString();
                }
            });
            
            // Simpan kembali data yang sudah diperbaiki
            localStorage.setItem('products', JSON.stringify(parsedProducts));
            
        } catch (error) {
            console.error('Error migrating localStorage data:', error);
            // Jika terjadi error, hapus data untuk mencegah error berulang
            localStorage.removeItem('products');
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 