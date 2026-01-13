<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PasswordResetController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'We could not find a user with that email address.',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'We could not find a user with that email address.'
            ], 404);
        }

        // Generate 6-digit code
        $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Delete old codes for this email
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Insert new code (store as plain text for easy verification, but hash it)
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($code),
            'created_at' => Carbon::now(),
        ]);

        // Send email with code
        try {
            Mail::send('emails.password-reset-code', [
                'user' => $user,
                'code' => $code,
            ], function ($message) use ($user) {
                $message->to($user->email, $user->name)
                    ->subject('Your Password Reset Code - Promise Bridal Shop');
            });

            return response()->json([
                'message' => 'Password reset code has been sent to your email address.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send email. Please try again later.'
            ], 500);
        }
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        // Find the reset code
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Invalid or expired reset code.'
            ], 400);
        }

        // Check if code is valid (not expired - 15 minutes)
        $createdAt = Carbon::parse($resetRecord->created_at);
        if ($createdAt->diffInMinutes(Carbon::now()) > 15) {
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();
            
            return response()->json([
                'message' => 'This reset code has expired. Please request a new one.'
            ], 400);
        }

        // Verify code
        if (!Hash::check($request->code, $resetRecord->token)) {
            return response()->json([
                'message' => 'Invalid reset code. Please check and try again.'
            ], 400);
        }

        // Code is valid - get user and create token for automatic login
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        // Update last login timestamp
        $user->update(['last_login_at' => now()]);

        // Create a token for the user (so they can be automatically logged in)
        $authToken = $user->createToken('password_reset_token')->plainTextToken;

        // Code is valid - return success with token for auto-login
        return response()->json([
            'message' => 'Code verified successfully. You can now change your password.',
            'verified' => true,
            'access_token' => $authToken,
            'token_type' => 'Bearer',
            'user' => $user->fresh(),
        ], 200);
    }

    public function resetPasswordWithCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Find the reset code
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Invalid or expired reset code.'
            ], 400);
        }

        // Check if code is valid (not expired - 15 minutes)
        $createdAt = Carbon::parse($resetRecord->created_at);
        if ($createdAt->diffInMinutes(Carbon::now()) > 15) {
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();
            
            return response()->json([
                'message' => 'This reset code has expired. Please request a new one.'
            ], 400);
        }

        // Verify code
        if (!Hash::check($request->code, $resetRecord->token)) {
            return response()->json([
                'message' => 'Invalid reset code.'
            ], 400);
        }

        // Update user password
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the reset code
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'message' => 'Password has been reset successfully. You can now login with your new password.'
        ], 200);
    }
}

