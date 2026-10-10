from django import forms
from .models import Order

class Orderfrom(forms.ModelForm):
    class Meta:
        model = Order
        # আপনার মডেলে থাকা সঠিক ফিল্ডগুলোর নাম এখানে দিতে হবে:
        fields = [
            'customer_name', 
            'phone_number', 
            'district', 
            'city',          # thana_or_area এর বদলে যদি city ব্যবহার করে থাকেন
            'address',       # adders_line এর বদলে যদি address ব্যবহার করে থাকেন
            'delivery_zone',
            'subtotal', 
            'shipping', 
            'total'
        ]