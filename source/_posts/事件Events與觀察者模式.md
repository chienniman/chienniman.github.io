---
title: 事件Events與觀察者模式
tags:
    - Backend
    - Laravel
    - Events
    - Observer pattern
cover: /images/observer.jpg
author: Boris Chien
keywords:
    - Backend
    - Laravel
    - Events
    - Observer pattern
categories:
    - Backend
abbrlink: 4281
date: 2023-05-03 20:04:04
---

## 觀察者模式(Observer pattern)

觀察者模式是一種設計模式，用於在物件之間建立一對多的依賴關係。當一個物件的狀態發生變化時，它的所有依賴物件都會收到通知並自動更新

## 事件(Events)

例如顧客購買了一件商品，驗證支付、更新訂單、發送通知、生成紀錄、訂單確認信等邏輯，全部加進交易，可能導致程式難以維護，不符合物件導向與設計模式的最佳實踐。
可以在某個時間點觸發事件，監聽器觸發對應邏輯，降低類的依賴關係，增強組合性。

## 目錄

```
app
├── Events事件
│   └── PodcastProcessed.php
│── Listeners偵聽
│   └── SendPodcastNotification.php
└── Providers註冊
    └── EventServiceProviders.php

```

## EventServiceProviders 註冊

{% codeblock lang:php %}

use App\Events\PodcastProcessed;
use App\Listeners\SendPodcastNotification;

    protected $listen = [
        PodcastProcessed::class => [
        SendPodcastNotification::class,
        ],
    ];
{% endcodeblock %}

## 生成事件與監聽器

```
php artisan make:event PodcastProcessed

php artisan make:listener SendPodcastNotification --event=PodcastProcessed
```

## 事件佇列

耗時長的任務，例如輸出 CSV、SQL，訂單發送等，用預設的同步處理就容易影響效能，
實作 ShouldQueue 介面的類，會被放入佇列

{% codeblock lang:php %}
class SendShipmentNotification implements ShouldQueue
{
    // 佇列種類
    public $connection = 'sqs';
    // 佇列名稱
    public $queue = 'listeners';
    // 延遲
    public $delay = 60;
}
{% endcodeblock %}


## 測試觸發事件

普通的 Response 可以直接 return 前端 Console，但在事件跟監聽器中這樣做是沒有意義的，可以在 listener 中寫入 laravel 的 log 方便追蹤。

{% codeblock lang:php %}
<?php

namespace App\Listeners;

use Illuminate\Support\Facades\Log;

class SendPodcastNotification
{

    public function handle()
    {
        Log::info('Event triggered successfully.');
    }
}

{% endcodeblock %}

官方也有提供事件跟監聽器的測試方法，直接實例化監聽器調用 handle 方法，Events 的 fake 也能阻止偵聽器，斷言分配事件

{% codeblock lang:php %}
<?php

namespace Tests\Feature;

use App\Events\OrderFailedToShip;
use App\Events\OrderShipped;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_orders_can_be_shipped(): void
    {
        Event::fake();

        // Perform order shipping...

        // Assert that an event was dispatched...
        Event::assertDispatched(OrderShipped::class);

        // Assert an event was dispatched twice...
        Event::assertDispatched(OrderShipped::class, 2);

        // Assert an event was not dispatched...
        Event::assertNotDispatched(OrderFailedToShip::class);

        // Assert that no events were dispatched...
        Event::assertNothingDispatched();
    }
}
{% endcodeblock %}


## 參考資料

[laravel.com/docs/10.x/events](https://laravel.com/docs/10.x/events)
