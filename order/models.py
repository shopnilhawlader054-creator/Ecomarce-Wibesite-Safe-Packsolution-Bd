from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from products.models import Products,product_size

# Create your models here.
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.db import models


class order(models.Model):
  customer_name = models.CharField(
      max_length=200, blank=False, null=False, verbose_name="গ্রাহকের নাম"
  )
  phone_number = models.CharField(
      max_length=15, blank=False, null=False, verbose_name="ফোন নম্বর"
  )
  district = models.CharField(
      max_length=200, blank=False, null=False, verbose_name="জেলা"
  )
  thana_or_area = models.CharField(
      max_length=200, blank=False, null=False, verbose_name="থানা বা এলাকা"
  )
  adders_line = models.CharField(
      max_length=300, blank=False, null=False, verbose_name="বিস্তারিত ঠিকানা"
  )
  sub_total_amount = models.DecimalField(
      max_digits=10,
      decimal_places=2,
      validators=[MinValueValidator(Decimal("0.01"))],
      verbose_name="প্রোডাক্টের মোট দাম",
  )
  dalavary_charge = models.DecimalField(
      max_digits=10,
      decimal_places=2,
      validators=[MinValueValidator(Decimal("0.00"))],
      verbose_name="ডেলিভারি চার্জ",
  )
  total_amount = models.DecimalField(
      max_digits=10,
      decimal_places=2,
      validators=[MinValueValidator(Decimal("0.01"))],
      verbose_name="সর্বমোট বিল",
  )
  created_at = models.DateTimeField(
      auto_now_add=True, verbose_name="অর্ডারের সময়"
  )

  def __str__(self):
    return f"Order #{self.id} - {self.customer_name} (৳{self.total_amount})"




  class orderitem(models.Model):
   order = models.ForeignKey(
      order,
      on_delete=models.CASCADE,
      related_name="orderitem",
      verbose_name="অর্ডার",
  )
   product = models.ForeignKey(
      Products,
      on_delete=models.CASCADE,
      related_name="orderitem",
      verbose_name="প্রোডাক্ট",
  )
  product_size = models.ForeignKey(
      product_size,
      on_delete=models.CASCADE,
      related_name="orderitem",
      verbose_name="প্রোডাক্ট সাইজ",
  )
  sub_qty = models.PositiveBigIntegerField(
      blank=True, null=True, verbose_name="পরিমাণ"
  )
  sub_total = models.DecimalField(
      max_digits=10,
      decimal_places=2,
      validators=[MinValueValidator(Decimal("0.01"))],
      verbose_name="প্রোডাক্টের মোট দাম",
  )
#   def __str__(self):
#     return f"Orderitem # {self.pr}"