# backend/orders/urls.py
from django.urls import path
from orders.views import ShowOrder, CreateOrder, AddToCart

urlpatterns = [
    path('showorder/', ShowOrder.as_view(), name="showorder"),
    path('createorder/', CreateOrder.as_view(), name="createorder"),
    path("cart/", AddToCart.as_view(), name="cart"),
    path("cart/<int:pk>/", AddToCart.as_view(), name="cart-detail"),
]