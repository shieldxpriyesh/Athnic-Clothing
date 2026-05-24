from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.ReadOnlyField()
    product_slug = serializers.CharField(source='product.slug', read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_slug', 'product_name',
            'variant', 'quantity', 'unit_price', 'size', 'color',
            'line_total',
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'status_display',
            'razorpay_order_id', 'razorpay_payment_id',
            'shipping_address', 'items',
            'subtotal', 'shipping_cost', 'gst_amount',
            'discount_amount', 'total', 'coupon_code',
            'tracking_id', 'created_at',
        ]


class CreateOrderSerializer(serializers.Serializer):
    shipping_address_id = serializers.IntegerField()
    coupon_code = serializers.CharField(required=False, allow_blank=True)
