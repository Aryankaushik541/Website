from django.urls import path
from orders.views import showOrder, CreateOrder, AddToCart, generate_invoice, CancelOrder
from . import views
urlpatterns = [
    path('showorder/', showOrder.as_view(), name='showorder'),
    path('createorder/', CreateOrder.as_view(), name="createorder"),
    path("cart/", AddToCart.as_view(), name="cart"),
    path("cart/<int:pk>/", AddToCart.as_view(), name="cart-detail"),
    path('orders/<int:order_id>/cancel-order/', CancelOrder.as_view(), name='cancel-order'),
    path('orders/<int:order_id>/invoice/', views.generate_invoice, name='generate-invoice'),
]
