<center>
<h1>📘 Dokumentasi Penggunaan API</h1>
</center>

> **Base URL:** `http://localhost:3000/api`

---

## 🔐 Auth API

### ✅ Register User

-   **URL:** `/api/register`
-   **Method:** `POST`
-   **Headers:** `Content-Type: application/json`

#### Request Body:

```json
{
    "name": "nama",
    "email": "nama@example.test",
    "password": "iniPasswordAman"
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
        "created_at": "2025-05-13T15:19:54.000000Z",
        "updated_at": "2025-05-13T15:19:54.000000Z"
    }
}
```

---

### ✅ Login User

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
        "token": "2|VZFMJ3R0UEWb7y46FvwjL1htn7dD88lWFhmp7UXm827a22af"
    }
}
```

---

### ✅ Logout User

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
    "message": "Berhasil logout"
}
```

---

## 👤 User API

> Semua endpoint User membutuhkan token (login dulu), dan gunakan header:

```
Authorization: Bearer {token}
Content-Type: application/json
```

---

### 📄 Ambil Semua User

-   **URL:** `/api/users`
-   **Method:** `GET`

#### Response:

```json
{
    "message": "Data users berhasil diambil",
    "data": [
        {
            "id": 1,
            "name": "nama",
            "email": "nama@example.test",
            "role": "user",
            "created_at": "...",
            "updated_at": "..."
        },
        ...
    ]
}
```

---

### ➕ Tambah User

-   **URL:** `/api/users`
-   **Method:** `POST`

#### Request Body:

```json
{
    "name": "User Baru",
    "email": "baru@example.com",
    "password": "password123",
    "role": "admin"
}
```

#### Response:

```json
{
    "message": "User berhasil dibuat",
    "data": {
        "id": 2,
        "name": "User Baru",
        "email": "baru@example.com",
        "role": "admin",
        "created_at": "...",
        "updated_at": "..."
    }
}
```

---

### 🔍 Lihat Detail User

-   **URL:** `/api/users/{id}`
-   **Method:** `GET`

#### Response:

```json
{
    "message": "Detail user ditemukan",
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

### 📝 Update User

-   **URL:** `/api/users/{id}`
-   **Method:** `PUT`

#### Request Body:

```json
{
    "name": "Nama Baru",
    "email": "baru@example.com",
    "password": "passwordBaru123",
    "role": "instruktur"
}
```

#### Response:

```json
{
    "message": "User berhasil diperbarui",
    "data": {
        "id": 1,
        "name": "Nama Baru",
        "email": "baru@example.com",
        "role": "instruktur",
        "created_at": "...",
        "updated_at": "..."
    }
}
```

---

### ❌ Hapus User

-   **URL:** `/api/users/{id}`
-   **Method:** `DELETE`

#### Response:

```json
{
    "message": "User berhasil dihapus"
}
```

---
