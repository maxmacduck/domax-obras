# 🏗️ DoMAX Obras

Dashboard moderno para gestão completa de obras de construção civil com integração Firebase.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.7.0-orange)
![Vite](https://img.shields.io/badge/Vite-4.5.14-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.2-cyan)

---

## 📋 Sobre o Projeto

**DoMAX Obras** é uma aplicação web completa para gestão de obras de construção, permitindo controle detalhado de:

- 💰 **Custos** - Materiais, mão de obra e equipamentos
- 📅 **Cronograma** - Etapas com barras de progresso visuais
- 📄 **Documentos** - Notas fiscais, projetos e recibos
- 📊 **Dashboard** - Visão geral com métricas em tempo real

---

## ✨ Principais Funcionalidades

### 💰 Gestão de Custos
- Adicionar, editar e remover custos
- Categorização por tipo (Material, Mão de obra, Equipamento, etc.)
- Status com código de cores (Pendente, Aprovado, Pago)
- Anexar documentos diretamente aos custos
- Visualização rápida de documentos anexados

### 📅 Cronograma Interativo
- Criar e gerenciar etapas da obra
- Barras de progresso visuais e animadas
- Atualização em tempo real do status
- Cores intuitivas (Verde=100%, Azul=em andamento, Cinza=não iniciado)

### 📄 Gerenciamento de Documentos
- Upload de PDFs, imagens e outros arquivos
- Categorização por tipo (Projeto, NF, Recibo, etc.)
- Visualização e download diretos
- Integração com Firebase Storage

### 📊 Dashboard em Tempo Real
- Orçamento total vs gasto
- Saldo restante calculado automaticamente
- Progresso geral da obra
- Resumo por categoria

---

## 🔥 Integração Firebase

O projeto utiliza Firebase para armazenamento de dados na nuvem:

- **Firestore Database** - Dados estruturados (custos, etapas, documentos)
- **Firebase Storage** - Armazenamento de arquivos
- **Real-time Sync** - Dados sempre atualizados
- **Multi-dispositivo** - Acesse de qualquer lugar

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Conta Firebase (gratuita)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/SEU_USUARIO/domax-obras.git
cd domax-obras
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase**

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🔧 Configuração do Firebase

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto
3. Copie as credenciais do SDK

### 2. Ativar Firestore Database

1. No Firebase Console, vá em **Firestore Database**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Modo de teste"** (para desenvolvimento)
4. Selecione a região mais próxima

### 3. Configurar Regras de Segurança

**Para desenvolvimento:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Para produção, configure regras com autenticação!**

---

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

---

## 🛠️ Tecnologias

- **React 18.2** - Framework UI
- **Vite 4.5** - Build tool ultra-rápida
- **TailwindCSS 3.3** - Estilização
- **Firebase 10.7** - Backend as a Service
- **Lucide React** - Ícones modernos

---

## 📂 Estrutura do Projeto

```
domax-obras/
├── src/
│   ├── App.jsx              # Componente principal
│   ├── services/
│   │   ├── firebase.js      # Configuração Firebase
│   │   ├── firestore.js     # Funções CRUD Firestore
│   │   └── storage.js       # Upload de arquivos
│   └── index.css            # Estilos globais
├── .env.local               # Credenciais Firebase (não versionado)
├── .gitignore
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🎨 Melhorias Visuais

- ✅ Barras de progresso animadas com gradientes
- ✅ Select de status com cores dinâmicas
- ✅ Botão "Ver" para visualizar documentos
- ✅ Design responsivo e moderno
- ✅ Feedback visual em todas as ações

---

## 📝 Estrutura de Dados (Firestore)

### Coleção: `projetos`
```javascript
{
  nome: string,
  orcamentoTotal: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Coleção: `custos`
```javascript
{
  projetoId: string,
  categoria: string,
  descricao: string,
  valor: number,
  data: string,
  status: 'pendente' | 'aprovado' | 'pago',
  temDocumento: boolean,
  tipoDocumento: string,
  documento: object
}
```

### Coleção: `etapas`
```javascript
{
  projetoId: string,
  nome: string,
  progresso: number (0-100),
  inicio: string,
  fim: string,
  status: 'pendente' | 'em_andamento' | 'concluido'
}
```

### Coleção: `documentos`
```javascript
{
  projetoId: string,
  tipo: string,
  nome: string,
  data: string,
  tamanho: string,
  arquivo: object
}
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👤 Autor

**Seu Nome**
- GitHub: [@seu_usuario](https://github.com/seu_usuario)

---

## 🙏 Agradecimentos

- Firebase pela infraestrutura cloud gratuita
- Lucide pela biblioteca de ícones
- Vercel pelo Vite

---

## 🔮 Próximas Funcionalidades

- [ ] Autenticação de usuários (Firebase Auth)
- [ ] Sincronização em tempo real
- [ ] Modo offline com cache
- [ ] Multi-projeto
- [ ] Relatórios em PDF
- [ ] Gráficos de custos
- [ ] Notificações
- [ ] App mobile (React Native)

---

**Desenvolvido com ❤️ para facilitar a gestão de obras**
