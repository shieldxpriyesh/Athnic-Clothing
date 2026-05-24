from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.CartView.as_view(), name='cart-view'),
    path('cart/add/', views.CartAddView.as_view(), name='cart-add'),
    path('cart/<str:key>/', views.CartUpdateView.as_view(), name='cart-update'),
    path('cart/clear/', views.CartClearView.as_view(), name='cart-clear'),
    path('cart/apply-coupon/', views.ApplyCouponView.as_view(), name='cart-apply-coupon'),
    path('orders/create/', views.CreateOrderView.as_view(), name='order-create'),
    path('orders/verify/', views.VerifyPaymentView.as_view(), name='order-verify'),
    path('orders/my/', views.UserOrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
]
