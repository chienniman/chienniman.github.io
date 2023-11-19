---
title: (技術)Laravel-Queue-訊息隊列
date: 2023-11-19 19:43:46
tags:
    - Queue
author: Boris Chien
---

# Laravel Queue 訊息隊列
## 特性
* 異步
* 重試

## 常見應用
* 建立、取消訂單
* 電子郵件
* webhook
* 自動付款、退款
* 每月報表、帳單
* 圖片、視頻上傳
* 更新索引

## 流程

1.設定`config/queue.php`、`.env`
2.`php artisan queue:table / php artisan migrate`
3.`php artisan make:job <name>`
4.`啟動 Queue Listener`
5.`Supervisor / Horizon 監控 `

## 介面
* 單例 `ShouldBeUnique`
* 加密 `ShouldBeEncrypted`

## 自選
class 屬性優先於指令

1.重試
```
php artisan queue:work --tries 3
```

2.優先
```
php artisan queue:work --queue
```

3.超時
```
php artisan queue:work --timeout
```

4.middleware
```php
public function middleware(): array
{
    return [new RateLimited];
}
```
## 同步 vs 非同步

### 同步
訂單支付，同步耗時相當久，無法得到即時響應

![order1](/images/queue/order1.jpg)
 
![order2](images/queue/order2.jpg)

```php
Route::post('/syncApiTest', function () {
    $delaySeconds=5;
    sleep($delaySeconds);
});
```

![pending](images/queue/pending.jpg)

### 非同步
1.範例需要，不建議在生產環境中的`web.php`寫邏輯
2.dispatch 成功，會將任務加入驅動，`queue:work`時在後台執行


```php
Route::post('/asyncApiTest', function () {
    ApiDemo::dispatch();
});
```
![jobs](images/queue/jobs.jpg)

## ref
[Laravel 消息队列实战](https://laravelacademy.org/post/22252)
[Queues](https://laravel.com/docs/10.x/queues)

