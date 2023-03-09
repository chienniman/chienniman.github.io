---
title: 被Youbike衝康多次的我決定使用LineBot反擊
tags:
    - Backend
    - LineBot
    - Webhook
    - ngrok
    - LINE Developers
    - Youbike API
    - Express.js
cover: /images/u-bike.jpg
abbrlink: "2482"
date: 2023-02-25 22:24:54
author: Boris Chien
description: 每天依賴Youbike通勤上下班，眼瞅著手錶的指針朝上班的死線漸漸逼近，火急火燎趕到公司樓下卻發現沒有空位，常常車數非常極端，要不爆滿(全滿+一堆放旁邊用繩子綁著)，要不一台都沒，只能花費雙倍路程時間到上一站，上網搜尋可行的解決方案，手動查詢Youbike地圖是不錯的解決方案，但對壓線出門的懶人不是最佳解，那如果每天早上固定收到通知呢?
keywords:
    - Backend
    - LineBot
    - Webhook
    - ngrok
    - LINE Developers
    - Youbike API
    - Express.js
---

## 關於上班這檔事

每天依賴 Youbike 通勤上下班，眼瞅著手錶的指針朝上班的死線漸漸逼近，火急火燎趕到公司樓下卻發現沒有空位，常常車數非常極端，要不爆滿(全滿+一堆放旁邊用繩子綁著)，要不一台都沒，只能花費雙倍路程時間到上一站，上網搜尋可行的解決方案，手動查詢 Youbike 地圖是不錯的解決方案，但對壓線出門的懶人不是最佳解，那如果每天早上固定收到通知呢?

## LineBot

為快速查詢 youbike，以 Node.js+Express.js 開發的 bot，邏輯都在[index.js](https://github.com/chienniman/YouBikeNotify-Bot/blob/main/index.js)

## 特點

1.快速查詢 youbike 特定站點<br> 2.格式客製<br> 3.精簡高效(134 行)<br> 4.部署 render 雲<br> 5.支持自動排程<br>

![](/images/ubike-robot-result.png)

## Express.js

使用 Node.js，其他語言參考[Official SDKs](https://developers.line.biz/en/docs/downloads/)，官方有提供

-   Java
-   PHP
-   Go
-   Perl
-   Ruby
-   Python
-   Node.js

## 本地

```
git clone https://github.com/chienniman/YouBikeNotify-Bot.git
```

```
npm install
```

```
mkdir .env
```
Configuring Environment Variables & Secrets
![](/images/config.jpg)

## Cron

```
npm install --save node-cron
```

![](/images/cron.jpg)

## 臺中交通資訊 API

上網搜了一下發現臺中交通資訊 API 整合的相當不錯，Swagger 的文件架構清晰，井然有序，這邊給個讚，~~台中路面狀況如果也可以就謝天謝地了~~。
[臺中交通資訊 API](https://motoretag.taichung.gov.tw/DataAPI/swagger/ui/index#/YoubikeAPI)
![](/images/youbike-api.jpg)
![](/images/query-ubike.jpg)

### API 版本

當我飛速敲完鍵盤，張開雙手準備享受 terminal 如瀑布般傾瀉而出的資料時，發現奇怪的事情，不對阿，為何更新時間對不上，如果差幾分鐘就算了，但是足足差了幾個小時，欄位資料也對不上

#### 慢

```
https://motoretag.taichung.gov.tw/DataAPI/api/YoubikeAllAPI
```

#### 及時

```
https://datacenter.taichung.gov.tw/swagger/OpenData/9af00e84-473a-4f3d-99be-b875d8e86256
```

猜測是更新頻率不同

## LINE

### LINE Developers

首先要先創建一個 LINE Developers 帳號
[註冊網址](https://developers.line.biz/en/)

### LINE Bot channel

登入後點選 Create new channel 創建新的 LINE Bot 頻道，並且填寫頻道相關資訊（例如：頻道名稱、頻道圖片、類型等等）。
![](/images/channel.jpg)

3.創建一個 index.js 文件並啟動 Express.js 伺服器，建議使用 nodemon，可以節省大量時間

### 本地測試

> 方法一(在相同內網情況下分享)
> 方法第一種是利用區網(此方法限定對方和你同時連上同一個網域)，適用的人像是跟你同時在同一個地方的工作夥伴，只要確保對方和你同時連上相同的區網就可以囉！
> 首先查詢你的電腦 ip 位置， windows 使用者開啟終端機輸入 ipconfig 即可查詢你目前 ip 位置，macOS 的使用者可以打開網路偏好設定裡面就有 ip 位置了。

## ngrok

> ngrok 做為一個轉發的伺服器，他可以把外界的請求轉發到你指定的 Port，使用的背景原理是連接到 ngrok 雲端伺服器，將你本機指定的地址公開，再將由 ngrok 一串公開的網址來存取內容。他的優點是快速而且還提供了 https 的服務讓你使用上更安全，甚至你還可以設置密碼保護。

[ref-[Day-37] 使用 ngrok 讓外網連接你的 API](https://ithelp.ithome.com.tw/articles/10197345)

### 安裝
[ngrok](https://ngrok.com/)

### 執行
1.windows，雙擊exe

2.linux， cd ngrok
```
ngrok.exe http {port}
```

### 映射

```
<!-- 雲端=>本地 -->
Forwarding https://xxxxxx.ngrok.io -> localhost:{port}
```

### 資安

沒有正確地設定 ngrok，防火牆、密碼，可能導致安全風險，使用完記得 ctrl+c 退出

### 驗證失敗

ngrok 運行 500，terminal 顯示 404，因為 token 沒設定好
![](/images/500.jpg)

![](/images/404.jpg)

### channel access tokens

> For services available on the Internet, authentication via IDs and passwords is often used as a means of verifying whether a person has permission to use the service. LINE Developers also verifies and confirms that a person has permission to use a specific channel. However, entering an ID and password every time you use a channel (for Messaging API channels, every time you use an endpoint in the Messaging API) takes too much effort and is therefore suboptimal.
> That is why LINE Developers uses channel access tokens as a means of authentication for channels. If you send the correct channel access token to LINE Developers, you are deemed to have permission to use the channel.

簡單來說，Channel Access Token 是一種憑證，讓 LINE Bot 與 LINE 平台的 API 通訊。開發者中心的專案頁面上設定並取得一組 Channel Access Token，才能使用 LINE Bot SDK 中的 API 來發送訊息、接收事件等。

如果找不到，Channel Access Token 在 messaging-api 的最下面，有個 issue 的按鈕，也要檢查 env 是否有正確設定

### 延遲

分發的 ip4/ip6 取決於網路服務供應商，有時候掛掉沒反應，可能是 ngrok 嚴重延遲，開啟/重開，ngrok 會隨機分配一個公共的 subdomain，因此必須持續在 line webhook 更新，驗證以確保設定正確。

### 502-bad-gateway

檢查伺服器有無開啟、錯誤

## Deployment(render)

> 官方文件[nodejs-on-rende](https://github.com/haojiwu/line-bot-nodejs-on-render)<br>

1.設定[render.yaml](https://github.com/chienniman/YouBikeNotify-Bot/blob/main/render.yaml)
2.新增 Web Service
3.Public Git repository
4.設定姓名、環境、區域
5.編譯部屬成功
![deploy-success](https://user-images.githubusercontent.com/97031067/223740969-e16e8586-e53b-491b-9caf-0eee42233eaa.jpg)

## 免費使用限制

> Free instance types are not available for Private Services, Background Workers, or Cron Jobs.<br>
> Web Services on the free instance type are automatically spun down after 15 minutes of inactivity. When a new request for a free service comes in, Render spins it up again so it can process the request.
> This can cause a response delay of up to 30 seconds for the first request that comes in after a period of inactivity.<br>

1.本地伺服器可自動排程，但 render 雲的免費計畫不支援
2.超過 15 分鐘沒有活動，伺服器會自動停止，直到新的請求，因此會造成延遲響應。
3.總結以上 2 點，部署 render 版本只能算是半自動，15 分鐘前有請求，可觸發排程

## 心得

youbike 地圖要逐一輸入搜尋，記錄資訊就相當麻煩，還要考慮過期，總不能一直盯著地圖重整吧，linebot 點擊一次幾秒內就能解決(~~不過得先花好幾天研究 LINE SDK~~)，朋友試用後的反饋也是相當輕巧方便，得感謝 heroku 之後還有如此便利、不用綁卡的雲，缺點也是相當明顯，不穩定的響應時間(1 秒~6 分鐘)，注定讓免費計畫只能作為實驗用途，應該沒有使用者能接受超過 5 秒的等待，會不會升級成付費版本目前還在觀察中，考量到簡潔好用的整合介面，內建支持 Github，可能性應該偏高。

## 附錄-悲慘~~搞笑~~故事

小弟的朋友花了幾千開了一台性能不錯的機器，興高采烈的要架設(私服)遊戲伺服器，過度膨脹的他沒設密碼，沒過幾天時間就被各路神仙開腸剖肚，被木馬感染，打遊戲的時候發現很卡，覺得很奇怪去查了以後發現資源都被拿去幫大佬挖礦拉
