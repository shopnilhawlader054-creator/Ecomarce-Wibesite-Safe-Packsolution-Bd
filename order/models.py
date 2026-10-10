from decimal import Decimal
from django.core.validators import MinValueValidator
from django.db import models
from products.models import Products, product_size

class Order(models.Model):
    customer_name = models.CharField(
        max_length=200, blank=False, null=False, verbose_name="গ্রাহকের নাম"
    )
    phone_number = models.CharField(
        max_length=15, blank=False, null=False, verbose_name="ফোন নম্বর"
    )
    district = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="জেলা"
    )
    city = models.CharField(  # thana_or_area পরিবর্তন করে city করা হলো
        max_length=200, blank=False, null=False, verbose_name="শহর/এলাকা"
    )
    address = models.CharField(  # adders_line বানান ও নাম ঠিক করা হলো
        max_length=300, blank=False, null=False, verbose_name="বিস্তারিত ঠিকানা"
    )
    subtotal = models.DecimalField(  # sub_total_amount পরিবর্তন করে subtotal করা হলো
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
        verbose_name="প্রোডাক্টের মোট দাম",
    )
    shipping = models.DecimalField(  # dalavary_charge পরিবর্তন করে shipping করা হলো
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
        verbose_name="ডেলিভারি চার্জ",
    )
    repeated = models.BooleanField(default=False)
    ZONE_CHOICES = [
        ('inside_dhaka', 'Inside Dhaka'),
        ('outside_dhaka', 'Outside Dhaka')
    ]
 
    ORDER_STATUS = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('delivered', 'Delivered')
    ]
    
    order_status = models.CharField(
        max_length=20,
        choices=ORDER_STATUS,
        default='pending',
        verbose_name='অর্ডারের স্ট্যাটাস'
    )

    delivery_zone = models.CharField(
        max_length=20,
        choices=ZONE_CHOICES,
        default='outside_dhaka',
        verbose_name="ডেলিভারি জোন"
    )
    total = models.DecimalField(  # total_amount পরিবর্তন করে total করা হলো
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
        verbose_name="সর্বমোট বিল",
    )
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="অর্ডারের সময়"
    )

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name} (৳{self.total})"


class Orderitem(models.Model):
    orders = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="orderitem",
        verbose_name="অর্ডার"
    )
    product = models.ForeignKey(
        Products,
        on_delete=models.CASCADE,
        related_name="orderitem",
        verbose_name="প্রোডাক্ট",
    )
    product_sizes = models.ForeignKey(
        product_size,
        on_delete=models.CASCADE,
        related_name="orderitem",
        verbose_name="প্রোডাক্ট সাইজ",
        blank=True,
        null=True,
    )
    sub_qty = models.PositiveBigIntegerField(
        default=1, verbose_name="পরিমাণ"
    )
    sub_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
        verbose_name="প্রোডাক্টের মোট দাম",
    )

    def __str__(self):
        product_name = self.product.product_name if self.product else "Unknown"
        return f"Order #{self.orders.id} - {product_name} (Qty: {self.sub_qty})"