<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'contact_number' => 'nullable|string|max:20',
            'gender' => 'nullable|string|in:Female,Male,Other',
            'date_of_birth' => 'nullable|date',
            'profile_img' => 'nullable|image|max:2048', // Max 2MB
        ]);

        if ($request->hasFile('profile_img')) {
            // Delete old image if exists and not default
            if ($user->profile_img && Storage::disk('public')->exists($user->profile_img)) {
                Storage::disk('public')->delete($user->profile_img);
            }

            $path = $request->file('profile_img')->store('profile-uploads', 'public');
            $user->profile_img = $path;
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->contact_number = $validated['contact_number'];
        $user->gender = $validated['gender'] ?? $user->gender;
        $user->date_of_birth = $validated['date_of_birth'] ?? $user->date_of_birth;

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function updateAddress(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'barangay' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
        ]);

        $user->address = $validated['address'] ?? $user->address;
        $user->city = $validated['city'] ?? $user->city;
        $user->province = $validated['province'] ?? $user->province;
        $user->barangay = $validated['barangay'] ?? $user->barangay;
        $user->zip = $validated['zip'] ?? $user->zip;
        $user->country = $validated['country'] ?? $user->country;

        $user->save();

        return response()->json([
            'message' => 'Address updated successfully',
            'user' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }

    public function updatePayment(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'card_holder_name' => 'nullable|string|max:255',
            'card_number' => 'nullable|string|max:19', // For validation only, we'll store last 4
            'card_expiry' => 'nullable|string|max:5', // MM/YY format
            'card_type' => 'nullable|string|max:50',
        ]);

        // Only store last 4 digits of card for security
        if (!empty($validated['card_number'])) {
            $user->card_last_four = substr(str_replace(' ', '', $validated['card_number']), -4);
        }

        $user->card_holder_name = $validated['card_holder_name'] ?? $user->card_holder_name;
        $user->card_expiry = $validated['card_expiry'] ?? $user->card_expiry;
        $user->card_type = $validated['card_type'] ?? $user->card_type;

        $user->save();

        return response()->json([
            'message' => 'Payment information updated successfully',
            'user' => $user
        ]);
    }

    public function getMeasurements(Request $request)
    {
        $user = $request->user();

        // Return measurements in the format expected by frontend
        $measurements = [
            'bust' => $user->bust,
            'waist' => $user->waist,
            'hips' => $user->hips,
            'hollow_to_hem' => $user->hollow_to_hem,
            'height' => $user->height,
            'notes' => $user->measurement_notes,
        ];

        // Only return if at least one measurement exists
        if (array_filter($measurements, fn($val) => $val !== null && $val !== '')) {
            return response()->json($measurements);
        }

        return response()->json($measurements);
    }

    public function updateMeasurements(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'bust' => 'nullable|numeric|min:0|max:200',
            'waist' => 'nullable|numeric|min:0|max:200',
            'hips' => 'nullable|numeric|min:0|max:200',
            'hollow_to_hem' => 'nullable|numeric|min:0|max:200',
            'height' => 'nullable|numeric|min:0|max:200',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Update only provided fields
        if (isset($validated['bust'])) {
            $user->bust = $validated['bust'];
        }
        if (isset($validated['waist'])) {
            $user->waist = $validated['waist'];
        }
        if (isset($validated['hips'])) {
            $user->hips = $validated['hips'];
        }
        if (isset($validated['hollow_to_hem'])) {
            $user->hollow_to_hem = $validated['hollow_to_hem'];
        }
        if (isset($validated['height'])) {
            $user->height = $validated['height'];
        }
        if (isset($validated['notes'])) {
            $user->measurement_notes = $validated['notes'];
        }

        $user->save();

        return response()->json([
            'message' => 'Measurements saved successfully',
            'bust' => $user->bust,
            'waist' => $user->waist,
            'hips' => $user->hips,
            'hollow_to_hem' => $user->hollow_to_hem,
            'height' => $user->height,
            'notes' => $user->measurement_notes,
        ]);
    }
}
