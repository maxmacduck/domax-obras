import React, { useState, useEffect } from 'react';
import { Camera, FileText, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, Calendar, Upload, Download, Plus, Trash2, Edit2, X, RefreshCw } from 'lucide-react';

const DashboardObra = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCusto, setEditingCusto] = useState(null);
  const [editingEtapa, setEditingEtapa] = useState(null);
  const [editandoConfig, setEditandoConfig] = useState(false);
  
  // Estados de configuração do projeto
  const [nomeProjeto, setNomeProjeto] = useState('');
  const [tempNomeProjeto, setTempNomeProjeto] = useState('');
  const [tempOrcamento, setTempOrcamento] = useState('');
  
  // Estados do formulário de custo
  const [formData, setFormData] = useState({
    categoria: 'Material',
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    status: 'pendente',
    temDocumento: false,
    tipoDocumento: '',
    documento: null
  });

  // Estados do formulário de etapa
  const [formEtapa, setFormEtapa] = useState({
    nome: '',
    progresso: 0,
    inicio: new Date().toISOString().split('T')[0],
    fim: new Date().toISOString().split('T')[0],
    status: 'pendente'
  });

  // Estados do formulário de documento
  const [formDocumento, setFormDocumento] = useState({
    tipo: 'Projeto',
    nome: '',
    arquivo: null
  });

  // Dados iniciais padrão
  const dadosIniciais = {
    nomeProjeto: 'Reforma Residencial - Apt 102',
    orcamentoTotal: 50000,
    custos: [
      { id: 1, categoria: 'Material', descricao: 'Cimento e areia', valor: 2500, data: '2024-02-01', status: 'pago', temDocumento: true, tipoDocumento: 'NF', documento: null },
      { id: 2, categoria: 'Mão de obra', descricao: 'Pedreiro - Semana 1', valor: 1800, data: '2024-02-05', status: 'pago', temDocumento: true, tipoDocumento: 'Recibo', documento: null },
      { id: 3, categoria: 'Material', descricao: 'Revestimento cerâmico', valor: 4200, data: '2024-02-10', status: 'pendente', temDocumento: false, tipoDocumento: '', documento: null },
      { id: 4, categoria: 'Mão de obra', descricao: 'Eletricista', valor: 1500, data: '2024-02-12', status: 'aprovado', temDocumento: false, tipoDocumento: '', documento: null },
      { id: 5, categoria: 'Equipamento', descricao: 'Aluguel betoneira', valor: 600, data: '2024-02-08', status: 'pago', temDocumento: true, tipoDocumento: 'NF', documento: null },
      { id: 6, categoria: 'Energia', descricao: 'Conta de luz - Fev/24', valor: 450, data: '2024-02-15', status: 'pago', temDocumento: true, tipoDocumento: 'Conta', documento: null },
      { id: 7, categoria: 'Condomínio', descricao: 'Condomínio - Fev/24', valor: 650, data: '2024-02-05', status: 'pago', temDocumento: true, tipoDocumento: 'Boleto', documento: null },
      { id: 8, categoria: 'IPTU', descricao: 'IPTU - 1ª parcela 2024', valor: 380, data: '2024-02-10', status: 'pago', temDocumento: true, tipoDocumento: 'Guia', documento: null }
    ],
    documentos: [
      { id: 1, tipo: 'Projeto', nome: 'Projeto Arquitetônico.pdf', data: '2024-01-15', tamanho: '2.4 MB' },
      { id: 2, tipo: 'Contrato', nome: 'Contrato Empreiteira.pdf', data: '2024-01-20', tamanho: '856 KB' },
      { id: 3, tipo: 'Orçamento', nome: 'Orçamento Materiais.xlsx', data: '2024-01-25', tamanho: '124 KB' },
      { id: 4, tipo: 'Licença', nome: 'Alvará de Reforma.pdf', data: '2024-01-18', tamanho: '1.2 MB' },
      { id: 5, tipo: 'Foto', nome: 'Estado Inicial - Cozinha.jpg', data: '2024-02-01', tamanho: '3.8 MB' }
    ],
    etapas: [
      { id: 1, nome: 'Demolição', progresso: 100, inicio: '2024-02-01', fim: '2024-02-05', status: 'concluido' },
      { id: 2, nome: 'Infraestrutura elétrica', progresso: 80, inicio: '2024-02-06', fim: '2024-02-15', status: 'em_andamento' },
      { id: 3, nome: 'Hidráulica', progresso: 60, inicio: '2024-02-08', fim: '2024-02-18', status: 'em_andamento' },
      { id: 4, nome: 'Alvenaria', progresso: 30, inicio: '2024-02-10', fim: '2024-02-25', status: 'em_andamento' },
      { id: 5, nome: 'Revestimento', progresso: 0, inicio: '2024-02-20', fim: '2024-03-05', status: 'pendente' },
      { id: 6, nome: 'Pintura', progresso: 0, inicio: '2024-03-01', fim: '2024-03-10', status: 'pendente' }
    ],
    orcamentoTotal: 50000
  };

  // Estados para dados
  const [custos, setCustos] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [orcamentoTotal, setOrcamentoTotal] = useState(50000);

  // Carregar dados do storage ao iniciar
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar configurações do projeto
      const resultNome = await window.storage.get('obra-nome-projeto');
      const resultOrcamento = await window.storage.get('obra-orcamento');
      
      if (resultNome && resultNome.value) {
        setNomeProjeto(JSON.parse(resultNome.value));
      } else {
        setNomeProjeto(dadosIniciais.nomeProjeto);
        await window.storage.set('obra-nome-projeto', JSON.stringify(dadosIniciais.nomeProjeto));
      }

      if (resultOrcamento && resultOrcamento.value) {
        setOrcamentoTotal(JSON.parse(resultOrcamento.value));
      } else {
        setOrcamentoTotal(dadosIniciais.orcamentoTotal);
        await window.storage.set('obra-orcamento', JSON.stringify(dadosIniciais.orcamentoTotal));
      }
      
      // Tentar carregar dados salvos
      const resultCustos = await window.storage.get('obra-custos');
      const resultDocs = await window.storage.get('obra-documentos');
      const resultEtapas = await window.storage.get('obra-etapas');

      // Se não existir dados, usar dados iniciais
      if (resultCustos && resultCustos.value) {
        setCustos(JSON.parse(resultCustos.value));
      } else {
        setCustos(dadosIniciais.custos);
        await salvarCustos(dadosIniciais.custos);
      }

      if (resultDocs && resultDocs.value) {
        setDocumentos(JSON.parse(resultDocs.value));
      } else {
        setDocumentos(dadosIniciais.documentos);
        await salvarDocumentos(dadosIniciais.documentos);
      }

      if (resultEtapas && resultEtapas.value) {
        setEtapas(JSON.parse(resultEtapas.value));
      } else {
        setEtapas(dadosIniciais.etapas);
        await salvarEtapas(dadosIniciais.etapas);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Em caso de erro, usar dados iniciais
      setNomeProjeto(dadosIniciais.nomeProjeto);
      setOrcamentoTotal(dadosIniciais.orcamentoTotal);
      setCustos(dadosIniciais.custos);
      setDocumentos(dadosIniciais.documentos);
      setEtapas(dadosIniciais.etapas);
    } finally {
      setLoading(false);
    }
  };

  const salvarCustos = async (novosCustos) => {
    try {
      setSaving(true);
      await window.storage.set('obra-custos', JSON.stringify(novosCustos));
    } catch (error) {
      console.error('Erro ao salvar custos:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const salvarDocumentos = async (novosDocs) => {
    try {
      setSaving(true);
      await window.storage.set('obra-documentos', JSON.stringify(novosDocs));
    } catch (error) {
      console.error('Erro ao salvar documentos:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const salvarEtapas = async (novasEtapas) => {
    try {
      setSaving(true);
      await window.storage.set('obra-etapas', JSON.stringify(novasEtapas));
    } catch (error) {
      console.error('Erro ao salvar etapas:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // Funções para atualizar dados
  const atualizarStatusCusto = async (id, novoStatus) => {
    const novosCustos = custos.map(c => 
      c.id === id ? { ...c, status: novoStatus } : c
    );
    setCustos(novosCustos);
    await salvarCustos(novosCustos);
  };

  const removerCusto = async (id) => {
    if (confirm('Tem certeza que deseja remover este custo?')) {
      const novosCustos = custos.filter(c => c.id !== id);
      setCustos(novosCustos);
      await salvarCustos(novosCustos);
    }
  };

  const abrirModalAdicionar = () => {
    setEditingCusto(null);
    setFormData({
      categoria: 'Material',
      descricao: '',
      valor: '',
      data: new Date().toISOString().split('T')[0],
      status: 'pendente',
      temDocumento: false,
      tipoDocumento: '',
      documento: null
    });
    setModalType('custo');
    setShowAddModal(true);
  };

  const abrirModalEditar = (custo) => {
    setEditingCusto(custo);
    setFormData({
      categoria: custo.categoria,
      descricao: custo.descricao,
      valor: custo.valor,
      data: custo.data,
      status: custo.status,
      temDocumento: custo.temDocumento,
      tipoDocumento: custo.tipoDocumento || '',
      documento: custo.documento
    });
    setModalType('custo');
    setShowAddModal(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          documento: {
            nome: file.name,
            tipo: file.type,
            tamanho: file.size,
            dados: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const salvarCusto = async () => {
    if (!formData.descricao || !formData.valor) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    let novosCustos;
    
    if (editingCusto) {
      // Editando custo existente
      novosCustos = custos.map(c => 
        c.id === editingCusto.id 
          ? { ...editingCusto, ...formData, valor: parseFloat(formData.valor) }
          : c
      );
    } else {
      // Adicionando novo custo
      const novoCusto = {
        id: Math.max(...custos.map(c => c.id), 0) + 1,
        ...formData,
        valor: parseFloat(formData.valor)
      };
      novosCustos = [...custos, novoCusto];
    }

    setCustos(novosCustos);
    await salvarCustos(novosCustos);
    setShowAddModal(false);
    setEditingCusto(null);
  };

  const gerarRelatorio = () => {
    const custosObra = custos.filter(c => ['Material', 'Mão de obra', 'Equipamento'].includes(c.categoria));
    const custosManutencao = custos.filter(c => ['Energia', 'Condomínio', 'IPTU'].includes(c.categoria));
    
    const totalMaterial = custos.filter(c => c.categoria === 'Material').reduce((sum, c) => sum + c.valor, 0);
    const totalMaoObra = custos.filter(c => c.categoria === 'Mão de obra').reduce((sum, c) => sum + c.valor, 0);
    const totalEquipamento = custos.filter(c => c.categoria === 'Equipamento').reduce((sum, c) => sum + c.valor, 0);
    const totalManutencao = custosManutencao.reduce((sum, c) => sum + c.valor, 0);
    const totalGeral = custos.reduce((sum, c) => sum + c.valor, 0);
    
    const documentosFaltando = custos.filter(c => !c.temDocumento);
    
    const relatorio = `
═══════════════════════════════════════════════════════════
         RELATÓRIO DE CUSTOS DA OBRA - ${new Date().toLocaleDateString('pt-BR')}
═══════════════════════════════════════════════════════════

📊 CUSTOS DE OBRA
──────────────────────────────────────────────────────────
Material:              ${formatCurrency(totalMaterial)}
Mão de obra:           ${formatCurrency(totalMaoObra)}
Equipamento:           ${formatCurrency(totalEquipamento)}
──────────────────────────────────────────────────────────
Subtotal Obra:         ${formatCurrency(totalMaterial + totalMaoObra + totalEquipamento)}

💰 CUSTOS DE MANUTENÇÃO
──────────────────────────────────────────────────────────
${custosManutencao.map(c => `${c.categoria.padEnd(20)} ${formatCurrency(c.valor)}`).join('\n')}
──────────────────────────────────────────────────────────
Subtotal Manutenção:   ${formatCurrency(totalManutencao)}

═══════════════════════════════════════════════════════════
TOTAL GERAL:           ${formatCurrency(totalGeral)}
═══════════════════════════════════════════════════════════

📄 DOCUMENTAÇÃO
──────────────────────────────────────────────────────────
Total de custos:       ${custos.length}
Documentos anexados:   ${custos.filter(c => c.temDocumento).length}
Documentos faltando:   ${documentosFaltando.length}

${documentosFaltando.length > 0 ? `
⚠️  DOCUMENTOS PENDENTES:
${documentosFaltando.map(c => `   • ${c.descricao} - ${formatCurrency(c.valor)} (${c.categoria})`).join('\n')}
` : '✅ Toda documentação está completa!'}

═══════════════════════════════════════════════════════════
Gerado em: ${new Date().toLocaleString('pt-BR')}
═══════════════════════════════════════════════════════════
    `.trim();

    // Criar e baixar arquivo
    const blob = new Blob([relatorio], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_Obra_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const atualizarProgressoEtapa = async (id, novoProgresso) => {
    const novasEtapas = etapas.map(e => {
      if (e.id === id) {
        let novoStatus = e.status;
        if (novoProgresso === 100) novoStatus = 'concluido';
        else if (novoProgresso > 0) novoStatus = 'em_andamento';
        else novoStatus = 'pendente';
        
        return { ...e, progresso: novoProgresso, status: novoStatus };
      }
      return e;
    });
    setEtapas(novasEtapas);
    await salvarEtapas(novasEtapas);
  };

  const resetarDados = async () => {
    if (confirm('Tem certeza que deseja resetar todos os dados para o padrão inicial?')) {
      setNomeProjeto(dadosIniciais.nomeProjeto);
      setOrcamentoTotal(dadosIniciais.orcamentoTotal);
      setCustos(dadosIniciais.custos);
      setDocumentos(dadosIniciais.documentos);
      setEtapas(dadosIniciais.etapas);
      
      await window.storage.set('obra-nome-projeto', JSON.stringify(dadosIniciais.nomeProjeto));
      await window.storage.set('obra-orcamento', JSON.stringify(dadosIniciais.orcamentoTotal));
      await salvarCustos(dadosIniciais.custos);
      await salvarDocumentos(dadosIniciais.documentos);
      await salvarEtapas(dadosIniciais.etapas);
      
      alert('Dados resetados com sucesso!');
    }
  };

  // Funções de configuração do projeto
  const abrirEdicaoConfig = () => {
    setTempNomeProjeto(nomeProjeto);
    setTempOrcamento(orcamentoTotal.toString());
    setEditandoConfig(true);
  };

  const salvarConfiguracoes = async () => {
    if (!tempNomeProjeto.trim()) {
      alert('O nome do projeto não pode estar vazio!');
      return;
    }
    
    const novoOrcamento = parseFloat(tempOrcamento);
    if (isNaN(novoOrcamento) || novoOrcamento <= 0) {
      alert('Digite um orçamento válido!');
      return;
    }

    try {
      setSaving(true);
      setNomeProjeto(tempNomeProjeto);
      setOrcamentoTotal(novoOrcamento);
      
      await window.storage.set('obra-nome-projeto', JSON.stringify(tempNomeProjeto));
      await window.storage.set('obra-orcamento', JSON.stringify(novoOrcamento));
      
      setEditandoConfig(false);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // Funções de etapas
  const abrirModalAdicionarEtapa = () => {
    setEditingEtapa(null);
    setFormEtapa({
      nome: '',
      progresso: 0,
      inicio: new Date().toISOString().split('T')[0],
      fim: new Date().toISOString().split('T')[0],
      status: 'pendente'
    });
    setModalType('etapa');
    setShowAddModal(true);
  };

  const abrirModalEditarEtapa = (etapa) => {
    setEditingEtapa(etapa);
    setFormEtapa({
      nome: etapa.nome,
      progresso: etapa.progresso,
      inicio: etapa.inicio,
      fim: etapa.fim,
      status: etapa.status
    });
    setModalType('etapa');
    setShowAddModal(true);
  };

  const salvarEtapa = async () => {
    if (!formEtapa.nome.trim()) {
      alert('Digite o nome da etapa!');
      return;
    }

    let novasEtapas;
    
    if (editingEtapa) {
      novasEtapas = etapas.map(e => 
        e.id === editingEtapa.id 
          ? { ...editingEtapa, ...formEtapa }
          : e
      );
    } else {
      const novaEtapa = {
        id: Math.max(...etapas.map(e => e.id), 0) + 1,
        ...formEtapa
      };
      novasEtapas = [...etapas, novaEtapa];
    }

    setEtapas(novasEtapas);
    await salvarEtapas(novasEtapas);
    setShowAddModal(false);
    setEditingEtapa(null);
  };

  const removerEtapa = async (id) => {
    if (confirm('Tem certeza que deseja remover esta etapa?')) {
      const novasEtapas = etapas.filter(e => e.id !== id);
      setEtapas(novasEtapas);
      await salvarEtapas(novasEtapas);
    }
  };

  // Funções de documentos
  const abrirModalAdicionarDocumento = () => {
    setFormDocumento({
      tipo: 'Projeto',
      nome: '',
      arquivo: null
    });
    setModalType('documento');
    setShowAddModal(true);
  };

  const handleDocumentoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande! Tamanho máximo: 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormDocumento(prev => ({
          ...prev,
          arquivo: {
            nome: file.name,
            tipo: file.type,
            tamanho: file.size,
            dados: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const salvarDocumento = async () => {
    if (!formDocumento.arquivo) {
      alert('Selecione um arquivo!');
      return;
    }

    const novoDoc = {
      id: Math.max(...documentos.map(d => d.id), 0) + 1,
      tipo: formDocumento.tipo,
      nome: formDocumento.arquivo.nome,
      data: new Date().toISOString().split('T')[0],
      tamanho: (formDocumento.arquivo.tamanho / 1024).toFixed(0) + ' KB',
      arquivo: formDocumento.arquivo
    };

    const novosDocs = [...documentos, novoDoc];
    setDocumentos(novosDocs);
    await salvarDocumentos(novosDocs);
    setShowAddModal(false);
  };

  const visualizarDocumento = (doc) => {
    if (doc.arquivo && doc.arquivo.dados) {
      window.open(doc.arquivo.dados, '_blank');
    } else {
      alert('Este documento não tem arquivo anexado.');
    }
  };

  const downloadDocumento = (doc) => {
    if (doc.arquivo && doc.arquivo.dados) {
      const link = document.createElement('a');
      link.href = doc.arquivo.dados;
      link.download = doc.nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Este documento não tem arquivo anexado.');
    }
  };

  const removerDocumento = async (id) => {
    if (confirm('Tem certeza que deseja remover este documento?')) {
      const novosDocs = documentos.filter(d => d.id !== id);
      setDocumentos(novosDocs);
      await salvarDocumentos(novosDocs);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600">Carregando dados da obra...</p>
        </div>
      </div>
    );
  }

  // Cálculos
  const custosObra = custos.filter(c => ['Material', 'Mão de obra', 'Equipamento'].includes(c.categoria));
  const custosManutencao = custos.filter(c => ['Energia', 'Condomínio', 'IPTU'].includes(c.categoria));
  
  const totalGasto = custos.filter(c => c.status === 'pago').reduce((sum, c) => sum + c.valor, 0);
  const totalPendente = custos.filter(c => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);
  const totalAprovado = custos.filter(c => c.status === 'aprovado').reduce((sum, c) => sum + c.valor, 0);
  const saldoDisponivel = orcamentoTotal - totalGasto - totalAprovado;
  const percentualGasto = ((totalGasto + totalAprovado) / orcamentoTotal * 100).toFixed(1);

  const totalObra = custosObra.reduce((sum, c) => sum + c.valor, 0);
  const totalManutencao = custosManutencao.reduce((sum, c) => sum + c.valor, 0);
  const documentosFaltando = custos.filter(c => !c.temDocumento).length;

  const progressoGeral = (etapas.reduce((sum, e) => sum + e.progresso, 0) / etapas.length).toFixed(0);

  const StatusBadge = ({ status }) => {
    const configs = {
      pago: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pago' },
      pendente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
      aprovado: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Aprovado' },
      concluido: { bg: 'bg-green-100', text: 'text-green-800', label: 'Concluído' },
      em_andamento: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Em Andamento' }
    };
    const config = configs[status] || configs.pendente;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Indicador de salvamento */}
        {saving && (
          <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <RefreshCw className="animate-spin" size={16} />
            Salvando...
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">DoMAX Obras</h1>
              {editandoConfig ? (
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={tempNomeProjeto}
                      onChange={(e) => setTempNomeProjeto(e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome do projeto"
                    />
                  </div>
                  <div className="w-48">
                    <input
                      type="number"
                      value={tempOrcamento}
                      onChange={(e) => setTempOrcamento(e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Orçamento"
                    />
                  </div>
                  <button
                    onClick={salvarConfiguracoes}
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => setEditandoConfig(false)}
                    className="px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-gray-600">{nomeProjeto}</p>
                  <button
                    onClick={abrirEdicaoConfig}
                    className="text-gray-400 hover:text-blue-600"
                    title="Editar projeto"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
              <p className="text-sm text-green-600 mt-1">✓ Dados sincronizados automaticamente</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={carregarDados}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <RefreshCw size={18} />
                Recarregar
              </button>
              <button 
                onClick={resetarDados}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                <Trash2 size={18} />
                Resetar Dados
              </button>
              <button 
                onClick={gerarRelatorio}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Download size={18} />
                Exportar Relatório
              </button>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="text-blue-600" size={24} />
              </div>
              <span className="text-sm text-gray-500">Orçamento</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(orcamentoTotal)}</h3>
            <p className="text-sm text-gray-600 mt-1">Total previsto</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="text-red-600" size={24} />
              </div>
              <span className="text-sm text-gray-500">Gasto</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalGasto)}</h3>
            <p className="text-sm text-gray-600 mt-1">{percentualGasto}% do orçamento</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <span className="text-sm text-gray-500">Progresso</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{progressoGeral}%</h3>
            <p className="text-sm text-gray-600 mt-1">Obra concluída</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${documentosFaltando > 0 ? 'bg-yellow-100' : 'bg-green-100'}`}>
                <FileText className={documentosFaltando > 0 ? 'text-yellow-600' : 'text-green-600'} size={24} />
              </div>
              <span className="text-sm text-gray-500">Documentação</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{custos.length - documentosFaltando}/{custos.length}</h3>
            <p className="text-sm text-gray-600 mt-1">{documentosFaltando > 0 ? `${documentosFaltando} pendente(s)` : 'Completa'}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
                { id: 'custos', label: 'Custos', icon: DollarSign },
                { id: 'cronograma', label: 'Cronograma', icon: Calendar },
                { id: 'documentos', label: 'Documentos', icon: FileText }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Tab: Visão Geral */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Distribuição de Custos */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Distribuição de Custos</h3>
                    <div className="space-y-3">
                      {[
                        { categoria: 'Material', valor: custos.filter(c => c.categoria === 'Material').reduce((s, c) => s + c.valor, 0), cor: 'bg-blue-500' },
                        { categoria: 'Mão de obra', valor: custos.filter(c => c.categoria === 'Mão de obra').reduce((s, c) => s + c.valor, 0), cor: 'bg-green-500' },
                        { categoria: 'Equipamento', valor: custos.filter(c => c.categoria === 'Equipamento').reduce((s, c) => s + c.valor, 0), cor: 'bg-yellow-500' }
                      ].map(item => {
                        const percentual = ((item.valor / (totalGasto + totalAprovado + totalPendente)) * 100).toFixed(1);
                        return (
                          <div key={item.categoria}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{item.categoria}</span>
                              <span className="font-medium">{formatCurrency(item.valor)} ({percentual}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className={`${item.cor} h-2 rounded-full`} style={{ width: `${percentual}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Financeiro */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Status Financeiro</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-gray-700">Orçamento Total</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(orcamentoTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                        <span className="text-gray-700">Total Pago</span>
                        <span className="font-semibold text-red-700">-{formatCurrency(totalGasto)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span className="text-gray-700">Aprovado a Pagar</span>
                        <span className="font-semibold text-blue-700">-{formatCurrency(totalAprovado)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                        <span className="text-gray-700">Pendente Aprovação</span>
                        <span className="font-semibold text-yellow-700">{formatCurrency(totalPendente)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded border-2 border-green-200">
                        <span className="font-medium text-gray-900">Saldo Disponível</span>
                        <span className="font-bold text-green-700">{formatCurrency(saldoDisponivel)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Etapas Recentes */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Etapas em Andamento</h3>
                  <div className="space-y-3">
                    {etapas.filter(e => e.status === 'em_andamento').map(etapa => (
                      <div key={etapa.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{etapa.nome}</h4>
                            <p className="text-sm text-gray-600">{formatDate(etapa.inicio)} - {formatDate(etapa.fim)}</p>
                          </div>
                          <span className="text-lg font-bold text-blue-600">{etapa.progresso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${etapa.progresso}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Custos */}
            {activeTab === 'custos' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Lançamentos de Custos</h3>
                  <button
                    onClick={abrirModalAdicionar}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus size={18} />
                    Adicionar Custo
                  </button>
                </div>
                
                {/* Filtros */}
                <div className="mb-4 flex gap-2 flex-wrap">
                  {['Todos', 'Material', 'Mão de obra', 'Equipamento', 'Energia', 'Condomínio', 'IPTU'].map(cat => (
                    <button
                      key={cat}
                      className="px-3 py-1 rounded-full text-sm border border-gray-300 hover:bg-gray-100"
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Documento</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {custos.map(custo => (
                        <tr key={custo.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{formatDate(custo.data)}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              ['Material', 'Mão de obra', 'Equipamento'].includes(custo.categoria)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {custo.categoria}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{custo.descricao}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{formatCurrency(custo.valor)}</td>
                          <td className="px-4 py-3 text-center">
                            <select 
                              value={custo.status}
                              onChange={(e) => atualizarStatusCusto(custo.id, e.target.value)}
                              className="text-xs px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
                            >
                              <option value="pendente">Pendente</option>
                              <option value="aprovado">Aprovado</option>
                              <option value="pago">Pago</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {custo.temDocumento ? (
                              <div className="flex items-center justify-center gap-1">
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-xs text-gray-600">{custo.tipoDocumento}</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <AlertCircle size={16} className="text-yellow-600" />
                                <span className="text-xs text-gray-600">Pendente</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button 
                              onClick={() => abrirModalEditar(custo)}
                              className="text-gray-600 hover:text-blue-600 mr-2"
                              title="Editar"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => removerCusto(custo.id)}
                              className="text-gray-600 hover:text-red-600"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-sm font-semibold text-gray-900">TOTAL</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                          {formatCurrency(custos.reduce((sum, c) => sum + c.valor, 0))}
                        </td>
                        <td colSpan="3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Resumo por categoria */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Custos de Obra</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-medium">{formatCurrency(custos.filter(c => c.categoria === 'Material').reduce((s, c) => s + c.valor, 0))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mão de obra:</span>
                        <span className="font-medium">{formatCurrency(custos.filter(c => c.categoria === 'Mão de obra').reduce((s, c) => s + c.valor, 0))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Equipamento:</span>
                        <span className="font-medium">{formatCurrency(custos.filter(c => c.categoria === 'Equipamento').reduce((s, c) => s + c.valor, 0))}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Subtotal:</span>
                        <span className="font-bold">{formatCurrency(totalObra)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Custos de Manutenção</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Energia:</span>
                        <span className="font-medium">{formatCurrency(custos.filter(c => c.categoria === 'Energia').reduce((s, c) => s + c.valor, 0))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condomínio:</span>
                        <span className="font-medium">{formatCurrency(custos.filter(c => c.categoria === 'Condomínio').reduce((s, c) => s + c.valor, 0))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IPTU:</span>
                        <span className="font-medium">{formatCurrency(custos.filter(c => c.categoria === 'IPTU').reduce((s, c) => s + c.valor, 0))}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Subtotal:</span>
                        <span className="font-bold">{formatCurrency(totalManutencao)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Cronograma */}
            {activeTab === 'cronograma' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Etapas da Obra</h3>
                  <button
                    onClick={abrirModalAdicionarEtapa}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus size={18} />
                    Adicionar Etapa
                  </button>
                </div>
                <div className="space-y-4">
                  {etapas.map(etapa => (
                    <div key={etapa.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{etapa.nome}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            <Clock size={14} className="inline mr-1" />
                            {formatDate(etapa.inicio)} até {formatDate(etapa.fim)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={etapa.progresso}
                            onChange={(e) => atualizarProgressoEtapa(etapa.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-bold"
                          />
                          <span className="text-sm text-gray-600">%</span>
                          <StatusBadge status={etapa.status} />
                          <button
                            onClick={() => abrirModalEditarEtapa(etapa)}
                            className="text-gray-600 hover:text-blue-600"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => removerEtapa(etapa.id)}
                            className="text-gray-600 hover:text-red-600"
                            title="Remover"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            etapa.status === 'concluido' ? 'bg-green-500' :
                            etapa.status === 'em_andamento' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${etapa.progresso}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Documentos */}
            {activeTab === 'documentos' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Documentos da Obra</h3>
                  <button
                    onClick={abrirModalAdicionarDocumento}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Upload size={18} />
                    Upload Documento
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentos.map(doc => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded">
                          <FileText className="text-blue-600" size={24} />
                        </div>
                        <div className="flex gap-1">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{doc.tipo}</span>
                          <button
                            onClick={() => removerDocumento(doc.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Remover"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2 truncate">{doc.nome}</h4>
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span>{formatDate(doc.data)}</span>
                        <span>{doc.tamanho}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200 flex gap-2">
                        <button 
                          onClick={() => visualizarDocumento(doc)}
                          className="flex-1 text-sm text-blue-600 hover:bg-blue-50 py-2 rounded transition"
                        >
                          Visualizar
                        </button>
                        <button 
                          onClick={() => downloadDocumento(doc)}
                          className="flex-1 text-sm text-gray-600 hover:bg-gray-100 py-2 rounded transition"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Adicionar/Editar Etapa */}
        {showAddModal && modalType === 'etapa' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingEtapa ? 'Editar Etapa' : 'Adicionar Nova Etapa'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Etapa *
                  </label>
                  <input
                    type="text"
                    value={formEtapa.nome}
                    onChange={(e) => setFormEtapa({ ...formEtapa, nome: e.target.value })}
                    placeholder="Ex: Demolição"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Início *
                    </label>
                    <input
                      type="date"
                      value={formEtapa.inicio}
                      onChange={(e) => setFormEtapa({ ...formEtapa, inicio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Fim *
                    </label>
                    <input
                      type="date"
                      value={formEtapa.fim}
                      onChange={(e) => setFormEtapa({ ...formEtapa, fim: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progresso (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formEtapa.progresso}
                    onChange={(e) => setFormEtapa({ ...formEtapa, progresso: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarEtapa}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingEtapa ? 'Salvar Alterações' : 'Adicionar Etapa'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Upload de Documento */}
        {showAddModal && modalType === 'documento' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Upload de Documento</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento *
                  </label>
                  <select
                    value={formDocumento.tipo}
                    onChange={(e) => setFormDocumento({ ...formDocumento, tipo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Projeto">Projeto</option>
                    <option value="Contrato">Contrato</option>
                    <option value="Orçamento">Orçamento</option>
                    <option value="Licença">Licença</option>
                    <option value="Foto">Foto</option>
                    <option value="NF">Nota Fiscal</option>
                    <option value="Recibo">Recibo</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selecionar Arquivo *
                  </label>
                  <input
                    type="file"
                    onChange={handleDocumentoUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos aceitos: PDF, JPG, PNG, DOC, XLS (máx. 5MB)
                  </p>
                  {formDocumento.arquivo && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          📎 {formDocumento.arquivo.nome}
                        </p>
                        <p className="text-xs text-green-600">
                          {(formDocumento.arquivo.tamanho / 1024).toFixed(0)} KB
                        </p>
                      </div>
                      <button
                        onClick={() => setFormDocumento({ ...formDocumento, arquivo: null })}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarDocumento}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Upload Documento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Adicionar/Editar Custo */}
        {showAddModal && modalType === 'custo' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCusto ? 'Editar Custo' : 'Adicionar Novo Custo'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <optgroup label="Custos de Obra">
                      <option value="Material">Material</option>
                      <option value="Mão de obra">Mão de obra</option>
                      <option value="Equipamento">Equipamento</option>
                    </optgroup>
                    <optgroup label="Custos de Manutenção">
                      <option value="Energia">Energia</option>
                      <option value="Condomínio">Condomínio</option>
                      <option value="IPTU">IPTU</option>
                    </optgroup>
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <input
                    type="text"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Ex: Cimento CP-II 50kg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Valor e Data */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.valor}
                      onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                      placeholder="0,00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status de Pagamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status de Pagamento
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="pago">Pago</option>
                  </select>
                </div>

                {/* Documentação */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="temDocumento"
                      checked={formData.temDocumento}
                      onChange={(e) => setFormData({ ...formData, temDocumento: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="temDocumento" className="ml-2 text-sm font-medium text-gray-700">
                      Possui documento anexado
                    </label>
                  </div>

                  {formData.temDocumento && (
                    <div className="space-y-3 ml-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Documento
                        </label>
                        <select
                          value={formData.tipoDocumento}
                          onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione...</option>
                          <option value="NF">Nota Fiscal</option>
                          <option value="Recibo">Recibo</option>
                          <option value="Boleto">Boleto</option>
                          <option value="Conta">Conta</option>
                          <option value="Guia">Guia</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Anexar Arquivo
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Formatos aceitos: PDF, JPG, PNG (máx. 5MB)
                        </p>
                        {formData.documento && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                            <span className="text-sm text-green-800">
                              📎 {formData.documento.nome}
                            </span>
                            <button
                              onClick={() => setFormData({ ...formData, documento: null })}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarCusto}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingCusto ? 'Salvar Alterações' : 'Adicionar Custo'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Simples para outras funcionalidades */}
        {showAddModal && modalType !== 'custo' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalType === 'etapa' && 'Adicionar Etapa'}
                  {modalType === 'documento' && 'Upload Documento'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Funcionalidade em desenvolvimento. Este é um exemplo de interface.
              </p>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardObra;