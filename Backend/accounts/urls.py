from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Autenticação
    path('auth/login/', views.login_user, name='login'),
    path('auth/register/', views.register_user, name='register'),
    path('auth/logout/', views.logout_user, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Perfil do usuário
    path('profile/', views.get_user_profile, name='user_profile'),
    path('profile/update/', views.update_user_profile, name='update_profile'),
    path('profile/change-password/', views.change_password, name='change_password'),
    
    # CRUD de usuários (apenas para usuários autenticados)
    path('users/', views.UserListCreateView.as_view(), name='user_list_create'),
    path('users/<int:id>/', views.UserRetrieveUpdateDestroyView.as_view(), name='user_detail'),
    
    # Relatórios
    path('reports/download-excel/', views.download_excel_report, name='download_excel_report'),
]
