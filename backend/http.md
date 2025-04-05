a # HTTP

---

## HTTP протокол

- Основы HTTP как протокола прикладного уровня
- Модель клиент-сервер
- Структура HTTP-запроса и HTTP-ответа
- Методы HTTP (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)
- Заголовки HTTP и их роль
- Коды состояния HTTP (2xx, 3xx, 4xx, 5xx)
<!-- - HTTP/1.1 vs HTTP/2 vs HTTP/3: основные отличия и преимущества -->

---

## Определение из Википедии

> ## **HTTP** _(англ. Hypertext Transfer Protocol — «протокол передачи гипертекста»)_ — сетевой протокол прикладного уровня, который изначально предназначался для получения с серверов гипертекстовых документов в формате HTML, а с течением времени стал универсальным средством взаимодействия между узлами Всемирной паутины

---

## 🛠 Диаграмма запроса и ответа

```mermaid
```mermaid
sequenceDiagram
    participant Client
    participant Server
    Client->>Server: GET /index.html HTTP/1.1
    Server-->>Client: HTTP/1.1 200 OK
```

<!--
Клиент-серверная архитектура
-->

---

## 🔍 Основные компоненты HTTP-запроса

1. **Стартовая линия**

   - Метод HTTP (например, GET, POST)
   - URL
   - Версия HTTP

2. **Заголовки**

   - Передача доп. метаданных (например, `Content-Type`, `Authorization`)

3. **Тело (опционально)**
   - Расширенные данные запроса (например, JSON, XML, protobuf)

---

## 📄 Пример HTTP-запроса

```plaintext
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9
Accept-Language: en-US,en;q=0.5
Connection: keep-alive
```

---

## 📨 Основные компоненты HTTP-ответа

1. **Статусная линия**

   - Версия HTTP
   - Код состояния (например, 200, 404)
   - Сообщение состояния (например, "OK", "Not Found")

2. **Заголовки**

   - Метаданные ответа (например, Content-Length, Server)

3. **Тело**
   - Данные, отправляемые клиенту (например, HTML-код, изображения)

---

## Пример HTTP-ответа

```plaintext
HTTP/1.1 200 OK
Date: Mon, 27 Sep 2021 12:28:53 GMT
Server: Apache/2.4.1 (Unix)
Last-Modified: Wed, 22 Sep 2021 19:15:56 GMT
Content-Type: text/html
Content-Length: 305

<!DOCTYPE html>
<html>
<head>
    <title>Пример страницы</title>
</head>
<body>
    <h1>Добро пожаловать на пример страницы!</h1>
    <p>Это пример HTTP-ответа.</p>
</body>
</html>
```

---

## Методы HTTP

HTTP предоставляет набор методов для взаимодействия с ресурсами на сервере. Основные методы включают:

- **GET**: Запрашивает представление ресурса. Запросы с использованием этого метода могут только извлекать данные.
- **POST**: Используется для отправки данных к серверу, например, при отправке формы или загрузке файла.
- **PUT**: Заменяет все текущие представления ресурса данными из запроса.
- **DELETE**: Удаляет указанный ресурс.
- **HEAD**: Аналогичен GET, но без тела ответа. Используется для получения метаданных.
- **OPTIONS**: Описывает параметры соединения для ресурса.
- **PATCH**: Используется для частичного изменения ресурса.

---

### 📦 Что такое HTTP заголовки?

- Метаданные запроса или ответа
- Управляют соединением между клиентом и сервером
- Могут влиять на безопасность, кэширование, контент

---

## Основные заголовки ответа

| Заголовок        | Описание                                | Пример                                          |
| ---------------- | --------------------------------------- | ----------------------------------------------- |
| `Content-Type`   | Тип данных в теле ответа                | `Content-Type: application/json; charset=utf-8` |
| `Content-Length` | Размер тела ответа в байтах             | `Content-Length: 2048`                          |
| `Server`         | Информация о сервере                    | `Server: nginx/1.18.0`                          |
| `Date`           | Дата и время генерации ответа           | `Date: Wed, 21 Oct 2023 07:28:00 GMT`           |
| `Location`       | URL для перенаправления                 | `Location: https://example.com/new-page`        |
| `Set-Cookie`     | Устанавливает cookie на стороне клиента | `Set-Cookie: session=abc123; Secure; HttpOnly`  |

---

## Заголовки для кеширования

- `Cache-Control`: Механизмы управления кешем
  - `max-age=3600, must-revalidate`
  - `no-cache`, `no-store`, `private`
- `ETag`: Уникальный идентификатор ресурса
  - `ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"`
- `Last-Modified`: Время последнего изменения
  - `Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT`
- `If-None-Match`: Условный GET-запрос (с ETag)
- `If-Modified-Since`: Условный GET-запрос (с датой)

---

## Кеширование через дату последнего обновления

```mermaid
sequenceDiagram
    Client->>Server: GET /resource If-Modified-Since: [date]
    alt Resource changed
        Server-->>Client: 200 OK Content + Last-Modified
    else Resource not changed
        Server-->>Client: 304 Not Modified
    end

```

<!--
Комментарий для лектора:
Объясните, как условные запросы работают с кодом 304:
- Клиент делает запрос с If-Modified-Since или If-None-Match
- Если ресурс не изменился, сервер возвращает 304 без тела ответа
- Это позволяет экономить трафик и повышать производительность
Отметьте, что для работы этого механизма необходимы заголовки ETag или Last-Modified в исходном ответе.
-->

---

## Кеширование через ETag

```mermaid
sequenceDiagram
  Client->>Server: GET /resource If-None-Match: [etag]
    alt ETag changed
        Server-->>Client: 200 OK Content + ETag
    else ETag matches
        Server-->>Client: 304 Not Modified
    end

```

<!--
Комментарий для лектора:
Объясните, как условные запросы работают с кодом 304:
- Клиент делает запрос с If-Modified-Since или If-None-Match
- Если ресурс не изменился, сервер возвращает 304 без тела ответа
- Это позволяет экономить трафик и повышать производительность
Отметьте, что для работы этого механизма необходимы заголовки ETag или Last-Modified в исходном ответе.
-->

---

## Заголовок Content-Type

- Определяет тип содержимого в теле запроса или ответа
- Примеры:
  - Content-Type: text/html; charset=UTF-8
  - Content-Type: application/json
  - Content-Type: image/jpeg
  - Content-Type: application/x-www-form-urlencoded
  - Content-Type: multipart/form-data

---

## User-Agent

- Заголовок в HTTP-запросах, используемый для идентификации клиента (например, браузера или приложения)

- Позволяет серверам определять характеристики клиента и адаптировать ответ.

- **Примеры**

Mozilla/5.0 (Windows NT 10.0; Win64; x64)

AppleWebKit/537.36 (KHTML, like Gecko)

Chrome/97.0.4692.99 Safari/537.36

---

## Accept-Language

- **Что такое Accept-Language?**
  - HTTP-заголовок, указывающий предпочтения клиента по языкам контента.
  - Используется сервером для выбора наиболее подходящей языковой версии ресурса.

- **Пример:**
  - Accept-Language: en-US,en
  - Accept-Language: en-US;q=0.8,en;q=0.7,tt-RU,tt;q=0.9,ru;q=0.8

---

## HTTP Cookie

- **Что такое Cookie?**
  - Небольшие файлы данных, которые веб-сайты сохраняют на устройстве пользователя через браузер
  - Используются для хранения информации о сеансе пользователя и его предпочтениях

- **Основные параметры Cookie:**
  - **Имя и значение**: Каждое cookie имеет уникальное имя и связанное с ним значение
  - **Домен и путь**: Определяют область видимости cookie и на каких страницах они будут отправлены
  - **Срок действия**: Устанавливает, когда cookie будет удален

---

## Зачем нужны Cookie?

- Сохранение пользовательских предпочтений (например, язык интерфейса).

- Управление сеансами (например, корзины покупок).

- Аутентификация пользователя.

- **Этико-правовые аспекты:**
  - Обязательство уведомления пользователей о сборе данных через cookies (например, GDPR).
  - Пользовательский контроль над cookies (возможность удаления и запрета).

Set-Cookie: sessionId=abc123; Expires=Wed, 09 Jun 2023 10:18:14 GMT; Secure; HttpOnly

Cookie: sessionId=abc123; Expires=Wed, 09 Jun 2023 10:18:14 GMT; Secure; HttpOnly

---

## HTTP Status Codes

```mermaid

flowchart TD
    A[HTTP Status Codes] --> B[Informational Responses
    1xx]
    A --> E[Successful Responses
    2xx]
    A --> H[Redirection Messages
    3xx]
    A --> K[Client Error Responses
    4xx]
    A --> N[Server Error Responses
    5xx]
```

---

## 1xx Informational

- **Когда применяются:** Для промежуточных ответов, указывающих, что запрос принят и обработка продолжается
- **Ключевые коды:**
  - 100 Continue: сервер получил запрос и готов к продолжению;
  - 101 Switching Protocols: сервер согласился на изменение протокола.

---

## 2xx Success

- 200 OK: запрос обработан успешно;
- 201 Created: ресурс создан;
- 202 Accepted: запрос принят, но обработка еще не началась;
- 203 Non-Authoritative Information: ответ от третьего лица;
- 204 No Content: ресурс не содержит тела;
- 205 Reset Content: ресурс обновлен;
- 206 Partial Content: часть ресурса возвращена по запросу.

---

## 3xx Redirection

- 301 Moved Permanently: ресурс перемещен на новый URL;
- 302 Found: ресурс временно перемещен на другой URL;
- 303 See Other: ресурс доступен по другому URL;
- 304 Not Modified: ресурс не изменялся;
- 307 Temporary Redirect: ресурс временно перемещен на другой URL;
- 308 Permanent Redirect: ресурс перемещен на другой URL.

---

## 4xx Client Error

- 400 Bad Request: неправильный запрос
- 401 Unauthorized: не авторизован
- 403 Forbidden: доступ запрещен
- 404 Not Found: ресурс не найден
- 405 Method Not Allowed: метод не поддерживается
- 408 Request Timeout: таймаут запроса
- 410 Gone: ресурс удален
- 413 Payload Too Large: размер тела запроса слишком велик
- 414 URI Too Long: URL слишком длинный
- 418 I’m a teapot
- 451 Unavailable For Legal Reasons

---

## 5xx Server Error

- 500 Internal Server Error: внутренняя ошибка сервера;
- 501 Not Implemented: метод не реализован;
- 502 Bad Gateway: неправильный ответ от шлюза;
- 503 Service Unavailable: сервер недоступен;
- 504 Gateway Timeout: таймаут шлюза;

---

## Localhost

- **Localhost** — это зарезервированное доменное имя, ссылающееся на ваш локальный компьютер

- Обычно применяется для разработки и тестирования веб-приложений на локальной машине

- **IP-адрес** для localhost: 127.0.0.1 (в IPv6: ::1)

- Используется для отправки запросов на сервер, работающий на той же машине

  - <http://localhost:3000> или <http://127.0.0.1:300>

- Развёртывание на localhost позволяет быстро тестировать изменения без необходимости публикации на удалённый сервер

- Полезно для разработчиков при отладке и тестировании приложений в изолированной среде.

---

## Что такое curl и wget?

- **curl**: Инструмент командной строки для передачи данных по URL

- **wget**: Сетевая утилита для получения контента с веб-серверов

---

## Ключевые возможности: curl

- **Гибкие опции вывода**: -o (файл)
- **HTTP-методы**: Поддерживает все HTTP-методы (GET, POST, PUT, DELETE и др.)
- **Работа с заголовками**: -H "Заголовок: Значение"
- **Отправка форм**: -F "поле=значение"
- **Работа с куками**: -b (отправка), -c (сохранение)

---

## Примеры использования curl

**Базовый запрос**

curl <https://api.example.com>

**Сохранение вывода в файл**

curl -o output.html <https://example.com>

**POST-запрос с JSON-данными**

curl -X POST -H "Content-Type: application/json" \
 -d '{"name":"Иван","age":30}' <https://api.example.com/users>

**Загрузка файла на сервер**

curl -F "file=@document.pdf" <https://example.com/upload>

---

## Ключевые возможности: wget

- **Рекурсивные загрузки**: -r для зеркалирования сайтов
- **Фоновая работа**: -b для продолжения загрузки в фоне
- **Возобновление загрузки**: -c для продолжения прерванных загрузок
- **Режим паука**: --spider для проверки ссылок без загрузки
- **Ограничение скорости**: --limit-rate=20k

---

## Примеры использования wget

**Базовая загрузка**

wget <https://example.com/file.zip>

**Возобновление прерванной загрузки**

wget -c <https://example.com/large-file.iso>

**Зеркалирование сайта (рекурсивная загрузка)**

wget -r -np -k <https://example.com>

**Загрузка в фоновом режиме**

wget -b <https://example.com/large-file.zip>

#### Загрузка нескольких файлов из списка

wget -i urls.txt

---

## JSON (JavaScript Object Notation)

- Текстовый формат обмена данными между приложениями

- Легко читаемый, компактный, язык-независимый

- Широко используется в web-разработке, Android, iOS

---

### JSON - структура

- **Объект (object)**: неупорядоченный набор пар "ключ-значение"

- **Массив (array)**: упорядоченный список значений

- **Значение (value)**: строка, число, логическое значение, null, объект, массив

---

### JSON - пример

```json
{
  "name": "John Doe",
  "age": 30,
  "isEmployed": true,
  "contact": {
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  },
  "skills": [
    {
      "name": "JavaScript",
      "level": "advanced"
    },
    {
      "name": "Python",
      "level": "intermediate"
    }
  ],
  "projects": ["Project A", "Project B"]
}
```

---

## Protocol Buffers (protobuf)

- Язык описания данных, созданный компанией Google

- **Преимущества**:
  - компактность
  - быстродействие
  - язык-независимость

---

## Составные типы protobuf

- enum (перечисления)
- message (вложенные сообщения)
- map<K, V> (отображения ключ-значение)
- repeated (массивы)
- oneof (выбор одного из нескольких полей)

---

## Пример proto-файла

```proto
syntax = "proto3";

message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 results_per_page = 3;

  oneof filter {
    string name_filter = 4;
    int32 id_filter = 5;
    bool show_deleted = 6;
  }

  map<string, string> metadata = 7;
}
```

---

## Пример запроса с использованием Protocol Buffers в Python

- Установка библиотеки:

  `pip install protobuf`

- Генерация Python-класса из proto-файла:
  
  `protoc --python_out=. example.proto`

---

### Пример запроса с использованием Protocol Buffers в Python код

``` python
from example_pb2 import SearchRequest

# Создаем объект SearchRequest
search_request = SearchRequest(
    query="Protocol Buffers",
    page_number=1,
    results_per_page=10
)

# Устанавливаем oneof поле
search_request.name_filter = "example_filter"

# Добавляем пару ключ-значение в map
search_request.metadata["version"] = "1.0"

# Сериализуем объект в бинарный формат
serialized_data = search_request.SerializeToString()



# Десериализуем объект 
response = SearchRequest()
  response.ParseFromString(serialized_data)
```

---

## Пагинация в HTTP

- **HTTP-запросы для пагинации:**
  - Используйте параметры запроса (query parameters) для указания страницы и размера страницы, например:
GET /items?page=2&pageSize=10
- **Заголовки ответов:**
  - Включайте заголовки, такие как Link для предоставления URL следующей и предыдущей страниц.

- **Паттерны:**
  - **Offset-limit:**
SQL: SELECT * FROM items LIMIT 10 OFFSET 20
- **Cursor-based:** Использует уникальный идентификатор последней записи страницы.


---

## Пагинация с использованием Base64

- Зачем использовать Base64 в пагинации?
  - Кодирование параметров пагинации в Base64 позволяет безопасно передавать сложные структуры данных через URL или заголовки HTTP.
  - Это полезно для обеспечения целостности данных и скрытия деталей отслеживания пагинации от пользователя.

- Пример использования:
  - Шаг 1: Формирование курсора
    - Например, структура курсора: { "page": 2, "size": 10 }.
  - Шаг 2: Кодирование курсора
    - Преобразуем структуру в строку и кодируем в Base64

---

## Пагинация с использованием Base64

```python

import base64
import json

cursor_data = { "page": 2, "size": 10 }
cursor_str = json.dumps(cursor_data)
encoded_cursor = base64.urlsafe_b64encode(cursor_str.encode()).decode()
```

- Шаг 3: Использование в HTTP-запросах
  - Предаем кодированный курсор через параметр URL:

`GET /items?cursor=eyJwYWdlIjoyLCJzaXplIjoxMH0=`

- Шаг 4: Декодирование на сервере
  - На сервере произведите декодирование и парсинг курсора:

```python
decoded_cursor = base64.urlsafe_b64decode(encoded_cursor).decode()
cursor_data = json.loads(decoded_cursor)
```

---

## SQL-инъекции в HTTP

- **Уязвимости через веб-формы и URL:**
  - Злоумышленники могут воспользоваться формами ввода и URL-параметрами для внедрения вредоносного SQL-кода

- **Проблемы:**
  - Повышенные привилегии доступа через манипуляции с данными, например, в логин формах:
`SELECT * FROM users WHERE username = 'admin' -- AND password = ''`
- **Валидация и очистка входных данных:**
  - Проверяйте и обрабатывайте введенные данные перед их использованием в SQL-запросах.

---

## Версионирование API

### Через URI

<https://api.example.com/v1/users>
<https://api.example.com/v2/users>

### Через HTTP заголовки

Accept: application/vnd.example.v1+json
Accept: application/vnd.example.v2+json

### Через параметр запроса

<https://api.example.com/users?version=1>
<https://api.example.com/users?version=2>

---

# REST API: Основы и Принципы

---

## Что такое REST API?

- REST = Representational State Transfer
- Архитектурный стиль взаимодействия компонентов распределенного приложения
- [Разработан Роем Филдингом в 2000 году](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- Основан на протоколе HTTP

---

## Основные принципы REST

1. Клиент-серверная архитектура
2. Отсутствие состояния (Statelessness)
3. Кэширование
4. Единообразие интерфейса
5. Многоуровневая система

---

## Отсутствие состояния (Statelessness)

- Сервер не хранит информацию о состоянии клиента
- Каждый запрос содержит всю необходимую информацию
- Преимущества:
  - Повышение надежности
  - Облегчение масштабирования
  - Упрощение балансировки нагрузки

---

## Кэширование

- Ответы сервера можно кэшировать
- Уменьшение задержки
- Снижение нагрузки на сервер
- Заголовки HTTP для управления кэшем:
  - Cache-Control
  - Expires
  - ETag

---

## Единообразие интерфейса

### 1. Идентификация ресурсов

<https://api.example.com/users/123>
<https://api.example.com/products?category=electronics>

### 2. Манипуляция ресурсами через представления

### 3. Самоописательные сообщения

### 4. HATEOAS (Hypertext As The Engine Of Application State)

---

## HTTP методы в REST API

| Метод  | Действие                     | Идемпотентность |
| ------ | ---------------------------- | --------------- |
| GET    | Получение ресурса            | Да              |
| POST   | Создание ресурса             | Нет             |
| PUT    | Полное обновление ресурса    | Да              |
| PATCH  | Частичное обновление ресурса | Нет             |
| DELETE | Удаление ресурса             | Да              |

---

## Дизайн URI

### Сравнение практик дизайна URI

| Метод |  Хорошие практики ❤️|  Плохие практики💔 |
|-------|---------------------|-------------------|
| GET | /users (получить список пользователей) | /getUsers (использование глаголов) |
| GET | /users/123 (получить информацию о пользователе 123) | /users/getUserById/123 (избыточность в пути) |
| POST | /users (создать нового пользователя) | /users/createUser |
| PUT | /users/123 (обновить пользователя 123) | /users/updateUser/123 |
| DELETE | /users/123 (удалить пользователя 123) | /users/deleteUser/123 |

---

## Пример REST API запроса и ответа

### Запрос

```plain
GET /api/users/123 HTTP/1.1
Host: example.com
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Ответ

```plain
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600

{
"id": 123,
"name": "Иван Иванов",
"email": "<ivan@example.com>",
"created_at": "2023-01-15T12:00:00Z"
}
```

---

## HATEOAS

### Hypermedia As The Engine Of Application State

```json
{
"id": 123,
"name": "Иван Иванов",
"email": "<ivan@example.com>",
"\_links": {
  "self": { "href": "/users/123" },
  "profile": { "href": "/users/123/profile" },
  "orders": { "href": "/users/123/orders" }
}
}
```

- Клиент взаимодействует с приложением через гиперссылки
- Повышает самодостаточность API

---

## Ограничения REST API

- Избыточность данных при многократной передаче
- Проблемы с производительностью при большом количестве запросов
- Ограничения в сложных операциях с данными
- Не подходит для работы в реальном времени (альтернатива: WebSockets)

---

## Альтернативы REST

- GraphQL - Язык запросов для API с гибкой выборкой данных
- gRPC - Высокопроизводительный фреймворк для RPC
- SOAP - Протокол обмена структурированными сообщениями
- WebSockets - Протокол для двусторонней связи в реальном времени

---

## Лучшие практики REST API

- Используйте существительные, а не глаголы в эндпоинтах
- Применяйте вложенные ресурсы для отображения отношений
- Реализуйте фильтрацию, сортировку и пагинацию
- Обеспечьте обработку ошибок с информативными сообщениями
- Организуйте версионирование API
- Ограничивайте количество запросов (Rate Limiting)
- Предоставляйте подробную документацию

---

## Документирование API

### Инструменты для документации

- OpenAPI (Swagger)
- RAML
- API Blueprint

### Ключевые элементы документации

- Описание эндпоинтов и методов
- Форматы входных и выходных данных
- Параметры запросов
- Коды ответов
- Примеры запросови ответов

---

## OpenAPI

- Стандарт для описания RESTful API

- Позволяет машинам и людям понимать возможности сервиса без необходимости доступа к исходному коду

## Что описанно в  OpenAPI файле?

- Определение всех доступных эндпоинтов API

- Описание используемых методов HTTP: GET, POST, PUT, DELETE

- Структура данных, используемых в запросах и ответах

---

## Основные преимущества

- Упрощение интеграции и автоматизация

- Генерация документации

- Создание клиентских библиотек

- Тестирование API

---

## OpenAPI пример handler

```yaml
   openapi: 3.0.0
   info:
     title: Sample API
     version: '1.0'
   paths:
     /users:
       get:
         summary: Get a list of users
         responses:
           '200':
             description: A list of users.
             content:
               application/json:
                 schema:
                   type: array
                   items:
                     $ref: '#/components/schemas/User'
```

---

## OpenAPI пример обекта

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
```
