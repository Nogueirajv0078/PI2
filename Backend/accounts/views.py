from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.http import HttpResponse
from .models import CustomUser
from .serializers import CustomUserSerializer, CustomUserReadSerializer, CustomTokenObtainPairSerializer, UserLoginSerializer
import pandas as pd
import io

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Apenas usuários ativos
        return CustomUser.objects.filter(is_active=True)
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CustomUserReadSerializer
        return CustomUserSerializer

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CustomUserReadSerializer
        return CustomUserSerializer
    
    def perform_destroy(self, instance):
        # Soft delete - apenas desativa o usuário
        instance.is_active = False
        instance.save()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Registra um novo usuário"""
    try:
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': CustomUserReadSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': f'Erro ao registrar usuário: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Autentica um usuário"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user = authenticate(request=request, username=email, password=password)
        if user and user.is_active:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': CustomUserReadSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Credenciais inválidas ou conta desativada.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Retorna o perfil do usuário autenticado"""
    serializer = CustomUserReadSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Atualiza o perfil do usuário autenticado"""
    serializer = CustomUserSerializer(
        request.user, 
        data=request.data, 
        partial=request.method == 'PATCH'
    )
    if serializer.is_valid():
        user = serializer.save()
        return Response(CustomUserReadSerializer(user).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Altera a senha do usuário autenticado"""
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    new_password_confirm = request.data.get('new_password_confirm')
    
    if not old_password or not new_password or not new_password_confirm:
        return Response(
            {'error': 'Todos os campos são obrigatórios.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if new_password != new_password_confirm:
        return Response(
            {'error': 'As novas senhas não coincidem.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not request.user.check_password(old_password):
        return Response(
            {'error': 'Senha atual incorreta.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    request.user.set_password(new_password)
    request.user.save()
    
    return Response({'message': 'Senha alterada com sucesso.'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Faz logout do usuário (invalida o token)"""
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logout realizado com sucesso.'})
    except Exception as e:
        return Response({'error': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_excel_report(request):
    """Gera e disponibiliza um relatório de usuários em Excel."""
    try:
        # Obter dados dos usuários
        users = CustomUser.objects.filter(is_active=True)
        
        # Estruturar os dados para o DataFrame
        data = {
            'ID': [user.id for user in users],
            'Nome': [user.first_name for user in users],
            'Sobrenome': [user.last_name for user in users],
            'Email': [user.email for user in users],
            'Data de Cadastro': [user.date_joined.strftime('%d/%m/%Y %H:%M') for user in users],
        }
        
        df = pd.DataFrame(data)
        
        # Criar um buffer de memória para o arquivo Excel
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Relatório de Usuários', index=False)
        
        output.seek(0)
        
        # Criar a resposta HTTP
        response = HttpResponse(
            output,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="relatorio_usuarios.xlsx"'
        
        return response
    
    except Exception as e:
        return Response(
            {'error': f'Erro ao gerar o relatório: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
