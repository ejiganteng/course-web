<center>
<h1>📘 Dokumentasi Penggunaan API</h1>
</center>

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

### Login User

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

### Logout User

-   **URL:** `/api/logout`
-   **Method:** `POST`
-   **Headers:** `Content-Type: application/json`

```
Authorization: Bearer 3|CzRYrT6jAifE3QTjvzJypAkbwNPmqxnAzThDXcK5699b86b4
```

#### Request Body:

Kosong atau `null`

#### Response:

```json
{
    "message": "Berhasil logout"
}
```

---
