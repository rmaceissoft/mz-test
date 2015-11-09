from rest_framework import serializers

from core.models import ServiceArea


class ServiceAreaSerializer(serializers.ModelSerializer):

    class Meta:
        model = ServiceArea
        fields = ('path', 'created_at', )