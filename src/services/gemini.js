// Serviço para integração com Google Gemini API
// API Documentation: https://ai.google.dev/gemini-api/docs

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Cache simples para economizar requisições
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Função principal para chamar a API do Gemini
 * @param {string} prompt - Texto do prompt para a IA
 * @param {boolean} useCache - Se deve usar cache (padrão: true)
 * @returns {Promise<string>} - Resposta da IA
 */
export async function callGemini(prompt, useCache = true) {
    // Verificar se há chave de API
    if (!GEMINI_API_KEY) {
        throw new Error('Chave de API do Gemini não configurada. Adicione VITE_GEMINI_API_KEY no arquivo .env.local');
    }

    // Verificar cache
    const cacheKey = prompt;
    if (useCache && cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log('✅ Resposta recuperada do cache');
            return cached.response;
        }
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8192,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro na API: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates[0]?.content?.parts[0]?.text;

        if (!text) {
            throw new Error('Resposta vazia da API');
        }

        // Salvar no cache
        if (useCache) {
            cache.set(cacheKey, {
                response: text,
                timestamp: Date.now()
            });
        }

        return text;
    } catch (error) {
        console.error('❌ Erro ao chamar Gemini API:', error);
        throw error;
    }
}

/**
 * Sugere materiais baseado no tipo de obra e área
 * @param {string} tipoObra - Tipo de obra (ex: "reforma de cozinha")
 * @param {number} area - Área em m² (opcional)
 * @returns {Promise<Array>} - Lista de materiais sugeridos
 */
export async function sugerirMateriais(tipoObra, area = null) {
    const areaText = area ? ` de ${area}m²` : '';
    const prompt = `Você é um especialista em construção civil brasileira. Liste os materiais principais necessários para: ${tipoObra}${areaText}.

Formato de resposta (uma linha por item):
- Nome do material | Quantidade estimada | Faixa de preço em R$

Seja objetivo, liste apenas 5-8 itens principais. Use preços realistas do mercado brasileiro.`;

    try {
        const response = await callGemini(prompt);

        // Parse da resposta em formato estruturado
        const lines = response.split('\n').filter(line => line.trim().startsWith('-'));
        const materiais = lines.map(line => {
            const parts = line.replace(/^-\s*/, '').split('|').map(p => p.trim());
            return {
                nome: parts[0] || '',
                quantidade: parts[1] || '',
                preco: parts[2] || ''
            };
        });

        return materiais;
    } catch (error) {
        console.error('Erro ao sugerir materiais:', error);
        return [];
    }
}

/**
 * Analisa custos e identifica problemas/oportunidades
 * @param {Array} custos - Lista de custos do projeto
 * @param {number} orcamento - Orçamento total do projeto
 * @returns {Promise<Object>} - Análise detalhada
 */
export async function analisarCustos(custos, orcamento) {
    const totalGasto = custos.filter(c => c.status === 'pago').reduce((sum, c) => sum + c.valor, 0);
    const totalPendente = custos.filter(c => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);

    const custosTexto = custos.map(c =>
        `${c.categoria}: ${c.descricao} - R$ ${c.valor.toFixed(2)} (${c.status})`
    ).join('\n');

    const prompt = `Você é um consultor financeiro de obras. Analise este orçamento:

ORÇAMENTO TOTAL: R$ ${orcamento.toFixed(2)}
GASTO ATÉ AGORA: R$ ${totalGasto.toFixed(2)}
PENDENTE: R$ ${totalPendente.toFixed(2)}

CUSTOS:
${custosTexto}

Forneça uma análise com:
1. ALERTAS: Identifique custos suspeitos (muito altos ou baixos)
2. OPORTUNIDADES: Onde é possível economizar
3. RECOMENDAÇÕES: 2-3 sugestões práticas

Seja objetivo e use valores específicos. Limite a resposta a 200 palavras.`;

    try {
        const response = await callGemini(prompt, false); // Não usar cache para análises
        return {
            analise: response,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Erro ao analisar custos:', error);
        return {
            analise: 'Não foi possível realizar a análise. Tente novamente.',
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Gera descrição automática para um item
 * @param {string} categoria - Categoria do item
 * @param {string} contexto - Contexto adicional (opcional)
 * @returns {Promise<string>} - Descrição gerada
 */
export async function gerarDescricaoItem(categoria, contexto = '') {
    const prompt = `Sugira UMA descrição curta (máximo 5 palavras) para um item da categoria "${categoria}" em uma obra${contexto ? `: ${contexto}` : ''}. Responda apenas a descrição, sem explicações.`;

    try {
        const response = await callGemini(prompt, false);
        return response.trim().replace(/['"]/g, ''); // Remove aspas
    } catch (error) {
        console.error('Erro ao gerar descrição:', error);
        return '';
    }
}

/**
 * Chat com a IA sobre construção com contexto do projeto
 * @param {string} pergunta - Pergunta do usuário
 * @param {Array} historico - Histórico de mensagens
 * @param {Object} dadosProjeto - Dados atuais do projeto (orçamento, custos, etapas)
 * @returns {Promise<string>} - Resposta da IA
 */
export async function chatConstrucao(pergunta, historico = [], dadosProjeto = null) {
    let contextoSistema = `Você é um assistente especializado em gerenciamento de obras e construção civil no Brasil.
Seu nome é "Assistente DoMAX".
Responda de forma clara, prática e objetiva. Use formatação Markdown (negrito, listas) para facilitar a leitura.`;

    // Adicionar contexto do projeto se disponível
    if (dadosProjeto) {
        const { orcamentoTotal, custos, etapas, nomeProjeto } = dadosProjeto;

        // Calcular totais
        const totalGasto = custos.filter(c => c.status === 'pago').reduce((sum, c) => sum + c.valor, 0);
        const totalPendente = custos.filter(c => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);
        const saldo = orcamentoTotal - totalGasto;

        // Resumo de custos por categoria
        const porCategoria = custos.reduce((acc, c) => {
            acc[c.categoria] = (acc[c.categoria] || 0) + c.valor;
            return acc;
        }, {});

        const resumoCustos = Object.entries(porCategoria)
            .map(([cat, val]) => `- ${cat}: R$ ${val.toFixed(2)}`)
            .join('\n');

        // Resumo de etapas
        const etapasTexto = etapas.map(e => `- ${e.nome}: ${e.status} (${e.progresso}%)`).join('\n');

        contextoSistema += `

DADOS ATUAIS DO PROJETO "${nomeProjeto}":
- Orçamento Total: R$ ${orcamentoTotal.toFixed(2)}
- Total Gasto (Pago): R$ ${totalGasto.toFixed(2)}
- Total Pendente: R$ ${totalPendente.toFixed(2)}
- Saldo Disponível: R$ ${saldo.toFixed(2)}

GASTOS POR CATEGORIA (Inclui pendentes):
${resumoCustos}

ETAPAS DA OBRA:
${etapasTexto}

Use estes dados para responder perguntas sobre o projeto específico. Se o usuário perguntar "quanto gastei?", use o valor de Total Gasto.`;
    }

    const contextoHistorico = historico.length > 0
        ? `\n\nCONTEXTO DA CONVERSA:\n${historico.map(m => `${m.role}: ${m.content}`).join('\n')}\n`
        : '';

    const prompt = `${contextoSistema}${contextoHistorico}

PERGUNTA DO USUÁRIO: ${pergunta}

Responda com base nos dados do projeto (se aplicável) e seu conhecimento de construção.`;

    try {
        const response = await callGemini(prompt, false);
        return response;
    } catch (error) {
        console.error('Erro no chat:', error);
        throw error;
    }
}

/**
 * Limpa o cache (útil para testes)
 */
export function limparCache() {
    cache.clear();
    console.log('🗑️ Cache limpo');
}
