---
title: (技術)網頁打包壓縮的好用工具Parcel
date: 2023-03-12 17:00:11
tags:
    - Frontend
    - Parcel
abbrlink: "2482"
author: Boris Chien
description: 說到打包工具，多數人的第一直覺就是Webpack，我也不例外，今天就要介紹一個簡單快速的打包工具Parcel，適用於小型專案的開發。
keywords:
    - Frontend
    - Parcel
categories:
    - Frontend
---
說到打包工具，多數人的第一直覺就是Webpack，我也不例外，今天就要介紹一個簡單快速的打包工具Parcel，適用於小型專案的開發。

## 為何壓縮
伺服器中，會使用壓縮來減少頻寬和傳輸時間，從而提高網站性能和用戶體驗。通常壓縮的是返回給客戶端的HTML、CSS、JavaScript、圖像等靜態資源文件。透過減少文件大小。

網頁伺服器會使用一些壓縮算法，例如gzip和deflate，將靜態資源文件壓縮成壓縮包，然後在將壓縮包傳輸給客戶端。客戶端接收到壓縮包後，會解壓縮文件並顯示頁面。

壓縮技術可以提高網站性能，但壓縮也可能增加服務器的負擔和處理時間。此外，某些瀏覽器不支持特定的壓縮算法，因此需要在服務器端進行相應的配置和優化。

## 原生性能
>Parcel's JavaScript compiler, CSS transformer, and source maps implementation are written in Rust for maximum performance. It's 10-20x faster than other JavaScript-based tools!
Parcel's JavaScript compiler is built on SWC, which handles transpiling JavaScript, JSX, and TypeScript. On top of SWC, Parcel implements dependency collection, bundling, scope hoisting, tree shaking, Node emulation, hot reloading, and more.
Parcel's CSS transformer and minifier is built in Rust on top of the browser-grade CSS parser used in Firefox. It's over 100x faster than other JavaScript-based transformers and minifiers.

JavaScript 編譯器、CSS 轉換器和源映射實現是用Rust編寫的，以實現最佳性能。它比其他基於 JavaScript 的工具快 10-20 倍！
Parcel 的 JavaScript 編譯器建立在SWC之上，它處理轉譯 JavaScript、JSX 和 TypeScript。在 SWC 之上，Parcel 實現了依賴收集、捆綁、範圍提升、tree shaking、Node 仿真、熱重載等。
Parcel 的 CSS 轉換器和縮小器是在 Firefox 中使用的瀏覽器級 CSS 解析器之上的 Rust 中構建的。比其他JavaScript 的轉換器和壓縮器快 100 倍以上。

## 快取
>Everything Parcel does is cached – transformation, dependency resolution, bundling, optimizing, and everything in between. This means the dev server restarts instantly, and the same code is never built twice.
Parcel automatically tracks all of the files, configuration, plugins, and dev dependencies that are involved in your build, and granularly invalidates the cache when something changes. It integrates with low-level operating system APIs to determine what files have changed in milliseconds, no matter the project size.

Parcel 所做的一切都被緩存——轉換、依賴解析、捆綁、優化，以及介於兩者之間的一切。這意味著開發伺服器會立即重新啟動，並且永遠不會構建相同的代碼兩次。
自動追蹤構建中所有文件、配置、插件和依賴項，並在變化時使緩存失效。與低階操作系統 API 整合，無論項目大小如何，都可以在幾毫秒內確定哪些文件發生了變化。

## 安裝
```
npm install --save-dev parcel
```
## 配置
```
{
  "name": "my-project",
  "source": "src/index.html",
  "scripts": {
    "start": "parcel",
    "build": "parcel build"
  },
  "devDependencies": {
    "parcel": "latest"
  }
}
```

## 資料夾
```
my-app/
  |- dist/                 # 編譯後代碼
  |  |- index.html         # 打包後的 HTML 
  |  |- main.js            # 打包後的 JavaScript 
  |- node_modules/         # 第三方庫
  |- src/                  # 源碼
  |  |- index.html         # HTML 入口
  |  |- main.js            # JavaScript 入口
  |- package.json          # 配置
  |-.parcel-cache          # 打包緩存
```
[開發環境](https://parceljs.org/features/development/)
[生產環境](https://parceljs.org/features/production/)

## JavaScript
介紹Parcel中js的配置前，先了解ES modules跟 CommonJS 的差異。

## 載入
ES modules 使用 import 載入模組，而 CommonJS 使用 require 載入模組。ES modules 在運行時進行靜態解析，而 CommonJS 在運行時動態載入。

## 編譯
ES modules 在編譯時會進行預解析和標記，使得編譯器能夠在編譯時知道哪些模組需要載入，而 CommonJS 則是在運行時動態載入，因此需要進行動態解析和加載，相對於 ES modules 更耗費運行時的資源。

## 輸出
ES modules 使用 export 輸出模組，而 CommonJS 使用 module.exports 輸出模組。ES modules 可以直接將對象、函數等直接作為輸出，而 CommonJS 必須透過 module.exports 將需要輸出的對象或函數包裝成對象再進行輸出。

## 結論
總之，ES modules 是一種新的模組化，比起CommonJS，有更好的靜態解析能力，支持標記和預解析，並且可以在編譯時優化。然而，目前在瀏覽器中 ES modules 的支援度還不夠完善，需要透過轉譯或者 polyfill 來實現，而 CommonJS 則是在 Node.js 等環境中得到了廣泛的使用。

## ES modules
add.js
{% codeblock lang:js %}
export function add(a, b) {
  return a + b;
}
{% endcodeblock %}

sum.js
{% codeblock lang:js %}
import {add} from './add.js';

export function sum(x,y) {
  return add(x, y);
}
{% endcodeblock %}

## CommonJS
add.js
{% codeblock lang:js %}
exports.add=function(a, b) {
  return a + b;
}
{% endcodeblock %}

sum.js
{% codeblock lang:js %}
const add=require('./add.js');

exports.sum=function(x,y) {
  return add(x, y);
}
{% endcodeblock %}

## 總結
與Webpack相比，Parcel的生態和功能有限，較難進行進階的設置。因此，在選擇使用Webpack還是Parcel時，需要根據具體需求和技術做出選擇。如果是在簡單項目中快速構建和開發，Parcel可能是一個不錯的選擇；如果需要更高度的客製化和擴展性，Webpack可能更符合需求。

## 參考資料
[Parcel](https://parceljs.org/)