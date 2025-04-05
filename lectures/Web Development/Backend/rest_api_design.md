# REST API Design Principles

## Introduction to REST APIs

REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP requests to perform CRUD (Create, Read, Update, Delete) operations on resources, which are represented as URLs.

### Key Principles of REST

- **Client-Server Architecture**: Separation of concerns between client and server
- **Statelessness**: Each request from client to server must contain all information needed to understand and process the request
- **Cacheability**: Responses must define themselves as cacheable or non-cacheable
- **Layered System**: A client cannot tell whether it is connected directly to the end server or an intermediary
- **Uniform Interface**: A consistent, standardized way to communicate between client and server

## HTTP Methods in REST APIs

RESTful APIs use standard HTTP methods to perform operations on resources:

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve data | GET /users (get all users) |
| POST | Create data | POST /users (create a new user) |
| PUT | Update data (full update) | PUT /users/123 (update user 123) |
| PATCH | Update data (partial update) | PATCH /users/123 (update part of user 123) |
| DELETE | Remove data | DELETE /users/123 (delete user 123) |

## Resource Naming

Good resource naming is crucial for a clear and intuitive API:

- Use nouns, not verbs (e.g., `/users` not `/getUsers`)
- Use plural nouns for collections (e.g., `/users` not `/user`)
- Use hierarchical relationships (e.g., `/users/123/orders`)
- Use lowercase letters and hyphens for multi-word resources (e.g., `/user-profiles`)

## HTTP Status Codes

Proper use of HTTP status codes helps clients understand the result of their request:

```mermaid
graph TD
    A[HTTP Status Codes] --> B[2xx: Success]
    A --> C[3xx: Redirection]
    A --> D[4xx: Client Error]
    A --> E[5xx: Server Error]
    
    B --> B1[200: OK]
    B --> B2[201: Created]
    B --> B3[204: No Content]
    
    C --> C1[301: Moved Permanently]
    C --> C2[304: Not Modified]
    
    D --> D1[400: Bad Request]
    D --> D2[401: Unauthorized]
    D --> D3[403: Forbidden]
    D --> D4[404: Not Found]
    D --> D5[422: Unprocessable Entity]
    
    E --> E1[500: Internal Server Error]
    E --> E2[503: Service Unavailable]
```

## Request and Response Examples

### Example Request

```http
GET /api/users/123 HTTP/1.1
Host: example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example Response

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600

{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2023-01-15T08:30:00Z"
}
```

## Versioning

API versioning helps manage changes without breaking existing clients:

- URL path versioning: `/api/v1/users`
- Query parameter: `/api/users?version=1`
- Custom header: `X-API-Version: 1`
- Accept header: `Accept: application/vnd.example.v1+json`

## Authentication and Authorization

Common authentication methods for REST APIs:

- **API Keys**: Simple key-based authentication
- **OAuth 2.0**: Industry-standard protocol for authorization
- **JWT (JSON Web Tokens)**: Compact, self-contained tokens for secure information transmission
- **Basic Authentication**: Username and password encoded in Base64

## Best Practices

1. **Use HTTPS**: Always secure your API with HTTPS
2. **Implement Rate Limiting**: Protect your API from abuse
3. **Provide Comprehensive Documentation**: Use tools like Swagger/OpenAPI
4. **Include Pagination**: For large collections of resources
5. **Support Filtering, Sorting, and Searching**: For better data retrieval
6. **Use Consistent Error Handling**: Standardize error responses
7. **Include HATEOAS Links**: Help clients navigate the API

## Conclusion

Designing a RESTful API requires careful consideration of resource naming, HTTP methods, status codes, and other principles. A well-designed API is intuitive, consistent, and easy to use, which improves developer experience and adoption.

---

*This lecture is part of the "Backend Development" series.*