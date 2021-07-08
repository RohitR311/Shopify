from .models import *
from .serializers import *

from geopy.geocoders import Nominatim

from geojson import Feature, Point, FeatureCollection

def get_location():
    cities = [address.city for address in ShippingAddres.objects.all()]
    features = []

    geolocator = Nominatim(user_agent="Rohit")

    for city in cities:
        location = geolocator.geocode(city)
        point = Point((location.latitude, location.longitude))
        features.append(Feature(geometry=point))

    data = FeatureCollection(features)

    return data
