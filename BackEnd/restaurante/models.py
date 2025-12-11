from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Mesa(models.Model):
    capacidad = models.IntegerField()
    descripcion = models.CharField(max_length=100)
    numero = models.IntegerField(unique=True)

    def __str__(self):
        return f"Mesa {self.numero} ({self.descripcion})"

class Reserva(models.Model):
    ESTADO = [
        ('RESERVADO', 'Reservado'),
        ('ANULADA', 'Anulada'),
        ('COMPLETADA', 'Completada'),
        ('NO ASISTEN', 'No asisten'),
    ]

    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    fecha = models.DateField()
    hora = models.TimeField()
    cantidad_personas = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(15)])
    estado = models.CharField(max_length=20, choices=ESTADO, default='RESERVADO')
    mesa = models.ForeignKey(Mesa, on_delete=models.PROTECT)
    observacion = models.TextField(blank= True, null= True)

    class Meta:
        ordering = ['fecha', 'hora']

    def __str__(self):
        return f"{self.nombre} - {self.fecha} {self.hora}"

