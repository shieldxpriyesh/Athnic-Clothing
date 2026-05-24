from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, NewsletterSubscriber
from .serializers import (
    CategorySerializer, ProductListSerializer,
    ProductDetailSerializer, NewsletterSubscriberSerializer,
)


class CategoryListView(generics.ListAPIView):
    """GET /api/categories/ — All categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None  # Return all categories


class ProductListView(generics.ListAPIView):
    """GET /api/products/ — Product list with filters & search"""
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'category__slug': ['exact'],
        'is_featured': ['exact'],
        'is_new_arrival': ['exact'],
        'price': ['gte', 'lte'],
        'variants__size': ['exact'],
        'variants__color': ['exact'],
    }
    search_fields = ['name', 'description', 'brand_story_copy']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category').prefetch_related('images')


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/<slug>/ — Product detail"""
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related('category').prefetch_related('images', 'variants')


class FeaturedProductsView(generics.ListAPIView):
    """GET /api/products/featured/ — Featured products for homepage"""
    serializer_class = ProductListSerializer
    pagination_class = None

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, is_featured=True
        ).select_related('category').prefetch_related('images')[:8]


class NewArrivalsView(generics.ListAPIView):
    """GET /api/products/new-arrivals/ — New arrivals"""
    serializer_class = ProductListSerializer
    pagination_class = None

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, is_new_arrival=True
        ).select_related('category').prefetch_related('images')[:8]


class RelatedProductsView(generics.ListAPIView):
    """GET /api/products/<slug>/related/ — Related products"""
    serializer_class = ProductListSerializer
    pagination_class = None

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        try:
            product = Product.objects.get(slug=slug, is_active=True)
            return Product.objects.filter(
                is_active=True, category=product.category
            ).exclude(pk=product.pk).select_related('category').prefetch_related('images')[:4]
        except Product.DoesNotExist:
            return Product.objects.none()


class NewsletterSubscribeView(APIView):
    """POST /api/newsletter/subscribe/ — Subscribe to newsletter"""
    def post(self, request):
        serializer = NewsletterSubscriberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Welcome to the tribe. You\'re in.'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
