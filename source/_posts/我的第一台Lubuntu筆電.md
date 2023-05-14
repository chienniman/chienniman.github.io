---
title: 我的第一台Lubuntu筆電
tags:
  - Linux
  - Lubuntu
author: Boris Chien
keywords:
  - Linux
categories:
  - Linux
abbrlink: 51643
date: 2023-04-23 20:20:37
---

## 前言
以前就想要一台Linux電腦，長期習慣Windows介面的我遲未行動，一部分原因也是因為許多Steam遊戲不支援，當初
舊筆電(使用5年)出現花屏，可能是顯示卡、螢幕問題，拿去修理效益比實在不大，但又有外出攜帶需求，結合價格、使用
頻率、開發需求、硬體規格等多方要素，2021年購入這台不到一萬的迷你筆電。

## 規格
* 處理器：IntelR Celeron N4020 Processor 1.1 GHz (4M Cache, up to 2.8 GHz)
* 記憶體(內建/最大)：4GB DDR4
* 硬碟：64G EMMC

大小跟平板差不多(11.6"HD霧面寬螢幕)，重量1.05KG，適合外出，預設安裝Windows10 S模式(只允許 Microsoft Store 上提供的應用程式)，整體來說開機相當快速，能上網、文書處理、前後端開發、跑資料庫，不過有時會黑屏閃退，這台小筆電開太多Chrome分頁，CPU就會飆到80、90%，所以桌機就漸漸取代它，直到最近整理時，打算安裝輕量級的Ubuntu版本，使其起死回生。

## Lubuntu
Linux有許多版本，適合桌面使用的Ubuntu，常用於伺服器和商業環境，許多其他Linux上游的Debian，CentOS等。
Ubuntu又有許多分支，UbuntuKylin、Kubuntu、Xubuntu、Edubuntu、Mythbuntu，本機選用的Lubuntu輕量、快速，適合老舊機型、規格低下的筆電。

## 映像檔
先到官方網站下載映像檔，![](/images/jammy-fish.jpg)

## 燒錄開機碟
![](/images/rufus.jpg)
使用rufus製作開機碟
1.裝置，選擇外接硬碟(USB)
2.開機模式，選擇剛剛下載的Lubuntu映像檔
3.資料分割方式，依照UEFI、BIOS選擇

## UEFI(統一可擴充韌體接口)開機
Asus筆電開機時長按F2，進入UEFI，開機順序更改為USB開機
![](/images/uefi.jpg)

## 啟動安裝
grub 啟動畫面。
1.安裝，選擇Try 或 Install Lubuntu。
2.顯卡問題，比如較新的 nvidia 卡，選擇safe graphics。
3.測試ram，選擇Test memory。
![](/images/lbuntu-install-1.jpg)

## 實時預覽
啟動後，探索 Lubuntu 並確保所有硬體都能正常工作。準備好後，雙擊桌面左上角的圖標
![](/images/lbuntu-install-2.jpg)

## 設定
![](/images/lbuntu-install-3.jpg)

## 位置
![](/images/lbuntu-install-4.jpg)

## 鍵盤
![](/images/lbuntu-install-5.jpg)

## 切割硬碟
![](/images/lbuntu-install-6.jpg)
刪除磁盤。格式化磁盤，請備份所有重要資料。

## 密碼配置
![](/images/lbuntu-install-7.jpg)

## 最後配置檢查
![](/images/lbuntu-install-8.jpg)

重新啟動，大功告成

## 參考資料&圖片
[lubuntu手冊](https://manual.lubuntu.me/stable/1/Installing_lubuntu.html)