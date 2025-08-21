import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Send, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProdutoForm {
  nome_produto: string;
  descricao_detalhada: string;
  imagens_urls: string;
  preco_venda: string;
  preco_promocional: string;
  preco_custo: string;
  custo_frete: string;
  fornecedor: string;
  categoria: string;
  estoque_inicial: string;
  estoque_infinito: boolean;
  sku: string;
  gtin_ean_isbn: string;
  tipo_produto: string;
  peso_g: string;
  altura_cm: string;
  largura_cm: string;
  comprimento_cm: string;
  tags: string;
  local_estoque: string;
  opcao1_nome: string;
  opcao1_valor: string;
  opcao2_nome: string;
  opcao2_valor: string;
}

const CadastrarProduto = () => {
  const [formData, setFormData] = useState<ProdutoForm>({
    nome_produto: '',
    descricao_detalhada: '',
    imagens_urls: '',
    preco_venda: '',
    preco_promocional: '',
    preco_custo: '',
    custo_frete: '',
    fornecedor: '',
    categoria: '',
    estoque_inicial: '',
    estoque_infinito: false,
    sku: '',
    gtin_ean_isbn: '',
    tipo_produto: '',
    peso_g: '',
    altura_cm: '',
    largura_cm: '',
    comprimento_cm: '',
    tags: '',
    local_estoque: 'Sede',
    opcao1_nome: 'Tamanho',
    opcao1_valor: '',
    opcao2_nome: 'Cor',
    opcao2_valor: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://meu-webhook-n8n.com/produtos');

  // Gerar SKU automaticamente
  useEffect(() => {
    if (formData.categoria && formData.nome_produto && formData.opcao2_valor && formData.opcao1_valor) {
      const categoria = formData.categoria.toLowerCase().replace(/\s+/g, '-');
      const nome = formData.nome_produto.toLowerCase().replace(/\s+/g, '-');
      const cor = formData.opcao2_valor.toLowerCase().replace(/\s+/g, '-');
      const tamanho = formData.opcao1_valor.toLowerCase().replace(/\s+/g, '-');
      
      const skuGerado = `${categoria}-${nome}-${cor}-${tamanho}`;
      setFormData(prev => ({ ...prev, sku: skuGerado }));
    }
  }, [formData.categoria, formData.nome_produto, formData.opcao2_valor, formData.opcao1_valor]);

  const handleInputChange = (field: keyof ProdutoForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.nome_produto.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome do produto não pode estar vazio",
        variant: "destructive",
      });
      return false;
    }

    const precoVenda = parseFloat(formData.preco_venda);
    const precoCusto = parseFloat(formData.preco_custo);
    const precoPromocional = formData.preco_promocional ? parseFloat(formData.preco_promocional) : 0;

    if (precoVenda <= 0) {
      toast({
        title: "Erro de validação",
        description: "O preço de venda deve ser maior que zero",
        variant: "destructive",
      });
      return false;
    }

    if (precoCusto <= 0) {
      toast({
        title: "Erro de validação",
        description: "O preço de custo deve ser maior que zero",
        variant: "destructive",
      });
      return false;
    }

    if (precoPromocional > 0 && precoPromocional >= precoVenda) {
      toast({
        title: "Erro de validação",
        description: "O preço promocional deve ser menor que o preço de venda",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const enviarParaN8n = async (dadosProduto: any) => {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          ...dadosProduto,
          timestamp: new Date().toISOString(),
          source: 'perronifitwear-system'
        }),
      });

      toast({
        title: "Dados enviados para n8n",
        description: "O produto foi enviado para o webhook n8n com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao enviar para n8n:', error);
      toast({
        title: "Erro no webhook",
        description: "Falha ao enviar dados para o n8n. Produto salvo localmente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simular salvamento no banco (Supabase)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const dadosProduto = {
        ...formData,
        id: Date.now(), // Simular ID gerado
        created_at: new Date().toISOString(),
      };

      // Salvar no "banco local" (simulação)
      const produtosSalvos = JSON.parse(localStorage.getItem('produtos') || '[]');
      produtosSalvos.push(dadosProduto);
      localStorage.setItem('produtos', JSON.stringify(produtosSalvos));

      // Enviar para n8n
      await enviarParaN8n(dadosProduto);

      toast({
        title: "Produto cadastrado!",
        description: `${formData.nome_produto} foi cadastrado com sucesso`,
      });

      // Reset do formulário
      setFormData({
        nome_produto: '',
        descricao_detalhada: '',
        imagens_urls: '',
        preco_venda: '',
        preco_promocional: '',
        preco_custo: '',
        custo_frete: '',
        fornecedor: '',
        categoria: '',
        estoque_inicial: '',
        estoque_infinito: false,
        sku: '',
        gtin_ean_isbn: '',
        tipo_produto: '',
        peso_g: '',
        altura_cm: '',
        largura_cm: '',
        comprimento_cm: '',
        tags: '',
        local_estoque: 'Sede',
        opcao1_nome: 'Tamanho',
        opcao1_valor: '',
        opcao2_nome: 'Cor',
        opcao2_valor: '',
      });

    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o produto",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const reenviarParaN8n = async () => {
    if (!formData.nome_produto) {
      toast({
        title: "Erro",
        description: "Preencha os dados do produto antes de reenviar",
        variant: "destructive",
      });
      return;
    }

    const sucesso = await enviarParaN8n(formData);
    if (sucesso) {
      toast({
        title: "Reenviado com sucesso",
        description: "Dados reenviados para o webhook n8n",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Cadastrar Produto</h1>
        <p className="text-muted-foreground">
          Adicione um novo produto ao catálogo da Perronifitwear
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="nome_produto">Nome do Produto *</Label>
                    <Input
                      id="nome_produto"
                      value={formData.nome_produto}
                      onChange={(e) => handleInputChange('nome_produto', e.target.value)}
                      placeholder="Ex: Camiseta Fitness Pro"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camisetas">Camisetas</SelectItem>
                        <SelectItem value="leggings">Leggings</SelectItem>
                        <SelectItem value="tops">Tops</SelectItem>
                        <SelectItem value="shorts">Shorts</SelectItem>
                        <SelectItem value="casacos">Casacos</SelectItem>
                        <SelectItem value="acessorios">Acessórios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tipo_produto">Tipo do Produto</Label>
                    <Select value={formData.tipo_produto} onValueChange={(value) => handleInputChange('tipo_produto', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Físico">Físico</SelectItem>
                        <SelectItem value="Digital">Digital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="descricao_detalhada">Descrição Detalhada</Label>
                    <Textarea
                      id="descricao_detalhada"
                      value={formData.descricao_detalhada}
                      onChange={(e) => handleInputChange('descricao_detalhada', e.target.value)}
                      placeholder="Descreva as características, materiais, benefícios..."
                      rows={4}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="imagens_urls">URLs das Imagens</Label>
                    <Input
                      id="imagens_urls"
                      value={formData.imagens_urls}
                      onChange={(e) => handleInputChange('imagens_urls', e.target.value)}
                      placeholder="https://exemplo.com/img1.jpg; https://exemplo.com/img2.jpg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Separe múltiplas URLs com ponto e vírgula (;)</p>
                  </div>

                  <div>
                    <Label htmlFor="fornecedor">Fornecedor</Label>
                    <Input
                      id="fornecedor"
                      value={formData.fornecedor}
                      onChange={(e) => handleInputChange('fornecedor', e.target.value)}
                      placeholder="Nome do fornecedor"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="fitness; yoga; academia; treino"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Separe com ponto e vírgula (;)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preços */}
            <Card>
              <CardHeader>
                <CardTitle>Preços e Custos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="preco_venda">Preço de Venda (R$) *</Label>
                    <Input
                      id="preco_venda"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.preco_venda}
                      onChange={(e) => handleInputChange('preco_venda', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="preco_promocional">Preço Promocional (R$)</Label>
                    <Input
                      id="preco_promocional"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco_promocional}
                      onChange={(e) => handleInputChange('preco_promocional', e.target.value)}
                      placeholder="0.00 (opcional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preco_custo">Preço de Custo (R$) *</Label>
                    <Input
                      id="preco_custo"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.preco_custo}
                      onChange={(e) => handleInputChange('preco_custo', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="custo_frete">Custo de Frete (R$)</Label>
                    <Input
                      id="custo_frete"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.custo_frete}
                      onChange={(e) => handleInputChange('custo_frete', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estoque */}
            <Card>
              <CardHeader>
                <CardTitle>Controle de Estoque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estoque_inicial">Estoque Inicial</Label>
                    <Input
                      id="estoque_inicial"
                      type="number"
                      min="0"
                      value={formData.estoque_inicial}
                      onChange={(e) => handleInputChange('estoque_inicial', e.target.value)}
                      placeholder="0"
                      disabled={formData.estoque_infinito}
                    />
                  </div>

                  <div>
                    <Label htmlFor="local_estoque">Local do Estoque</Label>
                    <Input
                      id="local_estoque"
                      value={formData.local_estoque}
                      onChange={(e) => handleInputChange('local_estoque', e.target.value)}
                      placeholder="Ex: Sede, Filial A"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center space-x-2">
                    <Switch
                      id="estoque_infinito"
                      checked={formData.estoque_infinito}
                      onCheckedChange={(checked) => handleInputChange('estoque_infinito', checked)}
                    />
                    <Label htmlFor="estoque_infinito">Estoque Infinito</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variações e Identificação */}
            <Card>
              <CardHeader>
                <CardTitle>Variações e Identificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="opcao1_nome">Nome da Opção 1</Label>
                    <Input
                      id="opcao1_nome"
                      value={formData.opcao1_nome}
                      onChange={(e) => handleInputChange('opcao1_nome', e.target.value)}
                      placeholder="Ex: Tamanho"
                    />
                  </div>

                  <div>
                    <Label htmlFor="opcao1_valor">Valor da Opção 1</Label>
                    <Input
                      id="opcao1_valor"
                      value={formData.opcao1_valor}
                      onChange={(e) => handleInputChange('opcao1_valor', e.target.value)}
                      placeholder="Ex: M"
                    />
                  </div>

                  <div>
                    <Label htmlFor="opcao2_nome">Nome da Opção 2</Label>
                    <Input
                      id="opcao2_nome"
                      value={formData.opcao2_nome}
                      onChange={(e) => handleInputChange('opcao2_nome', e.target.value)}
                      placeholder="Ex: Cor"
                    />
                  </div>

                  <div>
                    <Label htmlFor="opcao2_valor">Valor da Opção 2</Label>
                    <Input
                      id="opcao2_valor"
                      value={formData.opcao2_valor}
                      onChange={(e) => handleInputChange('opcao2_valor', e.target.value)}
                      placeholder="Ex: Preto"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gtin_ean_isbn">GTIN/EAN/ISBN</Label>
                    <Input
                      id="gtin_ean_isbn"
                      value={formData.gtin_ean_isbn}
                      onChange={(e) => handleInputChange('gtin_ean_isbn', e.target.value)}
                      placeholder="Código de barras"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dimensões */}
            <Card>
              <CardHeader>
                <CardTitle>Dimensões e Peso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="peso_g">Peso (g)</Label>
                    <Input
                      id="peso_g"
                      type="number"
                      min="0"
                      value={formData.peso_g}
                      onChange={(e) => handleInputChange('peso_g', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="altura_cm">Altura (cm)</Label>
                    <Input
                      id="altura_cm"
                      type="number"
                      min="0"
                      value={formData.altura_cm}
                      onChange={(e) => handleInputChange('altura_cm', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="largura_cm">Largura (cm)</Label>
                    <Input
                      id="largura_cm"
                      type="number"
                      min="0"
                      value={formData.largura_cm}
                      onChange={(e) => handleInputChange('largura_cm', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="comprimento_cm">Comprimento (cm)</Label>
                    <Input
                      id="comprimento_cm"
                      type="number"
                      min="0"
                      value={formData.comprimento_cm}
                      onChange={(e) => handleInputChange('comprimento_cm', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Salvando...' : 'Salvar Produto'}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={reenviarParaN8n}
                className="sm:w-auto"
              >
                <Send className="h-4 w-4 mr-2" />
                Reenviar ao n8n
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar com Informações */}
        <div className="space-y-6">
          {/* SKU Gerado */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SKU Gerado</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.sku ? (
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-sm font-mono">
                    {formData.sku}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Gerado automaticamente baseado em: categoria + nome + cor + tamanho
                  </p>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Preencha categoria, nome, cor e tamanho para gerar o SKU automaticamente
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Configuração do Webhook */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Webhook n8n</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook_url">URL do Webhook</Label>
                <Input
                  id="webhook_url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://seu-n8n.com/webhook/produtos"
                />
              </div>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Os dados serão enviados automaticamente para este webhook após salvar o produto.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Resumo dos Preços */}
          {(formData.preco_venda || formData.preco_custo) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.preco_venda && (
                  <div className="flex justify-between">
                    <span className="text-sm">Preço de Venda:</span>
                    <span className="font-medium">R$ {parseFloat(formData.preco_venda || '0').toFixed(2)}</span>
                  </div>
                )}
                
                {formData.preco_promocional && (
                  <div className="flex justify-between">
                    <span className="text-sm">Preço Promocional:</span>
                    <span className="font-medium text-brand-warning">R$ {parseFloat(formData.preco_promocional).toFixed(2)}</span>
                  </div>
                )}
                
                {formData.preco_custo && (
                  <div className="flex justify-between">
                    <span className="text-sm">Preço de Custo:</span>
                    <span className="font-medium">R$ {parseFloat(formData.preco_custo || '0').toFixed(2)}</span>
                  </div>
                )}
                
                {formData.preco_venda && formData.preco_custo && (
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Margem:</span>
                    <span className="font-bold text-brand-success">
                      {(((parseFloat(formData.preco_venda) - parseFloat(formData.preco_custo)) / parseFloat(formData.preco_venda)) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CadastrarProduto;