from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("accounts.urls")),
    path("stats/", include("stats_app.urls")),
    path("contests/", include("contests.urls")),
    path("mentor/", include("mentor.urls")),
]