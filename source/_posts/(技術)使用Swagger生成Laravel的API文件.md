---
title: (技術)使用Swagger生成Laravel的API文件
date: 2023-10-10 12:32:26
tags:
    - Swagger
author: Boris Chien
keywords:
    - Swagger
---

Swagger 可以用來生成 Laravel API 文件，輕鬆地記錄和分享 API 的資訊，提供了清晰的介面，
讓開發人員更容易了解和使用您的 API。這有助於提高開發效率並確保 API 文檔的一致性

## 安裝
```
composer require "darkaonline/l5-swagger"
```
## Controller

加入文件版本、標題、描述、授權

```php
namespace App\Http\Controllers;

use OpenApi\Annotations as OA;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Book-RESTful-API",
 *      description="Login to obtain a JWT, with bearer authorization",
 *      @OA\Contact(
 *          email="demo@example.com"
 *      ),
 *     @OA\License(
 *         name="Apache 2.0",
 *         url="http://www.apache.org/licenses/LICENSE-2.0.html"
 *     )
 * )
 */

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
```
## BookController

新增CRUD註解

```php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Http\Resources\BookResource;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function __construct()
    {
        $this->middleware('auth:api')->except(['index', 'show']);
    }
    /**
     * @OA\Get(
     *     path="/api/books",
     *     summary="取得最多25筆的書本與評分",
     *     tags={"Book"},
     *     @OA\Response(response="200", description="成功",@OA\JsonContent()),
     * )
     */
    public function index()
    {
        return BookResource::collection(Book::with('ratings')->paginate(25));
    }
    /**
     * @OA\POST(
     *     path="/api/books",
     *     summary="創建書本",
     *     tags={"Book"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 required={"title", "description"},
     *                 @OA\Property(
     *                     property="title",
     *                     type="string",
     *                     description="標題"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     type="string",
     *                     description="簡介"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="創建成功"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="未驗證"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="資源不存在"
     *     ),
     *     security={{ "bearer_token": {} }}
     * )
     */

    public function store(Request $request)
    {
        $book = Book::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return new BookResource($book);
    }

    /**
     * @OA\Get(
     *     path="/api/books/{bookId}",
     *     summary="取得書本",
     *     tags={"Book"},
     *      @OA\Parameter(
     *          name="bookId",
     *          description="Book id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="integer"
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="成功"
     *       ),
     *      @OA\Response(
     *          response=404,
     *          description="資源不存在"
     *       )
     * )
     */
    public function show(Book $book)
    {
        return new BookResource($book);
    }

    /**
     * @OA\Patch(
     *      path="/api/books/{bookId}",
     *      summary="更新書本",
     *      tags={"Book"},
     *      description="更新書本",
     *      @OA\Parameter(
     *          name="bookId",
     *          description="Book id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="integer"
     *          )
     *      ),
     *      @OA\RequestBody(
     *          description="更新書本的內容",
     *          required=true,
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema(
     *                  type="object",
     *                  @OA\Property(
     *                      property="title",
     *                      description="標題",
     *                      type="string"
     *                  ),
     *                  @OA\Property(
     *                      property="description",
     *                      description="內容",
     *                      type="string"
     *                  ),
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="成功",
     *          @OA\JsonContent()
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="未驗證",
     *          @OA\JsonContent()
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="資源不存在",
     *          @OA\JsonContent()
     *      ),
     *      security={{ "bearer_token": {} }}
     * )
     */
    public function update(Request $request, Book $book)
    {
        if ($request->user()->id !== $book->user_id) {
            return response()->json(['error' => 'You can only edit your own books.'], 403);
        }

        $book->update($request->only(['title', 'description']));

        return new BookResource($book);
    }

    /**
     * @OA\Delete(
     *     path="/api/books/{bookId}",
     *     summary="刪除書本",
     *     tags={"Book"},
     *      @OA\Parameter(
     *          name="bookId",
     *          description="Book id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="integer"
     *          )
     *      ),
     *      @OA\Response(
     *          response=204,
     *          description="刪除成功",
     *          @OA\JsonContent()
     *       ),
     *      @OA\Response(
     *          response=404,
     *          description="資源不存在",
     *          @OA\JsonContent()
     *       ),
     *      security={{ "bearer_token": {} }}
     * )
     */
    public function destroy(Book $book)
    {
        $book->delete();

        return response()->json(null, 204);
    }
}
```

## 生成文件

```
php artisan l5-swagger:generate
```
訪問以下路由即可看到文件

```
<server>/api/documention
```
## demo
[範例在這](https://github.com/chienniman/REST-API)

## Ref
[L5-Swagger](https://github.com/DarkaOnLine/L5-Swagger)
[swagger-demo](https://petstore.swagger.io/#/pet/uploadFile)
[use JWT Bearer token in swagger Laravel](https://stackoverflow.com/questions/50614594/use-jwt-bearer-token-in-swagger-laravel)