from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Campos visibles en el listado del admin
    list_display = (
        'id',
        'username',
        'email',
        'first_name',
        'last_name',
        'matricula',
        'is_active',
        'is_staff'
    )
    
    # Filtros laterales
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    
    # Campos de búsqueda
    search_fields = ('email', 'username', 'first_name', 'last_name', 'matricula')
    
    # Ordenamiento por defecto
    ordering = ('id',)

    # Secciones del formulario de edición en el admin
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {'fields': ('first_name', 'last_name', 'username', 'matricula')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas Importantes', {'fields': ('last_login', 'date_joined')}),
    )

    # Formulario de creación de usuario en el admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'matricula', 'first_name', 'last_name', 'password', 'is_staff', 'is_active'),
        }),
    )
