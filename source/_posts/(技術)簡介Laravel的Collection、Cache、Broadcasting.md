---
title: (技術)簡介Laravel的Collection、Cache、Broadcasting
abbrlink: 52036
date: 2023-03-01 23:10:29
tags:
  - Backend
  - Laravel
author: Boris Chien
description: Laravel後端API優化，進階功能Collection、Cache、Broadcasting
keywords:
  - Backend
  - Laravel
  - Collection
  - Cache
  - Broadcasting
categories:
    - Backend
cover: images/laravel/cover.webp
---

## Collection-優雅地包裝
> The Illuminate\Support\Collection class provides a fluent, convenient wrapper for working with arrays of data. For example, check out the following code. We'll use the collect helper to create a new collection instance from the array, run the strtoupper function on each element, and then remove all empty elements:

提供了一個流暢、方便的包裝器來處理數據陣列。
[Collections更多介紹](https://laravel.com/docs/10.x/collections#creating-collections)

## 驗證訪問token
{% codeblock lang:php %}
public function validateAccessToken(Request $request)
{
    $key = $request->input('accessToken');
    $tokens = API::getAccessTokens();
    $result = false;
    foreach ($tokens as $value) {
        if ($value->key === $key) {
            $result = true;
            break;
        }
    }
    return response()->json(['result' => $result]);
}
{% endcodeblock %}

## Collection
{% codeblock lang:php %}
public function validateAccessToken(Request $request)
{
    $key = $request->input('accessToken');
    $tokens = collect(API::getAccessTokens());
    $isValid = $tokens->where('key', $key)
                       ->isNotEmpty();
    return response()->json(['result' => $isValid]);
}
{% endcodeblock %}

## Cache
> Some of the data retrieval or processing tasks performed by your application could be CPU intensive or take several seconds to complete. When this is the case, it is common to cache the retrieved data for a time so it can be retrieved quickly on subsequent requests for the same data. The cached data is usually stored in a very fast data store such as Memcached or Redis.
Thankfully, Laravel provides an expressive, unified API for various cache backends, allowing you to take advantage of their blazing fast data retrieval and speed up your web application.

應用程序執行的某些數據查詢或任務可能會佔用 CPU 資源或需要幾秒鐘才能完成。在這種情況下，通常會將檢索到的數據緩存一段時間，以便在後續請求相同數據時可以快速檢索到。緩存數據通常存儲在非常快速的數據存儲中，例如Memcached或Redis。
值得慶幸的是，Laravel 為各種緩存後端提供了一個富有表現力的統一 API，讓您可以利用它們超快的數據檢索速度並加速您的 Web 應用程序。
[Cache更多介紹](https://laravel.com/docs/10.x/cache#introduction)

## 取出token
{% codeblock lang:php %}
  public static function getAccessTokens()
    {
        $token = DB::table("access_tokens")
            ->get()
            ->toArray();
        return $token;
    }
{% endcodeblock %}

## Cache token
{% codeblock lang:php %}
   public static function getAccessTokens()
    {
        return Cache::rememberForever('access_tokens', function () {
            return DB::table('access_tokens')->get()->toArray();
        });
    }
{% endcodeblock %}


## Broadcasting-網頁即時更新
> In many modern web applications, WebSockets are used to implement realtime, live-updating user interfaces. When some data is updated on the server, a message is typically sent over a WebSocket connection to be handled by the client. WebSockets provide a more efficient alternative to continually polling your application's server for data changes that should be reflected in your UI.

WebSockets就像一條繩子，連接客戶端與伺服器，雙方的訊息透過這條雙向管道即時更新，比起傳統的輪詢有更高的效能，消耗更少的資源，而Laravel有Pusher Channels與laravel-websockets。

## 輪詢
{% codeblock lang:js %}
function poll() {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    })
}
poll();
{% endcodeblock %}

#### Pusher Channels
訂閱事件即時更新，Pusher Channels是託管的伺服器群，免費使用上受到限制，包含每日最大訊息、併發連接數等。
![](/images/laravel/free-channel-plan.jpg)


