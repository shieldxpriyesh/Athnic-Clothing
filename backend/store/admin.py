import csv
from django.contrib import admin
from django.http import HttpResponse
from django.utils.html import format_html
from .models import Category, Product, ProductImage, ProductVariant, Coupon, NewsletterSubscriber


# ─── Inlines ──────────────────────────────────────────────────────────────────

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'order', 'is_primary', 'image_preview')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px;border-radius:4px;" />',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Preview'


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ('size', 'color', 'sku', 'stock_quantity', 'stock_status')
    readonly_fields = ('stock_status',)

    def stock_status(self, obj):
        if obj.stock_quantity == 0:
            return format_html('<span style="color:red;font-weight:bold;">OUT OF STOCK</span>')
        elif obj.stock_quantity <= 5:
            return format_html('<span style="color:orange;font-weight:bold;">LOW STOCK</span>')
        return format_html('<span style="color:green;font-weight:bold;">IN STOCK</span>')
    stock_status.short_description = 'Status'


# ─── Category ────────────────────────────────────────────────────────────────

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'display_order', 'product_count')
    list_editable = ('display_order',)
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'


# ─── Product ─────────────────────────────────────────────────────────────────

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'category', 'price_display', 'stock_display',
        'is_featured', 'is_active', 'is_new_arrival', 'created_at'
    )
    list_filter = ('is_featured', 'is_active', 'is_new_arrival', 'category')
    list_editable = ('is_featured', 'is_active', 'is_new_arrival')
    search_fields = ('name', 'description', 'brand_story_copy')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductVariantInline]
    readonly_fields = ('created_at', 'updated_at')
    actions = ['make_featured', 'remove_featured', 'activate', 'deactivate']

    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'category', 'brand_story_copy')
        }),
        ('Description', {
            'fields': ('description',),
            'classes': ('wide',)
        }),
        ('Pricing', {
            'fields': ('price', 'compare_price', 'gst_percent')
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured', 'is_new_arrival')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def price_display(self, obj):
        if obj.compare_price and obj.compare_price > obj.price:
            return format_html(
                '₹{} <small style="text-decoration:line-through;color:#888;">₹{}</small> '
                '<span style="color:#D4FF00;background:#0A0A0A;padding:2px 6px;border-radius:3px;font-size:11px;">'
                '-{}%</span>',
                obj.price, obj.compare_price, obj.discount_percent
            )
        return f'₹{obj.price}'
    price_display.short_description = 'Price'

    def stock_display(self, obj):
        total = obj.total_stock
        if total == 0:
            return format_html('<span style="color:red;">0</span>')
        elif total <= 10:
            return format_html('<span style="color:orange;">{}</span>', total)
        return format_html('<span style="color:green;">{}</span>', total)
    stock_display.short_description = 'Stock'

    @admin.action(description='Mark as Featured')
    def make_featured(self, request, queryset):
        queryset.update(is_featured=True)

    @admin.action(description='Remove from Featured')
    def remove_featured(self, request, queryset):
        queryset.update(is_featured=False)

    @admin.action(description='Activate Products')
    def activate(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description='Deactivate Products')
    def deactivate(self, request, queryset):
        queryset.update(is_active=False)


# ─── Coupon ──────────────────────────────────────────────────────────────────

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'value', 'min_order', 'used_count', 'max_uses', 'valid_until', 'is_active')
    list_filter = ('discount_type', 'is_active')
    list_editable = ('is_active',)
    search_fields = ('code',)


# ─── Newsletter ──────────────────────────────────────────────────────────────

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'subscribed_at')
    search_fields = ('email',)
    readonly_fields = ('subscribed_at',)
    actions = ['export_emails']

    @admin.action(description='Export selected emails to CSV')
    def export_emails(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="newsletter_subscribers.csv"'
        writer = csv.writer(response)
        writer.writerow(['Email', 'Subscribed At'])
        for sub in queryset:
            writer.writerow([sub.email, sub.subscribed_at])
        return response
