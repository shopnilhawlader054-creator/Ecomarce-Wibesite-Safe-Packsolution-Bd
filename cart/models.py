from django.db import models
from products.models import product_size,Products
from django.core.validators import MinValueValidator
from decimal import Decimal
# Create your models here.

from decimal import Decimal
from django.core.validators import MinValueValidator
from django.db import models


class CartItem(models.Model):
  # কোন প্রোডাক্টটি সিলেক্ট করা হয়েছে
  product = models.ForeignKey(
      Products,
      on_delete=models.CASCADE,
      related_name="cart_items",
      verbose_name="প্রোডাক্ট",
  )

  # প্রোডাক্টের কোন সাইজটি সিলেক্ট করা হয়েছে
  product_size = models.ForeignKey(
      product_size,
      on_delete=models.CASCADE,
      related_name="cart_items",
      verbose_name="প্রোডাক্ট সাইজ",
  )

  # কত পিস বা পরিমাণ নিতে চায়
  qty = models.PositiveIntegerField(default=1, verbose_name="পরিমাণ")

  # পণ্যের দাম (যদি আলাদাভাবে রাখতে চান)
  price = models.DecimalField(
      max_digits=10,
      decimal_places=2,
      validators=[MinValueValidator(Decimal("0.01"))],
      verbose_name="দাম",
  )

  # গেস্ট ইউজারের কার্ট ট্র্যাক করার জন্য সেশন কি (Session Key)
  session_key = models.CharField(
      max_length=255, blank=True, null=True, verbose_name="সেশন কি"
  )

  def __str__(self):
    size_str = (
        f" - ({self.product_size.productsize})" if self.product_size else ""
    )
    return f"{self.product.product_name}{size_str} [{self.qty} পিস]"