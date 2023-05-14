---
title: 無限嵌套的網頁-Iframe
tags:
    - Iframe
    - Frontend
abbrlink: cfa3
date: 2023-02-20 21:14:23
author: Boris Chien
description: HTML 標籤中的一種，用來在網頁中嵌入另一個網頁或者其他資源，以Youtube例子，最簡單的方式點擊影片的分享、嵌入，複製貼進html，大功告成
keywords:
    - Iframe
categories:
    - Frontend
---

HTML 標籤中的一種，用來在網頁中嵌入另一個網頁或者其他資源，Youtube 為例，最簡單是點擊影片的分享、嵌入，複製貼進 html，大功告成，
![](/images/embed.jpg)

## 假設想要客製化呢?
-   想客製化屬性，例如禁音、循環播放、定時停止、兩倍速等，就需要使用 Youtube API。
 1.設定 div 的 id 為 player

```
<div id="player"></div>
```

2.載入 IFrame Player API 程式碼

```
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
<!-- 確保被插入第一個script前 -->
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
```

3.API Script 載入後創造 iframe

```
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'M7lc1UVf-VE',
      playerVars: {
        'playsinline': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
  });
}
```

4.影片播放

```
function onPlayerReady(event) {
    event.target.playVideo();
}
```

5.使用者狀態改變，會呼叫此 API，播放 6 秒即停下

```
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }
}
<!-- 停止播放 -->
function stopVideo() {
    player.stopVideo();
}
```

6.兩倍數播放

```
 player.setPlaybackRate(2)

```

右邊的 widget 聊天，tidio 聊天室，也是iframe，在網站使用第三方頁面，豐富內容，不過也會帶來壞處，筆者會從效能、維護性、安全性、SEO 進行分析，

## 效能
網頁包含多個 iframe，會增加網頁的載入時間，導致用戶體驗變差。也可能會導致瀏覽器重新載入整個網頁，進一步降低網頁效能。

## 維護性
在網頁中使用 iframe 可能會使代碼變得更加複雜和難以維護，因為需要管理多個不同的 HTML 文件。

## 安全性
由於 iframe 允許在網頁中嵌入第三方內容，攻擊者可以通過嵌入有害的代碼來進行跨站攻擊（Cross-site scripting, XSS）等攻擊。為了防止這些攻擊，可以使用以下方法：

1. 同源策略：瀏覽器會檢查 iframe 中嵌入的文檔是否與當前文檔同源，即域名、端口和協議是否相同。如果不同源，瀏覽器就會禁止對嵌入文檔的訪問，以防止攻擊者通過這種方式進行攻擊。

2. Content Security Policy:是一種安全機制，用於限制在網頁中執行的 JavaScript 代碼。可以使用 CSP 來限制 iframe 中嵌入的 JavaScript 代碼，以防止 XSS 等攻擊。

3. frame-ancestors:可以使用 HTTP header 的 frame-ancestors 防嵌入。你問為什麼要防嵌入嗎?因為不法分子可以盜嵌別人的網站賺錢、引流到自己的網站。

## SEO

搜索引擎可能難以識別 iframe 中的內容，對 SEO 產生負面影響。

## 反思

如果 iframe 可以嵌套 iframe，最多可以嵌套幾層呢?

## 參考

[IFrame 播放器 API](https://developers.google.com/youtube/iframe_api_reference)
