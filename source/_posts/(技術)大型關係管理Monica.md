---
title: (技術)大型關係管理Monica
tags:
    - Backend
    - Authentication
    - Authorization
    - Monica
    - Laravel
    - OAuth
author: Boris Chien
description: Monica是一個開源專案，用於組織和記錄與親人的互動。又稱PRM，個人關係管理。可將其視為您朋友或家人的CRM，本文翻譯貢獻，與感興趣的功能，API、數據導出、Oauth、以及issue。
keywords:
    - Backend
    - Authentication
    - Authorization
    - Monica
    - Laravel
    - OAuth
categories:
    - Backend
abbrlink: 49048
date: 2023-04-01 19:25:34
top_img: false
cover: images/monica/cover.webp
---

Monica 是一個開源專案，用於組織和記錄與親人的互動。又稱 PRM，個人關係管理。可將其視為您朋友或家人的 CRM，本文會介紹感興趣的功能，API、數據導出、OAuth、以及 issue。
> Monica’s vision is to help people have more meaningful relationships.
幫助人們建立有意義的關係

主打"關係管理"，相較市面成熟的社交產品(如 Facebook)，其定位特別，替人脈建立一個管理後台，還記得大學時參加幹訓、社團迎新，認識各社團幹部，常忘記小細節，此產品便能很好地解決這個問題，基於興趣，我也作為翻譯貢獻者，協助 monica 文件繁體中文的在地化，具體參考[chienniman/monica](https://github.com/chienniman/monica)。 
本文會介紹API授權(個人使用、開放授權)，數據導出、社群討論issue，也會同時附上以上功能的原始碼分析，深入淺出的介紹設計模式在本專案的應用。

## 執行&部署
```
PHP 8.1+
HTTP server with PHP support (eg: Apache, Nginx, Caddy)
Composer
MySQL
```
```
Platform.sh
Heroku
```

{% note warning no-icon %}
官方文件提到，構建專案程式需要 1.5GB RAM 以上，在 GCP 開便宜的 n1-standard-1，每月最少也要 600 台幣
{% endnote %}

## Authentication
在 Monica 中，OAuth 2.0 與個人訪問令牌是兩種不同的身份驗證機制，但它們都用於授權 API 訪問。
OAuth 2.0 是一種標準的開放授權協議，允許用戶在 Monica 上授權第三方應用程序訪問數據，不需要將用戶名和密碼提供給該應用程序。當用戶通過 OAuth 2.0 授權授權應用程序時，該應用程序會收到一個訪問令牌，以便它可以代表用戶訪問 Monica API。
個人訪問令牌則是一種基於 Monica 賬戶的令牌，允許應用程序代表用戶訪問 Monica API。這意味著，當用戶提供他們的個人訪問令牌給應用程序時，該應用程序就可以代表該用戶訪問 API，就像它擁有 OAuth 2.0 訪問令牌一樣。
雖然這兩種令牌都可以用於授權 API 訪問，但它們的使用方式略有不同。 OAuth 2.0 是一種標準的開放授權協議，允許用戶授權第三方應用程序訪問其數據。個人訪問令牌則是一種在 Monica 內部生成的令牌，只能由用戶本人使用。在大多數情況下，建議使用 OAuth 2.0，因為它是更安全和更靈活的身份驗證協議。

## 個人驗證授權

```
curl -H "Authorization: Bearer Personal access token" https://app.monicahq.com/api
```
## 個人驗證令牌(personal-access-token)
![](/images/monica/personal-access-token.jpg)
將 token 放在 postmon 的 Authorization 

## postman測試
![](/images/monica/postman-test.jpg)

## 開放授權(OAuth)
monica 也提供 OAuth 方式驗證 API，向伺服器發起驗證請求，跳出授權允許視窗，取得 Access Token，之後請求夾帶令牌訪問保護資源

## 流程
![](/images/monica/oauth-process.jpg)

## Postmon
![](/images/monica/postmon-oauth.jpg)
配置 postmon 參數，將 Callback URL 填入 monica 後台 API，Token name、Client ID、Client Secret 填入 postmon

## 授權請求
![](/images/monica/postmon-oauth-popup.jpg)
postmon 會跳出授權請求，允許後核發 Access Token、Refresh Token，點擊使用後自動帶入 Authorization Token 欄位

## 測試請求 
![](/images/monica/postmon-oauth-success.jpg)
[The OAuth 2.0 Authorization Framework: Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)
[monica-api 文件](https://www.monicahq.com/api)

## 第三方登入
官方託管 monica 支持 OAuth API，卻不支持 Facebook、Google 第三方登入，主流的平台為提升用戶體驗，通常會支持，疑惑地查找社群討論發現
![](/images/monica/issue-558.jpg)
degan6 提出 OAuth 登入的 pull request，但被主要開發者拒絕了
![](/images/monica/deny-issue.jpg)
1.不想要支持有疑慮的第三方登入(Facebook 疑似洩漏個資事件)<br> 2.官方託管已經移除大多數的追蹤程式碼

## 數據導出
monica 能輸出聯絡人vCard，使用者Sql、Json 等，相當便利，數據輸出需較長時間處理，隊列任務被存儲在數據庫，在多個請求之間共享任務。當任務被添加到隊列，被插入到表中，等待被執行。Laravel會跟蹤任務的狀態，未處理、處理中、已處理、失敗。
Laravel預設使用同步隊列(sync)，保證實時、穩定性，方便進行開發與測試，但對於大量、耗時任務，同步處理會阻塞主線程，因此不適合高併發場景。

## vCard
![](/images/monica/vcard.jpg)
vCard 是電子名片的文件格式標準。它一般附加在電子郵件之後，但也可以用於其它場合（如在網際網路上相互交換）。vCard 可包含的信息有：姓名、地址資訊、電話號碼、URL，logo，相片等。

## Routes
{% codeblock lang:php %}
// monica/routes/web.php 
Route::get('/people/{contact}/vcard', 'ContactsController@vcard')->name('vcard');
{% endcodeblock %}

## ContactsController
{% codeblock lang:php %}
// monica/app/Http/Controllers/ContactsController.php
// 依賴注入：Contact、ExportVCard、Str和LocaleHelper通過依賴注入。
public function vCard(Contact $contact)
{
    // 禁用 Debugbar 避免在下載 vCard 時，偵錯列（debugbar）出現在輸出中
    if (config('app.debug') && class_exists('\Barryvdh\Debugbar\Facade')) {
    Debugbar::disable();
    }
    // Laravel 中的全域輔助函數，用於從應用程式服務容器中取回特定的服務實例
    $vcard = app(ExportVCard::class)->execute([
    'account_id' => auth()->user()->account_id,
    'contact_id' => $contact->id,
    ]);
// response 函數將 $vcard 序列化後的 VCard 字符串作為內容，設置 'Content-type' 標頭為 'text/x-vcard'
// 表示傳輸的內容是 VCard 格式。同時，設置 'Content-Disposition' 標頭為 'attachment; 
// filename='.Str::slug($contact->name, '-', LocaleHelper::getLang()).'.vcf'
// 表示將其作為下載文件附件發送給用戶端，並將文件名設置為聯絡人的名稱轉換為 slug 格式後加上 .vcf 的檔名
    return response($vcard->serialize())
        ->header('Content-type', 'text/x-vcard')
        ->header('Content-Disposition', 'attachment; filename='.Str::slug($contact->name, '-', LocaleHelper::getLang()).'.vcf');
}
{% endcodeblock %}

## Sql & Json導出
![](/images/export-data.jpg)

## Routes
{% codeblock lang:php %}
// monica/routes/web.php 
Route::post('/settings/exportToSql', 'Settings\\ExportController@storeSQL')->name('export.store.sql');
Route::post('/settings/exportToJson', 'Settings\\ExportController@storeJson')->name('export.store.json');
{% endcodeblock %}

## ExportJob
{% codeblock lang:php %}
// monica/app/Models/Account/ExportJob.php 
namespace App\Models\Account;

use App\Traits\HasUuid;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;
use App\Notifications\ExportAccountDone;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExportJob extends Model
{
    use HasUuid, HasFactory;

    public const EXPORT_TODO = 'todo';
    public const EXPORT_DOING = 'doing';
    public const EXPORT_DONE = 'done';
    public const EXPORT_FAILED = 'failed';

    public const SQL = 'sql';

    public const JSON = 'json';

    protected $fillable = [
        'uuid',
        'account_id',
        'user_id',
        'type',
        'status',
        'filesystem',
        'filename',
        'started_at',
        'ended_at',
    ];

    protected $guarded = ['id'];

    protected $dates = [
        'started_at',
        'ended_at',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function start(): void
    {
        $this->status = self::EXPORT_DOING;
        $this->started_at = now();
        $this->save();
    }

    // 發信通知
    public function end(): void
    {
        $this->status = self::EXPORT_DONE;
        $this->ended_at = now();
        $this->save();
    
        $this->user->notify(new ExportAccountDone($this));
    }
}
{% endcodeblock %}

## ExportController
{% codeblock lang:php %}
// monica/app/Http/Controllers/Settings/ExportController.php
private function newExport(string $type): ExportJob
{
    $exports = ExportJob::where([
    'account_id' => auth()->user()->account_id,
    'user_id' => auth()->user()->id,
    ])
    ->orderBy('created_at')
    ->get();
    // 輸出任務總量超過最大配置，刪除最舊的任務
    if ($exports->count() >= config('monica.export_size')) {
        $job = $exports->first();
        try {
            if ($job->filename !== null) {
                StorageHelper::disk($job->location)
                    ->delete($job->filename);
            }
        } finally {
            // 確保釋放資源，避免內存洩漏、資源浪費
            $job->delete();
        }
    }
    // 回傳剛建立的實例資料
    return ExportJob::create([
        'account_id' => auth()->user()->account_id,
        'user_id' => auth()->user()->id,
        'type' => $type,
    ]);
}

public function storeSql()
{
    $job = $this->newExport(ExportJob::SQL);
    ExportAccount::dispatch($job);

    return redirect()->route('settings.export.index')
        ->withStatus(trans('settings.export_submitted'));
}

public function storeJson()
{
    $job = $this->newExport(ExportJob::JSON);
    ExportAccount::dispatch($job);

    return redirect()->route('settings.export.index')
        ->withStatus(trans('settings.export_submitted'));

}
{% endcodeblock %}

## Dispatch

{% codeblock lang:php %}
// framework/src/Illuminate/Foundation/Bus/Dispatchable.php 
public static function dispatch(...$arguments)
{
    return new PendingDispatch(new static(...$arguments));
}
{% endcodeblock %}

## PendingDispatch
{% codeblock lang:php %}
// framework/src/Illuminate/Foundation/Bus/PendingDispatch.php 
// 提供了一個額外的介面，讓使用者可以更方便地調用 Job 物件的方法。同時，在物件的銷毀時刻，
// PendingDispatch 會根據 $this->afterResponse 屬性來決定要如何分派 $this->job。
namespace Illuminate\Foundation\Bus;

use Illuminate\Bus\UniqueLock;
use Illuminate\Container\Container;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Contracts\Cache\Repository as Cache;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class PendingDispatch
{
    protected $job;

    protected $afterResponse = false;

    public function __construct($job)
    {
        $this->job = $job;
    }

    public function onConnection($connection)
    {
        $this->job->onConnection($connection);

        return $this;
    }

    public function onQueue($queue)
    {
        $this->job->onQueue($queue);

        return $this;
    }

    public function allOnConnection($connection)
    {
        $this->job->allOnConnection($connection);

        return $this;
    }

    public function allOnQueue($queue)
    {
        $this->job->allOnQueue($queue);

        return $this;
    }

    public function delay($delay)
    {
        $this->job->delay($delay);

        return $this;
    }

    public function afterCommit()
    {
        $this->job->afterCommit();

        return $this;
    }

    public function beforeCommit()
    {
        $this->job->beforeCommit();

        return $this;
    }

    public function chain($chain)
    {
        $this->job->chain($chain);

        return $this;
    }

    public function afterResponse()
    {
        $this->afterResponse = true;

        return $this;
    }

    // 實現對任務調度執行的控制，確保同一個唯一的任務在同一時間只會被調度執行一次。
    // 返回true，則表示當前任務可以被調度執行，否則返回false，表示該任務已經被另一個進程或線程佔用了
    protected function shouldDispatch()
    {
        if (! $this->job instanceof ShouldBeUnique) {
            return true;
        }

        return (new UniqueLock(Container::getInstance()->make(Cache::class)))
                ->acquire($this->job);
    }

    // $pendingDispatch 可以透過 __call 方法動態調用 $job 實例上的任何方法
    public function __call($method, $parameters)
    {
        $this->job->{$method}(...$parameters);

        return $this;
    }
    // 任務調度的判斷
    public function __destruct()
    {
        if (! $this->shouldDispatch()) {
            return;
        } elseif ($this->afterResponse) {
            app(Dispatcher::class)->dispatchAfterResponse($this->job);
        } else {
            app(Dispatcher::class)->dispatch($this->job);
        }
    }
}
{% endcodeblock %}

## 成功通知
![](/images/monica/export-email.jpg)

## 發信notify
{% codeblock lang:php %}
// monica/app/Models/Account/ExportJob.php 
public function end(): void
{
    $this->status = self::EXPORT_DONE;
    $this->ended_at = now();
    $this->save();

    $this->user->notify(new ExportAccountDone($this));
}
{% endcodeblock %}

## ExportAccountDone
{% codeblock lang:php %}
// monica/app/Notifications/ExportAccountDone.php 
public function toMail(User $user): MailMessage
{
    $date = Carbon::parse($this->exportJob->created_at)
        ->setTimezone($user->timezone);
    // 成功、主題、歡迎詞、描述、下載連結
    return (new MailMessage)
        ->success()
        ->subject(trans('mail.export_title'))
        ->greeting(trans('mail.greetings', ['username' => $user->first_name]))
        ->line(trans('mail.export_description', ['date' => DateHelper::getShortDate($date)]))
        ->action(trans('mail.export_download'), route('settings.export.index'));
}
{% endcodeblock %}

## 下載資源
{% codeblock lang:php %}
// monica/app/Http/Controllers/Settings/ExportController.php 
public function download(Request $request, string $uuid)
{
    // 查詢第一筆紀錄
    $job = ExportJob::where([
        'account_id' => auth()->user()->account_id,
        'user_id' => auth()->user()->id,
        'uuid' => $uuid,
    ])->firstOrFail();

    // 未完成
    if ($job->status !== ExportJob::EXPORT_DONE) {
        return redirect()->route('settings.export.index')
            ->withErrors(trans('settings.export_not_done'));
    }
    $disk = StorageHelper::disk($job->location);

    // 返回請求資料
    return $disk->response($job->filename,
            "monica.{$job->type}",
            [
                'Content-Type' => "application/{$job->type}; charset=utf-8",
                'Content-Disposition' => "attachment; filename=monica.{$job->type}",
            ]
        );
}
{% endcodeblock %}