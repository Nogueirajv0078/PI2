from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    """Manager customizado para CustomUser com email como USERNAME_FIELD"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Cria e salva um usuário com email e senha"""
        if not email:
            raise ValueError('O email é obrigatório')
        email = self.normalize_email(email)
        
        # Se username não foi fornecido, usar o email
        if 'username' not in extra_fields:
            extra_fields['username'] = email
        
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Cria e salva um superusuário com email e senha"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Campos necessários para createsuperuser (email já é USERNAME_FIELD)
    
    objects = CustomUserManager()
    
    class Meta:
        db_table = 'custom_user'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
    
    def __str__(self):
        name = f"{self.first_name} {self.last_name}".strip()
        return f"{name} ({self.email})" if name else self.email
