from django.shortcuts import render

def mentor_page(request):
    return render(request, 'mentor.html')
