// Este é o novo componente CadastrarProduto atualizado
// Agora permite cadastrar vários produtos em lote e enviá-los de uma vez para o n8n

// Devido ao tamanho e manutenção, manteremos a estrutura base original
// e focamos nas modificações relevantes para permitir o "modo em lote".

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
import { Save, Send, Upload, X, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Interface do produto
interface ProdutoForm {
  nome_produto: string;
  descricao_detalhada: string;
  imagens_urls: string;
  imagens_files: File[];
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
    nome_produto: '', descricao_detalhada: '', imagens_urls: '', imagens_files: [], preco_venda: '', preco_promocional: '', preco_custo: '', custo_frete: '', fornecedor: '', categoria: '', estoque_inicial: '', estoque_infinito: false, sku: '', gtin_ean_isbn: '', tipo_produto: '', peso_g: '', altura_cm: '', largura_cm: '', comprimento_cm: '', tags: '', local_estoque: 'Sede', opcao1_nome: 'Tamanho', opcao1_valor: '', opcao2_nome: 'Cor', opcao2_valor: '',
  });

  const [produtosTemp, setProdutosTemp] = useState<ProdutoForm[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('https://n8n.perronifitwear.cloud/webhook/produtos');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formData.categoria && formData.nome_produto && formData.opcao2_valor && formData.opcao1_valor) {
      const gerarSku = `${formData.categoria}-${formData.nome_produto}-${formData.opcao2_valor}-${formData.opcao1_valor}`.toLowerCase().replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, sku: gerarSku }));
    }
  }, [formData.categoria, formData.nome_produto, formData.opcao2_valor, formData.opcao1_valor]);

  const handleInputChange = (field: keyof ProdutoForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetarFormulario = () => {
    setFormData({
      nome_produto: '', descricao_detalhada: '', imagens_urls: '', imagens_files: [], preco_venda: '', preco_promocional: '', preco_custo: '', custo_frete: '', fornecedor: '', categoria: '', estoque_inicial: '', estoque_infinito: false, sku: '', gtin_ean_isbn: '', tipo_produto: '', peso_g: '', altura_cm: '', largura_cm: '', comprimento_cm: '', tags: '', local_estoque: 'Sede', opcao1_nome: 'Tamanho', opcao1_valor: '', opcao2_nome: 'Cor', opcao2_valor: '',
    });
  };

  const validateForm = () => {
    if (!formData.nome_produto.trim() || parseFloat(formData.preco_venda) <= 0 || parseFloat(formData.preco_custo) <= 0) {
      toast({ title: 'Erro de validação', description: 'Preencha os campos obrigatórios corretamente.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProdutosTemp(prev => [...prev, formData]);
    toast({ title: 'Produto adicionado à fila', description: `${formData.nome_produto} está na lista para envio` });
    resetarFormulario();
  };

  const enviarTodosParaN8n = async () => {
    if (produtosTemp.length === 0) {
      toast({ title: 'Nada para enviar', description: 'Nenhum produto na fila.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtos: produtosTemp, timestamp: new Date().toISOString(), source: 'perronifitwear-system' }),
      });
      setProdutosTemp([]);
      toast({ title: 'Sucesso', description: 'Produtos enviados com sucesso!' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Falha no envio para o webhook', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... repita aqui os cards com os inputs do produto (como já estava no seu código) */}

        <Button type="submit" className="w-full">Adicionar à Lista</Button>
      </form>

      <Button 
        onClick={enviarTodosParaN8n} 
        disabled={produtosTemp.length === 0 || isLoading} 
        className="w-full bg-green-600 hover:bg-green-700 text-white">
        {isLoading ? 'Enviando...' : `Enviar ${produtosTemp.length} produto(s) para o n8n`}
      </Button>

      {produtosTemp.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fila de Produtos ({produtosTemp.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {produtosTemp.map((p, i) => (
              <div key={i} className="text-sm py-1 border-b">{i + 1}. {p.nome_produto} ({p.opcao1_valor} - {p.opcao2_valor})</div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CadastrarProduto;
