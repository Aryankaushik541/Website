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
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import inch
from django.utils import timezone
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def generate_invoice(request, order_id):
    """
    Generate and return invoice PDF for a specific order
    """
    try:
        order = get_object_or_404(Order, id=order_id, customer=request.user)
        
        # Create invoices directory if it doesn't exist
        invoice_dir = os.path.join(settings.BASE_DIR, 'invoices')
        os.makedirs(invoice_dir, exist_ok=True)
        
        file_path = os.path.join(invoice_dir, f'{order_id}.pdf')
        
        # Generate PDF if it doesn't exist
        if not os.path.exists(file_path):
            create_invoice_pdf(order, file_path)
        
        return FileResponse(open(file_path, 'rb'), content_type='application/pdf')
    
    except Order.DoesNotExist:
        # Return default invoice if order not found
        default_path = os.path.join(settings.BASE_DIR, 'static', 'default_invoice.pdf')
        if os.path.exists(default_path):
            return FileResponse(open(default_path, 'rb'), content_type='application/pdf')
        else:
            return Response(
                {"error": "Invoice not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )


def create_invoice_pdf(order, file_path):
    """
    Create a professional invoice PDF using ReportLab
    """
    try:
        doc = SimpleDocTemplate(file_path, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.darkblue,
            alignment=1  # Center alignment
        )
        
        header_style = ParagraphStyle(
            'CustomHeader',
            parent=styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            textColor=colors.black
        )
        
        # Invoice Title
        story.append(Paragraph("INVOICE", title_style))
        story.append(Spacer(1, 12))
        
        # Company Information (customize as needed)
        company_info = """
        <b>Your Company Name</b><br/>
        123 Business Street<br/>
        City, State 12345<br/>
        Phone: (555) 123-4567<br/>
        Email: contact@yourcompany.com
        """
        story.append(Paragraph(company_info, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Invoice Details
        invoice_data = [
            ['Invoice Number:', f'INV-{order.id:06d}'],
            ['Order Date:', order.created_at.strftime('%B %d, %Y')],
            ['Order ID:', str(order.id)],
            ['Status:', order.status],
        ]
        
        invoice_table = Table(invoice_data, colWidths=[2*inch, 3*inch])
        invoice_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(invoice_table)
        story.append(Spacer(1, 20))
        
        # Customer Information
        story.append(Paragraph("Bill To:", header_style))
        customer_info = f"""
        <b>{order.customer.get_full_name() or order.customer.username}</b><br/>
        {order.customer.email}<br/>
        {order.address.address_line_1}<br/>
        {order.address.address_line_2 or ''}<br/>
        {order.address.city}, {order.address.state} {order.address.postal_code}<br/>
        {order.address.country}
        """
        story.append(Paragraph(customer_info, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Order Items
        story.append(Paragraph("Order Details:", header_style))
        
        # Create table data
        table_data = [['Product', 'Quantity', 'Unit Price', 'Total Price']]
        
        # Add product row
        table_data.append([
            order.products.name,
            str(order.quantity),
            f'${order.products.discount_price:.2f}',
            f'${order.final_price:.2f}'
        ])
        
        # Create table
        order_table = Table(table_data, colWidths=[3*inch, 1*inch, 1.2*inch, 1.2*inch])
        order_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(order_table)
        story.append(Spacer(1, 20))
        
        # Total
        total_data = [['Total Amount:', f'${order.final_price:.2f}']]
        total_table = Table(total_data, colWidths=[4.5*inch, 1.9*inch])
        total_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.lightblue),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(total_table)
        story.append(Spacer(1, 30))
        
        # Footer
        footer_text = """
        <b>Thank you for your business!</b><br/>
        For any questions regarding this invoice, please contact us at support@yourcompany.com
        """
        story.append(Paragraph(footer_text, styles['Normal']))
        
        # Build PDF
        doc.build(story)
        logger.info(f"Invoice generated successfully for order {order.id}")
        
    except Exception as e:
        logger.error(f"Error generating invoice for order {order.id}: {str(e)}")
        raise


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
            
            # Auto-generate invoice after order creation
            try:
                invoice_dir = os.path.join(settings.BASE_DIR, 'invoices')
                os.makedirs(invoice_dir, exist_ok=True)
                file_path = os.path.join(invoice_dir, f'{order.id}.pdf')
                create_invoice_pdf(order, file_path)
                logger.info(f"Auto-generated invoice for order {order.id}")
            except Exception as e:
                logger.error(f"Failed to auto-generate invoice for order {order.id}: {str(e)}")

        serializer = OrderSerializer(created_orders, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CancelOrder(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, order_id):
        """
        Cancel an order and restore product stock
        """
        try:
            order = get_object_or_404(Order, id=order_id, customer=request.user)
            
            # Check if order can be cancelled
            if order.status in ['delivered', 'cancelled']:
                return Response(
                    {"error": f"Cannot cancel order with status: {order.status}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Restore product stock
            product = order.products
            product.stock += order.quantity
            product.save()
            
            # Update order status
            order.status = 'cancelled'
            order.save()
            
            logger.info(f"Order {order_id} cancelled by user {request.user.email}")
            
            serializer = OrderSerializer(order)
            return Response({
                "message": "Order cancelled successfully",
                "order": serializer.data
            }, status=status.HTTP_200_OK)
            
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error cancelling order {order_id}: {str(e)}")
            return Response(
                {"error": "Failed to cancel order"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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