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
