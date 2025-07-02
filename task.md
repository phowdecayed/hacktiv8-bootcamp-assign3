Anda diminta untuk melakukan input data product dari section form ‘Product Information’ dan menampilkan data yang sudah di-input ke section sebelah kanan yang disediakan

Adapun data berdasar type, form element dan attr:
Product Name (text, input field, required)
Stock Status (text, select, required)
a. Opsi: In stock atau Out of stock

Price (number, input field, required) 
Description (text, text area, required) 
Quantity (number, input field, required)
Color (text, input field, required)
Material (text, input field, required)
Brand (text, input field, required)

Status required menandakan kolom input wajib diisi

Dalam function saveForm().Ketika  form  disave,  maka  data akan terdisplay  ke  section product sebelah details di kanan.

Status stock yang diinput akan mempengaruhi warna text yang di-display

Dalam template html yang disediakan gambar product Posisikan gambar product ke tengah dengan mengubah css class product-image (external css bernama style.css disediakan)

Form harus memiliki validasi real-time, sehingga:
●Semua input yang bersifat required tidak bisa dikosongkan sebelum submit.
●Jika input tidak valid, tampilkan error message secara dinamis di bawah input.Form hanya bisa dikirim jika semua input valid.

Stock Status Handling with DOM Manipulation 
Jika Stock Status = "Out of Stock", maka:
●Input Quantity akan otomatis nonaktif (disabled).
Jika Stock Status = "In Stock", maka:
●Input Quantity kembali aktif dan bisa diisi oleh user.Perubahan ini harus terjadi tanpa reload halaman menggunakan JavaScript.

Setelah user menambahkan produk, lakukan request ke JSONPlaceholder API(https://jsonplaceholder.typicode.com/posts) untuk mendapatkan data tambahan.
Data produk yang diinput user harus dikombinasikan dengan data dari API dan ditampilkan dalam daftar produk.-Gunakan Fetch API dengan Async/Await, serta lakukan error handling jika request gagal.

Delete Product:
○Setiap produk yang ditampilkan harus memiliki tombol Delete.
○Ketika tombol ditekan, produk harus dihapus dari tampilan dan localStorage.
-Edit Product:○Setiap produk harus memiliki tombol Edit.
○Ketika tombol ditekan, data produk dapat diubah melalui form dan diperbarui di tampilan.
-Semua perubahan harus bersifat real-time tanpa refresh halaman.

