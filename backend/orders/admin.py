import csv
from django.contrib import admin
from django.http import HttpResponse
from django.utils.html import format_html
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'size', 'color', 'quantity', 'unit_price', 'line_total_display')
    fields = ('product_name', 'size', 'color', 'quantity', 'unit_price', 'line_total_display')

    def line_total_display(self, obj):
        return f'₹{obj.line_total}'
    line_total_display.short_description = 'Total'

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_id', 'user', 'status_badge', 'total_display',
        'payment_status', 'created_at'
    )
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'user__username', 'user__email', 'razorpay_order_id', 'razorpay_payment_id')
    readonly_fields = (
        'user', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature',
        'shipping_address', 'subtotal', 'shipping_cost', 'gst_amount',
        'discount_amount', 'total', 'coupon_code', 'created_at', 'updated_at'
    )
    inlines = [OrderItemInline]
    actions = ['export_orders_csv', 'mark_shipped', 'mark_delivered']

    fieldsets = (
        ('Order Info', {
            'fields': ('user', 'status', 'tracking_id', 'notes')
        }),
        ('Payment', {
            'fields': ('razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature')
        }),
        ('Shipping', {
            'fields': ('shipping_address',)
        }),
        ('Totals', {
            'fields': ('subtotal', 'shipping_cost', 'gst_amount', 'discount_amount', 'coupon_code', 'total')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def order_id(self, obj):
        return f'#{obj.pk}'
    order_id.short_description = 'Order'

    def status_badge(self, obj):
        colors = {
            'pending': '#FFA500',
            'confirmed': '#4CAF50',
            'shipped': '#2196F3',
            'delivered': '#8BC34A',
            'cancelled': '#F44336',
        }
        color = colors.get(obj.status, '#888')
        return format_html(
            '<span style="background:{};color:white;padding:3px 10px;border-radius:12px;font-size:11px;'
            'font-weight:bold;text-transform:uppercase;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def total_display(self, obj):
        return f'₹{obj.total}'
    total_display.short_description = 'Total'

    def payment_status(self, obj):
        if obj.razorpay_payment_id:
            return format_html('<span style="color:green;">✓ Paid</span>')
        return format_html('<span style="color:orange;">Pending</span>')
    payment_status.short_description = 'Payment'

    @admin.action(description='Export orders to CSV')
    def export_orders_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="orders.csv"'
        writer = csv.writer(response)
        writer.writerow([
            'Order ID', 'User', 'Status', 'Total', 'Payment ID',
            'Coupon', 'Tracking', 'Created'
        ])
        for order in queryset:
            writer.writerow([
                order.pk, order.user, order.status, order.total,
                order.razorpay_payment_id, order.coupon_code,
                order.tracking_id, order.created_at
            ])
        return response

    @admin.action(description='Mark as Shipped')
    def mark_shipped(self, request, queryset):
        queryset.update(status='shipped')

    @admin.action(description='Mark as Delivered')
    def mark_delivered(self, request, queryset):
        queryset.update(status='delivered')
