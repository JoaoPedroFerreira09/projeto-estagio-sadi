# Agrupamento de Faces - Projeto de Avaliação

Esta é uma aplicação web desenvolvida para a avaliação de estágio. O objetivo é fornecer uma interface rica e intuitiva para o upload e agrupamento de imagens de faces, simulando um cenário de organização de vídeos capturados em salas de aula.

## Tecnologias Utilizadas

* **Frontend**:
    * **React**: Biblioteca principal para a construção da interface.
    * **TypeScript**: Para adicionar tipagem estática, segurança e robustez ao código.
    * **Vite**: Ferramenta de build e alta performance para o ambiente de desenvolvimento.
* **Estilização e Componentes**:
    * **React-Bootstrap & Bootstrap**: Utilizados para a estrutura de layout e componentes base da UI.
    * **CSS Customizado**: Uma folha de estilos personalizada (`App.css`) foi criada para garantir uma identidade visual.
* **Interatividade**:
    * **dnd-kit**: Biblioteca moderna e acessível para as funcionalidades de arrastar e soltar internas da aplicação.
    * **react-dropzone**: Biblioteca especializada para a funcionalidade de upload de arquivos arrastando do computador para o navegador.
* **Outras Ferramentas**:
    * **react-router-dom**: Para a navegação e criação de rotas na aplicação.
    * **Sonner**: Para a exibição de notificações (toasts) de feedback ao usuário.
    * **React Icons**: Para a utilização de ícones SVG de alta qualidade.

## Estrutura e Organização do Projeto

O projeto foi estruturado seguindo o princípio de **Separação de Responsabilidades**, dividindo o código em pastas com propósitos claros e bem definidos para facilitar a manutenção e escalabilidade.

A organização principal dentro da pasta `src` é a seguinte:

* **`/pages`**: Contém os componentes de "tela cheia", que atuam como o "cérebro" de cada rota da aplicação. Eles são responsáveis por gerenciar o estado e a lógica de negócios de cada tela.
    * `DashboardPage.tsx`: Orquestra a tela principal de interação, onde o usuário realiza o upload, o agrupamento e a manipulação das imagens e perfis.
    * `ProfilesPage.tsx`: Exibe uma página dedicada para a visualização geral de todos os perfis criados no sistema.

* **`/components`**: Contém todos os componentes de UI reutilizáveis, que são "visuais" (Presentational Components) e recebem dados e funções via `props`.
    * `**/gallery`**: Componentes relacionados à galeria principal de imagens.
    * `**/profiles`**: Componentes para a criação e listagem dos perfis de usuário.
    * `**/layout`**: Componentes que definem a estrutura visual da página, como a `Sidebar`.
    * `**/UI`**: Componentes genéricos de interface, como o `Header`.

* **`/hooks`**: Armazena hooks customizados do React, como o `useLocalStorage`.

* **`/services`**: Responsável pela comunicação  como a nossa `api.ts` simulada.

* **`/types`**: Centraliza todas as interfaces e tipos do TypeScript.

* **`/styles`**: Contém os arquivos de estilização globais e customizados.


## Como Rodar o Projeto Localmente

Siga os passos abaixo para executar o projeto em sua máquina.

**Pré-requisitos:**
* Node.js (versão 18 ou superior)
* npm

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO_NO_GITHUB]
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd nome-da-pasta-do-projeto
    ```

3.  **Instale todas as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  Abra seu navegador e acesse `http://localhost:5173`