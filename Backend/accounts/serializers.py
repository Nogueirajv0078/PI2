from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import CustomUser

class CustomUserReadSerializer(serializers.ModelSerializer):
    """Serializer apenas para leitura (sem campos de senha)"""
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'date_joined', 'is_active')
        read_only_fields = ('id', 'date_joined', 'is_active')

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=False)
    password_confirm = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'password', 'password_confirm', 'date_joined', 'is_active')
        read_only_fields = ('id', 'date_joined')
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'username': {'required': False},
            'email': {'required': True},
        }
    
    def validate_email(self, value):
        """Validar se o email já está em uso (apenas na criação)"""
        if self.instance is None:  # Criação
            if CustomUser.objects.filter(email=value).exists():
                raise serializers.ValidationError("Este email já está em uso.")
        else:  # Atualização
            if CustomUser.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("Este email já está em uso.")
        return value
    
    def validate(self, attrs):
        # Se for criação (não tem instance), password é obrigatório
        is_create = self.instance is None
        
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        
        if is_create:
            # Na criação, password e password_confirm são obrigatórios
            if not password:
                raise serializers.ValidationError({"password": "A senha é obrigatória."})
            if not password_confirm:
                raise serializers.ValidationError({"password_confirm": "A confirmação de senha é obrigatória."})
            if password != password_confirm:
                raise serializers.ValidationError({"password": "As senhas não coincidem."})
        else:
            # Na atualização, se fornecer password, deve fornecer password_confirm também
            if password or password_confirm:
                if not password or not password_confirm:
                    raise serializers.ValidationError("Ambos os campos de senha são obrigatórios quando você deseja alterar a senha.")
                if password != password_confirm:
                    raise serializers.ValidationError("As senhas não coincidem.")
        
        return attrs
    
    def create(self, validated_data):
        password_confirm = validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        
        # Validar senha usando validadores do Django (antes de criar o usuário)
        # Criamos um usuário temporário apenas para validação
        temp_user = CustomUser(email=email)
        try:
            validate_password(password, user=temp_user)
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        
        # Se username não foi fornecido, usar o email
        if 'username' not in validated_data or not validated_data.get('username'):
            validated_data['username'] = email
        
        # Criar usuário com email como primeiro argumento (USERNAME_FIELD)
        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            **validated_data
        )
        return user
    
    def update(self, instance, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
    
    def to_representation(self, instance):
        """Usar o serializer de leitura para retornar dados sem campos sensíveis"""
        return CustomUserReadSerializer(instance).data

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        
        return token
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )
            
            if not user:
                raise serializers.ValidationError('Credenciais inválidas.')
            
            if not user.is_active:
                raise serializers.ValidationError('Conta desativada.')
            
            if not user.check_password(password):
                raise serializers.ValidationError('Credenciais inválidas.')
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Email e senha são obrigatórios.')

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
