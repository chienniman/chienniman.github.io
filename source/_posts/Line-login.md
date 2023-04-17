---
title: Line-login
abbrlink: 1318
date: 2023-04-16 16:02:26
tags:
    - Line API
    - Line login
    - OAuth
    - Authorization
    - API
cover: /images/line-api-overview.jpg
author: Boris Chien
categories:
    - Line API
---

## Line login

LINE Login 是一種快速登錄服務，將 LINE Login 集成到網站或應用程序中，用戶能輕鬆地註冊和登錄。
使用者只需點擊 LINE 登錄按鈕，無需記住每個站點的電子郵件地址和密碼。

## 優勢

-   廣大的用戶數量
-   建立帳號變得更加容易
-   個人化

### 流程圖

![](/images/web-login-flow.jpg)

## 授權請求 API

Authenticating users and making authorization requests

```
https://access.line.me/oauth2/v2.1/authorize
```

## 必須參數

1.response_type，回應授權碼
2.client_id，LINE Login Channel ID，在 Providers Basic settings
3.redirect_uri，重新導向網址，需配置
4.state，防跨站偽造請求，隨機值
5.scope，權限範圍，user ID、name、Profileimage、Email

## 選填參數

1.nonce，防止重複攻擊，ID token 回傳值
2.prompt，再次確認是否授權
3.max_age，授權時間

其餘參考[Integrating LINE Login with your web app](https://developers.line.biz/en/docs/line-login/integrate-line-login/#create-a-channel)

## Postmon

在 Postmon 選擇 Oauth2.0，填入參數，並將 Callback url 配置到 Line 設定中
![](/images/postmon-line-oauth-login.png)

## Line popup

跳出授權頁面
![](/images/postmon-line-oauth-popup1.png)
確認存取權限
![](/images/postmon-line-oauth-popup2.jpg)
取得 Access Token，id_token
![](/images/postmon-line-oauth-result.png)

## JWT

全名是 JSON Web Token，在不同系統之間傳遞安全性資訊的開放標準。JWT 通常用於認證和授權方面，例如當使用者進行登入時，系統會建立一個 JWT，並將其傳遞給客戶端，之後客戶端每次向伺服器發送請求時都會攜帶這個 JWT，以證明其身份和權限。

## 組成

1.header
2.payload
3.signature

## Header

alg：對 JWT 進行簽章或解密的演算法

## Payload

sub：subject，用字串或 URI 表示 JWT 夾帶的唯一識別訊息。
aud：audience，字串、URI 陣列表示這個 JWT 唯一識別的預期接收者。
exp：expiration，過期時間
name:用戶名稱
picture:用戶照片

## Signature

HS256、RS256、ES256

header 和 payload 為 JSON 物件經過 Base64 編碼，signature 為 private key 對編碼後的 header +payload 經過演算法完成簽章，再將簽章用 Base64 編碼後。

![](/images/jwt-io-line-result.png)

## 參考
[LINE Login v2.1](https://developers.line.biz/zh-hant/services/line-login/)
[LINE API Use Case](https://lineapiusecase.com/en/api/login.html)
