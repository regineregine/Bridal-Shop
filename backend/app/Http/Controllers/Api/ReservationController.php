<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required|string',
            'type' => 'required|string',
            'guests' => 'required|integer|min:1',
        ]);

        $reservation = Reservation::create([
            'user_id' => $request->user() ? $request->user()->id : null,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $request->appointment_time,
            'type' => $request->type,
            'guests' => $request->guests,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        return response()->json($reservation, 201);
    }
}
