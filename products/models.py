from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

class Products(models.Model):
    CATEGORY_CHOICES = [
    ('bubble_wrap', 'বাবল র‍্যাপ'),
    ('tape', 'টেপ'),
    ('box', 'বক্স'),
    ('pen', 'পেন'),
    ('tape_cutter', 'টেপ কাটার'),
    ('polly','পলি')
    ]
    category = models.CharField(
    max_length=50,
    choices=CATEGORY_CHOICES,
    name=False,
    blank=False,
    verbose_name="ক্যাটাগরি"
    )
    product_name = models.CharField(max_length=300, verbose_name="প্রোডাক্টের নাম")
    product_image = models.ImageField(upload_to='products/', null=True, blank=True, verbose_name="প্রোডাক্টের ছবি")
    Product_Description = models.CharField(max_length=500, verbose_name="প্রোডাক্টের বিবরণ")
    Key_Features = models.CharField(max_length=500, verbose_name="মূল বৈশিষ্ট্যসমূহ")
    Why_Choose_This_Product = models.CharField(max_length=500, verbose_name="কেন এই প্রোডাক্টটি বেছে নেবেন")
    Suitable_For = models.CharField(max_length=500, verbose_name="কার জন্য উপযোগী")
    Refund_Exchange_Policy = models.CharField(max_length=500, verbose_name="রিফান্ড ও এক্সচেঞ্জ পলিসি")
    total_product = models.PositiveIntegerField(default=0, verbose_name="মোট পণ্যের পরিমাণ (স্টক)")

    def __str__(self):
        return f"{self.product_name} - স্টক: {self.total_product}টি"


class product_size(models.Model):
    product = models.ForeignKey(Products, on_delete=models.SET_NULL, null=True, blank=True, related_name='sizes', verbose_name="প্রোডাক্ট")
    productsize = models.CharField(max_length=500, blank=True, null=True, verbose_name="প্রোডাক্ট সাইজ")
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False, validators=[MinValueValidator(Decimal('0.01'))], verbose_name="দাম")
    weight = models.PositiveIntegerField(blank=False, verbose_name="ওজন")

    def __str__(self):
        return f"{self.product.product_name if self.product else 'No Product'} - {self.productsize}"