from django.db import models

# Create your models here.
class User(models.Model):
    class Meta():
        username = models.TextField()
        score = models.IntegerField()
        total_game_play = models.IntegerField()