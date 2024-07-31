---
title: (技術)開發一把Terraria超級酷炫的莫托洛夫之劍
date: 2024-07-31 13:18:27
tags:
---
## Terraria
> 《泰拉瑞亞》（英語：Terraria）是一款2D沙盒模擬遊戲，由Re-Logic開發。名稱來自土族缸。《泰拉瑞亞》的遊戲特色是在一個隨機生成的2D世界裡探索、創造、建築，並與各種生物戰鬥，類似於銀河戰士系列和《惡魔城X 月下夜想曲》。[6][7][8]遊戲2011年5月16日最初發布在Windows平台，此後，陸續發布了支援其他作業系統、主機、智慧型手機和平板電腦等的版本。遊戲發布時受到普遍正面評價，其沙盒元素頗受好評。截止到2022年5月全平台累積銷量逾4450萬套，成為有史以來銷量最好的遊戲之一。


## tModLoader
> tModLoader（TML）是一個免費的程序，允許使用模組遊玩泰拉瑞亞。其內置的模組瀏覽器能夠下載並更新模組，也能上傳自己製作的模組。tModLoader 由 TML 團隊開發製作，並由其發布為獨立程序，不過它也可在 Steam 上作為泰拉瑞亞的可下載內容（DLC）獲取。關於包含製作模組和使用 tModLoader 的信息的官方 tModLoader Wiki 可以在 GitHub 上找到。


## 開發準備
1.`.NET 8 SDK`
2.[Visual Studio 2022](https://https://visualstudio.microsoft.com/zh-hant/vs/)
3.[Quick Terraria-specific C# crash course](https://docs.google.com/document/d/1xRz3kFNbewb8DI29AKXuyi6O327IcxlgihZ7sdK_IuE/edit)
4.[CheatSheet](https://steamcommunity.com/sharedfiles/filedetails/?id=2563784437)


## C# OOP
1.抽象類別不能實作
2.繼承抽象類別的子類必須複寫父類的的抽象方法
3.呼叫衍生類的虛擬類都是最終衍生類的實現
4.覆寫(Override)子類別可以覆寫父類別的方法
5.多載(Overload)一個類別中，定義多個名稱相同，但參數不同的方法
6.多型(Polymorphism)是指父類別可透過子類別衍伸成多種型態


## 自動生成模組


### 架構
1.[ModName].cs-唯一模組檔
2.description.txt-模組說明
3.build.txt-版本、作者、顯示名稱
4.icon.png -模組圖標
5.[ModName].csproj
6.Properties/launchSettings.json- tModLoader debug路徑
7.Content/Items/[ItemName].cs-自定義的核心邏輯
8.Content/Items/[ItemName].png-圖片
9.Localization/en-US_Mods.[ModName].hjson-物品名、物品說明


### 流程
創建模組>vs打開`C:\Users\USER\Documents\My Games\Terraria\tModLoader\ModSources\TestMod`編輯>熱加載/手動加載
![](/images/terraria/1.webp)
![](/images/terraria/2.webp)
![](/images/terraria/3.webp)


## 開發須知
1.ModItem 有不同的 hook 可以被玩家改寫，hook會被在遊戲更新迴圈中呼叫，想更改手槍發射的邏輯，可以修改`ModItem.Shoot`

2.每個物品都有唯一的`Type`，以及被存在物品陣列的`Index`，兩者獨立無關聯性

3.Sprite 是指 2D 遊戲中常見的 2D 圖形，必須是 .png 檔案，動態sprite例如蜂王，必須使用2像素來分割

4.約定方向，NPC向左，箭頭往上，法杖往右上


## 超級酷炫的莫托洛夫之劍
我想要一把能夠射出持續燃燒火焰，同時具有酷炫燃燒特效、音效的刀

```csharp
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;
using Microsoft.Xna.Framework;

namespace TestMod.Content.Items
{ 
	public class TestSword : ModItem
	{
		// 設定劍的數值，長、寬、擊退等
		public override void SetDefaults()
		{
			Item.damage = 50;
			Item.DamageType = DamageClass.Melee;
			Item.width = 40;
			Item.height = 40;
			Item.useTime = 20;
			Item.useAnimation = 20;
			Item.useStyle = ItemUseStyleID.Swing;
			Item.knockBack = 6;
			Item.value = Item.buyPrice(silver: 1);
			Item.rare = ItemRarityID.Blue;
			Item.UseSound = SoundID.Item1;
			Item.autoReuse = true;
			Item.shoot = ProjectileID.MolotovFire;
			Item.shootSpeed = 10f;
		}
        
		// 揮動特效
		public override void MeleeEffects(Player player, Rectangle hitbox)
		{
			int dust = Dust.NewDust(new Vector2(hitbox.X, hitbox.Y), hitbox.Width, hitbox.Height, DustID.AmberBolt);
			Main.dust[dust].noGravity = true;
		}

		//  註冊到品項集合中
		public override void AddRecipes()
		{
			Recipe recipe = CreateRecipe();
			recipe.AddIngredient(ItemID.DirtBlock, 10);
			recipe.AddTile(TileID.WorkBenches);
			recipe.Register();
		}
	}
}


```

![](/images/terraria/4.webp)

## Ref
https://zh.wikipedia.org/zh-tw/%E6%B3%B0%E6%8B%89%E7%91%9E%E4%BA%9A
https://terraria.wiki.gg/zh/wiki/TModLoader?variant=zh-tw
https://github.com/tModLoader/tModLoader/wiki/Basic-tModLoader-Modding-Guide
https://docs.tmodloader.net/docs/stable/class_mod_item.html