<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

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

        $order = Order::with(['user', 'items.product'])->findOrFail($id);
        $oldStatus = $order->status;
        
        if ($request->has('status')) {
            $order->status = $request->status;
        }
        
        if ($request->has('payment_status')) {
            $order->payment_status = $request->payment_status;
        }

        $order->save();
        $order->refresh();
        $order->load(['user', 'items.product']);

        // Send email notification if status changed and user exists
        if ($request->has('status') && $oldStatus !== $order->status && $order->user) {
            try {
                $this->sendStatusUpdateEmail($order);
            } catch (\Exception $e) {
                // Log error but don't fail the request
                Log::error('Failed to send order status email: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }

    private function sendStatusUpdateEmail($order)
    {
        $user = $order->user;
        
        if (!$user || !$user->email) {
            return;
        }

        // Format status label
        $statusLabels = [
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'in_production' => 'In Production',
            'fitting' => 'Fitting / Alteration',
            'ready_for_delivery' => 'Ready for Delivery',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
            'refunded' => 'Refunded',
            'rejected' => 'Rejected / Disputed',
        ];

        $statusLabel = $statusLabels[$order->status] ?? ucfirst(str_replace('_', ' ', $order->status));

        Mail::send('emails.order-status-update', [
            'user' => $user,
            'order' => $order,
            'statusLabel' => $statusLabel,
        ], function ($message) use ($user, $order, $statusLabel) {
            $message->to($user->email, $user->name)
                ->subject("Order #{$order->id} Status Update: {$statusLabel} - Promise Bridal Shop");
        });
    }
}

