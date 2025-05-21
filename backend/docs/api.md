# 📘 Dokumentasi Penggunaan API (Update)

> **Base URL:** `http://localhost:3000/api`

---

## Auth API

### Register User

-   **URL:** `/api/register`
-   **Method:** `POST`
-   **Headers:** `Content-Type: application/json`

#### Request Body:

```json
{
    "name": "nama",
    "email": "nama@example.test",
    "password": "iniPasswordAman",
    "role": "admin" // optional, default: user
}
```

#### Response:

```json
{
    "message": "Register berhasil",
    "data": {
        "id": 1,
        "name": "nama",
        "email": "nama@example.test",
        "role": "user",
        "created_at": "...",
        "updated_at": "..."
    }
}
```

---

### Login User (dengan role)

-   **URL:** `/api/login`
-   **Method:** `POST`
-   **Headers:** `Content-Type: application/json`

#### Request Body:

```json
{
    "email": "nama@example.test",
    "password": "iniPasswordAman"
}
```

#### Response:

```json
{
    "message": "Berhasil login",
    "data": {
        "user_id": 1,
        "name": "nama",
        "email": "nama@example.test",
        "role": "admin",
        "token": "2|VZFMJ3R0UEWb7y46FvwjL1htn7dD88lWFhmp7UXm827a22af"
    }
}
```

---

### Logout User

-   **URL:** `/api/logout`
-   **Method:** `POST`
-   **Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body:

Kosong

#### Response:

```json
{
    "message": "Logout berhasil",
    "data": null
}
```

---

## Category API

> Semua endpoint `Category` memerlukan login dan role **admin**.

### Ambil Semua Category

-   **URL:** `/api/categories`
-   **Method:** `GET`
-   **Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Response:

```json
{
    "message": "Data categories berhasil diambil",
    "data": [
        {
            "id": 1,
            "name": "Kategori A",
            "created_at": "...",
            "updated_at": "..."
        },
        ...
    ]
}
```

---

### Tambah Category

-   **URL:** `/api/categories`
-   **Method:** `POST`

#### Request Body:

```json
{
    "name": "Kategori Baru"
}
```

#### Response:

> Success: 201 created

```json
{
    "message": "Category berhasil dibuat",
    "data": {
        "id": 2,
        "name": "Kategori Baru",
        "created_at": "...",
        "updated_at": "..."
    }
}
```

### Response:

> Error: 422 Unprocessable Entity
> Jika data duplikat

```json
{
    "success": false,
    "message": "Validasi gagal",
    "errors": {
        "name": ["Nama kategori sudah terdaftar."]
    }
}
```

---

### Lihat Detail Category

-   **URL:** `/api/categories/{id}`
-   **Method:** `GET`

#### Response:

```json
{
    "message": "Detail category ditemukan",
    "data": {
        "id": 1,
        "name": "Kategori A",
        "created_at": "...",
        "updated_at": "..."
    }
}
```

---

### Update Category

-   **URL:** `/api/categories/{id}`
-   **Method:** `PUT`

#### Request Body:

```json
{
    "name": "Kategori Update"
}
```

#### Response:

```json
{
    "message": "Category berhasil diperbarui",
    "data": {
        "id": 1,
        "name": "Kategori Update",
        "created_at": "...",
        "updated_at": "..."
    }
}
```

---

### Hapus Category

-   **URL:** `/api/categories/{id}`
-   **Method:** `DELETE`

#### Response:

```json
{
    "message": "Category berhasil dihapus"
}
```

---

## Course API

> Semua endpoint Course memerlukan login. Beberapa endpoint hanya untuk instruktur.

### Ambil Semua Course

-   **URL:** `/api/courses`
-   **Method:** `GET`
-   **Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Query Parameter (opsional):

-   `published=true` → hanya ambil yang sudah dipublish
-   `published=false` → hanya ambil yang belum dipublish

#### Response:

```json
{
    "message": "Daftar kursus",
    "data": [
        {
            "id": 1,
            "instructor_id": 2,
            "title": "Belajar Vue.js",
            "description": "Panduan lengkap Vue",
            "price": "149.99",
            "thumbnail": "url_gambar.jpg",
            "is_published": true,
            "created_at": "...",
            "updated_at": "...",
            "instructor": {
                "id": 2,
                "name": "Instruktur A",
                "email": "a@example.com"
            }
        }
    ]
}
```

---

### Tambah Course

-   **URL:** `/api/courses`
-   **Method:** `POST`
-   **Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body:

```json
{
    "title": "Laravel Dasar",
    "description": "Belajar Laravel dari nol",
    "price": 99.99,
    "thumbnail": "https://image.url",
    "is_published": true
}
```

#### Response:

Status: 201 Created

```json
{
    "message": "Kursus berhasil dibuat",
    "data": {
        "id": 3,
        "instructor_id": 2,
        "title": "Laravel Dasar",
        "description": "Belajar Laravel dari nol",
        "price": "99.99",
        "thumbnail": "https://image.url",
        "is_published": true,
        "created_at": "...",
        "updated_at": "..."
    }
}
```

---

### Lihat Detail Course Beserta PDF

-   **URL:** `/api/courses/{id}`
-   **Method:** `GET`
-   **Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Response:

```json
{
    "message": "Detail kursus",
    "data": {
        "id": 1,
        "instructor_id": 3,
        "title": "testing",
        "description": "testing deskripsi",
        "price": "1000.00",
        "thumbnail": "Ini thumbnail",
        "is_published": 1,
        "created_at": "2025-05-21T09:36:40.000000Z",
        "updated_at": "2025-05-21T09:36:40.000000Z",
        "instructor": {
            "id": 3,
            "name": "instruktur",
            "email": "instruktur@example.test",
            "email_verified_at": null,
            "created_at": "2025-05-21T06:06:24.000000Z",
            "updated_at": "2025-05-21T06:06:24.000000Z",
            "role": "instruktur"
        },
        "categories": [
            {
                "id": 1,
                "name": "PHP",
                "created_at": "2025-05-21T06:30:07.000000Z",
                "updated_at": "2025-05-21T06:30:07.000000Z",
                "pivot": {
                    "course_id": 1,
                    "category_id": 1
                }
            },
            {
                "id": 2,
                "name": "Laravel",
                "created_at": "2025-05-21T06:30:11.000000Z",
                "updated_at": "2025-05-21T06:30:11.000000Z",
                "pivot": {
                    "course_id": 1,
                    "category_id": 2
                }
            }
        ],
        "pdfs": [
            {
                "id": 1,
                "course_id": 1,
                "title": "Test PDF",
                "file_path": "public/course_pdfs/1747831260-682dc9dc23901-TestPDF.pdf",
                "order_index": 1,
                "created_at": "2025-05-21T12:41:00.000000Z",
                "updated_at": "2025-05-21T12:41:00.000000Z"
            }
        ]
    }
}
```

---

### Update Course

-   **URL:** `/api/courses/{id}`
-   **Method:** `PUT`
-   **Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body:

```json
{
    "title": "Laravel Lanjut",
    "description": "Level lanjut Laravel",
    "price": 199.99,
    "thumbnail": "https://image.url",
    "is_published": false
}
```

#### Response:

```json
{
    "message": "Kursus berhasil diperbarui",
    "data": {
        "id": 3,
        "title": "Laravel Lanjut",
        "description": "Level lanjut Laravel",
        "price": "199.99",
        "thumbnail": "https://image.url",
        "is_published": false,
        "created_at": "...",
        "updated_at": "..."
    }
}
```

---

### Hapus Course

-   **URL:** `/api/courses/{id}`
-   **Method:** `DELETE`
-   **Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Response:

```json
{
    "message": "Kursus berhasil dihapus"
}
```

## PDF

## Upload PDF

-   **URL:** `/api/courses/{id}/upload`
-   **Method:** `POST`
-   **Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body:

```json
{
  "pdfs": [
    {
      "title": "Modul 1",
      "order_index": 1,
      "file": [PDF file]
    },
    {
      "title": "Modul 2",
      "order_index": 2,
      "file": [PDF file]
    }
  ]
}
```

#### Response:

Status: 201 Created

```json
{
    "message": "PDF berhasil ditambahkan ke course",
    "pdfs": [
        {
            "id": 1,
            "title": "PDF 1",
            "url": "http://localhost:8000/storage/course_pdfs/1747831260-682dc9dc23901-PDF1.pdf",
            "order_index": "1"
        },
        {
            "id": 2,
            "title": "PDF 2",
            "url": "http://localhost:8000/storage/course_pdfs/1747831260-682dc9dc35d38-PDF2.pdf",
            "order_index": "2"
        }
    ]
}
```

## Download PDF

-   **URL:** `/api/pdfs/{id}/download`
-   **Method:** `GET`
-   **Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Response:

Status: 200 OK

## Upload PDF

-   **URL:** `/api/courses/{id}/update`
-   **Method:** `PUT`
-   **Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Request Body:

```json
{
  "pdfs": [
    {
      "title": "Modul 1",
      "order_index": 1,
      "file": [PDF file]
    }
  ]
}
```

#### Response:

Status: 200 OK

```json
{
    "message": "PDF berhasil diperbarui",
    "pdf": {
        "id": 1,
        "title": "Judul Baru Lagi",
        "url": "http://localhost:8000/storage/course_pdfs/1747862101-682e425595d33-newPDF.pdf",
        "order_index": "1"
    }
}
```
