---
title: (技術)使用Laravel-Batch與Pusher上傳20萬筆庫存
date: 2023-11-19 19:43:46
tags:
    - Batch
    - Queue
author: Boris Chien
---
## Queue
* 異步
* 重試

## 應用
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
## Batch
* 追蹤同類型作業
* 執行工作並更新進度

## 建表
```
php artisan queue:table

php artisan queue:batches-table
 
php artisan migrate
```
## use

```
use Batchable
```

## dispatch

```
Bus::batch
```
## worker
```
php artisan queue:work
```

## 架構設計
* websocket及時更新
* 非同步
* pub-sub

每1000筆資料分塊上傳，worker完成job後查詢進度，發佈到客戶端

## views
```php
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PusherBatchUploader</title>
    <link rel="stylesheet" href="{{ asset('build/assets/app-00ef6d16.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css">
</head>

<body>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min.js"></script>
    <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
    <script>
        Pusher.logToConsole = true;

        var pusher = new Pusher('4ba467a4d146b608c291', {
            cluster: 'ap3'
        });
        var channel = pusher.subscribe('batch-progress');
        channel.bind('pusher:subscription_succeeded', function (data) {
            console.log(data);
        });
        channel.bind('batch-progress-updated', function (data) {
            $('#uploadStatus').html('處理中');

            if (data.progress === 100) {
                location.reload();
            }
            $('.progressBarValue').css('width', data.progress + "%");

            console.log(data);
        });
    </script>

    <div id="form">
        <form id="uploadForm" action="/uploadCsv" method="post" enctype="multipart/form-data">
            @csrf
            <input type="file" name="mycsv" id="mycsv">
            <button type="button" onclick="uploadFile()">
                Upload
            </button>
        </form>
    </div>

    <div class="progressBar">
        <div id="uploadStatus"></div>
        <div class="progressBarcontainer">
            <div class="progressBarValue"></div>
        </div>
    </div>

    <div class="table-reponsive box">
        <table id="example" class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Batch Id</th>
                    <th>Pending Jobs</th>
                    <th>Total Jobs</th>
                    <th>Created At</th>
                    <th>Finished At</th>
                </tr>
            </thead>
            <tbody>
                @foreach($allBatches as $key => $data)
                <tr>
                    <td>{{ $key+1 }}</td>
                    <td>{{ $data->id }}</td>
                    <td>{{ $data->pending_jobs }}</td>
                    <td>{{ $data->total_jobs }}</td>
                    <td>{{ date('Y-m-d H:i',$data->created_at) }}</td>
                    <td>{{ date('Y-m-d H:i',$data->finished_at) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>


    </div>

    <script>
        $(document).ready(function () {
            $('#example').DataTable();
        });

        var allBatches = {!! json_encode($allBatches)!!};
        console.log(allBatches);

        function uploadFile() {
            var formData = new FormData(document.getElementById('uploadForm'));

            formData.append('_token', '{{ csrf_token() }}');

            $.ajax({
                type: 'POST',
                url: '/uploadCsv',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    $('#uploadStatus').html('上傳中');
                },
                error: function (error) {
                    $('#uploadStatus').html('Error uploading');
                }
            });
        }
    </script>
</body>

</html>
```

## controller
```php
public function uploadCsv()
    {
        if (request()->has('mycsv')) {
            $batch = Bus::batch([])->then(function (Batch $batch) {
                $progress = Bus::findBatch($batch->id);

                event(new BatchProcessingProgressUpdated($progress->toArray()));
            })->dispatch();

            $data = file(request()->mycsv);
            $chunks = array_chunk($data, 1000);
            $header = [];

            foreach ($chunks as $key => $chunk) {
                $data = array_map('str_getcsv', $chunk);
                if ($key === 0) {
                    $header = array_shift($data);
                }
                $batch->add(new SalesCsvProcess($data, $header, $batch->id));
            }
        }
    }
```
## jobs
```php
<?php

namespace App\Jobs;

use Throwable;
use App\Models\Sales;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Bus;
use App\Events\BatchProcessingProgressUpdated;

class SalesCsvProcess implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $data;
    public $header;
    public $batchId;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($data, $header,$batchId)
    {
        $this->data   = $data;
        $this->header = $header;
        $this->batchId = $batchId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        foreach ($this->data as $sale) {
            $saleData = array_combine($this->header, $sale);
            Sales::create($saleData);
        }
        $progress=Bus::findBatch($this->batchId);
        event(new BatchProcessingProgressUpdated($progress->toArray()));
    }

    public function failed(Throwable $exception)
    {
    }
}
```

## 廣播失敗
[laravel-run-event-inside-job-queue-async](https://stackoverflow.com/questions/74755444/laravel-run-event-inside-job-queue-async)

## ref
[Laravel 消息队列实战](https://laravelacademy.org/post/22252)
[Queues](https://laravel.com/docs/10.x/queues)
[laravel-upload-large-file-with-resumablejs-and-laravel-chunk-upload](https://shouts.dev/articles/laravel-upload-large-file-with-resumablejs-and-laravel-chunk-upload)
[multiple-queues-in-laravel](https://stackoverflow.com/questions/50576569/multiple-queues-in-laravel)
[laravel-queues-and-workers-in-production](https://martinjoo.dev/laravel-queues-and-workers-in-production)
[laravel-queues-deep-dive](https://www.honeybadger.io/blog/laravel-queues-deep-dive/)
[queues#job-batching](https://laravel.com/docs/10.x/queues#job-batching)
[Laravel Job Batching](https://www.youtube.com/watch?v=aYpPswG1Op8&list=PLe30vg_FG4OTrILM1C9NvCgujTRKGsAwB&ab_channel=Bitfumes)
[pusher-subscription-succeeded](https://pusher.com/docs/channels/using_channels/presence-channels/#pusher-subscription-succeeded)
[Responsive Table](https://codepen.io/FluidOfInsanity/pen/yaLRjd)

