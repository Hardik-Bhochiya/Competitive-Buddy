from django.urls import path
from study_material_views import views

urlpatterns = [
    path('materials/', views.study_material_list, name='study_material_list'),
    path('materials/upload/', views.upload_study_material, name='upload_study_material'),
    path('materials/download/<int:material_id>/', views.download_material, name='download_material'),
]
