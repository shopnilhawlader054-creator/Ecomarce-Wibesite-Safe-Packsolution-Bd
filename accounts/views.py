from django.shortcuts import render,redirect
from django.contrib.auth import logout,login,authenticate
from .forms import Registationform
# from django.contrib.auth.models import User

# Create your views here.

def register(request):
    if request.method == 'POST':
        regester_form = Registationform(request.POST)
        if regester_form.is_valid():
            regester_form.save()
            return redirect ('login')
        else:
            print("FORM ERRORS:", regester_form.errors)


    return render (request,'register.html')

def logins(request):
    if request.method == 'POST':
        usern_ame = request.POST.get('username')
        pass_word = request.POST.get('password')
        user = authenticate(request,username = usern_ame,password = pass_word)
        if user is not None:
            login(request,user)
            return redirect('shop')


          

    return render (request,'login.html')

def logouts(request):
    user_id = request.user.id
    if user_id:
        
        logout(request)
        print('log out sucess')
        return redirect('login')
    return render(request,'register.html')
   
