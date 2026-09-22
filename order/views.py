from django.shortcuts import render

# Create your views here.

def order_from(request):
    print('order hittng sucess')
    
    return render(request,'order_from.html')