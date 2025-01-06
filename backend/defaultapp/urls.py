from django.urls import path

from . import views

urlpatterns = [
    path("abc/", views.index, name="index"),
]