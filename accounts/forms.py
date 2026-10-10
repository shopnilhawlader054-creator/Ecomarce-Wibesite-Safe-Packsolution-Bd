from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User

class Registationform(UserCreationForm):
    class Meta:
        model = User
        fields = ['username','email']
    def clean_email(self):
            email = self.cleaned_data['email']
            if User.objects.filter(email = email).exists():
                raise forms.ValidationError('Email alrady registed')
            return email