from django.core.serializers import serialize
from .models import ShippingAddres

from django.http.response import JsonResponse, HttpResponse, ResponseHeaders
from .location import get_location

import json

def getMapData(request):
    result = get_location()
    return HttpResponse(json.dumps(result))