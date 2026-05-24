from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/featured/', views.FeaturedProductsView.as_view(), name='product-featured'),
    path('products/new-arrivals/', views.NewArrivalsView.as_view(), name='product-new-arrivals'),
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('products/<slug:slug>/related/', views.RelatedProductsView.as_view(), name='product-related'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('newsletter/subscribe/', views.NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),
]
