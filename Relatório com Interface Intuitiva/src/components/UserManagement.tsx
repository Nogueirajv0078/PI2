import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { apiService, User, RegisterData } from '../services/api';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, Download } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await apiService.getUsers();
      setUsers(usersData);
    } catch (error: any) {
      toast.error('Erro ao carregar usuários: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.username || !formData.first_name || 
        !formData.last_name || !formData.password || !formData.password_confirm) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (formData.password !== formData.password_confirm) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      if (editingUser) {
        // Atualizar usuário existente
        const updateData = {
          email: formData.email,
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
        };
        await apiService.updateUser(editingUser.id, updateData);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        await apiService.createUser(formData);
        toast.success('Usuário criado com sucesso!');
      }
      
      setShowForm(false);
      setEditingUser(null);
      setFormData({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        password_confirm: '',
      });
      loadUsers();
    } catch (error: any) {
      toast.error('Erro: ' + error.message);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      password: '',
      password_confirm: '',
    });
    setShowForm(true);
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await apiService.deleteUser(userId);
        toast.success('Usuário excluído com sucesso!');
        loadUsers();
      } catch (error: any) {
        toast.error('Erro ao excluir usuário: ' + error.message);
      }
    }
  };

  const handleDownloadReport = async () => {
    try {
      const blob = await apiService.downloadUserReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio_usuarios.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Relatório de usuários baixado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao baixar relatório: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/80 backdrop-blur-md border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Gerenciamento de Usuários</CardTitle>
          <CardDescription className="text-gray-400">
            Gerencie usuários do sistema com operações completas de CRUD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-gray-100"
                />
              </div>
            </div>
            <Button
              onClick={handleDownloadReport}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório
            </Button>
            <Button
              onClick={() => {
                setShowForm(true);
                setEditingUser(null);
                setFormData({
                  email: '',
                  username: '',
                  first_name: '',
                  last_name: '',
                  password: '',
                  password_confirm: '',
                });
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6 bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Nome</Label>
                      <Input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Sobrenome</Label>
                      <Input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Email</Label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Username</Label>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Senha</Label>
                      <Input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        required={!editingUser}
                        placeholder={editingUser ? "Deixe em branco para manter" : ""}
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Confirmar Senha</Label>
                      <Input
                        name="password_confirm"
                        type="password"
                        value={formData.password_confirm}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        required={!editingUser}
                        placeholder={editingUser ? "Deixe em branco para manter" : ""}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      {editingUser ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingUser(null);
                      }}
                      className="border-gray-600 text-gray-300"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Carregando usuários...</div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg">
                      <span className="text-white font-semibold text-sm">
                        {user.first_name[0]}{user.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <p className="text-gray-500 text-xs">@{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(user)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(user.id)}
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
