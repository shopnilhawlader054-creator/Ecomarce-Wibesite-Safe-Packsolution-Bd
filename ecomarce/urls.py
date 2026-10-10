"""
URL configuration for ecomarce project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from products.views import all_products,product,others_catagory,Packaging_Machineries_catagory
from order.views import order_from
from cart.views import add_to_cart
from accounts.views import register,logins,logouts

from django.conf import settings
from django.conf.urls.static import static
from order.views import all_customer_detal,add_product,add_product_size,all_product,all_cutomer,adimin_home,order_confromed,order_pending,order_detals,status_update,delet_order,delet_product,eidt_product,all_product_size,edit_product_size

urlpatterns = [
    path('admin/',adimin_home,name='admin_panel'),
    path('updatestatus/<int:pk>/',view=status_update,name='update_status'),
    path('editproductsizes/<int:pk>/',view=edit_product_size,name='edit_product_size'),
    path('allproductsize/<int:pk>/',view=all_product_size,name='all_product_size'),
    path('productedit/<int:pk>/',view=eidt_product,name='edit_product'),
    path('deletproduct/<int:pk>/',view=delet_product,name='delet_product'),
    path('deletorder/<int:pk>/',view=delet_order,name='delet_order'),
    path('orderpending/',view=order_pending,name='order_pending'),
    path('orderconfromed/',view=order_confromed,name='order_confromed'),
    path('orderdetals/<int:pk>/',view=order_detals,name='order_detals'),
    path('allproduct/',view=all_product,name='all_product'),
    path('allcustomer/',view=all_cutomer,name='all_customer'),
    path('addproductsize/<int:pk>/',view=add_product_size,name = 'add_product_size'),
    path('addproduct/',view=add_product,name='add_product'),
    path('',view=all_products,name='shop'),
    path('product/<int:pk>/',view=product,name='product_detail'),
    path('order_form/',view=order_from,name='order_from'),
    path('catagory/',view=others_catagory,name='others_catagory'),
    path('Packaging_Machineries_catagory/',view= Packaging_Machineries_catagory,name='Packaging_Machineries_catagory'),
    path('addtocart/',view=add_to_cart,name='add_to_cart'),
    path('api-auth/', include('rest_framework.urls')),
    path('register/',view=register,name='register'),
    path('login/',view=logins,name='login'),
    path('logout/',view=logouts,name='logout'),
    path('allcustomer/',view=all_customer_detal,name='all_customer')
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)