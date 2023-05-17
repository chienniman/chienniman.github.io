---
title: (技術)30秒解決Dcard彈跳視窗
tags:
    - Frontend
abbrlink: d0fe
date: 2023-02-28 14:12:05
author: Boris Chien
description: 有時在網路上看到有趣的Dcard文章，好奇點進去，看留言時卻跳出討厭的登入視窗，這篇文章會示範如何用開發者工具在30秒內關閉。
keywords:
    - Frontend
    - Dcard
    - Modal
categories:
    - Frontend
---

## 可以不要一直叫我登入嗎

有時在網路上看到有趣的 Dcard 文章，好奇點進去，看留言時卻跳出討厭的登入視窗，這篇文章會示範如何用開發者工具在 30 秒內關閉

1. 點擊 F12，開發者工具
   ![](/images/dcard/page.jpg)

2. 找到彈跳視窗根元素(最外層，屬性 tabindex="0")，點滑鼠右鍵，刪除元素，這時候就可以看到乾淨漂亮的頁面了~但是還是不能滾動
   ![](/images/dcard/root-element.jpg)

3. 往上滑找到 body 元素，element 屬性加上 overflow:scroll
   ![](/images/scroll.jpg)

4. 大功告成，不需要打帳密了

## 全自動執行

做成 Chrome Extension，這裡提供思路，封裝實作可以參考[這篇文章](https://ithelp.ithome.com.tw/articles/10186017)

{% codeblock lang:js %}
window.addEventListener('load', function() {
    const popup = document.getElementById({modal--id});
    if (popup) {
    popup.remove();
    document.body.style.overflow = 'scroll';
    }
});
{% endcodeblock %}

## 免責聲明
本文僅為客戶端提供教學示範之用，請勿用於任何影響網頁正常運作的技術，否則將承擔相應的法律責任。

