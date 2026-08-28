from django.shortcuts import render

# Create your views here.
def products(request):
    print('hitting succes')

    return render(request,'base.html')