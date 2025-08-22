import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, Users, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  // Dados simulados - em produção virão do Supabase
  const stats = {
    totalProdutos: 156,
    produtosAtivos: 142,
    produtosSemEstoque: 14,
    vendasMes: 89,
    clientesAtivos: 234,
    ticketMedio: 156.50
  };

  const produtosRecentes = [
    { nome: "Camiseta Fitness Pro", categoria: "Camisetas", estoque: 25, status: "ativo" },
    { nome: "Legging High Waist", categoria: "Leggings", estoque: 0, status: "sem_estoque" },
    { nome: "Top Esportivo Basic", categoria: "Tops", estoque: 18, status: "ativo" },
    { nome: "Short de Corrida", categoria: "Shorts", estoque: 7, status: "estoque_baixo" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu negócio Perronifitwear
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-brand-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">{stats.totalProdutos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.produtosAtivos} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-success">{stats.vendasMes}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-brand-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-secondary">{stats.clientesAtivos}</div>
            <p className="text-xs text-muted-foreground">
              Base de clientes crescendo
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <ShoppingCart className="h-4 w-4 text-brand-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-warning">R$ {stats.ticketMedio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Valor médio por venda
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Produtos Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas de Estoque */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-brand-warning" />
              Alertas de Estoque
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-brand-danger/5 border border-brand-danger/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-brand-danger">{stats.produtosSemEstoque} produtos sem estoque</span>
                <Badge variant="destructive">Crítico</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Reabasteça o estoque para não perder vendas
              </p>
            </div>
            
            <div className="p-4 bg-brand-warning/5 border border-brand-warning/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-brand-warning">7 produtos com estoque baixo</span>
                <Badge variant="secondary">Atenção</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Considere repor o estoque em breve
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Produtos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-brand-primary" />
              Produtos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {produtosRecentes.map((produto, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{produto.nome}</h4>
                    <p className="text-xs text-muted-foreground">{produto.categoria}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">Estoque: {produto.estoque}</p>
                    <Badge 
                      variant={
                        produto.status === 'ativo' ? 'default' :
                        produto.status === 'sem_estoque' ? 'destructive' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {produto.status === 'ativo' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </>
                      ) : produto.status === 'sem_estoque' ? (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Sem Estoque
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Estoque Baixo
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="/cadastrar-produto" 
              className="p-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg text-white hover:opacity-90 transition-opacity text-center group"
            >
              <Package className="h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium">Cadastrar Produto</p>
            </a>
            
            <a 
              href="/produtos" 
              className="p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors text-center group"
            >
              <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-brand-primary group-hover:scale-110 transition-transform" />
              <p className="font-medium">Ver Produtos</p>
            </a>
            
            <a 
              href="/vendas" 
              className="p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors text-center group"
            >
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-brand-success group-hover:scale-110 transition-transform" />
              <p className="font-medium">Registrar Venda</p>
            </a>
            
            <a 
              href="/clientes" 
              className="p-4 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors text-center group"
            >
              <Users className="h-6 w-6 mx-auto mb-2 text-brand-secondary group-hover:scale-110 transition-transform" />
              <p className="font-medium">Gerenciar Clientes</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;