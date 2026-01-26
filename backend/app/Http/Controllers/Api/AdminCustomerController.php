<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index(Request $request)
    {
        // Check if requesting archived customers
        $archived = $request->query('archived', false);
        
        $query = User::withCount('orders');
        
        if ($archived) {
            $query->where('is_archived', true);
        } else {
            $query->where('is_archived', false);
        }
        
        $customers = $query->latest()->get();
        
        // Calculate total_spent for each customer
        // Only count orders where payment_status = 'paid' AND status is 'in_production' or later
        $customers->each(function ($customer) {
            $customer->total_spent = $customer->orders()
                ->where('payment_status', 'paid')
                ->whereIn('status', ['in_production', 'fitting', 'ready_for_delivery', 'delivered'])
                ->sum('total_price');
        });

        return $customers;
    }

    public function show($id)
    {
        $user = User::with(['orders' => function($query) {
            $query->with('items.product')->latest();
        }])->findOrFail($id);

        // Calculate total_spent for this customer
        $user->total_spent = $user->orders()
            ->where('payment_status', 'paid')
            ->whereIn('status', ['in_production', 'fitting', 'ready_for_delivery', 'delivered'])
            ->sum('total_price');

        return $user;
    }

    public function archive($id)
    {
        $user = User::findOrFail($id);
        
        $user->update([
            'is_archived' => true,
            'archived_at' => now(),
        ]);

        return response()->json([
            'message' => 'Customer archived successfully',
            'user' => $user
        ]);
    }

    public function unarchive($id)
    {
        $user = User::findOrFail($id);
        
        $user->update([
            'is_archived' => false,
            'archived_at' => null,
        ]);

        return response()->json([
            'message' => 'Customer unarchived successfully',
            'user' => $user
        ]);
    }
}

