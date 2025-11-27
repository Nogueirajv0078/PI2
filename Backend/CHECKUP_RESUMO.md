# Resumo das Correções Realizadas no Backend

## Problemas Identificados e Corrigidos

### 1. **Manager Customizado para CustomUser**
   - **Problema**: O Django não estava criando usuários corretamente quando `USERNAME_FIELD = 'email'`
   - **Solução**: Criado `CustomUserManager` que herda de `BaseUserManager` e implementa `create_user()` e `create_superuser()` corretamente
   - **Arquivo**: `Backend/accounts/models.py`

### 2. **Backend de Autenticação Customizado**
   - **Problema**: A autenticação por email não estava funcionando corretamente
   - **Solução**: Criado `EmailBackend` que autentica usando email como username
   - **Arquivo**: `Backend/accounts/backends.py`
   - **Configuração**: Adicionado `AUTHENTICATION_BACKENDS` no `settings.py`

### 3. **Serializer para Registro e Login**
   - **Problema**: O serializer não estava passando o email corretamente ao criar usuário
   - **Solução**: 
     - Ajustado `create()` para passar `email` como primeiro argumento para `create_user()`
     - Adicionada validação de email único
     - Criado `CustomUserReadSerializer` para não expor campos sensíveis nas respostas
     - Validação de senha usando validadores do Django
   - **Arquivo**: `Backend/accounts/serializers.py`

### 4. **Campos Opcionais no Modelo**
   - **Problema**: `first_name` e `last_name` eram obrigatórios, causando erros
   - **Solução**: Tornados opcionais com `blank=True`
   - **Arquivo**: `Backend/accounts/models.py`
   - **Migration**: Criada e aplicada migration `0002_alter_customuser_managers_alter_customuser_email_and_more.py`

### 5. **Token Blacklist**
   - **Problema**: Logout não estava invalidando tokens
   - **Solução**: 
     - Adicionado `rest_framework_simplejwt.token_blacklist` ao `INSTALLED_APPS`
     - Aplicadas migrations do token_blacklist
   - **Arquivo**: `Backend/auth_project/settings.py`

### 6. **Views Atualizadas**
   - **Problema**: Views retornavam dados com campos sensíveis
   - **Solução**: 
     - Views de registro e login agora usam `CustomUserReadSerializer` para respostas
     - Tratamento de erros melhorado
     - Autenticação passa `request` para o backend
   - **Arquivo**: `Backend/accounts/views.py`

## Endpoints da API

### Autenticação
- `POST /api/auth/register/` - Registrar novo usuário
- `POST /api/auth/login/` - Login de usuário
- `POST /api/auth/logout/` - Logout (invalida token)
- `POST /api/auth/token/refresh/` - Atualizar access token

### Perfil
- `GET /api/profile/` - Obter perfil do usuário autenticado
- `PUT/PATCH /api/profile/update/` - Atualizar perfil
- `POST /api/profile/change-password/` - Alterar senha

### CRUD de Usuários (requer autenticação)
- `GET /api/users/` - Listar usuários
- `POST /api/users/` - Criar usuário
- `GET /api/users/<id>/` - Obter usuário
- `PUT/PATCH /api/users/<id>/` - Atualizar usuário
- `DELETE /api/users/<id>/` - Desativar usuário (soft delete)

## Estrutura de Dados

### Registro de Usuário (POST /api/auth/register/)
```json
{
  "email": "usuario@example.com",
  "username": "usuario123",  // opcional, usa email se não fornecido
  "first_name": "João",       // opcional
  "last_name": "Silva",       // opcional
  "password": "senha123",
  "password_confirm": "senha123"
}
```

### Login (POST /api/auth/login/)
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

### Resposta de Registro/Login
```json
{
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "username": "usuario123",
    "first_name": "João",
    "last_name": "Silva",
    "date_joined": "2025-11-10T23:00:00Z",
    "is_active": true
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

## Configurações Importantes

### settings.py
- `AUTH_USER_MODEL = 'accounts.CustomUser'`
- `AUTHENTICATION_BACKENDS` com `EmailBackend` customizado
- `INSTALLED_APPS` inclui `rest_framework_simplejwt.token_blacklist`
- CORS configurado para `localhost:5173` e `localhost:3000`

### Migrations Aplicadas
- `accounts.0001_initial` - Modelo inicial
- `accounts.0002_alter_customuser_managers_alter_customuser_email_and_more` - Ajustes no modelo
- `token_blacklist.*` - Migrations do token blacklist

## Próximos Passos para Testar

1. **Iniciar o servidor Django**:
   ```bash
   cd Backend
   python manage.py runserver
   ```

2. **Testar registro**:
   ```bash
   curl -X POST http://localhost:8000/api/auth/register/ \
     -H "Content-Type: application/json" \
     -d '{
       "email": "teste@example.com",
       "username": "teste",
       "first_name": "Teste",
       "last_name": "Usuario",
       "password": "senha123456",
       "password_confirm": "senha123456"
     }'
   ```

3. **Testar login**:
   ```bash
   curl -X POST http://localhost:8000/api/auth/login/ \
     -H "Content-Type: application/json" \
     -d '{
       "email": "teste@example.com",
       "password": "senha123456"
     }'
   ```

## Notas Importantes

- O email é usado como `USERNAME_FIELD`, então é único e obrigatório
- O username é opcional e, se não fornecido, usa o email
- As senhas são validadas usando os validadores padrão do Django
- Tokens JWT são usados para autenticação
- O logout invalida o refresh token usando blacklist
- Usuários deletados são desativados (soft delete), não removidos do banco

