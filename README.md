# Boris 軟體坊

> 專注於後端開發心得與技術實戰的技術部落格

## 🚀 快速開始

### 環境要求

- Node.js 16.x 或更高版本
- Git
- npm 或 yarn

### 初次安裝

```bash
# 1. 克隆專案（包含 submodule）
git clone --recursive https://github.com/chienniman/chienniman.github.io.git
cd chienniman.github.io

# 2. 如果已經克隆但沒有 submodule，執行：
git submodule update --init --recursive

# 3. 安裝依賴
npm install

# 4. 清除快取並生成網站
npm run clean
npm run build

# 5. 啟動開發伺服器
npm run server
```

現在可以在 http://localhost:4000 查看網站！

## 📁 專案結構

```
├── source/                 # 網站源碼
│   ├── _posts/             # 文章目錄
│   ├── images/             # 圖片資源
│   │   └── posts/          # 文章專用圖片
│   └── about/              # 關於頁面
├── themes/butterfly/       # Butterfly 主題 (submodule)
├── public/                 # 生成的靜態文件
├── scripts/                # 自動化腳本
├── _config.yml            # Hexo 主配置
├── _config.butterfly.yml  # 主題配置
└── package.json           # 專案依賴
```

## 🛠️ 常用指令

### 基本操作

```bash
# 清除快取
npm run clean

# 生成靜態文件
npm run build

# 啟動開發伺服器
npm run server

# 一鍵重建並啟動
npm run rebuild-and-serve

# 部署到 GitHub Pages
npm run deploy
```

### 文章管理

```bash
# 新增文章（會自動創建對應圖片目錄）
npm run new-post "文章標題"

# 刪除文章（會同時刪除文章檔案和圖片目錄）
npm run delete-post "文章檔名"
```

### Submodule 管理

```bash
# 更新所有 submodule 到最新版本
npm run update-submodules

# 手動更新 Butterfly 主題
cd themes/butterfly
git pull origin master
cd ../..
```

## ✍️ 寫作指南

### 1. 創建新文章

```bash
npm run new-post "我的新文章"
```

這會自動創建：
- `source/_posts/我的新文章.md`
- `source/images/posts/我的新文章/` 目錄

### 2. 圖片使用

將圖片放到對應的文章目錄中，然後在 markdown 中使用絕對路徑：

```markdown
![圖片描述](/images/posts/文章檔名/圖片名稱.jpg)
```

### 3. 文章 Front Matter 範例

```yaml
---
title: 文章標題
link: 文章連結（英文）
lang: cn
tags:
  - 標籤1
  - 標籤2
categories:
  - 分類名稱
date: 2025-10-25 15:30:00
author: Boris
description: 文章簡短描述
keywords:
  - 關鍵字1
  - 關鍵字2
---
```

## 🎨 主題配置

主要配置文件：
- `_config.yml` - Hexo 基本配置
- `_config.butterfly.yml` - Butterfly 主題配置

### 常見主題設定

```yaml
# 關閉/開啟某些效果（提升效能）
fireworks:
    enable: false  # 煙火點擊效果

canvas_ribbon:
    enable: false  # 背景彩帶效果

# 社交連結
social:
    fab fa-github: https://github.com/username || Github
    fas fa-envelope: mailto:email@example.com || Email
```

## 🚀 部署

### GitHub Pages 自動部署

```bash
npm run deploy
```

這會自動：
1. 生成靜態文件
2. 推送到 GitHub Pages
3. 觸發網站更新

### 手動部署流程

```bash
# 1. 清除並重新生成
npm run clean
npm run build

# 2. 檢查生成結果
ls public/

# 3. 部署
npm run deploy
```

## 🔧 故障排除

### 常見問題

**問題：圖片無法顯示**
```bash
# 解決方案：使用絕對路徑
![圖片](/images/posts/文章名/圖片.jpg)
```

**問題：主題更新後網站異常**
```bash
# 解決方案：清除快取重新生成
npm run clean
npm run build
```

**問題：submodule 更新失敗**
```bash
# 解決方案：重新初始化 submodule
git submodule deinit themes/butterfly
git submodule update --init themes/butterfly
```

**問題：開發伺服器卡住**
```bash
# 解決方案：完全重啟
Ctrl+C  # 停止伺服器
npm run rebuild-and-serve  # 重新啟動
```

## 📝 開發注意事項

### 效能優化
- 圖片建議使用 WebP 格式
- 避免過大的圖片（建議 < 1MB）
- 關閉不必要的動畫效果

### 圖片命名規則
- 使用英文檔名
- 小寫字母 + 連字符
- 有意義的命名：`screenshot-login-page.jpg`

### Git 操作
```bash
# 提交更改（包含 submodule）
git add .
git commit -m "更新文章"
git push

# 更新 submodule
git submodule update --remote
git add themes/butterfly
git commit -m "更新主題"
git push
```

## 📞 聯絡方式

- **Email**: cscs851210max@gmail.com
- **LINE ID**: boris_line_id
- **GitHub**: https://github.com/chienniman

---

Made with ❤️ by Boris | Powered by [Hexo](https://hexo.io/) & [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly)