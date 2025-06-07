from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from orders.models import Order, CartItem
from orders.serializers import OrderSerializer, CartItemSerializer
from products.models import Products
from accounts.models import user_address
from django.http import FileResponse
from django.conf import settings
import os

def generate_invoice(request, order_id):
    file_path = os.path.join(settings.BASE_DIR, 'invoices', f'{order_id}.pdf')

    if not os.path.exists(file_path):
        return FileResponse(open('static/default_invoice.pdf', 'rb'), content_type='application/pdf')

    return FileResponse(open(file_path, 'rb'), content_type='application/pdf')


class showOrder(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(customer__email=request.user.email)
        if not orders.exists():
            return Response(
                {"error": "You do not have any orders."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class CreateOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_slugs = request.data.get('product', [])
        address_id = request.data.get('address_id')

        try:
            address = user_address.objects.get(pk=address_id)
        except user_address.DoesNotExist:
            return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)

        created_orders = []
        for product_slug in product_slugs:
            slug = product_slug.get('slug')
            quantity = product_slug.get('quantity', 1)

            try:
                product = Products.objects.get(slug=slug)
            except Products.DoesNotExist:
                return Response(
                    {"error": f"Product '{slug}' not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            if product.stock < quantity:
                return Response(
                    {"error": f"Not enough stock for product '{slug}'"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            order = Order.objects.create(
                customer=request.user,
                address=address,
                products=product,
                final_price=product.discount_price * quantity,
                quantity=quantity
            )

            product.stock -= quantity
            product.save()
            created_orders.append(order)

        serializer = OrderSerializer(created_orders, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AddToCart(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items = CartItem.objects.filter(customer=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        product_slug = request.data.get('product')
        quantity = request.data.get('quantity', 1)

        try:
            product = get_object_or_404(Products, slug=product_slug)
            if product.stock < quantity:
                return Response(
                    {"error": "Not enough stock available"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cart_item, created = CartItem.objects.get_or_create(
                customer=request.user,
                product=product,
            )
            cart_item.quantity = quantity
            cart_item.save()
            return Response({'msg': 'product added'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        try:
            cart_item = CartItem.objects.get(pk=pk, customer=request.user)
            quantity = request.data.get('quantity')
            if quantity is not None and quantity != 0:
                cart_item.quantity = quantity
                cart_item.save()
                serializer = CartItemSerializer(cart_item)
                return Response(serializer.data)
            else:
                return Response(
                    {"error": "Quantity is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        try:
            item = CartItem.objects.get(pk=pk, customer=request.user)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)
