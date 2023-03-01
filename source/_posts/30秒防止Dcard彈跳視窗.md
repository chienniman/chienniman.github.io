---
title: 30秒解決Dcard彈跳視窗
tags:
  - Frontend
  - React.js
  - Mantine
cover: /images/dcard.jpg
abbrlink: d0fe
date: 2023-02-28 14:12:05
author: Boris Chien
description: 有時在網路上看到有趣的Dcard文章，好奇點進去，看留言時卻跳出討厭的登入視窗，這篇文章會示範如何用開發者工具在30秒內關閉，並教你如何自己做一個彈跳視窗。
keywords:
  - Frontend
  - React.js
  - Mantine
  - Dcard
  - Modal
---
## 可以不要一直叫我登入嗎
有時在網路上看到有趣的Dcard文章，好奇點進去，看留言時卻跳出討厭的登入視窗，這篇文章會示範如何用開發者工具在30秒內關閉，並教你如何自己做一個彈跳視窗
1. 點擊F12，開發者工具
![](/images/dcard.jpg)

2. 找到彈跳視窗根元素(最外層，屬性tabindex="0")，點滑鼠右鍵，刪除元素，這時候就可以看到乾淨漂亮的頁面了~但是還是不能滾動
![](/images/root-element.jpg)

3. 往上滑找到body元素，element屬性加上overflow:scroll
![](/images/dcard-scroll.jpg)

4. 大功告成，不需要打帳密了

## 全自動執行
做成Chrome Extension，這裡提供思路，封裝實作可以參考[這篇文章](https://ithelp.ithome.com.tw/articles/10186017)

{% codeblock lang:js %}
window.addEventListener('load', function() {
    const popup = document.getElementById({modal--id});
    if (popup) {
        popup.remove();
        document.body.style.overflow = 'scroll';
    }
});
{% endcodeblock %}

## 魔法對付魔法-自己做一個彈跳視窗
不少函式庫都有封裝好的元件可以使用，以React components庫Mantine來舉例
### React.js
{% codeblock lang:js %}
import { useState } from 'react';
import { Modal, Button, Group } from '@mantine/core';

function Demo() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Introduce yourself!"
      >
        {/* Modal content */}
      </Modal>

      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group>
    </>
  );
}
{% endcodeblock %}
![](/images/mantine-modal.jpg)
[mantine modal](https://mantine.dev/core/modal/)

## 免責聲明
本文僅為客戶端提供教學示範之用，請勿用於任何影響網頁正常運作的技術，否則將承擔相應的法律責任。

本文所述的技術僅限於學習和研究目的，任何使用者若因濫用本文中的技術所造成的任何損失或損害，作者概不負責。

任何使用者在使用本文中的技術前，應該仔細閱讀並理解相關技術的風險和可能的後果。使用者應自行承擔所有風險和責任，作者不對因使用本文中的技術所造成的任何損失或損害負責。

本文中提供的技術僅供參考，並不保證其準確性和可靠性。作者不承擔任何因使用本文中的技術而引起的損失或損害的任何責任。

最後，作者保留隨時修改本免責聲明的權利。任何修改將在本文中公佈，敬請留意。

敬祈使用者慎重考慮並尊重相關法律法規。