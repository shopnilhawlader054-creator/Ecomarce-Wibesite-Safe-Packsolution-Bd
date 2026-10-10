import json
from django.http import JsonResponse
from django.shortcuts import render,get_object_or_404,redirect
from order.models import Order, Orderitem
from products.models import Products, product_size
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def order_from(request):
    if request.method == 'POST':
        try:
            # ১. ফ্রন্টএন্ড থেকে পাঠানো JSON ডেটা ডিকোড করা
            data = json.loads(request.body)
            print("Received Data:", data)
            
            customer_name = data.get('customer_name')
            phone_number = data.get('phone_number')
            city = data.get('city', 'Not Provided')
            address = data.get('address', 'Not Provided')
            delivery_zone = data.get('delivery_zone', 'outside_dhaka')
            
            subtotal = data.get('subtotal', 0)
            shipping = data.get('shipping', 0)
            total = data.get('total', 0)
            items = data.get('items', [])
            old_customer = Order.objects.filter(phone_number = phone_number).exists()

            
            # ২. মূল অর্ডার সেভ করা
            order_instance = Order.objects.create(
                customer_name=customer_name,
                phone_number=phone_number,
                district='N/A',
                city=city,
                address=address,
                delivery_zone=delivery_zone,
                subtotal=subtotal,
                shipping=shipping,
                total=total,
                repeated= old_customer
                
            )

            # ৩. অর্ডার আইটেমগুলো সেভ করা
            for item in items:
                p_name = item.get('product_name')
                product_obj = Products.objects.filter(product_name__icontains=p_name).first() if p_name else None
                
                size_name = item.get('size')
                size_obj = None
                if size_name:
                    # এখানে মডেলের সঠিক ফিল্ড চয়েস 'productsize' ব্যবহার করা হলো
                    size_obj = product_size.objects.filter(productsize__icontains=size_name).first()

                qty = int(item.get('qty', 1))
                price = float(item.get('price', 0))
                item_subtotal = qty * price

                Orderitem.objects.create(
                    orders=order_instance,
                    product=product_obj,
                    product_sizes=size_obj, # এটি Orderitem টেবিলের ফিল্ড নাম
                    sub_qty=qty,
                    sub_total=item_subtotal
                )

            print("Order Saved Successfully!")
            return JsonResponse({'status': 'success', 'message': 'Order placed successfully!'})
            
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
            
    return render(request, 'order_from.html')

def all_customer_detal(request):

    return render(request,'all_customer_detal.html')


@staff_member_required
def add_product (request):
    if request.method == 'POST':
        product_name = request.POST.get("product_name")
        product_category = request.POST.get("category")
        product_image = request.FILES.get('product_image')
        product_Description = request.POST.get('Product_Description')
        key_Features = request.POST.get('Key_Features')
        why_Choose_This_Product = request.POST.get('Why_Choose_This_Product')
        suitable_For = request.POST.get('Suitable_For')
        refund_Exchange_Policy = request.POST.get('Refund_Exchange_Policy')
        total = request.POST.get('total_product')
            
        products = Products(
               product_name = product_name,
               product_image = product_image,
               Product_Description = product_Description,
               Key_Features = key_Features,
               Why_Choose_This_Product = why_Choose_This_Product,
               Suitable_For = suitable_For,
               Refund_Exchange_Policy = refund_Exchange_Policy,
               category = product_category,
               total_product = total,

               
        )
        products.save()
        return redirect ('all_product')
    return render(request,'add_product.html')
@staff_member_required
def add_product_size (request,pk):
    product = get_object_or_404(Products,id = pk)
    if request.method == 'POST':
        product_sizes = request.POST.get('productsize')
        price = request.POST.get('price')
        weight = request.POST.get('weight')
        order_item = product_size(
            product = product,
             productsize = product_sizes,
             price = price,
             weight = weight,
        )
        order_item.save()
        return redirect('all_product')
    context ={
        'product':product
    }
    return render (request,'product_size.html',context)

def all_product(request):
    allproduct = Products.objects.all()
    context = {
        'all_product':allproduct,
    }
    return render(request,'all_product.html',context)

def adimin_home (request):
    total_product = Products.objects.count()
    total_pending = Order.objects.filter(order_status = 'pending').count()
    total_confromed = Order.objects.filter(order_status = 'confirmed').count()
    total_order = Order.objects.count()
    context = {
     'total_confromed':total_confromed,
     'total_order': total_order,
     'total_pending': total_pending,
     'total_product': total_product
    }
    return render(request,'adminhome.html',context)

def all_cutomer(request):

    return render(request,'all_customer_detal.html')


def order_pending(request):
    total_pending = Order.objects.filter(order_status = 'pending')
    context ={
        'total_pending':total_pending
    }

    return render(request,'pending_order.html',context)


def order_confromed(request):
   total_confromed = Order.objects.filter(order_status = 'confirmed')
   print('show order')
   for i in total_confromed:
       print(f'order confromded succesfull:{i}')
   context = {
       'total_confromed':total_confromed,
   }


   return render (request,'confromed_order.html',context)

def order_detals(request,pk):
 order = get_object_or_404(Order,id = pk)
 print(order.repeated)
 order_item = order.orderitem.all()
 for i in order_item:
     print(i)
 context = {
    'order':order,
    'order_item':order_item
 }


 return render (request,'order_detals.html',context)



def status_update (request,pk):

    order = get_object_or_404(Order,id = pk)
    if request.method == 'POST':
       new_status = request.POST.get('status')
       order.order_status = new_status
       order.save()
       print(order.order_status)
       return redirect('all_customer')
    
def delet_order(request,pk):
    order = get_object_or_404(Order,id= pk)

    order.delete()
    return redirect ('all_customer')

def delet_product(request,pk):
    product = get_object_or_404(Products,id=pk)
    product.delete()
    print('delet success')
    return redirect('all_product')


def eidt_product(request,pk):
    product = get_object_or_404(Products,id= pk)
    if request.method == 'POST':
          product.product_name = request.POST.get("product_name")
          product.category = request.POST.get("category")
          if request.FILES.get('product_image'):
               product.product_image = request.FILES.get('product_image')
          product.product_Description = request.POST.get('Product_Description')
          product.Key_Features = request.POST.get('Key_Features')
          product.Why_Choose_This_Product = request.POST.get('Why_Choose_This_Product')
          product.Suitable_For = request.POST.get('Suitable_For')
          product.Refund_Exchange_Policy = request.POST.get('Refund_Exchange_Policy')
          product.total_product = request.POST.get('total_product')
          print(request.POST.get('total_product'))
          product.save()
          return redirect ('all_product')
    context ={
        'product':product
    }

    return render(request,'product_edit.html',context)



def all_product_size(request,pk):
    product = get_object_or_404(Products,id = pk)
    product_sizes = product.sizes.all()
    context = {
        'product':product,
        'product_sizes':product_sizes
    }

    return render(request,'all_product_size.html',context)



def edit_product_size (request,pk):
    product_sizes = get_object_or_404(product_size,id = pk)
    if request.method == 'POST':
        product_sizes.productsize = request.POST.get('productsize')
        product_sizes.price =  request.POST.get('price')
        product_sizes.weight = request.POST.get('weight')
        product_sizes.save()
        return redirect('all_product_size')
    context ={
        'product_sizes':product_sizes
    }
    return render(request,'product_size_edit.html',context)

