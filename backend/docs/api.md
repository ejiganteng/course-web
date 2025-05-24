# API Documentation

**Base URL:** `http://localhost:3000/api`

## Authentication API

### Register User

-   **URL:** `/api/register`
-   **Method:** `POST`
-   **Headers:** `Content-Type: application/json`

#### Request Body:

```json
{
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "string" // optional, default: "user"
}
```

#### Response (Success - 201 Created):

```json
{
    "message": "Register berhasil",
    "data": {
        "id": integer,
        "name": "string",
        "email": "string",
        "role": "string",
        "created_at": "string",
        "updated_at": "string"
    }
}
```

### Login User

-   **URL:** `/api/login`
-   **Method:** `POST`
-   **Headers:** `Content-Type: application/json`

#### Request Body:

```json
{
    "email": "string",
    "password": "string"
}
```

#### Response (Success - 200 OK):

```json
{
    "message": "Berhasil login",
    "data": {
        "user_id": integer,
        "name": "string",
        "email": "string",
        "role": "string",
        "token": "string"
    }
}
```

### Logout User

-   **URL:** `/api/logout`
-   **Method:** `POST`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Request Body:

Empty

#### Response (Success - 200 OK):

```json
{
    "message": "Logout berhasil",
    "data": null
}
```

## Category API

_All endpoints require authentication and `admin` role._

### Get All Categories

-   **URL:** `/api/categories`
-   **Method:** `GET`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Response (Success - 200 OK):

```json
{
    "message": "Data categories berhasil diambil",
    "data": [
        {
            "id": integer,
            "name": "string",
            "created_at": "string",
            "updated_at": "string"
        }
    ]
}
```

### Create Category

-   **URL:** `/api/categories`
-   **Method:** `POST`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Request Body:

```json
{
    "name": "string"
}
```

#### Response (Success - 201 Created):

```json
{
    "message": "Category berhasil dibuat",
    "data": {
        "id": integer,
        "name": "string",
        "created_at": "string",
        "updated_at": "string"
    }
}
```

#### Response (Error - 422 Unprocessable Entity):

```json
{
    "success": false,
    "message": "Validasi gagal",
    "errors": {
        "name": ["Nama kategori sudah terdaftar."]
    }
}
```

### Get Category Details

-   **URL:** `/api/categories/{id}`
-   **Method:** `GET`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Response (Success - 200 OK):

```json
{
    "message": "Detail category ditemukan",
    "data": {
        "id": integer,
        "name": "string",
        "created_at": "string",
        "updated_at": "string"
    }
}
```

### Update Category

-   **URL:** `/api/categories/{id}`
-   **Method:** `PUT`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Request Body:

```json
{
    "name": "string"
}
```

#### Response (Success - 200 OK):

```json
{
    "message": "Category berhasil diperbarui",
    "data": {
        "id": integer,
        "name": "string",
        "created_at": "string",
        "updated_at": "string"
    }
}
```

### Delete Category

-   **URL:** `/api/categories/{id}`
-   **Method:** `DELETE`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Response (Success - 200 OK):

```json
{
    "message": "Category berhasil dihapus"
}
```

## Course API

_All endpoints require authentication. Some endpoints are restricted to instructors._

### Get All Courses

-   **URL:** `/api/courses`
-   **Method:** `GET`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Query Parameters (Optional):

-   `published=true`: Retrieve only published courses.
-   `published=false`: Retrieve only unpublished courses.

#### Response (Success - 200 OK):

```json
{
    "message": "Daftar kursus",
    "data": [
        {
            "id": integer,
            "instructor_id": integer,
            "title": "string",
            "description": "string",
            "price": "string",
            "thumbnail": "string",
            "is_published": boolean,
            "created_at": "string",
            "updated_at": "string",
            "instructor": {
                "id": integer,
                "name": "string",
                "email": "string"
            }
        }
    ]
}
```

### Get Course By Owner

-   **URL:** `/api/courses/owner`
-   **Method:** `GET`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Response (Success - 200 OK):

```json
{
    "message": "Kursus berdasarkan ID instruktur berhasil diambil.",
    "data": [
        {
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
                },
                {
                    "id": 3,
                    "name": "Testing",
                    "created_at": "2025-05-21T06:30:15.000000Z",
                    "updated_at": "2025-05-21T06:30:15.000000Z",
                    "pivot": {
                        "course_id": 1,
                        "category_id": 3
                    }
                }
            ],
            "pdfs": [
                {
                    "id": 1,
                    "course_id": 1,
                    "title": "Judul Baru Lagi",
                    "file_path": "public/course_pdfs/1747862101-682e425595d33-Test.pdf",
                    "order_index": 1,
                    "created_at": "2025-05-21T12:41:00.000000Z",
                    "updated_at": "2025-05-21T21:15:01.000000Z"
                }
            ]
        }
    ]
}
```

### Create Course

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
    "title": "string",
    "description": "string",
    "price": number,
    "thumbnail": "string",
    "is_published": boolean
}
```

#### Response (Success - 201 Created):

```json
{
    "message": "Kursus berhasil dibuat",
    "data": {
        "id": integer,
        "instructor_id": integer,
        "title": "string",
        "description": "string",
        "price": "string",
        "thumbnail": "string",
        "is_published": boolean,
        "created_at": "string",
        "updated_at": "string"
    }
}
```

### Get Course Details

-   **URL:** `/api/courses/{id}`
-   **Method:** `GET`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Response (Success - 200 OK):

```json
{
    "message": "Detail kursus",
    "data": {
        "id": integer,
        "instructor_id": integer,
        "title": "string",
        "description": "string",
        "price": "string",
        "thumbnail": "string",
        "is_published": boolean,
        "created_at": "string",
        "updated_at": "string",
        "instructor": {
            "id": integer,
            "name": "string",
            "email": "string",
            "role": "string",
            "created_at": "string",
            "updated_at": "string"
        },
        "categories": [
            {
                "id": integer,
                "name": "string",
                "created_at": "string",
                "updated_at": "string",
                "pivot": {
                    "course_id": integer,
                    "category_id": integer
                }
            }
        ],
        "pdfs": [
            {
                "id": integer,
                "course_id": integer,
                "title": "string",
                "file_path": "string",
                "order_index": integer,
                "created_at": "string",
                "updated_at": "string"
            }
        ]
    }
}
```

### Update Course

-   **URL:** `/api/courses/{id}`
-   **Method:** `POST`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Request Body:

```json
{
    "title": "string",
    "description": "string",
    "price": number,
    "thumbnail": "string",
    "is_published": boolean
}
```

#### Response (Success - 200 OK):

```json
{
    "message": "Kursus berhasil diperbarui",
    "data": {
        "id": integer,
        "title": "string",
        "description": "string",
        "price": "string",
        "thumbnail": file[images],
        "is_published": boolean,
        "created_at": "string",
        "updated_at": "string"
    }
}
```

### Delete Course

-   **URL:** `/api/courses/{id}`
-   **Method:** `DELETE`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Response (Success - 200 OK):

```json
{
    "message": "Kursus berhasil dihapus"
}
```

## PDF API

_All endpoints require authentication and are restricted to instructors._

### Upload PDF

-   **URL:** `/api/courses/{id}/upload`
-   **Method:** `POST`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: multipart/form-data
    ```

#### Request Body:

```json
{
    "pdfs": [
        {
            "title": "string",
            "order_index": integer,
            "file": "file"
        }
    ]
}
```

#### Response (Success - 201 Created):

```json
{
    "message": "PDF berhasil ditambahkan ke course",
    "pdfs": [
        {
            "id": integer,
            "title": "string",
            "url": "string",
            "order_index": integer
        }
    ]
}
```

### Update PDF

-   **URL:** `/api/courses/{id}/update`
-   **Method:** `PUT`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: multipart/form-data
    ```

#### Request Body:

```json
{
    "pdfs": [
        {
            "title": "string",
            "order_index": integer,
            "file": "file"
        }
    ]
}
```

#### Response (Success - 200 OK):

```json
{
    "message": "PDF berhasil diperbarui",
    "pdf": {
        "id": integer,
        "title": "string",
        "url": "string",
        "order_index": integer
    }
}
```

### Download PDF

-   **URL:** `/api/pdfs/{id}/download`
-   **Method:** `GET`
-   **Headers:**
    ```
    Authorization: Bearer {token}
    Content-Type: application/json
    ```

#### Response (Success - 200 OK):

Returns the PDF file as a downloadable resource.
