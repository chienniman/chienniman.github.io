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

你是否也有一台放在抽屜裡吃灰的舊筆電？運行 Windows 卡頓、風扇狂轉、開機要等半天？**別急著丟掉！** 

這些「退役」的筆電其實可以變身為：
- 🖥️ **輕量級開發機** - 寫程式、測試專案
- 🌐 **小型 Web 伺服器** - 架設個人網站、API 服務
- 📊 **資料處理工具** - 跑腳本、批次處理
- 🔧 **學習 Linux 的實驗機** - 安全環境下練習指令

**核心理念**：用最小的投資，獲得最大的效益，讓硬體發揮最後價值！

## 我的舊筆電改造實例
![asus-laptop示意圖，非實物](/images/posts/my-first-lubuntu-laptop/asus-laptop.jpg)
### 硬體規格（2021年入手，8000元）
* **處理器**：Intel Celeron N4020 (1.1 GHz, 最高 2.8 GHz)
* **記憶體**：4GB DDR4
* **儲存空間**：64GB eMMC
* **螢幕**：11.6" HD 霧面螢幕
* **重量**：1.05KG（輕巧便攜）

### Windows 時期的痛點
- 🐌 **開機超慢**：Windows 10 S 模式限制重重
- 🔥 **效能瓶頸**：開幾個 Chrome 分頁就 CPU 飆到 90%
- 💾 **儲存空間不足**：64GB 扣掉系統後所剩無幾
- ⚡ **偶發性當機**：黑屏閃退問題

### Lubuntu 改造後的蛻變
- ⚡ **開機時間**：從 2 分鐘縮短到 30 秒
- 💻 **多工處理**：同時運行開發環境、瀏覽器、終端機無壓力
- 🔧 **開發友善**：內建 Python、Git、Node.js 環境
- 💰 **成本效益**：舊硬體 + 免費系統 = 高性價比開發機

## 為什麼選擇 Lubuntu？

### 與其他 Linux 發行版比較

| 發行版 | 記憶體需求 | 適用場景 | 學習難度 |
|--------|------------|----------|----------|
| **Lubuntu** | 512MB 起 | 老舊硬體、輕量使用 | ⭐⭐ 簡單 |
| Ubuntu | 2GB 起 | 一般桌面使用 | ⭐⭐⭐ 中等 |
| Debian | 1GB 起 | 伺服器、進階用戶 | ⭐⭐⭐⭐ 較難 |
| CentOS | 1GB 起 | 企業伺服器 | ⭐⭐⭐⭐⭐ 困難 |

### Lubuntu 的優勢
- 🪶 **輕量級設計**：基於 Ubuntu，但資源占用極低
- 🎯 **專為舊硬體優化**：LXDE 桌面環境，效能優先
- 🛠️ **開發友善**：完整的軟體套件管理系統
- 📚 **豐富文檔**：Ubuntu 生態系統的文檔支援

## 動手改造：完整安裝指南

### 準備工作清單
- [ ] 8GB 以上 USB 隨身碟
- [ ] 備份重要資料
- [ ] 下載 Lubuntu ISO 檔案
- [ ] 準備 Rufus 燒錄工具
### 步驟一：下載 Lubuntu 映像檔
前往 [Lubuntu 官方網站](https://lubuntu.me/downloads/) 下載最新的 LTS 版本（長期支援版本）
![Ubuntu Jammy Jellyfish 下載頁面](/images/posts/my-first-lubuntu-laptop/jammy-fish.jpg)

**建議選擇 LTS 版本的原因：**
- 🛡️ 5年安全更新支援
- 🔒 穩定性更高，適合生產環境
- 📦 軟體套件相容性更好

### 步驟二：製作開機碟
使用 [Rufus](https://rufus.ie/) 製作開機碟，這是最簡單可靠的方法：

![使用 Rufus 製作開機碟](/images/posts/my-first-lubuntu-laptop/rufus.jpg)

**Rufus 設定要點：**
1. **裝置**：選擇你的 USB 隨身碟
2. **開機選擇**：選擇剛下載的 Lubuntu ISO 檔
3. **資料分割配置**：依據你的電腦選擇 UEFI 或 BIOS

### 步驟三：進入 UEFI 設定
**不同品牌筆電進入 UEFI 的按鍵：**
- ASUS：開機時按 F2
- Acer：開機時按 F2 或 Del
- HP：開機時按 F10 或 Esc
- Lenovo：開機時按 F1 或 F2
- Dell：開機時按 F2 或 F12

![UEFI 設定畫面](/images/posts/my-first-lubuntu-laptop/uefi.jpg)

**重要設定：**
1. 將 USB 設為第一開機順序
2. 關閉 Secure Boot（如果有的話）
3. 儲存設定並重新開機

### 步驟四：開始安裝 Lubuntu
插入 USB 開機碟，重新啟動電腦，你會看到 GRUB 選單：

![Lubuntu 開機選單](/images/posts/my-first-lubuntu-laptop/install-1.jpg)

**安裝選項說明：**
- **Try Lubuntu**：先體驗系統，不會改變硬碟
- **Install Lubuntu**：直接安裝（建議先試用確認硬體相容性）
- **Safe Graphics**：如果有顯示問題就選這個
- **Test Memory**：檢測記憶體是否有問題

### 步驟五：系統試用與硬體檢測
建議先選擇「Try Lubuntu」來確保所有硬體都能正常運作：

![Lubuntu 桌面預覽](/images/posts/my-first-lubuntu-laptop/install-2.jpg)

**需要測試的項目：**
- ✅ WiFi 連線是否正常
- ✅ 音效輸出是否正常  
- ✅ 觸控板/滑鼠是否靈敏
- ✅ USB 連接埠是否可用
- ✅ 螢幕亮度調節是否正常

確認無誤後，點擊桌面上的「Install Lubuntu」圖示開始安裝。

### 步驟六：安裝配置
![安裝設定選項](/images/posts/my-first-lubuntu-laptop/install-3.jpg)

**語言和地區設定：**
![選擇地理位置](/images/posts/my-first-lubuntu-laptop/install-4.jpg)
- 選擇「Taiwan」確保時區正確
- 這會影響軟體更新伺服器的選擇

**鍵盤配置：**
![鍵盤配置](/images/posts/my-first-lubuntu-laptop/install-5.jpg)
- 建議選擇「Chinese (Traditional)」
- 可以在安裝後隨時更改

**硬碟分割（重要！）：**
![硬碟分割設定](/images/posts/my-first-lubuntu-laptop/install-6.jpg)

**⚠️ 注意：這個步驟會清除整個硬碟資料！**

**分割建議（64GB 硬碟）：**
- `/` (根目錄)：50GB，ext4 格式
- `swap`：4GB（與記憶體大小相同）  
- `/home`：剩餘空間，存放使用者資料

**使用者帳號設定：**
![設定使用者密碼](/images/posts/my-first-lubuntu-laptop/install-7.jpg)

**安全建議：**
- 使用強密碼（至少8位，包含數字和符號）
- 勾選「要求密碼登入」提高安全性
- 電腦名稱建議用英文，方便網路識別

**最終確認：**
![安裝前最終確認](/images/posts/my-first-lubuntu-laptop/install-8.jpg)

仔細檢查所有設定，確認無誤後點擊「Install」開始安裝。整個過程約需 20-30 分鐘。

## 安裝完成後的首要設定

### 1. 系統更新
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. 安裝中文輸入法
```bash
sudo apt install ibus-chewing
```

### 3. 安裝開發工具
```bash
# Git 版本控制
sudo apt install git

# Node.js 開發環境  
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs

# Python 開發環境
sudo apt install python3-pip

# VS Code 編輯器
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update
sudo apt install code
```

## 實際應用場景

### 作為輕量級開發機
- 🐍 **Python 腳本開發**：資料處理、網頁爬蟲
- 🌐 **Web 前端開發**：HTML、CSS、JavaScript
- 🔧 **小型 API 開發**：Flask、FastAPI 專案
- 📝 **文檔撰寫**：Markdown、技術文件

### 作為小型伺服器
- 🏠 **家用檔案伺服器**：Samba、FTP 服務
- 🌐 **個人網站主機**：Nginx + PHP/Python
- 📊 **資料庫服務**：MySQL、PostgreSQL
- 🔄 **自動化腳本**：定時備份、資料同步

### 學習和實驗環境
- 🐧 **Linux 指令練習**：安全的實驗環境
- 🔧 **系統管理學習**：用戶管理、網路設定
- 🛡️ **資安工具測試**：網路掃描、滲透測試

## 效能優化技巧

### 1. 關閉不必要的服務
```bash
# 查看開機啟動服務
systemctl list-unit-files --type=service --state=enabled

# 關閉不需要的服務（例如藍牙）
sudo systemctl disable bluetooth
```

### 2. 使用 ZRAM 提升記憶體效率
```bash
sudo apt install zram-config
```

### 3. SSD 優化設定
```bash
# 在 /etc/fstab 中加入 noatime 參數
sudo nano /etc/fstab
# 範例：UUID=xxx / ext4 defaults,noatime 0 1
```

## 成本效益分析

### 💰 總投資成本
- **舊筆電回收利用**：$0
- **USB 隨身碟**：$200（可重複使用）
- **時間投資**：2-3 小時

### 💎 獲得價值
- **專用開發環境**：市價 $15,000+ 的輕薄筆電功能
- **24/7 小型伺服器**：雲端 VPS 每月 $300-500
- **學習實驗平台**：無價的實作經驗

**投資報酬率：無限大！** 💪

## 故障排除指南

### 常見問題與解決方案

**問題：WiFi 無法連線**
```bash
# 解決方案：安裝額外驅動
sudo ubuntu-drivers autoinstall
```

**問題：中文顯示亂碼**  
```bash
# 解決方案：安裝中文字體
sudo apt install fonts-noto-cjk
```

**問題：音效無輸出**
```bash
# 解決方案：重新載入音效驅動
sudo alsa force-reload
```

## 總結：老舊硬體的新生命
一開始將這台筆電當作網頁伺服器，只架設在內網，但整體非常順暢，透過htop指令觀察閒置時記憶體的使用率低了很多，原先安裝windows系統，只要多打開幾個瀏覽器分頁就會死機，因為記憶體經常性飆破99%，改造過後測試沒遇到這個問題，另外可以同時使用GUI跟CLI真的很方便，也不用被微軟強制綁架更新電腦，真的推薦如果有用不到的筆電可以重灌lubuntu，這台筆電經過整理就送給親戚使用了，截止至2025/10作業系統沒有遇過任何bug。