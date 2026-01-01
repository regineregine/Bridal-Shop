<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index()
    {
        return Order::with(['user', 'items.product'])->latest()->get();
    }

    public function show($id)
    {
        return Order::with(['user', 'items.product'])->findOrFail($id);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,confirmed,in_production,fitting,ready_for_delivery,delivered,cancelled,refunded,rejected',
            'payment_status' => 'sometimes|string|in:pending,paid,cancelled,failed',
        ]);

        $order = Order::findOrFail($id);
        
        if ($request->has('status')) {
            $order->status = $request->status;
        }
        
        if ($request->has('payment_status')) {
            $order->payment_status = $request->payment_status;
        }

        $order->save();

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->load(['user', 'items.product'])
        ]);
    }
}

