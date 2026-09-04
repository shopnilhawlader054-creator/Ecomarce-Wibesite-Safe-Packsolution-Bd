from django.shortcuts import render,get_object_or_404
from products.models import Products
from django.db.models import Q


# Create your views here.
def all_products(request):
    print('hitting succes')
    polly = Products.objects.filter(category = 'polly')
    tap = Products.objects.filter(category = 'tape')
    babol = Products.objects.filter(Q(category = 'bubble_wrap')|
                                    Q(category = 'pen')
                                    )
    context ={
        'polly':polly,
        'tap':tap,
        'babol':babol
    }

    return render(request,'product_card.html',context)


def product (request,pk):
    product = get_object_or_404 (Products,pk = pk)

    if product.Suitable_For:
        subtitle_list = [item.strip() for item in product.Suitable_For.split(',') if item.strip()]
    else:
        subtitle_list = []

    if product.Key_Features:
        key_features = [item.strip() for item in product.Key_Features.split(',') if item.strip()]
    else:
        key_features = []

    product_size = product.sizes.all()

    context ={
        'product':product,
        'product_size':product_size,
        'subtitle_list':subtitle_list,
        'key_features':key_features
    }
    print('hitting success')
    return render(request,'product.html',context)
