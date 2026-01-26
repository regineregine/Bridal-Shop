<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product']);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Sort by created_at date
        if ($request->has('sort') && $request->sort === 'asc') {
            $query->orderBy('created_at', 'asc');
        } else {
            $query->orderBy('created_at', 'desc'); // Default to newest first
        }

        return $query->get();
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
            'expected_delivery_date' => 'sometimes|nullable|date|after:today',
        ]);

        $order = Order::with(['user', 'items.product'])->findOrFail($id);
        $oldStatus = $order->status;

        return DB::transaction(function () use ($request, $order, $oldStatus) {
            $newStatus = $request->input('status');

            // Handle stock management based on status changes
            if ($request->has('status') && $oldStatus !== $newStatus) {
                // If changing from cancelled to any other status, deduct stock
                if ($oldStatus === 'cancelled' && $newStatus !== 'cancelled') {
                    foreach ($order->items as $item) {
                        if ($item->product->stock < $item->quantity) {
                            throw new \Exception("Cannot change order status: Insufficient stock for product: {$item->product->name}. Available: {$item->product->stock}, Required: {$item->quantity}");
                        }
                        $item->product->decrement('stock', $item->quantity);
                    }
                }
                // If changing to cancelled from any other status, restore stock
                elseif ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
                    foreach ($order->items as $item) {
                        $item->product->increment('stock', $item->quantity);
                    }
                }
            }

            if ($request->has('status')) {
                $order->status = $newStatus;
            }

            if ($request->has('payment_status')) {
                $order->payment_status = $request->payment_status;
            }

            if ($request->has('expected_delivery_date')) {
                $order->expected_delivery_date = $request->expected_delivery_date;
            } else {
                // Recalculate expected delivery based on current status and remaining time
                $weeksRemaining = match($newStatus) {
                    'pending' => 12, // Full 12 weeks remaining
                    'confirmed' => 10, // 2 weeks processing time passed, 10 remaining
                    'in_production' => 6, // 6 weeks processing time passed, 6 remaining
                    'fitting' => 2, // 10 weeks processing time passed, 2 remaining
                    'ready_for_delivery' => 0.43, // ~3 days remaining (shipping/pickup time)
                    default => 12
                };

                // Calculate from now, not from order date
                $order->expected_delivery_date = Carbon::now()->addWeeks($weeksRemaining);
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
        });
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

