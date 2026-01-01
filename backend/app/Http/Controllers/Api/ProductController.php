<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        return $query->get();
    }

    public function show($id)
    {
        return Product::findOrFail($id);
    }

    public function reduceStock(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($id);
        
        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Insufficient stock',
                'available' => $product->stock
            ], 400);
        }

        $product->stock -= $request->quantity;
        $product->save();

        return response()->json([
            'message' => 'Stock updated successfully',
            'product' => $product
        ]);
    }
}
