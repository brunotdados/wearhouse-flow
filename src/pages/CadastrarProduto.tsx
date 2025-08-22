// components/CadastrarProduto.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Trash2, Save, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ProdutoForm {
  nome_produto: string;
  descricao_detalhada: string;
  preco_venda: string;
  categoria: string;
}

export default function CadastrarProduto() {
  const [produto, setProduto] = useState<ProdutoForm>({
    nome_produto: '',
    descricao_detalhada: '',
    preco_venda: '',
    categoria: '',
  });

  const [listaProdutos, setListaProdutos] = useState<ProdutoForm[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('https://n8n.perronifitwear.cloud/webhook/produtos');

  const handleChange = (field: keyof ProdutoForm, value: string) => {
    setProduto(prev => ({ ...prev, [field]: value }));
  };

  const adicionarProduto = () => {
    if (!produto.nome_produto || !produto.preco_venda) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome do produto e preço de venda são obrigatórios',
        variant: 'destructive',
      });
      return;
    }
    setListaProdutos(prev => [...prev, produto]);
    setProduto({ nome_produto: '', descricao_detalhada: '', preco_venda: '', categoria: '' });
  };

  const removerProduto = (index: number) => {
    setListaProdutos(prev => prev.filter((_, i) => i !== index));
  };

  const enviarParaN8n = async () => {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtos: listaProdutos }),
      });
      if (response.ok) {
        toast({ title: 'Enviado!', description: 'Produtos enviados para o n8n com sucesso.' });
        setListaProdutos([]);
      } else {
        throw new Error('Erro na resposta');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao enviar',
        description: 'Falha ao conectar com o webhook do n8n.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome do Produto</Label>
            <Input value={produto.nome_produto} onChange={e => handleChange('nome_produto', e.target.value)} />
          </div>
          <div>
            <Label>Preço de Venda</Label>
            <Input type="number" value={produto.preco_venda} onChange={e => handleChange('preco_venda', e.target.value)} />
          </div>
          <div>
            <Label>Categoria</Label>
            <Input value={produto.categoria} onChange={e => handleChange('categoria', e.target.value)} />
          </div>
          <div>
            <Label>Descrição Detalhada</Label>
            <Textarea value={produto.descricao_detalhada} onChange={e => handleChange('descricao_detalhada', e.target.value)} />
          </div>
          <Button type="button" onClick={adicionarProduto}>
            <Save className="w-4 h-4 mr-2" /> Adicionar à Lista
          </Button>
        </CardContent>
      </Card>

      {listaProdutos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Produtos na Lista ({listaProdutos.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {listaProdutos.map((p, i) => (
              <div key={i} className="flex justify-between items-center border p-2 rounded">
                <div>
                  <strong>{p.nome_produto}</strong> - R$ {p.preco_venda}
                </div>
                <Button size="icon" variant="ghost" onClick={() => removerProduto(i)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button className="mt-4" onClick={enviarParaN8n}>
              <Send className="w-4 h-4 mr-2" /> Enviar produtos para o n8n
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
