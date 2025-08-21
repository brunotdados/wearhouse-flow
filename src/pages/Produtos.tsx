import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Send, Eye, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Produto {
  id: number;
  nome_produto: string;
  categoria: string;
  preco_venda: string;
  preco_promocional: string;
  estoque_inicial: string;
  estoque_infinito: boolean;
  sku: string;
  opcao1_valor: string;
  opcao2_valor: string;
  created_at: string;
}

const Produtos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar produtos do localStorage (simulando Supabase)
  useEffect(() => {
    const carregarProdutos = () => {
      try {
        const produtosSalvos = JSON.parse(localStorage.getItem('produtos') || '[]');
        
        // Se não houver produtos, adicionar alguns exemplos
        if (produtosSalvos.length === 0) {
          const produtosExemplo: Produto[] = [
            {
              id: 1,
              nome_produto: "Camiseta Fitness Pro",
              categoria: "camisetas",
              preco_venda: "89.90",
              preco_promocional: "69.90",
              estoque_inicial: "25",
              estoque_infinito: false,
              sku: "camisetas-camiseta-fitness-pro-preto-m",
              opcao1_valor: "M",
              opcao2_valor: "Preto",
              created_at: "2024-01-15T10:30:00.000Z"
            },
            {
              id: 2,
              nome_produto: "Legging High Waist",
              categoria: "leggings", 
              preco_venda: "129.90",
              preco_promocional: "",
              estoque_inicial: "0",
              estoque_infinito: false,
              sku: "leggings-legging-high-waist-azul-p",
              opcao1_valor: "P",
              opcao2_valor: "Azul",
              created_at: "2024-01-14T15:20:00.000Z"
            },
            {
              id: 3,
              nome_produto: "Top Esportivo Basic",
              categoria: "tops",
              preco_venda: "59.90",
              preco_promocional: "",
              estoque_inicial: "18",
              estoque_infinito: false,
              sku: "tops-top-esportivo-basic-rosa-g",
              opcao1_valor: "G",
              opcao2_valor: "Rosa",
              created_at: "2024-01-13T09:45:00.000Z"
            },
            {
              id: 4,
              nome_produto: "Short de Corrida",
              categoria: "shorts",
              preco_venda: "79.90",
              preco_promocional: "59.90",
              estoque_inicial: "7",
              estoque_infinito: false,
              sku: "shorts-short-de-corrida-cinza-m",
              opcao1_valor: "M",
              opcao2_valor: "Cinza",
              created_at: "2024-01-12T14:15:00.000Z"
            }
          ];
          
          localStorage.setItem('produtos', JSON.stringify(produtosExemplo));
          setProdutos(produtosExemplo);
        } else {
          setProdutos(produtosSalvos);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Ocorreu um erro ao carregar a lista de produtos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  // Filtrar produtos
  useEffect(() => {
    let filtered = produtos;

    if (searchTerm) {
      filtered = filtered.filter(produto =>
        produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoriaFilter) {
      filtered = filtered.filter(produto => produto.categoria === categoriaFilter);
    }

    setFilteredProdutos(filtered);
  }, [produtos, searchTerm, categoriaFilter]);

  const getStatusEstoque = (produto: Produto) => {
    if (produto.estoque_infinito) return { label: 'Infinito', variant: 'default' as const, icon: CheckCircle };
    
    const estoque = parseInt(produto.estoque_inicial);
    if (estoque === 0) return { label: 'Sem Estoque', variant: 'destructive' as const, icon: AlertCircle };
    if (estoque <= 10) return { label: 'Estoque Baixo', variant: 'secondary' as const, icon: AlertCircle };
    return { label: 'Em Estoque', variant: 'default' as const, icon: CheckCircle };
  };

  const reenviarParaN8n = async (produto: Produto) => {
    const webhookUrl = 'https://meu-webhook-n8n.com/produtos';
    
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          ...produto,
          timestamp: new Date().toISOString(),
          action: 'reenvio_manual'
        }),
      });

      toast({
        title: "Produto reenviado",
        description: `${produto.nome_produto} foi reenviado para o n8n`,
      });
    } catch (error) {
      toast({
        title: "Erro no reenvio",
        description: "Falha ao reenviar produto para o n8n",
        variant: "destructive",
      });
    }
  };

  const categorias = Array.from(new Set(produtos.map(p => p.categoria))).filter(Boolean);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Carregando produtos...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({length: 8}).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
                <div className="h-6 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie o catálogo da Perronifitwear ({filteredProdutos.length} produtos)
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90">
          <a href="/cadastrar-produto">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </a>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      {filteredProdutos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoriaFilter 
                ? "Tente ajustar os filtros ou limpar a busca"
                : "Comece adicionando seu primeiro produto"
              }
            </p>
            <Button asChild>
              <a href="/cadastrar-produto">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Produto
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Variações</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProdutos.map((produto) => {
                    const statusEstoque = getStatusEstoque(produto);
                    const StatusIcon = statusEstoque.icon;
                    
                    return (
                      <TableRow key={produto.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{produto.nome_produto}</div>
                            <div className="text-sm text-muted-foreground">
                              Criado em {new Date(produto.created_at).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant="outline">
                            {produto.categoria.charAt(0).toUpperCase() + produto.categoria.slice(1)}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="font-medium">R$ {parseFloat(produto.preco_venda).toFixed(2)}</div>
                            {produto.preco_promocional && (
                              <div className="text-sm text-brand-warning">
                                Promo: R$ {parseFloat(produto.preco_promocional).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant={statusEstoque.variant} className="gap-1">
                            <StatusIcon className="w-3 h-3" />
                            {produto.estoque_infinito ? 'Infinito' : produto.estoque_inicial}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            <div>{produto.opcao1_valor}</div>
                            <div className="text-muted-foreground">{produto.opcao2_valor}</div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant="secondary" className="font-mono text-xs">
                            {produto.sku}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => reenviarParaN8n(produto)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Produtos;