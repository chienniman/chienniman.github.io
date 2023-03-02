---
title: Laravel開發與優化之路(1)
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
description: 在軟體開發中，技術債是指為了快速完成開發而採用的簡單、快速但不完美的解決方案所產生的成本。這些解決方案通常需要進行修復或更新，維護和提高應用程式的品質和可擴展性。本文介紹Laravel後端API優化，進階功能Collection、Cache、Broadcasting，開發紀錄，範例均為開發中真實遇到的問題。
keywords:
  - Backend
  - 後端數據
  - Laravel
  - Collection
  - Cache
  - Broadcasting
  - API
  - 技術債
  - refactor
  - 優化
---

## 技術債
在軟體開發中，技術債是指為了快速完成開發而採用的簡單、快速但不完美的解決方案所產生的成本。這些解決方案通常需要進行修復或更新，維護和提高應用程式的品質和可擴展性。
本文介紹Laravel後端API優化，進階功能Collection、Cache、Broadcasting，開發紀錄，範例均為開發中真實遇到的問題。

## Collection-更好操作後端數據
> The Illuminate\Support\Collection class provides a fluent, convenient wrapper for working with arrays of data. For example, check out the following code. We'll use the collect helper to create a new collection instance from the array, run the strtoupper function on each element, and then remove all empty elements:

提供了一個流暢、方便的包裝器來處理數據陣列。
[Collections更多介紹](https://laravel.com/docs/10.x/collections#creating-collections)

### 技術債-驗證訪問token
{% codeblock lang:php %}
public function validateAccessToken(Request $request)
{
    $key = $request->input('accessToken');
    $url = $request->input('url');
    $tokens = API::getAccessTokens();
    $result = 0;
    foreach ($tokens as $value) {
        if ($value->key === $key && $value->domain === $url) {
            $result = 1;
            break;
        }
    }
    return response()->json(['result' => $result]);
}
{% endcodeblock %}

### 優點
1.可讀性較高，易於理解。
2.原生PHP方法，簡單快速
3.程式碼邏輯耦合高

### 缺點
1.API::getAccessTokens()可能會導致性能問題、未知錯誤。
2.Access Token 數據大時，遍歷效率較低。
3.暴露過多實做細節

### 優化-抽象地操作數據
{% codeblock lang:php %}
public function validateAccessToken(Request $request)
{
    $key = $request->input('accessToken');
    $url = $request->input('url');
    $tokens = collect(API::getAccessTokens());
    $isValid = $tokens->where('key', $key)
                       ->where('domain', $url)
                       ->isNotEmpty();
    return response()->json(['result' => $isValid]);
}
{% endcodeblock %}
### 優點
1.鍊式調用，更短、簡潔，Collection提高可讀性。
2.提高演算法效率。
3.抽象，隱藏實做細節。

### 缺點
1.上手難度，開發成本較高
2.不直觀

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

### 優點
簡單快速

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

### 缺點
需要花費資源在處理數據一致、同步更新

## Broadcasting-網頁即時更新的最佳選擇
> In many modern web applications, WebSockets are used to implement realtime, live-updating user interfaces. When some data is updated on the server, a message is typically sent over a WebSocket connection to be handled by the client. WebSockets provide a more efficient alternative to continually polling your application's server for data changes that should be reflected in your UI.

WebSockets就像一條繩子，連接客戶端與伺服器，雙方的訊息透過這條雙向管道即時更新，比起傳統的輪詢有更高的效能，消耗更少的資源，而Laravel有Pusher Channels與laravel-websockets供選擇。

### 技術債?-輪詢
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
    .finally(() => {
      setTimeout(poll, 1000);
    });
}
poll();
{% endcodeblock %}
### 優點
1.程式碼簡單、直觀、易維護。
2.兼容性高

### 缺點
1.伺服器負擔大(可以理解成固定間隔DDOS)
2.延遲高

### 優化-Broadcasting
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



筆者有整理各種技術比較與laravel-websockets的實作，連結如下，供參考
[網頁即時更新&laravel-websockets](https://hackmd.io/@monkeymonkey/Sk-odiP8o)
