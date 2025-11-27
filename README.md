# Sistema de Relatórios com Interface Intuitiva

Este projeto implementa um sistema completo de autenticação e gerenciamento de usuários com interface React e backend Django, incluindo funcionalidades de geração de relatórios com IA.

## 🚀 Funcionalidades

### Frontend (React)
- **Autenticação completa**: Login e registro de usuários
- **Interface moderna**: Design responsivo com tema escuro e gradientes
- **Gerenciamento de usuários**: CRUD completo com interface intuitiva
- **Geração de relatórios**: Upload de arquivos e geração de relatórios com IA
- **Navegação protegida**: Rotas protegidas por autenticação
- **Notificações**: Sistema de toast para feedback do usuário

### Backend (Django)
- **Modelo de usuário personalizado**: Campos essenciais (email, nome, sobrenome)
- **Autenticação JWT**: Tokens seguros com refresh automático
- **API REST completa**: Endpoints para CRUD de usuários
- **Validação de dados**: Validação robusta de entrada
- **CORS configurado**: Comunicação segura entre frontend e backend

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Radix UI
- Lucide React
- Sonner (notificações)

### Backend
- Django 5.2.5
- Django REST Framework
- Django Simple JWT
- Django CORS Headers
- SQLite (desenvolvimento)

## 📋 Pré-requisitos

- Node.js 18+ 
- Python 3.8+
- pip (gerenciador de pacotes Python)

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd PI2
```

### 2. Configuração do Backend (Django)

```bash
# Navegue para a pasta do backend
cd Backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Execute as migrações
python manage.py makemigrations
python manage.py migrate

# Crie um superusuário (opcional)
python manage.py createsuperuser

# Execute o servidor
python manage.py runserver
```

O backend estará rodando em `http://localhost:8000`

### 3. Configuração do Frontend (React)

```bash
# Navegue para a pasta do frontend
cd "Relatório com Interface Intuitiva"

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/login/` - Login de usuário
- `POST /api/auth/register/` - Registro de usuário
- `POST /api/auth/logout/` - Logout de usuário
- `POST /api/auth/token/refresh/` - Renovar token de acesso

### Perfil do Usuário
- `GET /api/profile/` - Obter perfil do usuário autenticado
- `PUT/PATCH /api/profile/update/` - Atualizar perfil
- `POST /api/profile/change-password/` - Alterar senha

### Gerenciamento de Usuários
- `GET /api/users/` - Listar usuários
- `POST /api/users/` - Criar usuário
- `GET /api/users/{id}/` - Obter usuário específico
- `PUT/PATCH /api/users/{id}/` - Atualizar usuário
- `DELETE /api/users/{id}/` - Excluir usuário (soft delete)

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

1. **Login**: Retorna access token e refresh token
2. **Access Token**: Válido por 60 minutos
3. **Refresh Token**: Válido por 7 dias
4. **Renovação automática**: O frontend renova tokens automaticamente

## 🎨 Interface do Usuário

### Páginas
- **Login** (`/login`): Autenticação de usuários existentes
- **Registro** (`/register`): Criação de novas contas
- **Dashboard** (`/dashboard`): Interface principal com duas abas:
  - **Relatórios**: Geração de relatórios com IA
  - **Usuários**: Gerenciamento completo de usuários

### Componentes Principais
- **HeaderLogin**: Cabeçalho da página de login/registro
- **UserManagement**: Interface completa de CRUD de usuários
- **AuthContext**: Gerenciamento de estado de autenticação
- **ApiService**: Serviço para comunicação com a API

## 🔧 Configurações

### Backend (settings.py)
- CORS configurado para `localhost:5173`
- JWT com tokens de 60 minutos
- Modelo de usuário personalizado
- Validação de senhas robusta

### Frontend (vite.config.ts)
- Proxy configurado para API
- Hot reload habilitado
- Build otimizado para produção

## 🚀 Deploy

### Backend
```bash
# Instalar dependências de produção
pip install gunicorn

# Executar com Gunicorn
gunicorn auth_project.wsgi:application
```

### Frontend
```bash
# Build para produção
npm run build

# Os arquivos estarão em dist/
```

## 🐛 Solução de Problemas

### Erro de CORS
- Verifique se o backend está rodando na porta 8000
- Confirme as configurações de CORS no settings.py

### Erro de Token
- Verifique se o token está sendo salvo no localStorage
- Confirme se o refresh token está funcionando

### Erro de Conexão
- Verifique se ambos os servidores estão rodando
- Confirme as URLs da API no frontend

## 📝 Estrutura do Projeto

```
PI2/
├── Backend/                    # Backend Django
│   ├── accounts/              # App de usuários
│   │   ├── models.py         # Modelo de usuário personalizado
│   │   ├── views.py          # Views da API
│   │   ├── serializers.py    # Serializers
│   │   └── urls.py           # URLs da API
│   ├── auth_project/         # Configurações do Django
│   └── requirements.txt      # Dependências Python
└── Relatório com Interface Intuitiva/  # Frontend React
    ├── src/
    │   ├── components/       # Componentes reutilizáveis
    │   ├── contexts/         # Contextos (Auth)
    │   ├── pages/           # Páginas da aplicação
    │   ├── services/        # Serviços (API)
    │   └── styles/          # Estilos CSS
    └── package.json         # Dependências Node.js
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- Desenvolvido como parte do projeto PI2
- Sistema completo de autenticação e gerenciamento de usuários
- Interface moderna e responsiva
- Integração frontend-backend robusta

---

**Nota**: Este é um projeto de demonstração que implementa um sistema completo de autenticação e gerenciamento de usuários com interface moderna e funcionalidades avançadas.
