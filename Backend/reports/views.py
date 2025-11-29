"""
Views para geração de relatórios financeiros
"""
import os
import tempfile
import logging
from django.conf import settings
from django.http import FileResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .services.report_generator import gerar_relatorio

logger = logging.getLogger(__name__)

# Tamanho máximo do arquivo: 50MB
MAX_FILE_SIZE = 50 * 1024 * 1024

# Extensões permitidas
ALLOWED_EXTENSIONS = ['.xlsx', '.xls', '.csv']


class GenerateReportView(APIView):
    """
    View para receber upload de arquivo e gerar relatório financeiro
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Recebe arquivo via multipart/form-data e retorna relatório gerado
        """
        try:
            # Verificar se arquivo foi enviado
            if 'file' not in request.FILES:
                return Response(
                    {'error': 'Nenhum arquivo foi enviado. Use a chave "file".'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            uploaded_file = request.FILES['file']
            
            # Validar extensão
            file_name = uploaded_file.name
            file_ext = os.path.splitext(file_name)[1].lower()
            
            if file_ext not in ALLOWED_EXTENSIONS:
                return Response(
                    {
                        'error': f'Formato de arquivo não suportado. Use: {", ".join(ALLOWED_EXTENSIONS)}'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validar tamanho
            if uploaded_file.size > MAX_FILE_SIZE:
                return Response(
                    {'error': f'Arquivo muito grande. Tamanho máximo: {MAX_FILE_SIZE / (1024*1024):.0f}MB'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            logger.info(f"Processando arquivo: {file_name} (tamanho: {uploaded_file.size} bytes)")
            
            # Criar diretório temporário se não existir
            temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp')
            os.makedirs(temp_dir, exist_ok=True)
            
            # Salvar arquivo temporariamente
            temp_input_path = os.path.join(temp_dir, f"input_{request.user.id}_{file_name}")
            with open(temp_input_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
            
            logger.info(f"Arquivo salvo temporariamente: {temp_input_path}")
            
            # Gerar relatório
            try:
                output_path = gerar_relatorio(temp_input_path)
                logger.info(f"Relatório gerado: {output_path}")
            except ValueError as e:
                # Limpar arquivo temporário em caso de erro
                if os.path.exists(temp_input_path):
                    os.remove(temp_input_path)
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                logger.error(f"Erro ao gerar relatório: {e}", exc_info=True)
                # Limpar arquivo temporário em caso de erro
                if os.path.exists(temp_input_path):
                    os.remove(temp_input_path)
                return Response(
                    {'error': f'Erro ao processar arquivo: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            finally:
                # Limpar arquivo de entrada após processamento
                if os.path.exists(temp_input_path):
                    try:
                        os.remove(temp_input_path)
                    except Exception as e:
                        logger.warning(f"Erro ao remover arquivo temporário: {e}")
            
            # Verificar se arquivo de saída existe
            if not os.path.exists(output_path):
                return Response(
                    {'error': 'Erro ao gerar relatório. Arquivo de saída não foi criado.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Retornar arquivo para download
            file_handle = open(output_path, 'rb')
            response = FileResponse(
                file_handle,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(output_path)}"'
            response['Content-Length'] = os.path.getsize(output_path)
            
            # Agendar limpeza do arquivo de saída após envio
            # Usar callback para limpar após resposta ser enviada
            def cleanup_file():
                try:
                    if os.path.exists(output_path):
                        os.remove(output_path)
                        logger.info(f"Arquivo temporário removido: {output_path}")
                except Exception as e:
                    logger.warning(f"Erro ao remover arquivo temporário: {e}")
            
            # Em produção, usar celery ou similar para limpeza assíncrona
            # Por enquanto, vamos deixar o arquivo para limpeza manual periódica
            
            return response
            
        except Exception as e:
            logger.error(f"Erro inesperado: {e}", exc_info=True)
            return Response(
                {'error': f'Erro interno do servidor: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

