from django.contrib.gis.geos import Point
from rest_framework import mixins, viewsets

from api.serializers import ServiceAreaSerializer
from core.models import ServiceArea


class ServiceAreaViewSet(mixins.CreateModelMixin,
                         mixins.ListModelMixin,
                         viewsets.GenericViewSet):
    """
    Service Area resource.
    """
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

    def list(self, request, *args, **kwargs):
        """
        Return a list of service areas
        ---
        parameters:
            - name: lat
              description: latitude of the point to be used when filtering service areas
              type: number
              paramType: query
            - name: lng
              description: longitude of the point to be used when filtering service areas
              type: number
              paramType: query
        """
        return super(ServiceAreaViewSet, self).list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """
        Create a new service area
        ---
        parameters:
            - name: path
              description: geometry path with the bounding box of the service area. It supports GeoJSON and WKT formats.
              type: string
              paramType: form
        """
        return super(ServiceAreaViewSet, self).create(request, *args, **kwargs)
