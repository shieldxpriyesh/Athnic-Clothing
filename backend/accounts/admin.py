from django.contrib import admin
from .models import ShippingAddress


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'city', 'state', 'pincode', 'is_default')
    list_filter = ('state', 'is_default')
    search_fields = ('name', 'user__username', 'city', 'pincode')
