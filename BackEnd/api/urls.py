from django.urls import path
from .views import ReservasList, ReservaDetalles, MesaList

urlpatterns = [
    path('mesas/', MesaList.as_view(), name = 'mesas-list'),
    path('reservas/', ReservasList.as_view(), name='reservas-list'),
    path('reservas/<int:pk>/', ReservaDetalles.as_view(), name='reservas-detail')
]