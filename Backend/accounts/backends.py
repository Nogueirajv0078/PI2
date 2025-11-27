from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailBackend(ModelBackend):
    """
    Backend de autenticação customizado para autenticar usando email
    quando USERNAME_FIELD é 'email'
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get('email')
        
        if username is None or password is None:
            return None
        
        try:
            # Tentar autenticar usando email
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            # Tentar autenticar usando username (fallback)
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return None
        
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        
        return None

