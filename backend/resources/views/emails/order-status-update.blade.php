<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
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
        .status-badge {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 18px;
            margin: 20px 0;
        }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-confirmed { background-color: #dbeafe; color: #1e40af; }
        .status-in_production { background-color: #e9d5ff; color: #6b21a8; }
        .status-fitting { background-color: #e0e7ff; color: #4338ca; }
        .status-ready_for_delivery { background-color: #cffafe; color: #155e75; }
        .status-delivered { background-color: #d1fae5; color: #065f46; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
        .status-refunded { background-color: #fed7aa; color: #9a3412; }
        .status-rejected { background-color: #fecaca; color: #7f1d1d; }
        .order-info {
            background-color: #faf8f6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .order-info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e8e2dd;
        }
        .order-info-item:last-child {
            border-bottom: none;
        }
        .order-info-label {
            font-weight: 600;
            color: #8f7f75;
        }
        .order-info-value {
            color: #a5948b;
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
        .items-list {
            margin: 20px 0;
        }
        .item {
            display: flex;
            gap: 15px;
            padding: 15px;
            background-color: #faf8f6;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .item-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
        }
        .item-details {
            flex: 1;
        }
        .item-name {
            font-weight: 600;
            color: #8f7f75;
            margin-bottom: 5px;
        }
        .item-meta {
            font-size: 14px;
            color: #a5948b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Promise</h1>
        </div>
        <div class="content">
            <h2>Order Status Update</h2>
            <p>Hello {{ $user->name }},</p>
            <p>We have an update on your order!</p>
            
            <div style="text-align: center;">
                <span class="status-badge status-{{ $order->status }}">
                    {{ $statusLabel }}
                </span>
            </div>

            <div class="order-info">
                <div class="order-info-item">
                    <span class="order-info-label">Order Number:</span>
                    <span class="order-info-value">#{{ $order->id }}</span>
                </div>
                <div class="order-info-item">
                    <span class="order-info-label">Order Date:</span>
                    <span class="order-info-value">{{ \Carbon\Carbon::parse($order->created_at)->format('F d, Y') }}</span>
                </div>
                <div class="order-info-item">
                    <span class="order-info-label">Total Amount:</span>
                    <span class="order-info-value">₱{{ number_format($order->total_price, 2) }}</span>
                </div>
                <div class="order-info-item">
                    <span class="order-info-label">Payment Status:</span>
                    <span class="order-info-value">{{ ucfirst($order->payment_status) }}</span>
                </div>
            </div>

            @if($order->items && count($order->items) > 0)
            <div class="items-list">
                <h3 style="color: #8f7f75; font-size: 18px; margin-bottom: 15px;">Order Items:</h3>
                @foreach($order->items as $item)
                <div class="item">
                    @if($item->product && $item->product->image)
                    @php
                        $imageUrl = $item->product->image;
                        if (strpos($imageUrl, 'http') === false && strpos($imageUrl, 'data:') === false) {
                            // Use FRONTEND_URL for images since backend is accessed via Vite proxy
                            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
                            if (strpos($imageUrl, 'products/') === 0) {
                                // Images in storage are accessed via proxy: /api/storage/... or through frontend
                                $imageUrl = $frontendUrl . '/storage/' . $imageUrl;
                            } else {
                                $imageUrl = $frontendUrl . '/img/' . $imageUrl;
                            }
                        }
                    @endphp
                    <img src="{{ $imageUrl }}" alt="{{ $item->product->name }}" class="item-image" />
                    @endif
                    <div class="item-details">
                        <div class="item-name">{{ $item->product->name ?? 'Product' }}</div>
                        <div class="item-meta">
                            Size: {{ $item->size ?? 'N/A' }} | 
                            Quantity: {{ $item->quantity }} | 
                            Price: ₱{{ number_format($item->price, 2) }}
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
            @endif

            <div class="divider"></div>

            <p style="font-size: 16px; color: #8f7f75; font-weight: 600;">What's Next?</p>
            <p style="font-size: 14px; color: #a5948b;">
                @if($order->status === 'pending')
                    Your order has been received and is awaiting payment confirmation. We'll notify you once payment is verified.
                @elseif($order->status === 'confirmed')
                    Your payment has been confirmed! We're now preparing your order. Production will begin soon.
                @elseif($order->status === 'in_production')
                    Great news! Your dress is now in production. Our team is working on creating your beautiful dress. This process typically takes 4-8 weeks.
                @elseif($order->status === 'fitting')
                    Your dress is ready for fitting! Please contact us to schedule your fitting appointment. Minor alterations can be made at this stage.
                @elseif($order->status === 'ready_for_delivery')
                    Your dress is complete and ready for pickup or delivery! We'll contact you soon to arrange delivery or pickup.
                @elseif($order->status === 'delivered')
                    Your order has been delivered! We hope you love your dress. If you have any questions or concerns, please contact us within 48-72 hours.
                @elseif($order->status === 'cancelled')
                    Your order has been cancelled. If you have any questions about this cancellation, please contact our customer service team.
                @elseif($order->status === 'refunded')
                    Your refund has been processed. The amount will be credited back to your original payment method within 5-10 business days.
                @elseif($order->status === 'rejected')
                    Your refund request has been reviewed. Unfortunately, it does not meet our refund policy criteria. Please contact us if you have any questions.
                @endif
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}/profile?tab=orders" class="button">
                    View Order Details
                </a>
            </div>

            <div class="divider"></div>

            <p style="font-size: 14px; color: #a5948b;">
                If you have any questions about your order, please don't hesitate to contact us. We're here to help!
            </p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} Promise Bridal Shop. All rights reserved.</p>
            <p style="margin-top: 10px;">Thank you for choosing Promise!</p>
        </div>
    </div>
</body>
</html>

