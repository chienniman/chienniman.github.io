const fs = require('fs');
const path = require('path');

// 獲取文章檔名參數
const postName = process.argv[2];

if (!postName) {
    console.error('❌ 請提供文章檔名！');
    console.log('用法: npm run delete-post "文章檔名"');
    console.log('例如: npm run delete-post "my-article"');
    process.exit(1);
}

// 移除 .md 副檔名（如果有的話）
const fileName = postName.replace(/\.md$/, '');

const projectRoot = path.resolve(__dirname, '..');
const postFilePath = path.join(projectRoot, 'source', '_posts', `${fileName}.md`);
const imagesDirPath = path.join(projectRoot, 'source', 'images', 'posts', fileName);

// 檢查文章是否存在
if (!fs.existsSync(postFilePath)) {
    console.error(`❌ 找不到文章: ${fileName}.md`);
    console.log('可用的文章:');
    
    // 列出所有文章
    const postsDir = path.join(projectRoot, 'source', '_posts');
    if (fs.existsSync(postsDir)) {
        const posts = fs.readdirSync(postsDir)
            .filter(file => file.endsWith('.md'))
            .map(file => `  - ${file.replace('.md', '')}`);
        
        if (posts.length > 0) {
            console.log(posts.join('\n'));
        } else {
            console.log('  (沒有找到任何文章)');
        }
    }
    process.exit(1);
}

// 確認刪除
console.log(`🗑️  正在刪除:`);
console.log(`   📄 文章: ${fileName}.md`);
if (fs.existsSync(imagesDirPath)) {
    const imageFiles = fs.readdirSync(imagesDirPath);
    console.log(`   📁 圖片目錄: images/posts/${fileName}/ (包含 ${imageFiles.length} 個檔案)`);
}

try {
    // 刪除文章檔案
    fs.unlinkSync(postFilePath);
    console.log(`✅ 已刪除文章: ${fileName}.md`);
    
    // 刪除圖片目錄（如果存在）
    if (fs.existsSync(imagesDirPath)) {
        // 遞迴刪除目錄和其中所有檔案
        function deleteFolderRecursive(folderPath) {
            if (fs.existsSync(folderPath)) {
                fs.readdirSync(folderPath).forEach((file) => {
                    const curPath = path.join(folderPath, file);
                    if (fs.lstatSync(curPath).isDirectory()) {
                        deleteFolderRecursive(curPath);
                    } else {
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(folderPath);
            }
        }
        
        deleteFolderRecursive(imagesDirPath);
        console.log(`✅ 已刪除圖片目錄: images/posts/${fileName}/`);
    }
    
    console.log('\n🎉 文章和相關資源已完全移除！');
    console.log('💡 記得執行 hexo clean && hexo generate 來更新網站');
    
} catch (error) {
    console.error('❌ 刪除文章時發生錯誤:', error.message);
    process.exit(1);
}