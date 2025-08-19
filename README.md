# 📖 Base de Conhecimento Inteligente

![Imagem de demonstração da tela de usuário da aplicação](https://i.imgur.com/3n1P82a.png)

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Badge"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS Badge"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge"/>
</p>

## 🚀 Sobre o Projeto

A **Base de Conhecimento Inteligente** é uma aplicação web moderna e responsiva desenvolvida para centralizar e gerenciar perguntas e respostas frequentes (FAQ). Ela foi criada para ser uma ferramenta de suporte ágil, permitindo que administradores cadastrem facilmente novos conhecimentos e que usuários finais encontrem soluções para seus problemas de forma rápida e intuitiva.

O sistema conta com dois painéis distintos: um painel administrativo completo para o gerenciamento do conteúdo e uma interface de usuário elegante e funcional para consulta.

---

### ✨ Funcionalidades Principais

#### Painel do Administrador
- **Dashboard com Métricas:** Cards com estatísticas em tempo real, como total de perguntas e data do último cadastro.
- **CRUD Completo:** Crie, leia, atualize e delete perguntas e respostas de forma simples.
- **Gerenciamento de Temas:** Organize o conhecimento em categorias para facilitar a navegação.
- **Histórico de Visualizações:** Acompanhe quais são as perguntas mais acessadas pelos usuários.

#### Painel do Usuário
- **Busca Inteligente:** Pesquisa instantânea por palavras-chave em títulos, respostas e temas.
- **Navegação por Temas:** Explore o conhecimento através de cards de temas interativos.
- **Layout Intuitivo:** Interface limpa, com respostas em formato de "acordeão" para uma melhor experiência de leitura.
- **Autenticação Segura:** Sistema de login, cadastro de novos usuários e recuperação de senha.
- **Modo Claro e Escuro:** Tema adaptável para preferência visual do usuário.

---

### 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

- **Frontend:**
  - [**React**](https://reactjs.org/) (com Hooks e Context API)
  - [**Vite**](https://vitejs.dev/) como ambiente de desenvolvimento
  - [**Tailwind CSS**](https://tailwindcss.com/) para estilização
- **Backend & Banco de Dados:**
  - [**Firebase**](https://firebase.google.com/)
    - **Authentication:** Para gerenciamento de usuários.
    - **Firestore:** Como banco de dados NoSQL em tempo real.
    - **Storage:** Para armazenamento de imagens (funcionalidade removida temporariamente).
- **Deploy:**
  - [**Vercel**](https://vercel.com/)

---

### ⚙️ Como Rodar o Projeto Localmente

Siga os passos abaixo para executar a aplicação na sua máquina.

#### Pré-requisitos
- [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

#### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/viniciusl17/Base-conhecimento-app.git](https://github.com/viniciusl17/Base-conhecimento-app.git)
    cd SEU-REPOSITORIO
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env.local` na raiz do projeto.
    * Dentro deste arquivo, adicione as credenciais do seu projeto Firebase. O Vite só expõe variáveis com o prefixo `VITE_`.

    ```env
    # .env.local

    VITE_API_KEY="SUA_API_KEY"
    VITE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
    VITE_PROJECT_ID="SEU_PROJECT_ID"
    VITE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
    VITE_MESSAGING_SENDER_ID="SEU_MESSAGING_SENDER_ID"
    VITE_APP_ID="SEU_APP_ID"
    ```
    > **Importante:** Você pode encontrar essas chaves no console do seu projeto Firebase, em "Configurações do Projeto" > "Geral" > "Seus apps".

4.  **Execute a aplicação:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).

---

### 🔥 Configuração do Firebase

Para que a aplicação funcione corretamente, certifique-se de que seu projeto Firebase está configurado da seguinte forma:

1.  **Authentication**: O provedor "E-mail/Senha" deve estar ativado.
2.  **Firestore**: Crie as coleções `users`, `questions` e `viewHistory` e defina as regras de segurança conforme o guia fornecido.
3.  **Usuário Admin**: Crie um usuário admin manualmente no Firestore (coleção `users`) e adicione um campo `role` com o valor `admin`.

---
