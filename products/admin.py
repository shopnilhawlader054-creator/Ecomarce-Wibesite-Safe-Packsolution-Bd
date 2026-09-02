from django.contrib import admin
from products.models import Products,product_size

# Register your models here.
admin.site.register(product_size)
admin.site.register(Products)