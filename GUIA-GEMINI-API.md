# 🤖 Configuração da API do Google Gemini

## Passo 1: Obter a Chave de API (GRATUITO)

1. **Acesse**: https://makersuite.google.com/app/apikey
2. **Faça login** com sua conta Google
3. Clique em **"Create API Key"** ou **"Get API Key"**
4. Copie a chave gerada (formato: `AIza...`)

> [!IMPORTANT]
> **Tier Gratuito**: 15 requisições/minuto e 1500/dia - suficiente para desenvolvimento!

## Passo 2: Configurar no Projeto

1. Abra o arquivo `.env.local` na raiz do projeto
2. Cole sua chave de API na última linha:
   ```
   VITE_GEMINI_API_KEY=SUA_CHAVE_AQUI
   ```
3. Salve o arquivo

## Passo 3: Reiniciar o Servidor

Se o servidor estiver rodando, **reinicie** para carregar a nova variável:

```bash
# Pare o servidor (Ctrl+C)
# Depois inicie novamente:
npm run dev
```

## Verificar Configuração

Após reiniciar, clique no botão **✨ IA** flutuante no canto inferior direito. Se aparecer um erro sobre chave de API, verifique:

1. ✅ Chave colada corretamente (sem espaços extras)
2. ✅ Arquivo `.env.local` salvo
3. ✅ Servidor reiniciado após adicionar a chave

## Funcionalidades Disponíveis

### 1. 💬 Chat de Assistente
- Clique no botão **✨ IA** flutuante
- Faça perguntas sobre construção, materiais, custos
- Exemplos:
  - "Quanto custa fazer uma laje de 50m²?"
  - "Quais materiais preciso para reformar uma cozinha?"

### 2. 📊 Análise de Orçamento
- Abra o chat de IA
- Clique em **"Analisar Orçamento"**
- A IA analisará todos os custos e dará sugestões

## Troubleshooting

### "Chave de API não configurada"
- Verifique se adicionou a chave no `.env.local`
- Reinicie o servidor de desenvolvimento

### "Erro 429 - Too Many Requests"
- Você atingiu o limite gratuito (15 req/min ou 1500/dia)
- Aguarde alguns minutos ou volte amanhã

### "Erro na API"
- Verifique sua conexão com a internet
- Confirme que a chave de API é válida
- Visite https://makersuite.google.com/app/apikey para verificar

## Privacidade

> [!NOTE]
> As conversas são enviadas para a API do Google Gemini mas não são armazenadas permanentemente. As mensagens ficam apenas no seu navegador.

---

**Pronto!** Agora você tem IA integrada no seu sistema de gerenciamento de obras! 🎉
