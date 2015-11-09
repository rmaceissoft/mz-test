from django.shortcuts import render

from rest_framework.renderers import JSONRenderer

from api.serializers import ServiceAreaSerializer
from core.models import ServiceArea


def search(request, template_name="search.html"):
    try:
        last_service_area = ServiceArea.objects.all()[0]
        serializer = ServiceAreaSerializer(last_service_area)
        json_last_service_area = JSONRenderer().render(serializer.data)
    except IndexError:
        json_last_service_area = None
    return render(request, template_name=template_name, context={
        'json_last_service_area': json_last_service_area
    })
