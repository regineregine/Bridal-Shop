<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->orders()->with('items.product')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'shipping_address' => 'required',
            'total_price' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($request) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_price' => $request->total_price,
                'shipping_address' => json_encode($request->shipping_address),
                'status' => 'pending',
                'payment_status' => 'pending', // In a real app, handle payment gateway callback
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'size' => $item['size'] ?? null,
                ]);
            }

            return $order->load('items');
        });
    }

    public function show(Request $request, $id)
    {
        return $request->user()->orders()->with('items.product')->findOrFail($id);
    }

    public function cancel(Request $request, $id)
    {
        $order = $request->user()->orders()->with('items.product')->findOrFail($id);

        // Check if order can be cancelled (only pending or confirmed)
        if (!in_array($order->status, ['pending', 'confirmed'])) {
            return response()->json([
                'message' => 'This order cannot be cancelled. Only pending or confirmed orders can be cancelled.'
            ], 422);
        }

        // Update order status
        $order->status = 'cancelled';
        $order->save();

        return response()->json([
            'message' => 'Order cancelled successfully',
            'order' => $order->load('items.product')
        ]);
    }
}
