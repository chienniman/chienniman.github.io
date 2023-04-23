---
title: Linux簡介與架站常用設定
tags:
  - Linux
cover: /images/sudo.jpg
author: Boris Chien
keywords:
  - Linux
categories:
  - Linux
abbrlink: 10270
date: 2023-04-20 22:21:50
---
## Ubuntu 
適合桌面使用的 Linux 發行版。易用、友好的圖形界面和硬體支援都使其成為桌面用戶的首選。此外，Ubuntu 也可以用於開發和測試，其軟體庫提供了豐富的開發工具和環境。對於初學者或需要快速部署伺服器的使用者，也可以選擇 Ubuntu Server 版本。

## Debian
通常被認為是一個穩定、可靠且安全的 Linux 發行版。其特點是針對穩定性進行優化，因此可以用於重要的伺服器和商業環境。Debian 也提供了廣泛的套件庫，可以滿足不同用戶的需求。Debian 同時也是許多其他 Linux 發行版的上游版本，因此對於需要自行定制 Linux 系統的使用者，Debian 可以是一個不錯的選擇。

## CentOS 
是以 Red Hat Enterprise Linux（RHEL）為基礎的 Linux 發行版，其特點是穩定性和安全性。由於 CentOS 的套件庫與 RHEL 的套件庫完全相同，因此 CentOS 可以用於商業環境中需要運行 RHEL 應用程式的場合。 CentOS 也可以用於 Web 伺服器、資料庫伺服器、郵件伺服器等多種伺服器場景，具有良好的穩定性和可靠性。

## FHS
檔案系統階層標準（Filesystem Hierarchy Standard）定義了Linux作業系統中的主要目錄及目錄內容

## 目錄
```
/ (root)
├── bin/ : 執行檔，cat, chmod, chown, date, mv, mkdir, cp, bash等
├── boot/ : 開機檔
├── dev/ : 裝置檔
├── etc/ : 應用程式設定檔
├── home/ : 家
├── lib/ : 函式庫
├── media/ : 外接媒體
├── mnt/ : 掛載目錄
├── opt/ : 第三方軟體
├── proc/ : 虛擬檔案
├── root/ : 超級使用者家目錄
├── run/ : 系統暫存檔
├── sbin/ : 系統執行檔
├── srv/ : 網路服務
├── sys/ : 系統硬體
├── tmp/ : 系統暫時檔
├── usr/ : Unix Software Resource檔案
└── var/ : 系統運行變數檔
```

## /var/log/
```
/var/log/
├── audit/          # 安全訊息
├── cron/           # crontab 的紀錄檔
├── lastlog         # 最近登入紀錄
├── mail/           # 郵件訊息
├── messages        # 系統訊息
├── secure          # 系統驗證
├── spooler/        # 列印相關
└── yum.log         # yum紀錄
```

## /etc/nginx

```
/etc/nginx
├── conf.d/         # Nginx 設定檔案夾，所有虛擬主機的設定檔
├── fastcgi_params  # FastCGI 參數檔
├── mime.types      # MIME 類型設定檔
├── modules/        # Nginx 模組
├── nginx.conf      # Nginx 主要設定檔
├── scgi_params     # SCGI 參數檔案
├── sites-available/   # 網站設定檔
├── sites-enabled/     # 連結網站設定檔
└── uwsgi_params    # uWSGI 參數檔案
```
nginx.conf 是 Nginx 的主配置，worker_processes，pid，events 等，虛擬主機的配置信息，如 server、location 等。
conf.d/ 目錄是 Nginx 的一個子目錄，存放一些額外的配置文件，便於管理和組織。以 .conf 作為後綴名，通過 include 指令包含在 nginx.conf 中，以便於 Nginx 加載。


## 

## /etc/nginx/nginx.conf
```
# Nginx的啟用Linux 帳戶
user  nginx;

# Nginx的執行緒數量(建議為你的 CPU 核心數 x 2)
worker_processes  2;
 
# Error Log 檔的位置
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;
 
events {
    # 同時連線總數量
    worker_connections  1024;
}
 
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
 
    # 預設的 log 記錄格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
 
    # Access log 檔的位置
    access_log  /var/log/nginx/access.log  main;
 
    sendfile        on;
    #tcp_nopush     on;
 
    keepalive_timeout  65;
 
    # 預設不會自動啟動 gzip 壓縮
    #gzip  on;
 
    # 載入 /etc/nginx/conf.d/ 下的所有設定檔
    include /etc/nginx/conf.d/*.conf;
}
```
