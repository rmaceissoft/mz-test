from django.contrib.gis.geos import Point
from rest_framework import viewsets

from api.serializers import ServiceAreaSerializer
from core.models import ServiceArea


class ServiceAreaViewSet(viewsets.ModelViewSet):
    queryset = ServiceArea.objects.all()
    serializer_class = ServiceAreaSerializer

    def get_queryset(self):
        queryset = super(ServiceAreaViewSet, self).get_queryset()
        try:
            lat = float(self.request.query_params.get('lat'))
            lng = float(self.request.query_params.get('lng'))
        except (ValueError, TypeError):
            lat, lng = None, None
        if lat and lng:
            point = Point(lng, lat)
            queryset = queryset.filter(path__contains=point)
        return queryset
