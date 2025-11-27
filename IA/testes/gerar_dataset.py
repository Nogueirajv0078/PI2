import pandas as pd
import numpy as np
import random

def gerar_dados_realistas(linhas=2000):
    print(f"--- Gerando dataset com {linhas} registros ---")
    
    # 1. Configurações da Simulação
    # Começa vendendo R$ 2.000 e cresce aprox R$ 5,00 a cada período
    inicio_vendas = 2000
    crescimento_tendencia = 5 
    
    dados = []
    
    # Cabeçalho "sujo" igual ao seu padrão
    dados.append(["MES", "faturamento", "despesas", "qtd_vendas"])
    dados.append(["Obrigatório", "Obrigatório", "Obrigatório", "Obrigatório"])
    dados.append(["mes_sequencial", "faturamento", "custos_totais", "total_vendas"])

    # 2. Loop Matemático
    for i in range(1, linhas + 1):
        # Faturamento base cresce com o tempo
        base = inicio_vendas + (i * crescimento_tendencia)
        
        # Adiciona "Ruído" (Variação aleatória do mercado de +/- 15%)
        variacao = random.uniform(0.85, 1.15)
        faturamento = base * variacao
        
        # Despesas: Custos fixos (R$ 500) + Custos variáveis (60% do faturamento) + Variação
        despesas = 500 + (faturamento * 0.60) + random.uniform(-100, 200)
        
        # Quantidade de vendas: Depende do preço médio (ex: R$ 100 por item)
        preco_medio = random.uniform(90, 110)
        qtd = int(faturamento / preco_medio)
        
        # Arredondar valores
        faturamento = round(faturamento, 2)
        despesas = round(despesas, 2)

        dados.append([i, faturamento, despesas, qtd])

    # 3. Salvar
    df = pd.DataFrame(dados)
    nome_arquivo = "dataset_gigante.csv"
    # Header=False e Index=False porque nós já criamos o header manualmente na lista
    df.to_csv(nome_arquivo, header=False, index=False)
    print(f"Sucesso! Arquivo '{nome_arquivo}' criado com {linhas} linhas.")

if __name__ == "__main__":
    gerar_dados_realistas()