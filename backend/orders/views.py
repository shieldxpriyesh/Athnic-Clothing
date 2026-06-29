import json
from decimal import Decimal
from django.conf import settings
from django.db import models
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from store.models import Product, ProductVariant, Coupon
from accounts.models import ShippingAddress
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer

try:
    import razorpay
    razorpay_client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )
except Exception:
    razorpay_client = None


# ─── Session Cart ────────────────────────────────────────────────────────────

class CartView(APIView):
    """GET /api/cart/ — Get session cart"""
    authentication_classes = []

    def get(self, request):
        cart = request.session.get('cart', {})
        cart_items = []
        subtotal = Decimal('0')

        for key, item in cart.items():
            try:
                product = Product.objects.get(pk=item['product_id'], is_active=True)
                img = product.primary_image
                line_total = Decimal(str(item['price'])) * item['quantity']
                subtotal += line_total
                cart_items.append({
                    'key': key,
                    'product_id': product.id,
                    'product_name': product.name,
                    'product_slug': product.slug,
                    'image': request.build_absolute_uri(img.image.url) if img and img.image else None,
                    'size': item.get('size', ''),
                    'color': item.get('color', ''),
                    'quantity': item['quantity'],
                    'price': str(item['price']),
                    'line_total': str(line_total),
                })
            except Product.DoesNotExist:
                continue

        # Check for applied coupon in session
        coupon_code = request.session.get('coupon_code', '')
        discount_amount = Decimal('0')
        active_coupon_code = ''

        if coupon_code:
            from django.utils import timezone
            try:
                coupon = Coupon.objects.get(code=coupon_code.upper(), is_active=True)
                if coupon.valid_until >= timezone.now() and (coupon.max_uses == 0 or coupon.used_count < coupon.max_uses) and subtotal >= coupon.min_order:
                    active_coupon_code = coupon.code
                    if coupon.discount_type == 'percent':
                        discount_amount = (subtotal * coupon.value) / 100
                    else:
                        discount_amount = min(coupon.value, subtotal)
                else:
                    request.session['coupon_code'] = ''
                    request.session.modified = True
            except Coupon.DoesNotExist:
                request.session['coupon_code'] = ''
                request.session.modified = True

        shipping_cost = Decimal('0') if (subtotal >= 999 or subtotal == Decimal('0')) else Decimal('79')
        gst_amount = (subtotal - discount_amount) * Decimal('0.18')
        total = subtotal - discount_amount + gst_amount + shipping_cost

        return Response({
            'items': cart_items,
            'subtotal': str(subtotal),
            'shipping_cost': str(shipping_cost),
            'gst_amount': str(gst_amount),
            'discount_amount': str(discount_amount),
            'total': str(total),
            'coupon_code': active_coupon_code,
            'item_count': sum(i['quantity'] for i in cart_items),
        })


class CartAddView(APIView):
    """POST /api/cart/ — Add to cart"""
    authentication_classes = []

    def post(self, request):
        product_id = request.data.get('product_id')
        size = request.data.get('size', '')
        color = request.data.get('color', '')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(pk=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=404)

        # Check stock if variant specified
        if size and color:
            try:
                variant = ProductVariant.objects.get(
                    product=product, size=size, color=color
                )
                if variant.stock_quantity < quantity:
                    return Response({'error': 'Not enough stock.'}, status=400)
            except ProductVariant.DoesNotExist:
                return Response({'error': 'Variant not found.'}, status=404)

        cart = request.session.get('cart', {})
        cart_key = f"{product_id}_{size}_{color}"

        if cart_key in cart:
            cart[cart_key]['quantity'] += quantity
        else:
            cart[cart_key] = {
                'product_id': product_id,
                'price': str(product.price),
                'size': size,
                'color': color,
                'quantity': quantity,
            }

        request.session['cart'] = cart
        request.session.modified = True

        return Response({'message': 'Added to cart.', 'item_count': sum(i['quantity'] for i in cart.values())})


class CartUpdateView(APIView):
    """PUT /api/cart/<key>/ — Update cart item quantity"""
    authentication_classes = []

    def put(self, request, key):
        cart = request.session.get('cart', {})
        quantity = int(request.data.get('quantity', 1))

        if key not in cart:
            return Response({'error': 'Item not found in cart.'}, status=404)

        if quantity <= 0:
            del cart[key]
        else:
            cart[key]['quantity'] = quantity

        request.session['cart'] = cart
        request.session.modified = True
        return Response({'message': 'Cart updated.'})

    def delete(self, request, key):
        cart = request.session.get('cart', {})
        if key in cart:
            del cart[key]
            request.session['cart'] = cart
            request.session.modified = True
        return Response({'message': 'Item removed.'})


class CartClearView(APIView):
    """DELETE /api/cart/clear/ — Clear cart"""
    authentication_classes = []

    def delete(self, request):
        request.session['cart'] = {}
        request.session.modified = True
        return Response({'message': 'Cart cleared.'})


# ─── Coupon ──────────────────────────────────────────────────────────────────

class ApplyCouponView(APIView):
    """POST /api/cart/apply-coupon/ — Apply coupon code"""
    authentication_classes = []

    def post(self, request):
        code = request.data.get('code', '').strip().upper()
        from django.utils import timezone

        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon code.'}, status=400)

        if coupon.valid_until < timezone.now():
            return Response({'error': 'This coupon has expired.'}, status=400)

        if coupon.max_uses > 0 and coupon.used_count >= coupon.max_uses:
            return Response({'error': 'This coupon has been fully redeemed.'}, status=400)

        # Calculate cart total
        cart = request.session.get('cart', {})
        cart_total = sum(
            Decimal(str(item['price'])) * item['quantity']
            for item in cart.values()
        )

        if cart_total < coupon.min_order:
            return Response({
                'error': f'Minimum order of ₹{coupon.min_order} required.'
            }, status=400)

        if coupon.discount_type == 'percent':
            discount = (cart_total * coupon.value) / 100
        else:
            discount = coupon.value

        # Persist coupon to session
        request.session['coupon_code'] = coupon.code
        request.session.modified = True

        return Response({
            'code': coupon.code,
            'discount_type': coupon.discount_type,
            'value': str(coupon.value),
            'discount_amount': str(discount),
            'message': f'Coupon applied! You save ₹{discount}',
        })



# ─── Orders ──────────────────────────────────────────────────────────────────

class CreateOrderView(APIView):
    """POST /api/orders/create/ — Create Razorpay order"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get shipping address
        try:
            address = ShippingAddress.objects.get(
                pk=serializer.validated_data['shipping_address_id'],
                user=request.user
            )
        except ShippingAddress.DoesNotExist:
            return Response({'error': 'Shipping address not found.'}, status=400)

        # Get cart
        cart = request.session.get('cart', {})
        if not cart:
            return Response({'error': 'Cart is empty.'}, status=400)

        # Calculate totals
        subtotal = Decimal('0')
        order_items = []

        for key, item in cart.items():
            try:
                product = Product.objects.get(pk=item['product_id'], is_active=True)
                line_total = Decimal(str(item['price'])) * item['quantity']
                subtotal += line_total
                order_items.append({
                    'product': product,
                    'quantity': item['quantity'],
                    'unit_price': Decimal(str(item['price'])),
                    'size': item.get('size', ''),
                    'color': item.get('color', ''),
                })
            except Product.DoesNotExist:
                continue

        # Apply coupon
        discount = Decimal('0')
        coupon_code = serializer.validated_data.get('coupon_code', '')
        if not coupon_code:
            coupon_code = request.session.get('coupon_code', '')

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code.upper(), is_active=True)
                from django.utils import timezone
                if coupon.valid_until >= timezone.now() and (coupon.max_uses == 0 or coupon.used_count < coupon.max_uses) and subtotal >= coupon.min_order:
                    if coupon.discount_type == 'percent':
                        discount = (subtotal * coupon.value) / 100
                    else:
                        discount = min(coupon.value, subtotal)
                else:
                    coupon_code = ''
            except Coupon.DoesNotExist:
                coupon_code = ''

        # GST (average 18%)
        gst_amount = (subtotal - discount) * Decimal('0.18')
        shipping_cost = Decimal('0') if subtotal >= 999 else Decimal('79')
        total = subtotal - discount + gst_amount + shipping_cost

        # Create Razorpay order
        razorpay_order = None
        if razorpay_client:
            razorpay_order = razorpay_client.order.create({
                'amount': int(total * 100),  # Amount in paise
                'currency': 'INR',
                'payment_capture': 1,
            })

        # Create order in DB
        order = Order.objects.create(
            user=request.user,
            razorpay_order_id=razorpay_order['id'] if razorpay_order else '',
            shipping_address={
                'name': address.name,
                'phone': address.phone,
                'line1': address.line1,
                'line2': address.line2,
                'city': address.city,
                'state': address.get_state_display(),
                'pincode': address.pincode,
            },
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            gst_amount=gst_amount,
            discount_amount=discount,
            total=total,
            coupon_code=coupon_code,
        )

        for item_data in order_items:
            product = item_data.pop('product')
            variant = None
            if item_data['size'] and item_data['color']:
                variant = ProductVariant.objects.filter(
                    product=product,
                    size=item_data['size'],
                    color=item_data['color']
                ).first()

            OrderItem.objects.create(
                order=order,
                product=product,
                variant=variant,
                product_name=product.name,
                **item_data,
            )

        return Response({
            'order_id': order.id,
            'razorpay_order_id': order.razorpay_order_id,
            'razorpay_key_id': settings.RAZORPAY_KEY_ID,
            'amount': int(total * 100),
            'currency': 'INR',
            'order': OrderSerializer(order).data,
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    """POST /api/orders/verify/ — Verify Razorpay payment"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id', '')
        razorpay_payment_id = request.data.get('razorpay_payment_id', '')
        razorpay_signature = request.data.get('razorpay_signature', '')

        try:
            order = Order.objects.get(
                razorpay_order_id=razorpay_order_id,
                user=request.user
            )
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=404)

        # Verify signature
        if razorpay_client:
            try:
                razorpay_client.utility.verify_payment_signature({
                    'razorpay_order_id': razorpay_order_id,
                    'razorpay_payment_id': razorpay_payment_id,
                    'razorpay_signature': razorpay_signature,
                })
            except Exception:
                order.status = 'cancelled'
                order.save()
                return Response({'error': 'Payment verification failed.'}, status=400)

        # Update order
        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_signature = razorpay_signature
        order.status = 'confirmed'
        order.save()

        # Update coupon usage
        if order.coupon_code:
            Coupon.objects.filter(code=order.coupon_code).update(
                used_count=models.F('used_count') + 1
            )

        # Reduce stock
        for item in order.items.all():
            if item.variant:
                item.variant.stock_quantity = max(0, item.variant.stock_quantity - item.quantity)
                item.variant.save()

        # Clear cart & coupon
        request.session['cart'] = {}
        request.session['coupon_code'] = ''
        request.session.modified = True

        return Response({
            'message': 'Payment verified. Order confirmed.',
            'order': OrderSerializer(order).data,
        })


class UserOrderListView(generics.ListAPIView):
    """GET /api/orders/my/ — User order history"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    """GET /api/orders/<id>/ — Order detail"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')
