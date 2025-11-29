# 📊 Integração de Geração de Relatórios Financeiros

## 🎯 Visão Geral

Este documento descreve a integração completa do serviço Python de geração de relatórios financeiros com o backend Django e frontend React.

## 📋 Fluxo Completo

```
┌─────────────────┐
│   Frontend      │
│   (React/TS)    │
└────────┬────────┘
         │
         │ 1. Upload arquivo (FormData)
         │    POST /api/report/
         │    Headers: Authorization: Bearer <token>
         │    Body: multipart/form-data
         │
         ▼
┌─────────────────┐
│   Backend       │
│   (Django)      │
│                 │
│  GenerateReport │
│  View           │
└────────┬────────┘
         │
         │ 2. Validar arquivo
         │    - Extensão (.xlsx, .xls, .csv)
         │    - Tamanho (max 50MB)
         │    - Autenticação
         │
         │ 3. Salvar temporariamente
         │    media/temp/input_<user_id>_<filename>
         │
         │ 4. Chamar serviço
         │    gerar_relatorio(caminho_arquivo)
         │
         ▼
┌─────────────────┐
│   Serviço IA    │
│   (Python)      │
│                 │
│ report_generator │
│ .py             │
└────────┬────────┘
         │
         │ 5. Processar dados
         │    - Ler Excel/CSV (pula 2 linhas)
         │    - Validar colunas
         │    - Treinar modelos ML
         │    - Gerar previsões
         │    - Criar Excel formatado
         │
         │ 6. Retornar caminho
         │    media/temp/Relatorio_IA_<nome>_<timestamp>.xlsx
         │
         ▼
┌─────────────────┐
│   Backend       │
│   (Django)      │
└────────┬────────┘
         │
         │ 7. Retornar FileResponse
         │    Content-Type: application/vnd.openxmlformats...
         │    Content-Disposition: attachment
         │
         ▼
┌─────────────────┐
│   Frontend      │
│   (React/TS)    │
└─────────────────┘
         │
         │ 8. Receber Blob
         │    Criar URL temporária
         │    Download automático
         │    Limpar URL
         │
         ▼
    ✅ Relatório baixado
```

## 🏗️ Estrutura de Arquivos

```
Backend/
├── reports/
│   ├── __init__.py
│   ├── apps.py
│   ├── admin.py
│   ├── models.py
│   ├── views.py          # GenerateReportView
│   ├── urls.py           # /api/report/
│   ├── tests.py
│   └── services/
│       ├── __init__.py
│       └── report_generator.py  # Serviço refatorado
│
└── auth_project/
    ├── settings.py       # MEDIA_ROOT, MEDIA_URL
    └── urls.py           # Inclui reports.urls

Relatório com Interface Intuitiva/
└── src/
    ├── services/
    │   └── api.ts        # generateReport()
    └── pages/
        └── Dashboard.tsx # handleGenerateReport()
```

## 🔧 Componentes Principais

### 1. Serviço Python (`report_generator.py`)

**Função principal:**
```python
def gerar_relatorio(caminho_arquivo_entrada: str, caminho_saida: str = None) -> str:
    """
    Recebe caminho do arquivo e retorna caminho do relatório gerado
    """
```

**Características:**
- ✅ Sem dependência de Tkinter
- ✅ Usa logging do Django
- ✅ Tratamento de erros robusto
- ✅ Validação de dados
- ✅ Geração de Excel formatado com gráficos

### 2. View Django (`GenerateReportView`)

**Endpoint:** `POST /api/report/`

**Validações:**
- Arquivo obrigatório (chave "file")
- Extensões permitidas: `.xlsx`, `.xls`, `.csv`
- Tamanho máximo: 50MB
- Autenticação JWT obrigatória

**Processo:**
1. Recebe arquivo via `multipart/form-data`
2. Valida formato e tamanho
3. Salva temporariamente em `media/temp/`
4. Chama `gerar_relatorio()`
5. Retorna `FileResponse` com Excel gerado
6. Limpa arquivos temporários

### 3. Frontend React (`Dashboard.tsx`)

**Função principal:**
```typescript
const handleGenerateReport = async () => {
  const blob = await apiService.generateReport(uploadedFile);
  // Download automático
}
```

**Características:**
- ✅ Upload real de arquivo
- ✅ Loading durante processamento
- ✅ Download automático do Excel
- ✅ Tratamento de erros
- ✅ Feedback visual (toast notifications)

## 📦 Dependências

### Backend (`requirements.txt`)
```
Django==5.2.5
djangorestframework==3.15.2
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
django-filter==24.2
pandas
openpyxl
scikit-learn      # Para Machine Learning
xlsxwriter        # Para formatação Excel
```

## 🔐 Segurança

- ✅ Autenticação JWT obrigatória
- ✅ Validação de extensão de arquivo
- ✅ Limite de tamanho (50MB)
- ✅ Arquivos temporários são limpos
- ✅ CORS configurado corretamente

## 🧪 Testes

Execute os testes:
```bash
cd Backend
python manage.py test reports
```

## 🚀 Como Usar

1. **Iniciar servidores:**
   ```bash
   .\activate.ps1
   ```

2. **Fazer upload:**
   - Acesse o dashboard
   - Faça upload de arquivo Excel/CSV
   - Clique em "Gerar Relatório com IA"
   - Aguarde processamento
   - Arquivo será baixado automaticamente

## 📝 Formato do Arquivo de Entrada

O arquivo deve ter:
- **2 linhas de cabeçalho** (serão puladas)
- **Linha 3** com as colunas:
  - `mes_sequencial`
  - `faturamento`
  - `custos_totais` (mapeado para `despesas`)
  - `total_vendas` (mapeado para `qtd_vendas`)

## 🎨 Formato do Relatório Gerado

O Excel gerado contém:
- ✅ Dados históricos (últimos 48 meses)
- ✅ Previsões para próximos 3 meses (IA)
- ✅ Formatação condicional
- ✅ Gráficos (Faturamento vs Despesas, Evolução do Lucro)
- ✅ Estilos profissionais

## ⚠️ Tratamento de Erros

### Backend
- Arquivo não encontrado → 400 Bad Request
- Formato inválido → 400 Bad Request
- Erro no processamento → 500 Internal Server Error
- Não autenticado → 401 Unauthorized

### Frontend
- Exibe toast com mensagem de erro
- Mantém estado de loading
- Permite tentar novamente

## 🔄 Limpeza de Arquivos Temporários

- Arquivos de entrada são removidos após processamento
- Arquivos de saída ficam em `media/temp/` para limpeza periódica
- Em produção, usar Celery para limpeza assíncrona

## 📊 Logging

Todos os eventos importantes são logados:
- Upload de arquivo
- Processamento iniciado
- Erros durante processamento
- Geração concluída
- Limpeza de arquivos

## ✅ Checklist de Implementação

- [x] Serviço Python refatorado (sem Tkinter)
- [x] App Django criado
- [x] View para upload implementada
- [x] Rota API configurada
- [x] Frontend atualizado (upload real)
- [x] Download automático implementado
- [x] Mocks removidos
- [x] Tratamento de erros completo
- [x] Validações implementadas
- [x] Logging configurado
- [x] Testes básicos criados

## 🎯 Próximos Passos (Opcional)

- [ ] Adicionar cache para relatórios gerados
- [ ] Implementar fila de processamento (Celery)
- [ ] Adicionar histórico de relatórios gerados
- [ ] Melhorar UI de feedback durante processamento
- [ ] Adicionar preview do relatório antes de download
- [ ] Implementar notificações por email

