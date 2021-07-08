from django.urls import path
from .view import getMapData

urlpatterns = [
    path("map/", getMapData, name="map"),
]
