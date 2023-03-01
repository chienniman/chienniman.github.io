---
title: CSO老玩家談伺服器的授權、驗證、實作
tags:
  - Backend
  - Server
  - Authentication
  - Authorization
  - Express.js
  - Node.js
cover: /images/cso.jpg
abbrlink: 8be7
date: 2023-02-21 23:02:00
author: Boris Chien
---

國中回到家的第一件事，衝到電腦桌前，輕車熟路地打開遊戲，心中抑制不住的雀躍感讓腎上腺素飆升，手指沁出汗液，CSO(射擊遊戲)，無數70、80後少年花費了大把的黃金歲月與金錢，為了能獲得"氪金神氣"。
想要征服危機四伏的義大利巷戰，需要準備的不是堪比P95的防毒面具，也不是能讓殭屍聞風喪膽的蛇姬之吻M95，~~而是大課長的帳號密碼~~。

## Authentication驗證
驗證就是告訴伺服器登入者是其所聲稱的使用者(~~公帳又是一回事~~)

不考慮中國的實名認證，大多數國家都是用一組帳號密碼，以下是簡易流程
```
              +------------------------+        
              |    遊戲客戶端啟動        |        
              +-----------+------------+        
                          |                    
                          | 向遊戲伺服器發送認證請求  
                          |                    
              +-----------v------------+        
              |   遊戲伺服器進行認證     |        
              +-----------+------------+        
                          |                    
                          | 驗證玩家帳號和密碼是否正確、權限(有無鎖帳號)    
                          |                    
              +-----------v------------+        
              |   確認帳號和密碼正確     |        
              +-----------+------------+        
                          |                    
                          | 允許進入遊戲伺服器    
                          |                    
              +-----------v------------+        
              |       排隊進入遊戲       |        
              +------------------------+        

```
## Authorization授權
當玩家通過認證進入遊戲伺服器後，伺服器會根據玩家的賬戶信息和權限進行授權，假設想要2023的年槍，紫炫流光，就得向伺服器獲得"授權"，買解碼器、黑市，才能解鎖新武器。

以下以商店販買的槍進行簡單舉例
```
選擇購買的武器 -> 檢查是否有足夠點數 -> 扣款授權 -> 武器授權 -> 成功購買 

```
## 總結
### 特點：
1.使用方便：使用帳號和密碼進行身份驗證是一種非常簡單和方便的方式。

2.可擴展性：可以很容易地擴展大量的使用者，在系統中輕鬆管理數百萬個用戶帳戶。

3.可靠性：大多數情況下是足夠可靠的。

### 防護：
1.密碼強度：為了確保安全性，建議使用強密碼，例如至少8位，並包含數字、字母和符號。

2.防止暴力破解：系統限制每個帳戶的登錄嘗試次數，在輸入錯誤密碼的次數超過一定限制後暫時鎖定該帳戶。

3.加密存儲密碼：存儲密碼時，應使用加密算法進行加密，並避免使用明文存儲。

4.多因素身份驗證：為了提高安全性，使用短信驗證碼、密碼和指紋等多種因素進行身份驗證。

# Https Authentication

## Basic：

一種HTTP驗證機制，它使用Base64將用戶名和密碼進行編碼，然後在HTTP請求中以Authorization標頭的形式傳送。簡單來說，當使用者輸入用戶名和密碼時，這些數據將被編碼並包含在HTTP請求中，伺服器收到請求後會解碼這些數據並進行身份驗證。

![](/images/basic-auth.jpg)

### Express.js
 
{% codeblock lang:js %}
const express = require('express');
const app = express();

// mock
const username = 'admin';
const password = 'password';

const auth = (req, res, next) => {
  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
    res.status(401).send('Authentication Required');
    return;
  }

  // Parse the authorization header
  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  // valid
  if (user === username && pass === password) {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
    res.status(401).send('Authentication Required');
  }
}

// Protected route
app.get('/protected', auth, (req, res) => {
  res.send('This is a protected route');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
{% endcodeblock %}


### 簡易的測試
[jigsaw.w3.org測試網址](https://jigsaw.w3.org/HTTP/)

![](/images/auth-login.jpg)

```
ac:guest
pw:guest
```
> 一個有因應此策略的client訪問一個使用Basic Authentication的server
伺服器會檢查在Header裡的Authorization欄位，規格應為 Authorization: Basic <value>
此時因為沒有Authorization並沒有資料，server按照約定會回傳401 status code並在Header上加上 WWW-Authenticate: Basic realm="<value>"
client當發現得到以上的回應後，會出現一個給予使用者輸入用戶名稱及密碼的地方
client將用戶名稱跟密碼做成一個base64的資料，虛擬碼表示為: base64(username:password)
client將資料放到Header: Authorization: base64(username:password)
server重複2開始的動作。

[先生你誰?-身分驗證Authentication (Basic, token, JWT)](https://ithelp.ithome.com.tw/articles/10304135)
![](/images/auth-success.jpg)

把header的authentication取出base64解碼可以看到正好是輸入的帳密
```
base64(username:password)
```
![](/images/base64.jpg)


## Digest：
> 摘要訪問認證是一種協議規定的Web伺服器用來同網頁瀏覽器進行認證信息協商的方法。它在密碼發出前，先對其應用哈希函數，這相對於HTTP基本認證發送明文而言，更安全。
[https://zh.wikipedia.org/zh-tw/HTTP%E6%91%98%E8%A6%81%E8%AE%A4%E8%AF%81](HTTP摘要認證)

- 客戶端向服務器發送請求。
- 服務器回復401和WWW-Authenticate,nonce(服務器生成的隨機字符串，防止重放攻擊)。
```
www-authenticate: 
Digest realm="test", 
domain="/HTTP/Digest", 
nonce="e67010901fb034b2e0e0c9e0c1f451d8"
```
- 客戶端使用用戶名、領域和密碼計算出HA1值，使用請求方式和請求URI計算出HA2值。
- 客戶端使用HA1、nonce和HA2計算出響應值，加到“Authorization”的header。
```
HA1 = MD5(username:realm:password)
HA2 = MD5(method:digestURI)
response = MD5(HA1:nonce:HA2)
```
- 服務器使用相同的計算方式驗證。如果正確，服務器會返回請求的資源，否則，返回401未授權或其他錯誤狀態碼，客戶端必須重新進行身份驗證。

### Express.js
{% codeblock lang:js %}
const express = require('express');
const passport = require('passport');
const DigestStrategy = require('passport-http').DigestStrategy;

const app = express();

passport.use(new DigestStrategy({ qop: 'auth' },
  (username, done) => {
<!--  mock DB user  -->
    const user = { username: 'guest', password: 'password', realm: 'test' };
    if (username === user.username) {
      return done(null, user, user.password);
    } else {
      return done(null, false);
    }
  }
));

app.get('/digest', passport.authenticate('digest', { session: false }),
  (req, res) => {
    res.send('成功進入保護區域！');
  }
);

app.listen(3000, () => console.log('App started on port 3000'));
{% endcodeblock %}

