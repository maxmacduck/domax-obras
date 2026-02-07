# 🏗️ DoMAX Obras - Dashboard de Gerenciamento

Dashboard profissional para gerenciamento de custos e documentação de obras e reformas.

## 🚀 Deploy na Vercel (Método Mais Fácil)

### Opção 1: Via GitHub (Recomendado - Deploy Automático)

#### Passo 1: Criar Conta no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "Sign up"
3. Crie sua conta (gratuita)

#### Passo 2: Criar Repositório
1. Clique no botão "+" no canto superior direito
2. Selecione "New repository"
3. Nome: `domax-obras` (ou o que preferir)
4. Marque "Public"
5. Clique em "Create repository"

#### Passo 3: Fazer Upload dos Arquivos
**Pelo site do GitHub:**
1. Na página do repositório criado
2. Clique em "uploading an existing file"
3. Arraste TODOS os arquivos do projeto
4. Clique em "Commit changes"

**OU pelo terminal (se souber usar Git):**
```bash
cd caminho/para/domax-obras-vercel
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/domax-obras.git
git push -u origin main
```

#### Passo 4: Deploy na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up" → "Continue with GitHub"
3. Autorize a Vercel a acessar o GitHub
4. Clique em "Import Project"
5. Selecione o repositório `domax-obras`
6. Clique em "Deploy"
7. Aguarde 2-3 minutos... Pronto! ✅

**Seu dashboard estará no ar em:** `https://domax-obras.vercel.app`

---

### Opção 2: Upload Direto (Mais Rápido, Sem GitHub)

#### Passo 1: Preparar os Arquivos
1. Baixe todos os arquivos do projeto
2. Certifique-se que tem a pasta completa

#### Passo 2: Deploy na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com email ou GitHub
3. Clique em "Add New..." → "Project"
4. Clique na aba "Deploy from a template"
5. **OU** arraste a pasta do projeto direto na página

#### Passo 3: Configurar
1. Nome do projeto: `domax-obras`
2. Framework Preset: **Vite**
3. Clique em "Deploy"
4. Aguarde... Pronto! ✅

---

## 📱 Como Acessar

### No Computador
- Abra o link: `https://seu-projeto.vercel.app`
- Adicione aos favoritos

### No Celular
- Abra o mesmo link no navegador
- Menu do navegador → "Adicionar à tela inicial"
- Agora você tem um ícone como se fosse um app!

---

## 🔄 Como Atualizar o Dashboard

### Se usou GitHub (Opção 1):
1. Faça alterações nos arquivos localmente
2. Commit e push para o GitHub
3. A Vercel atualiza automaticamente! 🎉

### Se fez upload direto (Opção 2):
1. Vá em vercel.com → seu projeto
2. Aba "Deployments"
3. Faça novo upload dos arquivos atualizados

---

## 💾 Onde Ficam os Dados?

Os dados são salvos no **navegador** usando o storage do Claude:
- ✅ Funcionam offline
- ✅ Sincronizam entre dispositivos
- ✅ Não precisa banco de dados
- ⚠️ Ficam salvos enquanto você usar o mesmo link/sessão

---

## 🛠️ Desenvolvimento Local (Opcional)

Se quiser rodar na sua máquina para testar:

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Abrir no navegador
http://localhost:5173
```

---

## 📋 Funcionalidades

- ✅ Controle de custos (Material, Mão de obra, Equipamento)
- ✅ Custos de manutenção (Energia, Condomínio, IPTU)
- ✅ Gestão de documentos com upload
- ✅ Cronograma de etapas com progresso
- ✅ Relatórios exportáveis
- ✅ Responsivo (funciona em qualquer tela)
- ✅ Persistência automática de dados

---

## 🎯 Próximos Passos

1. Fazer o deploy seguindo uma das opções acima
2. Configurar o nome do seu projeto
3. Começar a lançar os custos
4. Fazer upload dos documentos
5. Acompanhar o progresso da obra!

---

## 🆘 Problemas Comuns

**"Build failed":**
- Verifique se todos os arquivos estão na pasta
- Tente fazer deploy novamente

**"Dados não aparecem":**
- Os dados são locais do navegador
- Use sempre o mesmo link
- Verifique se o storage está habilitado

**"Não consigo fazer upload":**
- Limite de 5MB por arquivo
- Formatos aceitos: PDF, JPG, PNG, DOC, XLS

---

## 📞 Suporte

Dúvidas? Volte na conversa do Claude e me pergunte!

---

**Desenvolvido com ❤️ usando React + Vite + Tailwind CSS**
