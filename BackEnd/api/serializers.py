from rest_framework import serializers
from restaurante.models import Reserva, Mesa

class MesaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mesa
        fields = '__all__'


class ReservaSerializer(serializers.ModelSerializer):
    mesa_info = MesaSerializer(source='mesa', read_only = True)

    class Meta:
        model = Reserva
        fields = '__all__'