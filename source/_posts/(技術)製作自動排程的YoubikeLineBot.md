---
title: (技術)製作自動排程的YoubikeLineBot
tags:
    - Backend
    - LineBot
    - Line API
    - Youbike API
    - render
abbrlink: "2482"
date: 2023-02-25 22:24:54
author: Boris Chien
description: Youbike 通勤上下班，趕到公司樓下卻發現沒有空位，只能花費雙倍路程時間步行到上一站，搜尋可行的解決方案，別人製作的Youbike 地圖是不錯的解決方案，但對壓線出門的懶人不是最佳解，重複的查詢、比較、紀錄相當多餘，真正能解決痛點的是固定時間、客製化、快速查詢工具。
keywords:
    - Backend
    - LineBot
    - Webhook
    - ngrok
    - LINE Developers
    - Youbike API
    - render
    - Line API
categories:
    - Line API
cover: images/youbikeLinebot/cover.webp
---

## 關於騎腳踏車上班
Youbike 通勤上下班，趕到公司樓下卻發現沒有空位，只能花費雙倍路程時間步行到上一站，搜尋可行的解決方案，別人製作的 [站點地圖](https://www.youbike.com.tw/region/main/stations/)是不錯的解決方案，但對壓線出門的懶人不是最佳解，**重複的查詢、比較、紀錄**相當多餘，真正能解決痛點的是**固定時間、主動通知、快速查詢**工具。
以 Node.js開發的 bot，邏輯在[index.js](https://github.com/chienniman/YouBikeNotify-Bot/blob/main/index.js)，[完整原始碼](https://github.com/chienniman/YouBikeNotify-Bot)。

## 特點

* `自動化查詢`
* `部署Render雲服務`
* `排程每日通知`

![](/images/youbikeLinebot/ubike-robot-result.webp)

## SDK

其他語言參考[Official SDKs](https://developers.line.biz/en/docs/downloads/)，官方提供

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

**環境變數&金鑰**
![](/images/youbikeLinebot/config.jpg)

## Cron

```
npm install --save node-cron
```

![](/images/youbikeLinebot/cron.jpg)

## 臺中交通資訊 API

上網搜了一下發現臺中交通資訊 API 整合的相當不錯，Swagger 的文件架構清晰，井然有序，這邊給個讚，~~台中路面狀況如果也可以就謝天謝地了~~。
[臺中交通資訊 API](https://motoretag.taichung.gov.tw/DataAPI/swagger/ui/index#/YoubikeAPI)
![](/images/youbikeLinebot/youbike-api.jpg)
![](/images/youbikeLinebot/query-ubike.jpg)


### LINE Developers

首先要先創建一個 LINE Developers 帳號
[註冊網址](https://developers.line.biz/en/)

### LINE Bot channel

登入後點選 Create new channel 創建新的 LINE Bot 頻道，並且填寫頻道相關資訊（例如：頻道名稱、頻道圖片、類型等等）。
![](/images/youbikeLinebot/channel.jpg)

## ngrok

> ngrok 做為一個轉發的伺服器，他可以把外界的請求轉發到你指定的 Port，使用的背景原理是連接到 ngrok 雲端伺服器，將你本機指定的地址公開，再將由 ngrok 一串公開的網址來存取內容。他的優點是快速而且還提供了 https 的服務讓你使用上更安全，甚至你還可以設置密碼保護。

[ref-[Day-37] 使用 ngrok 讓外網連接你的 API](https://ithelp.ithome.com.tw/articles/10197345)

### 安裝

[ngrok](https://ngrok.com/)

### 執行

`windows，雙擊 exe`

`linux， cd ngrok`

```
ngrok.exe http {port}
```

### 映射

```
<!-- 雲端=>本地 -->
Forwarding https://xxxxxx.ngrok.io -> localhost:{port}
```

### 資安

沒有正確地設定 ngrok，防火牆、密碼，可能導致安全風險，使用完記得`ctrl+c`退出

### 驗證失敗

ngrok 運行 500，terminal 顯示 404，因為 token 沒設定好
![](/images/youbikeLinebot/500.jpg)

![](/images/youbikeLinebot/404.jpg)

## 部署雲端

> 官方文件[nodejs-on-rende](https://github.com/haojiwu/line-bot-nodejs-on-render)

1.設定[render.yaml](https://github.com/chienniman/YouBikeNotify-Bot/blob/main/render.yaml) 
2.新增 Web Service
3.Public Git repository 
4.設定姓名、環境、區域 
5.編譯部屬成功
![deploy-success](https://user-images.githubusercontent.com/97031067/223740969-e16e8586-e53b-491b-9caf-0eee42233eaa.jpg)

## 免費限制

> Free instance types are not available for Private Services, Background Workers, or Cron Jobs.<br>
> Web Services on the free instance type are automatically spun down after 15 minutes of inactivity. When a new request for a free service comes in, Render spins it up again so it can process the request.
> This can cause a response delay of up to 30 seconds for the first request that comes in after a period of inactivity.<br>

{% note warning no-icon %}
* 本地伺服器可自動排程，但 render 雲的免費計畫不支援 
* 超過 15 分鐘沒有活動，伺服器會自動停止，直到新的請求，造成延遲響應。
{% endnote %}

## 心得

youbike 地圖相當方便，但是查詢、紀錄、比較等重複性工作仍可優化，都說科技始終來自惰性，有了排程查詢機器人後只需要被動等待通知，但缺點也是相當明顯，不穩定的響應(1 秒~6 分鐘)，注定讓免費計畫只能作為實驗用途，很少使用者能接受超過 5 秒的等待，會不會升級成付費版本目前還在觀察中。

