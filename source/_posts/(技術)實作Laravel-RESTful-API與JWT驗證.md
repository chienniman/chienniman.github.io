---
title: (技術)實作Laravel-RESTful-API與JWT驗證
date: 2023-10-10 11:55:18
tags:
    - Backend
    - Authentication
    - Authorization
    - JWT
    - Laravel
author: Boris Chien
keywords:
    - Backend
    - Authentication
    - Authorization
    - JWT
    - Laravel
---

## RESTful API

> Representational State Transfer (REST) 是一種軟體架構，它對 API 的運作方式施加了條件。REST 最初是作為管理複雜網路 (如網際網路) 上的通訊指導方針而建立。您可以使用以 REST 為基礎的架構，來支援大規模的高效能和可靠的通訊。您可以輕鬆實作和修改，為任何 API 系統提供可視性和跨平台可移植性。

## 風格

-   統一介面
-   無狀態
-   分層系統
-   可快取性
-   隨需編碼

## 方法

-   URL
-   GET
-   POST
-   PUT
-   DELETE

## 幂等

同樣的請求被執行一次與連續執行多次，在伺服器的效果是一樣的，GET、HEAD、PUT、DELETE 是冪等的，POST 方法不是

## JWT

JSON Web Token，在伺服器間將訊息作為 JSON 物件傳輸，由 header、payload、signature 組成，
常搭配 RESTful API 作為身分驗證。

## 實作

### 安裝

```
composer require tymon/jwt-auth
```

### 生成密鑰

```
php artisan jwt:secret
```

### 創建 BookResource、BookController

```
php artisan make:resource BookResource
```

```
php artisan make:controller BookController --api
```

### 加入 Middleware

```PHP
public function __construct()
{
  $this->middleware('auth:api')->except(['index', 'show']);
}
```

## Postmon 測試

登入取得 access token，預設有效時間一小時

![](/images/restfulApi/login.webp)

加入 API Header，用來驗證使用者身分

```
Authorization : Bearer <access token>
```

成功新增資源

![](/images/restfulApi/post.webp)

## demo
[範例在這](https://github.com/chienniman/REST-API)

## Ref

[什麼是 RESTful API？](https://aws.amazon.com/tw/what-is/restful-api/)
[冪等](https://developer.mozilla.org/zh-CN/docs/Glossary/Idempotent)
[Build a REST API with Laravel API resources](https://pusher.com/blog/build-rest-api-laravel-api-resources/#securing-the-api-endpoints)
