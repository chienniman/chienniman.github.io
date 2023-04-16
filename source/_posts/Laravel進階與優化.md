---
title: Laravel進階與優化
abbrlink: 52036
date: 2023-03-01 23:10:29
tags:
  - Backend
  - Laravel
  - Collection
  - Cache
  - Broadcasting
  - 優化
cover: /images/laravel.jpg
author: Boris Chien
description: Laravel後端API優化，進階功能Collection、Cache、Broadcasting，開發紀錄，範例均為開發中真實遇到
keywords:
  - Backend
  - 後端數據
  - Laravel
  - Collection
  - Cache
  - Broadcasting
  - API
  - refactor
  - Pusher Channels
categories:
    - Backend
---

## Collection-優雅地包裝
> The Illuminate\Support\Collection class provides a fluent, convenient wrapper for working with arrays of data. For example, check out the following code. We'll use the collect helper to create a new collection instance from the array, run the strtoupper function on each element, and then remove all empty elements:

提供了一個流暢、方便的包裝器來處理數據陣列。
[Collections更多介紹](https://laravel.com/docs/10.x/collections#creating-collections)

### 驗證訪問token
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

### 缺點
1.API::getAccessTokens()可能會導致性能問題、未知錯誤。
2.Access Token 數據大時，遍歷效率低。


### 抽象地
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
### 優點
鍊式調用，更短、簡潔，Collection提高可讀性。


## Cache-緩存你的數據
> Some of the data retrieval or processing tasks performed by your application could be CPU intensive or take several seconds to complete. When this is the case, it is common to cache the retrieved data for a time so it can be retrieved quickly on subsequent requests for the same data. The cached data is usually stored in a very fast data store such as Memcached or Redis.
Thankfully, Laravel provides an expressive, unified API for various cache backends, allowing you to take advantage of their blazing fast data retrieval and speed up your web application.

應用程序執行的某些數據查詢或任務可能會佔用 CPU 資源或需要幾秒鐘才能完成。在這種情況下，通常會將檢索到的數據緩存一段時間，以便在後續請求相同數據時可以快速檢索到。緩存數據通常存儲在非常快速的數據存儲中，例如Memcached或Redis。
值得慶幸的是，Laravel 為各種緩存後端提供了一個富有表現力的統一 API，讓您可以利用它們超快的數據檢索速度並加速您的 Web 應用程序。
[Cache更多介紹](https://laravel.com/docs/10.x/cache#introduction)

### 技術債-取出token
{% codeblock lang:php %}
  public static function getAccessTokens()
    {
        $token = DB::table("access_tokens")
            ->get()
            ->toArray();
        return $token;
    }
{% endcodeblock %}

### 缺點
消耗伺服器查詢資源，token不需頻繁更新

### 優化-Cache
{% codeblock lang:php %}
   public static function getAccessTokens()
    {
        return Cache::rememberForever('access_tokens', function () {
            return DB::table('access_tokens')->get()->toArray();
        });
    }
{% endcodeblock %}

### 優點
1.提高程式效能，減少對資料庫的查詢。
2.資料存儲在快取中，後續請求中快速地獲取。


## Broadcasting-網頁即時更新的最佳選擇
> In many modern web applications, WebSockets are used to implement realtime, live-updating user interfaces. When some data is updated on the server, a message is typically sent over a WebSocket connection to be handled by the client. WebSockets provide a more efficient alternative to continually polling your application's server for data changes that should be reflected in your UI.

WebSockets就像一條繩子，連接客戶端與伺服器，雙方的訊息透過這條雙向管道即時更新，比起傳統的輪詢有更高的效能，消耗更少的資源，而Laravel有Pusher Channels與laravel-websockets。

### 輪詢
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

### 缺點
1.伺服器負擔大(可理解成固定DDOS)
2.延遲高
3.性能差

#### Pusher Channels
透過訂閱事件即時更新
{% codeblock lang:php %}
$pusher->trigger('my-channel', 'my-event', [
  'message' => 'hello world'
]);
{% endcodeblock %}

{% codeblock lang:js %}
var channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
  alert('Received my-event with message: ' + data.message);
});
{% endcodeblock %}
須注意，Pusher Channels是託管的伺服器群，免費使用上受到限制，包含每日最大訊息、併發連接數等。
![](/images/free-channel-plan.jpg)

#### laravel-websockets
>laravel-websockets is a Laravel package that can handle the server side of WebSockets entirely. It completely replaces the need for a service like Pusher or a JavaScript-based laravel-echo-server. It has extensive documentation and a demo application you can play with. Marcel, developer and co-owner at beyondcode, and I have been working on this together for the past couple of weeks. In this blog post, we'd like to introduce the package to you.

laravel-websockets 基於Ratchet，提供實時偵測儀表板，支持多租戶技術，也兼容Pusher包。
![](/images/debug-dashboard.jpg)

Pusher 三種不同頻道：

1.私人頻道(PrivateChannel)：訂閱頻道前身分驗證
2.存在頻道(PresenceChannel)：與私人頻道相同，確定頻道上的使用權限
3.公共頻道(public)：任何人可訂閱，不需驗證。 

### 優點
1.事件驅動，性能高
2.適合多用戶
3.延遲低

[laravel-websockets文件](https://beyondco.de/docs/laravel-websockets/getting-started/introduction)
[官方聊天室範例](https://github.com/beyondcode/laravel-websockets-demo)

### 即時通訊比較
連結如下，供參考
[網頁即時更新](https://hackmd.io/@monkeymonkey/Sk-odiP8o)



