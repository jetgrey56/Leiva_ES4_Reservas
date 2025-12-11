from django.contrib import admin
from restaurante.models import Mesa, Reserva

# Register your models here #

class MesaAdmin(admin.ModelAdmin):
    list_display = ('capacidad', 'descripcion', 'numero',)
    search_fields = ('capacidad', )
    list_filter = ('numero', )
admin.site.register(Mesa, MesaAdmin)

class ReservasAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'telefono', 'fecha', 'hora', 'cantidad_personas', 'estado', 'mesa', 'observacion',)
    search_fields = ('nombre', 'fecha', 'hora', 'mesa',)
    list_filter = ('mesa',)
admin.site.register(Reserva, ReservasAdmin)



