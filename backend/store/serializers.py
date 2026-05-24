from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant, Coupon, NewsletterSubscriber


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'description', 'display_order', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'order', 'is_primary']


class ProductVariantSerializer(serializers.ModelSerializer):
    size_display = serializers.CharField(source='get_size_display', read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'size_display', 'color', 'sku', 'stock_quantity']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product listings."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name',
            'price', 'compare_price', 'discount_percent',
            'is_featured', 'is_new_arrival', 'primary_image',
            'brand_story_copy', 'created_at',
        ]

    def get_primary_image(self, obj):
        img = obj.primary_image
        if img and img.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(img.image.url)
            return img.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for product detail page."""
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    discount_percent = serializers.ReadOnlyField()
    total_stock = serializers.ReadOnlyField()
    available_sizes = serializers.SerializerMethodField()
    available_colors = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'brand_story_copy',
            'category', 'price', 'compare_price', 'gst_percent',
            'discount_percent', 'total_stock',
            'is_featured', 'is_new_arrival',
            'images', 'variants',
            'available_sizes', 'available_colors',
            'created_at',
        ]

    def get_available_sizes(self, obj):
        return list(
            obj.variants.filter(stock_quantity__gt=0)
            .values_list('size', flat=True)
            .distinct()
        )

    def get_available_colors(self, obj):
        return list(
            obj.variants.filter(stock_quantity__gt=0)
            .values_list('color', flat=True)
            .distinct()
        )


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['code', 'discount_type', 'value', 'min_order']


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['email']

    def validate_email(self, value):
        if NewsletterSubscriber.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already subscribed.")
        return value
