# Serviço de Geração de Relatórios

## Origem do Código

Este serviço é baseado no arquivo original:
- **Arquivo original:** `IA/app_ia_v12.py`
- **Função original:** `processar_previsao_final()`

## Adaptações Realizadas

### ✅ Mantido (Lógica Idêntica)
- ✅ Leitura de arquivo Excel/CSV (pula 2 linhas de cabeçalho)
- ✅ Mapeamento de colunas
- ✅ Processamento de dados
- ✅ Treinamento de modelos ML (LinearRegression)
- ✅ Geração de previsões (próximos 3 meses)
- ✅ Formatação do Excel (estilos, cores, formatação condicional)
- ✅ Gráficos (Faturamento vs Despesas, Evolução do Lucro)
- ✅ Cálculo de lucro histórico e previsto

### 🔄 Adaptado para Django
- ❌ Removido: `selecionar_arquivo()` (Tkinter)
- ❌ Removido: `if __name__ == "__main__"`
- ❌ Removido: `os.startfile()` (abertura automática)
- ✅ Adicionado: Logging do Django
- ✅ Adicionado: Tratamento de erros com exceções
- ✅ Adicionado: Retorno do caminho do arquivo gerado
- ✅ Adaptado: Caminho de saída configurável (media/temp ao invés de Downloads)

### 📝 Mudanças de Interface

**Original:**
```python
def processar_previsao_final(caminho_arquivo_entrada):
    # Retorna None em caso de erro
    # Salva em Downloads
    # Abre arquivo automaticamente
```

**Refatorado:**
```python
def gerar_relatorio(caminho_arquivo_entrada: str, caminho_saida: str = None) -> str:
    # Retorna caminho do arquivo gerado
    # Levanta exceções em caso de erro
    # Salva em media/temp (ou caminho especificado)
    # Não abre arquivo (retorna para Django servir)
```

## Garantia de Compatibilidade

✅ **Toda a lógica de processamento está idêntica ao original**
✅ **Mesmos cálculos, mesmas fórmulas, mesmos resultados**
✅ **Mesma formatação visual do Excel gerado**

A única diferença é a interface (sem Tkinter) e o destino do arquivo (servido via Django ao invés de salvo em Downloads).

