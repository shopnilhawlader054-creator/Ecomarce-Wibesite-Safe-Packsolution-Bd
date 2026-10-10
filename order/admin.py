from django.contrib import admin
from order.models import Order,Orderitem

# Register your models here.
admin.site.register(Order)
admin.site.register(Orderitem)
