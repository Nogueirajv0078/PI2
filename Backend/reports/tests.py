"""
Tests para o app de relatórios
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
import os
import tempfile
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()


class ReportGenerationTestCase(TestCase):
    """Testes para geração de relatórios"""
    
    def setUp(self):
        """Configuração inicial para os testes"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            username='testuser',
            first_name='Test',
            last_name='User'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_upload_without_file(self):
        """Testa upload sem arquivo"""
        response = self.client.post('/api/report/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
    
    def test_upload_invalid_format(self):
        """Testa upload com formato inválido"""
        file = SimpleUploadedFile("test.txt", b"file_content", content_type="text/plain")
        response = self.client.post('/api/report/', {'file': file})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_upload_without_authentication(self):
        """Testa upload sem autenticação"""
        client = APIClient()  # Cliente sem autenticação
        file = SimpleUploadedFile("test.xlsx", b"file_content", content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response = client.post('/api/report/', {'file': file})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

