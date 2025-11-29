"""
Serviço de geração de relatório financeiro usando IA (Machine Learning)
Baseado em IA/app_ia_v12.py - Refatorado para funcionar como módulo Django
Removida dependência de Tkinter e adaptado para uso em backend web
"""
import pandas as pd
from sklearn.linear_model import LinearRegression
import os
from pathlib import Path
import warnings
from datetime import datetime
import logging

# Configurar logging
logger = logging.getLogger(__name__)

# Ignora avisos técnicos irrelevantes
warnings.filterwarnings("ignore")


def gerar_relatorio(caminho_arquivo_entrada: str, caminho_saida: str = None) -> str:
    """
    Função baseada em processar_previsao_final() do arquivo original IA/app_ia_v12.py
    Refatorada para funcionar como módulo Django sem Tkinter
    
    Mantém TODA a lógica original:
    - Mesma leitura de arquivo (pula 2 linhas)
    - Mesmo mapeamento de colunas
    - Mesmos cálculos ML (LinearRegression)
    - Mesmas previsões (próximos 3 meses)
    - Mesma formatação Excel
    - Mesmos gráficos
    
    Args:
        caminho_arquivo_entrada: Caminho completo do arquivo Excel/CSV de entrada
        caminho_saida: Caminho onde salvar o relatório (opcional)
    
    Returns:
        str: Caminho completo do arquivo gerado
    
    Raises:
        ValueError: Se o arquivo não puder ser processado
        FileNotFoundError: Se o arquivo de entrada não existir
    """
    if not caminho_arquivo_entrada:
        raise ValueError("Caminho do arquivo de entrada não fornecido")
    
    if not os.path.exists(caminho_arquivo_entrada):
        raise FileNotFoundError(f"Arquivo não encontrado: {caminho_arquivo_entrada}")
    
    logger.info(f"Processando arquivo: {os.path.basename(caminho_arquivo_entrada)}")
    
    # 1. Leitura (Pula as 2 primeiras linhas de cabeçalho 'sujo')
    try:
        if caminho_arquivo_entrada.endswith('.csv'):
            df = pd.read_csv(caminho_arquivo_entrada, header=2)
        else:
            df = pd.read_excel(caminho_arquivo_entrada, header=2)
    except Exception as e:
        logger.error(f"Erro ao ler arquivo: {e}")
        raise ValueError(f"Erro ao abrir arquivo: {str(e)}")
    
    # Limpeza dos nomes das colunas
    df.columns = [str(c).strip().lower() for c in df.columns]
    
    # 2. Mapeamento
    mapa_colunas = {
        'mes_sequencial': 'mes_sequencial',
        'faturamento': 'faturamento',
        'custos_totais': 'despesas',
        'total_vendas': 'qtd_vendas'
    }
    
    # Verificar se todas as colunas necessárias existem
    colunas_faltantes = [col for col in mapa_colunas.keys() if col not in df.columns]
    if colunas_faltantes:
        logger.error(f"Colunas não encontradas: {colunas_faltantes}")
        raise ValueError(f"Colunas obrigatórias não encontradas na linha 3: {', '.join(colunas_faltantes)}")
    
    df = df.rename(columns=mapa_colunas)
    
    # Converte tudo para número
    for col in ['mes_sequencial', 'faturamento', 'despesas', 'qtd_vendas']:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    df_limpo = df.dropna(subset=['mes_sequencial', 'faturamento'])
    
    if len(df_limpo) < 2:
        raise ValueError("Poucos dados para análise. É necessário pelo menos 2 registros válidos.")
    
    logger.info(f"Dados processados: {len(df_limpo)} registros válidos")
    
    # 3. Cálculos e IA (Machine Learning)
    X = df_limpo[['mes_sequencial']]
    
    try:
        model_fat = LinearRegression().fit(X, df_limpo['faturamento'])
        model_desp = LinearRegression().fit(X, df_limpo['despesas'])
    except Exception as e:
        logger.error(f"Erro ao treinar modelos: {e}")
        raise ValueError(f"Erro ao processar dados com IA: {str(e)}")
    
    # Previsão Futura
    ultimo_mes = int(df_limpo['mes_sequencial'].max())
    
    # Cria input futuro
    df_futuro_input = pd.DataFrame({
        'mes_sequencial': [ultimo_mes + 1, ultimo_mes + 2, ultimo_mes + 3]
    })
    
    prev_fat_bruto = model_fat.predict(df_futuro_input[['mes_sequencial']])
    prev_desp_bruto = model_desp.predict(df_futuro_input[['mes_sequencial']])
    
    # Trava (Não deixa ser negativo) - Lógica idêntica ao original
    prev_fat = [max(0, valor) for valor in prev_fat_bruto]
    prev_desp = [max(0, valor) for valor in prev_desp_bruto]
    prev_lucro = [f - d for f, d in zip(prev_fat, prev_desp)]
    
    # 4. Monta Dados Finais
    df_futuro = pd.DataFrame({
        'mes_sequencial': df_futuro_input['mes_sequencial'],
        'faturamento': prev_fat,
        'despesas': prev_desp,
        'lucro': prev_lucro,
        'tipo': 'Previsão'
    })
    
    df_visual = df_limpo.tail(48).copy()
    df_visual['lucro'] = df_visual['faturamento'] - df_visual['despesas']
    df_visual['tipo'] = 'Histórico'
    
    cols_export = ['mes_sequencial', 'faturamento', 'despesas', 'lucro', 'tipo']
    df_final = pd.concat([df_visual[cols_export], df_futuro[cols_export]], ignore_index=True)
    
    # 5. SALVAMENTO COM DATA E HORA
    if not caminho_saida:
        # Criar diretório temporário se não existir
        pasta_temp = os.path.join(os.path.dirname(caminho_arquivo_entrada), 'temp')
        os.makedirs(pasta_temp, exist_ok=True)
        
        nome_base = os.path.splitext(os.path.basename(caminho_arquivo_entrada))[0]
        data_hora = datetime.now().strftime("%d-%m-%Y_%H-%M-%S")
        nome_saida = f"Relatorio_IA_{nome_base}_{data_hora}.xlsx"
        caminho_saida = os.path.join(pasta_temp, nome_saida)
    
    logger.info(f"Salvando relatório: {caminho_saida}")
    
    try:
        writer = pd.ExcelWriter(caminho_saida, engine='xlsxwriter')
        sheet = 'Relatório IA'
        df_final.to_excel(writer, sheet_name=sheet, startrow=1, header=False, index=False)
        
        wb = writer.book
        ws = writer.sheets[sheet]
        
        # Estilos - Idênticos ao arquivo original
        fmt_head = wb.add_format({'bold': True, 'font_color': 'white', 'bg_color': '#4A235A', 'align': 'center', 'border': 1})
        fmt_money = wb.add_format({'num_format': 'R$ #,##0.00'})
        fmt_prev = wb.add_format({'bg_color': '#D7BDE2', 'italic': True})
        fmt_lucro_pos = wb.add_format({'num_format': 'R$ #,##0.00', 'font_color': 'green', 'bold': True})
        fmt_lucro_neg = wb.add_format({'num_format': 'R$ #,##0.00', 'font_color': 'red', 'bold': True})
        
        titulos = ['Mês', 'Faturamento', 'Despesas', 'Lucro', 'Status']
        for i, t in enumerate(titulos):
            ws.write(0, i, t, fmt_head)
        
        ws.set_column('B:D', 18, fmt_money)
        # Formatação condicional - Idêntica ao original
        ws.conditional_format(f'A2:E{len(df_final)+1}', {'type': 'formula', 'criteria': '=$E2="Previsão"', 'format': fmt_prev})
        ws.conditional_format(f'D2:D{len(df_final)+1}', {'type': 'cell', 'criteria': '>', 'value': 0, 'format': fmt_lucro_pos})
        ws.conditional_format(f'D2:D{len(df_final)+1}', {'type': 'cell', 'criteria': '<', 'value': 0, 'format': fmt_lucro_neg})
        
        # Gráficos - Idênticos ao arquivo original
        chart1 = wb.add_chart({'type': 'column'})
        chart1.add_series({'name': 'Faturamento', 'categories': [sheet, 1, 0, len(df_final), 0], 'values': [sheet, 1, 1, len(df_final), 1], 'fill': {'color': '#5DADE2'}})
        chart1.add_series({'name': 'Despesas', 'values': [sheet, 1, 2, len(df_final), 2], 'fill': {'color': '#E74C3C'}})
        chart1.set_title({'name': 'Faturamento vs Despesas'})
        ws.insert_chart('G2', chart1)
        
        chart2 = wb.add_chart({'type': 'line'})
        chart2.add_series({'name': 'Lucro', 'categories': [sheet, 1, 0, len(df_final), 0], 'values': [sheet, 1, 3, len(df_final), 3], 'line': {'color': '#229954', 'width': 3}})
        chart2.set_title({'name': 'Evolução do Lucro'})
        ws.insert_chart('G21', chart2)
        
        writer.close()
        logger.info(f"Relatório gerado com sucesso: {caminho_saida}")
        
        return caminho_saida
        
    except Exception as e:
        logger.error(f"Erro ao salvar relatório: {e}")
        raise ValueError(f"Erro ao gerar arquivo Excel: {str(e)}")

