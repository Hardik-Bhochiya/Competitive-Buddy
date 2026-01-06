from django.shortcuts import render

def contest_page(request):
    return render(request, 'contest.html')
