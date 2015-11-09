from django.contrib.gis.db import models
from django.utils import timezone


class ServiceArea(models.Model):
    """
    hold service areas defined over the map
    """
    path = models.PolygonField()
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ('-created_at', )