<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: 'Unna', serif;
            line-height: 1.6;
            color: #8f7f75;
            background-color: #faf8f6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(165, 148, 139, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #ff80ab, #ff5c8d);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            font-family: 'Great Vibes', cursive;
            font-size: 48px;
            color: #ffffff;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            font-family: 'Tinos', serif;
            color: #8f7f75;
            font-size: 24px;
            margin-top: 0;
        }
        .content p {
            color: #a5948b;
            font-size: 16px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #ff80ab, #ff5c8d);
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }
        .button:hover {
            background: linear-gradient(135deg, #ff5c8d, #b70585);
        }
        .footer {
            background-color: #faf8f6;
            padding: 20px 30px;
            text-align: center;
            font-size: 14px;
            color: #a5948b;
        }
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #dcd6d0, transparent);
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Promise</h1>
        </div>
        <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hello {{ $user->name }},</p>
            <p>We received a request to reset your password for your Promise Bridal Shop account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">Reset Password</a>
            </div>
            <div class="divider"></div>
            <p style="font-size: 14px; color: #a5948b;">
                If you did not request a password reset, please ignore this email. This link will expire in 60 minutes.
            </p>
            <p style="font-size: 14px; color: #a5948b;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ $resetUrl }}" style="color: #ff80ab; word-break: break-all;">{{ $resetUrl }}</a>
            </p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} Promise Bridal Shop. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

