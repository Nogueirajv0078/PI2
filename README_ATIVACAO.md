# Como Iniciar o Projeto

## Método Automático (Recomendado)

Execute o script PowerShell na raiz do projeto:

```powershell
.\activate.ps1
```

Este script irá:
1. Verificar se Python e Node.js estão instalados
2. Verificar/criar o ambiente virtual do Python
3. Instalar dependências do frontend (se necessário)
4. Iniciar o Backend Django em um terminal separado (porta 8000)
5. Iniciar o Frontend Vite em outro terminal separado (porta 3000)

## Método Manual

### 1. Iniciar o Backend (Django)

Abra um terminal PowerShell e execute:

```powershell
cd Backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

O backend estará disponível em: http://localhost:8000

### 2. Iniciar o Frontend (Vite/React)

Abra outro terminal PowerShell e execute:

```powershell
cd "Relatório com Interface Intuitiva"
npm run dev
```

O frontend estará disponível em: http://localhost:3000

## URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin

## Solução de Problemas

### Erro: "Python não encontrado"
- Instale o Python 3.8 ou superior
- Certifique-se de adicionar Python ao PATH durante a instalação

### Erro: "Node.js não encontrado"
- Instale o Node.js (versão 16 ou superior)
- Baixe em: https://nodejs.org/

### Erro: "ERR_CONNECTION_REFUSED"
- Verifique se o backend está rodando na porta 8000
- Verifique se não há firewall bloqueando a conexão
- Certifique-se de que a URL no `api.ts` está correta: `http://localhost:8000/api`

### Erro: "Cannot activate virtual environment"
- Execute no PowerShell como Administrador
- Ou execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Porta já em uso
- Se a porta 8000 estiver em uso, o Django tentará usar 8001, 8002, etc.
- Atualize a URL no `api.ts` se necessário
- Para o frontend, altere a porta no `vite.config.ts`

## Estrutura do Projeto

```
PI2/
├── Backend/                 # Django Backend
│   ├── accounts/            # App de autenticação
│   ├── auth_project/       # Configurações do projeto
│   ├── manage.py           # Script de gerenciamento Django
│   └── venv/               # Ambiente virtual Python
│
└── Relatório com Interface Intuitiva/  # React Frontend
    ├── src/
    │   ├── services/
    │   │   └── api.ts      # Configuração da API
    │   └── ...
    └── package.json
```

## Comandos Úteis

### Backend
```powershell
# Criar superusuário
python manage.py createsuperuser

# Aplicar migrations
python manage.py migrate

# Criar migrations
python manage.py makemigrations

# Verificar configurações
python manage.py check
```

### Frontend
```powershell
# Instalar dependências
npm install

# Build para produção
npm run build
```

