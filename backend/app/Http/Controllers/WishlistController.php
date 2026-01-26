<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Display a listing of the user's wishlist.
     */
    public function index()
    {
        $user = Auth::user();

        $wishlistItems = Wishlist::where('user_id', $user->id)
            ->with('product')
            ->get()
            ->map(function ($wishlist) {
                return [
                    'id' => $wishlist->id,
                    'product' => $wishlist->product,
                    'added_at' => $wishlist->created_at,
                ];
            });

        return response()->json($wishlistItems);
    }

    /**
     * Add a product to the user's wishlist.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();

        // Check if product is already in wishlist
        $existing = Wishlist::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Product already in wishlist',
                'wishlist_item' => $existing,
            ], 200);
        }

        $wishlistItem = Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json([
            'message' => 'Product added to wishlist',
            'wishlist_item' => $wishlistItem->load('product'),
        ], 201);
    }

    /**
     * Check if a product is in the user's wishlist.
     */
    public function check(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();

        $inWishlist = Wishlist::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->exists();

        return response()->json([
            'in_wishlist' => $inWishlist,
        ]);
    }

    /**
     * Remove a product from the user's wishlist.
     */
    public function destroy($productId)
    {
        $user = Auth::user();

        $wishlistItem = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if (!$wishlistItem) {
            return response()->json([
                'message' => 'Product not found in wishlist',
            ], 404);
        }

        $wishlistItem->delete();

        return response()->json([
            'message' => 'Product removed from wishlist',
        ]);
    }
}
