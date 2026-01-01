<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index()
    {
        $customers = User::withCount('orders')->latest()->get();
        
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
}

