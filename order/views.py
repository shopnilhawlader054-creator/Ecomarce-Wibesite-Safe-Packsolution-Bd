from django.shortcuts import render

# Create your views here.

def product (request):
    print('hitting success')
    return render(request,'product.html')