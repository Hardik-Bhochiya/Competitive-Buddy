from django.urls import path
from . import views

urlpatterns = [
    path('', views.mentor_page, name='mentor'),
]
