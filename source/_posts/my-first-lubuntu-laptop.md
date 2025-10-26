---
title: 老舊筆電重生指南：用 Lubuntu 打造你的專屬輕量級開發機
link: my-first-lubuntu-laptop
lang: cn
tags:
  - Linux
  - Lubuntu
  - 伺服器
author: Boris Chien
keywords:
  - 老舊筆電改造
  - Lubuntu 安裝
  - 輕量級 Linux
  - 開發機設置
  - 小型伺服器
description: 別讓老舊筆電成為電子垃圾！本文詳細介紹如何用 Lubuntu 讓你的舊筆電變廢為寶，成為高效的輕量級開發機或小型伺服器，延長硬體生命週期的同時節省成本。
categories:
  - Linux
date: 2023-04-23 20:20:37
---

## 為什麼要讓老舊筆電重生？

你是不是也有一台放在抽屜裡積灰塵的舊筆電？每次開機等到天荒地老，風扇轉得像飛機要起飛一樣？別急著丟掉啊！

其實這些看似要退休的筆電還能發揮不少功用：
- 拿來寫程式、測試一些小專案
- 架個人網站或是簡單的API服務
- 跑一些資料處理的腳本
- 當作學習Linux的練習機，壞了也不心疼

我的想法很簡單：花最少的錢，讓舊硬體發揮最後的價值。與其讓它們在抽屜裡當電子垃圾，不如給它們第二次生命。

## 我的舊筆電改造實例
![asus-laptop示意圖，非實物](/images/posts/my-first-lubuntu-laptop/asus-laptop.jpg)
### 硬體規格（2021年入手，8000元）
* **處理器**：Intel Celeron N4020 (1.1 GHz, 最高 2.8 GHz)
* **記憶體**：4GB DDR4
* **儲存空間**：64GB eMMC
* **螢幕**：11.6" HD 霧面螢幕
* **重量**：1.05KG（輕巧便攜）

### Windows 時期的各種問題
這台筆電本來裝的是Windows 10 S模式，用起來真的很痛苦：
- 開機超級慢，每次都要等個兩分鐘才能用
- 開幾個Chrome分頁CPU就飆到90%，整台電腦卡到不行
- 64GB的儲存空間扣掉系統後根本不夠用
- 偶爾還會黑屏當機，真的很煩躁

### 裝了Lubuntu之後完全不一樣
- 開機時間從兩分鐘縮短到30秒左右
- 可以同時開發環境、瀏覽器、終端機都不會卡
- 內建Python、Git、Node.js等開發工具，很方便
- 舊硬體配上免費的作業系統，CP值超高

## 為什麼選擇 Lubuntu？

### 與其他 Linux 發行版比較

| 發行版 | 記憶體需求 | 適用場景 | 學習難度 |
|--------|------------|----------|----------|
| **Lubuntu** | 512MB 起 | 老舊硬體、輕量使用 | ⭐⭐ 簡單 |
| Ubuntu | 2GB 起 | 一般桌面使用 | ⭐⭐⭐ 中等 |
| Debian | 1GB 起 | 伺服器、進階用戶 | ⭐⭐⭐⭐ 較難 |
| CentOS | 1GB 起 | 企業伺服器 | ⭐⭐⭐⭐⭐ 困難 |

### Lubuntu的好處
- 輕量級設計：雖然基於Ubuntu，但吃的資源非常少
- 專為舊硬體優化：LXDE桌面環境跑起來很順
- 對開發者友善：軟體安裝和管理都很方便
- 文檔資源豐富：Ubuntu生態系的好處就是資料很多

## 動手改造：完整安裝指南

### 準備工作
開始之前先準備這些東西：
- 一支8GB以上的USB隨身碟
- 記得備份重要資料（等等會格式化硬碟）
- 下載Lubuntu的ISO檔案
- 準備Rufus燒錄工具

### 步驟一：下載Lubuntu映像檔
到[Lubuntu官方網站](https://lubuntu.me/downloads/)下載最新的LTS版本。建議選LTS版本是因為：
- 有5年的安全更新
- 比較穩定，不會有奇怪的bug
- 軟體相容性比較好

### 步驟二：製作開機碟
用[Rufus](https://rufus.ie/)來製作開機碟，這個軟體很簡單好用：

![使用 Rufus 製作開機碟](/images/posts/my-first-lubuntu-laptop/rufus.jpg)

設定很簡單：
1. 選擇你的USB隨身碟
2. 選擇剛下載的Lubuntu ISO檔
3. 分割區配置看你的電腦選UEFI或BIOS就好

### 步驟三：進入UEFI設定
不同廠牌的筆電進UEFI的按鍵不太一樣：
- ASUS：開機時按F2
- Acer：開機時按F2或Del
- HP：開機時按F10或Esc
- Lenovo：開機時按F1或F2
- Dell：開機時按F2或F12

![UEFI 設定畫面](/images/posts/my-first-lubuntu-laptop/uefi.jpg)

主要要做這幾件事：
1. 把USB設為第一開機順序
2. 如果有Secure Boot就關掉
3. 存檔重開機

### 步驟四：開始安裝Lubuntu
插入USB開機碟重新啟動，會看到GRUB選單：

![Lubuntu 開機選單](/images/posts/my-first-lubuntu-laptop/install-1.jpg)

這裡有幾個選項：
- Try Lubuntu：先試用看看，不會動到硬碟
- Install Lubuntu：直接安裝（建議先試用確認硬體都能正常運作）
- Safe Graphics：如果螢幕有問題就選這個
- Test Memory：測試記憶體有沒有壞掉

### 步驟五：系統試用與硬體檢測
建議先選「Try Lubuntu」確保所有硬體都能正常運作：

![Lubuntu 桌面預覽](/images/posts/my-first-lubuntu-laptop/install-2.jpg)

要測試的項目：
- WiFi能不能連線
- 音效有沒有聲音
- 觸控板/滑鼠靈不靈敏
- USB孔能不能用
- 螢幕亮度調節正不正常

確認都沒問題後，點桌面上的「Install Lubuntu」圖示開始安裝。

### 步驟六：安裝設定
![安裝設定選項](/images/posts/my-first-lubuntu-laptop/install-3.jpg)

語言和地區設定：
![選擇地理位置](/images/posts/my-first-lubuntu-laptop/install-4.jpg)
選擇「Taiwan」確保時區對，這也會影響軟體更新的伺服器選擇。

鍵盤設定：
![鍵盤配置](/images/posts/my-first-lubuntu-laptop/install-5.jpg)
建議選「Chinese (Traditional)」，之後還是可以改。

硬碟分割（很重要！）：
![硬碟分割設定](/images/posts/my-first-lubuntu-laptop/install-6.jpg)

注意：這個步驟會把整個硬碟的資料都清掉！

對於64GB硬碟的建議分割：
- 根目錄(/)：50GB，用ext4格式
- swap：4GB（跟記憶體大小一樣）
- /home：剩下的空間，放使用者資料

使用者帳號設定：
![設定使用者密碼](/images/posts/my-first-lubuntu-laptop/install-7.jpg)

安全考量：
- 用強一點的密碼（至少8位，有數字和符號）
- 勾選「要求密碼登入」比較安全
- 電腦名稱建議用英文，網路辨識比較方便

最終確認：
![安裝前最終確認](/images/posts/my-first-lubuntu-laptop/install-8.jpg)

仔細檢查所有設定，確認沒問題就按「Install」。整個安裝過程大概20-30分鐘。

## 裝完之後要做的事

### 1. 更新系統
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. 裝中文輸入法
```bash
sudo apt install ibus-chewing
```

### 3. 裝開發工具
```bash
# Git版本控制
sudo apt install git

# Node.js開發環境  
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs

# Python開發環境
sudo apt install python3-pip

# VS Code編輯器
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update
sudo apt install code
```

## 實際用途

### 當開發機用
- 寫Python腳本：處理資料、網頁爬蟲
- Web前端開發：HTML、CSS、JavaScript
- 做小型API：Flask、FastAPI專案
- 寫文檔：Markdown、技術文件

### 當小伺服器用
- 家用檔案伺服器：Samba、FTP服務
- 個人網站：Nginx + PHP/Python
- 資料庫：MySQL、PostgreSQL
- 自動化：定時備份、資料同步

### 學習實驗
- 練習Linux指令：有個安全的環境可以亂搞
- 學系統管理：用戶管理、網路設定
- 測試資安工具：網路掃描、滲透測試

## 效能調校小技巧

### 1. 關掉不需要的服務
```bash
# 看看有哪些服務在開機時啟動
systemctl list-unit-files --type=service --state=enabled

# 關掉用不到的服務（比如藍牙）
sudo systemctl disable bluetooth
```

### 2. 用ZRAM提升記憶體效率
```bash
sudo apt install zram-config
```

### 3. SSD最佳化
```bash
# 在/etc/fstab中加入noatime參數
sudo nano /etc/fstab
# 範例：UUID=xxx / ext4 defaults,noatime 0 1
```

## 划算嗎？

### 花費成本
- 舊筆電回收利用：0元
- USB隨身碟：200元（還可以重複使用）
- 時間投資：2-3小時

### 得到什麼
- 專用開發環境：市價15,000元以上的輕薄筆電功能
- 24小時小型伺服器：雲端VPS每個月要300-500元
- 學習實驗平台：這個真的無價

投資報酬率根本爆表！

## 遇到問題怎麼辦

### 常見問題解法

WiFi連不上：
```bash
# 安裝額外驅動
sudo ubuntu-drivers autoinstall
```

中文顯示亂碼：
```bash
# 安裝中文字體
sudo apt install fonts-noto-cjk
```

沒有聲音：
```bash
# 重新載入音效驅動
sudo alsa force-reload
```

## 總結：給舊筆電第二次生命

一開始我把這台筆電當成內網的小伺服器來用，整體表現真的很棒。用htop看記憶體使用率，閒置時比原本裝Windows低很多。之前用Windows的時候，開幾個瀏覽器分頁就會當機，因為記憶體經常飆到99%。換成Lubuntu之後完全沒有這個困擾，可以同時用GUI和CLI真的很方便，也不用被微軟強制更新綁架。

如果你也有用不到的舊筆電，真的推薦試試看重灌Lubuntu。這台筆電後來整理好就送給親戚用了，到現在2025年10月都沒有遇過任何bug，運作得很穩定。