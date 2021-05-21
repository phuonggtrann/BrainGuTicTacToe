from django.contrib import admin

# Register your models here.
from .models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'score', 'total_game_play')

# register model
admin.site.register(User, UserAdmin)
