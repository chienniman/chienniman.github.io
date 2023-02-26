---
title: 被Youbike衝康多次的我決定使用LineBot反擊
date: 2023-02-25 22:24:54
tags:
    - Backend
    - LineBot
    - Webhook
    - ngrok
    - LINE Developers
    - Youbike API
cover: /images/u-bike.jpg
---
# 被Youbike衝康多次的我決定使用LineBot反擊

每天依賴Youbike通勤上下班，眼瞅著手錶的指針朝上班的死線漸漸逼近，火急火燎趕到公司樓下卻發現沒有空位，常常車數非常極端，要不爆滿(全滿+一堆放旁邊用繩子綁著)，要不一台都沒，只能花費雙倍路程時間到上一站，上網搜尋可行的解決方案，手動查詢Youbike地圖是不錯的解決方案，但對壓線出門的懶人不是最佳解，那如果每天早上固定收到通知呢?

### Code
1.create repo、clone

2.安裝 Express.js 和 LINE Bot SDK，相依套件

```
npm install express @line/bot-sdk dotenv
```
我自己是選擇Node.js，其他語言需要參考一下[Official SDKs](https://developers.line.biz/en/docs/downloads/)，官方有提供
- Java
- PHP
- Go 
- Perl
- Ruby
- Python
- Node.js


3.創建一個 index.js 文件並啟動 Express.js 伺服器
### 本地測試
> 方法一(在相同內網情況下分享)
方法第一種是利用區網(此方法限定對方和你同時連上同一個網域)，適用的人像是跟你同時在同一個地方的工作夥伴，只要確保對方和你同時連上相同的區網就可以囉！
首先查詢你的電腦 ip 位置， windows 使用者開啟終端機輸入 ipconfig 即可查詢你目前 ip 位置，macOS 的使用者可以打開網路偏好設定裡面就有 ip 位置了。

### ngrok
> ngrok 做為一個轉發的伺服器，他可以把外界的請求轉發到你指定的 Port，使用的背景原理是連接到 ngrok 雲端伺服器，將你本機指定的地址公開，再將由 ngrok 一串公開的網址來存取內容。他的優點是快速而且還提供了 https 的服務讓你使用上更安全，甚至你還可以設置密碼保護。

[ref-[Day-37] 使用 ngrok 讓外網連接你的 API](https://ithelp.ithome.com.tw/articles/10197345)

#### 1.安裝
#### 2.執行

windows，點exe，linux， cd ngrok
```
ngrok.exe http {port}
```
#### 3.結果 
```
<!-- 雲端映射本地 -->
Forwarding https://xxxxxx.ngrok.io -> localhost:{port}
```
#### 4.設定
##### Line Webhook URL
```
https://{ngrok}/{route}
```
##### backend
```
app.post("/{route}", line.middleware(config), (req, res) => {
    <!--  logic here    -->
});
```



#### 5.注意
沒有正確地設定ngrok，防火牆、密碼，可能導致安全風險，使用完記得ctrl+c退出

#### 6.問題
ngrok運行500，terminal顯示404，因為token沒設定好
![](/images/500.jpg)


![](/images/404.jpg)

channel access tokens
![](/images/auth-login.jpg)
> For services available on the Internet, authentication via IDs and passwords is often used as a means of verifying whether a person has permission to use the service. LINE Developers also verifies and confirms that a person has permission to use a specific channel. However, entering an ID and password every time you use a channel (for Messaging API channels, every time you use an endpoint in the Messaging API) takes too much effort and is therefore suboptimal.
That is why LINE Developers uses channel access tokens as a means of authentication for channels. If you send the correct channel access token to LINE Developers, you are deemed to have permission to use the channel.

簡單來說，Channel Access Token 是一種憑證，讓LINE Bot 與 LINE 平台的 API 通訊。開發者中心的專案頁面上設定並取得一組 Channel Access Token，才能使用 LINE Bot SDK 中的 API 來發送訊息、接收事件等。

如果找不到，Channel Access Token在messaging-api的最下面，有個issue的按鈕，也要檢查env是否有正確設定

#### 7.成功
恭喜，到這邊你獲得一隻會打印hello world的webhook機器人
![](/images/success.jpg)



#### 7.朋友的悲慘~~搞笑~~故事
小弟的朋友花了幾千開了一台性能不錯的機器，興高采烈的要架設(私服)遊戲伺服器，沒設密碼，沒過幾天時間就被各路神仙開腸剖肚，被木馬感染，打遊戲的時候發現很卡，覺得很奇怪去查了以後發現資源都被拿去挖礦拉


## API
上網搜了一下發現臺中交通資訊API整合的相當不錯，Swagger的文件架構清晰，井然有序，這邊給個讚，~~台中路面狀況如果也可以就謝天謝地了~~。

[臺中交通資訊API](https://motoretag.taichung.gov.tw/DataAPI/swagger/ui/index#/YoubikeAPI)
![](/images/youbike-api.jpg)

## LINE 
### 創建 LINE Developers 帳號：
首先你需要先創建一個 LINE Developers 帳號
[註冊網址](https://developers.line.biz/en/)

### 創建 LINE Bot channel：
登入後點選 Create new channel 創建新的 LINE Bot 頻道，並且填寫頻道相關資訊（例如：頻道名稱、頻道圖片、類型等等）。
![](/images/channel.jpg)