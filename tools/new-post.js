const fs = require('fs');
const path = require('path');

// 獲取文章標題參數
const postTitle = process.argv[2];

if (!postTitle) {
    console.error('❌ 請提供文章標題！');
    console.log('用法: npm run new-post "文章標題"');
    process.exit(1);
}

// 轉換標題為檔案名稱（移除特殊字符，空格轉連字符）
const fileName = postTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-')     // 空格轉連字符
    .trim();

const projectRoot = path.resolve(__dirname, '..');
const postsDir = path.join(projectRoot, 'source', '_posts');
const imagesDir = path.join(projectRoot, 'source', 'images', 'posts');

// 創建文章檔案路徑
const postFilePath = path.join(postsDir, `${fileName}.md`);
const imagesDirPath = path.join(imagesDir, fileName);

// 檢查文章是否已存在
if (fs.existsSync(postFilePath)) {
    console.error(`❌ 文章已存在: ${fileName}.md`);
    process.exit(1);
}

// 獲取當前日期時間
const now = new Date();
const dateStr = now.toISOString().slice(0, 19).replace('T', ' ');

// 文章模板
const postTemplate = `---
title: ${postTitle}
link: ${fileName}
lang: cn
tags:
  - 
categories:
  - 
date: ${dateStr}
author: Boris
description: 
keywords:
  - 
---

## 前言

在這裡開始寫你的文章內容...

## 總結

總結你的文章要點...

## 參考資料

- [參考連結](https://example.com)
`;

try {
    // 創建文章檔案
    fs.writeFileSync(postFilePath, postTemplate, 'utf8');
    console.log(`✅ 文章創建成功: ${fileName}.md`);
    
    // 創建對應的圖片目錄
    if (!fs.existsSync(imagesDirPath)) {
        fs.mkdirSync(imagesDirPath, { recursive: true });
        console.log(`✅ 圖片目錄創建成功: images/posts/${fileName}/`);
    }
    
    console.log(`\n📝 接下來你可以：`);
    console.log(`1. 編輯文章: source/_posts/${fileName}.md`);
    console.log(`2. 添加圖片到: source/images/posts/${fileName}/`);
    console.log(`3. 在文章中引用圖片: ![描述](/images/posts/${fileName}/圖片名.jpg)`);
    
} catch (error) {
    console.error('❌ 創建文章時發生錯誤:', error.message);
    process.exit(1);
}