from django.urls import path
from orders.views import showOrder, CreateOrder, AddToCart, generate_invoice

urlpatterns = [
    path('showorder/', showOrder.as_view(), name='showorder'),
    path('createorder/', CreateOrder.as_view(), name="createorder"),
    path("cart/", AddToCart.as_view(), name="cart"),
    path("cart/<int:pk>/", AddToCart.as_view(), name="cart-detail"),
    path('orders/invoice/<str:order_id>/', generate_invoice, name="download_invoice"),
]
