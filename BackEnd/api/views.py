from django.shortcuts import render
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from restaurante.models import Reserva, Mesa
from .serializers import ReservaSerializer, MesaSerializer
from django.http import Http404

# Create your views here.

class MesaList(APIView):
    def get(self, request):
        mesas = Mesa.objects.all().order_by('numero')
        serializer = MesaSerializer(mesas, many = True)
        return Response(serializer.data)

class ReservasList(APIView):

    def get(self, request):
        reservas = Reserva.objects.all().order_by('fecha', 'hora')
        serializer = ReservaSerializer(reservas, many = True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ReservaSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ReservaDetalles(APIView):
    def get_object(self, pk):
        try:
            return Reserva.objects.get(pk=pk)
        except Reserva.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        reserva = self.get_object(pk)
        serializer = ReservaSerializer(reserva)
        return Response(serializer.data)
    
    def put(self, request, pk):
        reserva = self.get_object(pk)
        serializer = ReservaSerializer(reserva, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        reserva = self.get_object(pk)
        serializer = ReservaSerializer(reserva, data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        reserva = self.get_object(pk)
        reserva.delete()
        return Response(
            {"message" : "La reserva se ha eliminado correctamente"},
            status=status.HTTP_204_NO_CONTENT
        )
    


