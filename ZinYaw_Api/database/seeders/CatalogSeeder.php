<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CatalogSeeder extends Seeder
{
    public function run()
    {
        $now = Carbon::now();

        // 1. Categories
        $categories = [
            ['id' => 1, 'name' => 'Bags & daily carry', 'slug' => 'bags-daily-carry'],
            ['id' => 2, 'name' => 'Audio & accessories', 'slug' => 'audio-accessories'],
            ['id' => 3, 'name' => 'Sports', 'slug' => 'sports'],
            ['id' => 4, 'name' => 'Home essentials', 'slug' => 'home-essentials'],
        ];
        DB::table('categories')->insert(array_map(fn($c) => array_merge($c, ['created_at' => $now, 'updated_at' => $now]), $categories));

        // 2. Base Products (Global Catalog)
        $baseProducts = [
            ['id' => 1, 'category_id' => 1, 'requested_by_user_id' => 1, 'title' => 'Everyday Commuter Backpack — Charcoal', 'main_image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 'approval_status' => 'approved', 'description' => 'A great backpack.'],
            ['id' => 2, 'category_id' => 2, 'requested_by_user_id' => 1, 'title' => 'Studio Wireless Headphones', 'main_image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'approval_status' => 'approved', 'description' => 'High quality audio.'],
            ['id' => 3, 'category_id' => 3, 'requested_by_user_id' => 1, 'title' => 'Cloudstep Everyday Trainers', 'main_image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'approval_status' => 'approved', 'description' => 'Comfortable shoes.'],
            ['id' => 4, 'category_id' => 4, 'requested_by_user_id' => 1, 'title' => 'Travel Tumbler & Lunch Set', 'main_image' => 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500', 'approval_status' => 'approved', 'description' => 'Keep food warm.'],
        ];
        DB::table('base_products')->insert(array_map(fn($p) => array_merge($p, ['created_at' => $now, 'updated_at' => $now]), $baseProducts));

        // 3. Vendor Store Listings (The actual offers priced in MMK)
        $vendorListings = [
            ['id' => 1, 'base_product_id' => 1, 'vendor_id' => 1, 'price' => 45900.00, 'stock_quantity' => 124, 'is_active' => true],
            ['id' => 2, 'base_product_id' => 2, 'vendor_id' => 2, 'price' => 89500.00, 'stock_quantity' => 163, 'is_active' => true],
            ['id' => 3, 'base_product_id' => 3, 'vendor_id' => 4, 'price' => 62000.00, 'stock_quantity' => 202, 'is_active' => true],
            ['id' => 4, 'base_product_id' => 4, 'vendor_id' => 3, 'price' => 38500.00, 'stock_quantity' => 241, 'is_active' => true],
        ];
        DB::table('vendor_listings')->insert(array_map(fn($l) => array_merge($l, ['created_at' => $now, 'updated_at' => $now]), $vendorListings));
    }
}