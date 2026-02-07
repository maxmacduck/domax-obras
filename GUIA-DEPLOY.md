# 📸 GUIA VISUAL PASSO A PASSO - VERCEL

## 🎯 MÉTODO RECOMENDADO: Via GitHub

### ✅ PASSO 1: Criar Conta no GitHub (2 minutos)

1. Abra: https://github.com
2. Clique em "Sign up" (canto superior direito)
3. Preencha:
   - Email
   - Senha
   - Nome de usuário
4. Resolva o CAPTCHA
5. Clique em "Create account"
6. Verifique seu email
7. ✅ Conta criada!

---

### 📁 PASSO 2: Criar Repositório (1 minuto)

1. Na página inicial do GitHub
2. Clique no botão verde "New" (ou ícone + → "New repository")
3. Preencha:
   ```
   Repository name: domax-obras
   Description: Dashboard de gerenciamento de obras
   ☑️ Public (deixe marcado)
   ☑️ Add a README file (deixe DESMARCADO)
   ```
4. Clique em "Create repository"
5. ✅ Repositório criado!

---

### 📤 PASSO 3: Upload dos Arquivos (2 minutos)

**Na página do repositório que acabou de criar:**

1. Você verá uma tela dizendo "Quick setup"
2. Clique no link "uploading an existing file"
3. **ARRASTE TODOS OS ARQUIVOS** da pasta `domax-obras-vercel`:
   ```
   📁 domax-obras-vercel/
   ├── 📄 package.json
   ├── 📄 vite.config.js
   ├── 📄 index.html
   ├── 📄 tailwind.config.js
   ├── 📄 postcss.config.js
   ├── 📄 .gitignore
   ├── 📄 README.md
   └── 📁 src/
       ├── 📄 main.jsx
       ├── 📄 index.css
       └── 📄 App.jsx
   ```
4. Aguarde o upload (barra de progresso verde)
5. No campo de mensagem, deixe: "Initial commit"
6. Clique em "Commit changes"
7. ✅ Arquivos no GitHub!

---

### 🚀 PASSO 4: Deploy na Vercel (3 minutos)

1. Abra: https://vercel.com
2. Clique em "Sign Up"
3. Escolha "Continue with GitHub"
4. Autorize a Vercel (botão verde "Authorize Vercel")
5. Na dashboard da Vercel, clique em "Add New..." → "Project"
6. Você verá seus repositórios do GitHub
7. Encontre "domax-obras" e clique em "Import"
8. Configuração:
   ```
   Project Name: domax-obras
   Framework Preset: Vite (já detecta automaticamente)
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   ```
9. Clique em "Deploy"
10. Aguarde 2-3 minutos (acompanhe os logs)
11. ✅ PRONTO! Aparecerá "Congratulations!" 🎉

---

### 🎊 SEU DASHBOARD ESTÁ NO AR!

Você receberá um link tipo:
```
https://domax-obras.vercel.app
```

**OU**

```
https://domax-obras-seu-usuario.vercel.app
```

---

## 📱 PASSO 5: Adicionar no Celular (1 minuto)

### iPhone:
1. Abra o Safari
2. Acesse seu link do Vercel
3. Toque no ícone de compartilhar (quadrado com seta)
4. Role e escolha "Adicionar à Tela de Início"
5. Toque em "Adicionar"
6. ✅ Ícone criado na tela inicial!

### Android:
1. Abra o Chrome
2. Acesse seu link do Vercel
3. Toque nos 3 pontinhos (menu)
4. Escolha "Adicionar à tela inicial"
5. Toque em "Adicionar"
6. ✅ Ícone criado na tela inicial!

---

## 🔄 PASSO 6: Como Atualizar Depois

Quando você quiser mudar algo no dashboard:

1. Vá no GitHub → seu repositório "domax-obras"
2. Clique no arquivo que quer editar (ex: `src/App.jsx`)
3. Clique no ícone de lápis (Edit)
4. Faça as alterações
5. Role até o fim → "Commit changes"
6. Aguarde 1-2 minutos
7. ✅ A Vercel atualiza automaticamente!

**OU** faça upload de novos arquivos pela opção "Add file" → "Upload files"

---

## ⚡ ALTERNATIVA RÁPIDA: Sem GitHub

**Se tiver pressa e não quiser mexer com GitHub:**

1. Compacte a pasta `domax-obras-vercel` em um arquivo .zip
2. Acesse https://vercel.com
3. Faça login com email
4. Arraste o arquivo .zip na página
5. Pronto!

**Desvantagem:** Não terá deploy automático. Toda atualização precisa ser manual.

---

## ✅ CHECKLIST FINAL

- [ ] Conta no GitHub criada
- [ ] Repositório "domax-obras" criado
- [ ] Arquivos enviados para o GitHub
- [ ] Deploy feito na Vercel
- [ ] Link funcionando
- [ ] Adicionado nos favoritos/tela inicial
- [ ] Primeiro teste: configurar nome do projeto
- [ ] Primeiro teste: adicionar um custo

---

## 🎯 TEMPO TOTAL

- GitHub: 2 min
- Repositório: 1 min
- Upload: 2 min
- Vercel: 3 min
- **TOTAL: ~10 minutos** ⏱️

---

## 🆘 PROBLEMAS?

**"Repository already exists":**
→ Escolha outro nome: `domax-obras-2`, `minha-obra`, etc.

**"Build failed" na Vercel:**
→ Verifique se enviou TODOS os arquivos, incluindo a pasta `src/`

**"Page not found" ao abrir o link:**
→ Aguarde mais 1-2 minutos, a Vercel ainda está processando

**Não aparece para importar na Vercel:**
→ Clique em "Adjust GitHub App Permissions" e autorize todos os repositórios

---

💡 **DICA DE OURO:** Salve o link do seu projeto em algum lugar seguro (notes, email para você mesmo, etc)

---

🎉 **PARABÉNS! Seu dashboard profissional está no ar!**
