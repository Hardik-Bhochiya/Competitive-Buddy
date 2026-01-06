from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Profile

def home(request):
    return render(request, 'index.html')

def login_view(request):
    return render(request, 'login.html')

@login_required
def profile(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)

    if request.method == "POST":
        profile.cf_handle = request.POST.get("cf")
        profile.lc_handle = request.POST.get("lc")
        profile.cc_handle = request.POST.get("cc")
        profile.save()
        return redirect('/profile/')

    return render(request, 'profile.html', {'profile': profile})
