# GoDecola UI

**GoDecola UI** é a aplicação frontend desenvolvida em React como parte do projeto final da formação FullStack Avanade DecolaTech VI.  
A interface consome os dados da GoDecola API e proporciona uma experiência completa para usuários que desejam navegar, reservar e avaliar pacotes de viagem.

## Sumário

- [Preview](#preview)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instruções de Uso](#instruções-de-uso)
- [Licença](#licença)

## Preview

![](https://raw.githubusercontent.com/GoDecola/GoDecola-UI/refs/heads/main/src/assets/HomePage.jpg)


## 🛠️ Tecnologias Utilizadas
- **React 19**  
  Biblioteca JavaScript para construção de interfaces de usuário com foco em componentes reutilizáveis e arquitetura declarativa.

- **Vite**  
  Empacotador moderno de frontend que oferece tempo de inicialização extremamente rápido e recarga instantânea durante o desenvolvimento.

- **React Router DOM**  
  Sistema de roteamento para navegação entre páginas em aplicativos React de forma dinâmica e SPA (Single Page Application).

- **Redux + Redux Toolkit**  
  Gerenciamento de estado global da aplicação. O Redux Toolkit simplifica a configuração e reduz a verbosidade do código com `slices`, `thunks` e `createAsyncThunk`.

- **React Redux**  
  Integração oficial do React com o Redux para acesso ao estado global em componentes.


### 🎨 UI & Estilização

- **MUI (Material UI) v7 + MUI Joy**  
  Biblioteca de componentes React baseada no Material Design. Utiliza:
  - `@mui/material`: componentes principais (botões, inputs, grids, etc).
  - `@mui/icons-material`: ícones oficiais do Material Design.  
  - `@mui/x-data-grid`: tabela avançada com paginação, ordenação, filtros e mais.
  - `@mui/x-charts`: gráficos e visualizações de dados integrados ao MUI.  

- **Emotion**  
  Motor de estilização CSS-in-JS utilizado pelo MUI para estilização dinâmica com `sx` e `styled`.

- **React Icons**  
  Conjunto de ícones populares (como FontAwesome, Feather, Material Icons) facilmente integráveis em componentes React.

### 🌐 Integrações e Funcionalidades


- **React Google Maps API**
    exibição de mapas, geolocalização e marcadores usando a API do Google Maps.

- **Nominatim**
  serviço de geocodificação gratuita do OpenStreetMap, usado como alternativa ou complemento ao Google Maps para busca de endereços, cidades e coordenadas sem custo.

- **ViaCEP**  
  API brasileira gratuita para busca de endereços a partir de um CEP. Utilizada para preenchimento automático de formulários de endereço (logradouro, bairro, cidade, UF) com base apenas no CEP digitado.

- **Swiper**  
  Biblioteca de carrosséis e sliders touch-friendly, usada para galerias, banners e navegação horizontal.

- **React Dropzone**  
  Componente para upload de arquivos com suporte a arrastar e soltar.

- **IMask + React IMask + React Number Format**  
  Máscaras de entrada para campos como CPF, CNPJ, telefone, valores monetários e números formatados.

- **React Datepicker**  
  Seleção de datas com interface amigável e customizável.

- **Dicebear API**  
  Geração de avatares dinâmicos e personalizados com base em identificadores (como nome ou e-mail). Utilizada para exibir imagens de perfil únicas e estilizadas sem necessidade de upload.

- **html2canvas**  
  Converte elementos HTML da página em uma imagem (canvas). Usado em conjunto com `jsPDF` para gerar PDFs com base na renderização visual da interface, como capturas de relatórios, comprovantes ou telas inteiras.

- **xlsx (SheetJS)**  
  Biblioteca para leitura e geração de arquivos Excel (`.xlsx`). Usada para exportar tabelas e dados estruturados para planilhas diretamente no navegador.

- **FileSaver.js**  
  Permite salvar arquivos localmente via JavaScript. Integrada com `xlsx` para baixar planilhas geradas sem necessidade de backend.

- **jsPDF + jsPDF AutoTable**  
  Geração de documentos PDF dinâmicos no cliente. Usada para exportar relatórios, listagens e tabelas com formatação personalizada.

- **use-local-storage**  
  Hook simples para persistência de dados no `localStorage` com suporte a reatividade.

### 🔧 Desenvolvimento e Qualidade

- **ESLint + Plugins**  
  Ferramenta de análise estática para garantir boas práticas, consistência de código e detecção de erros.
  - `eslint-plugin-react-hooks`: verifica regras dos Hooks do React.
  - `eslint-plugin-react-refresh`: integração com HMR do Vite.

- **@vitejs/plugin-react**  
  Plugin oficial para suporte a React no Vite, incluindo Fast Refresh.

---

## Instruções de Uso

#### Clonar o repositório
```bash
git clone https://github.com/GoDecola/GoDecola-UI.git
```
#### Acessar o diretório
```bash
cd GoDecola-UI
```
#### Instalar dependências
```bash
node install
```
```bash
npm install
```
#### Executar o projeto
```bash
npm run dev
```

## Licença
Este projeto está licenciado sob a [Licença MIT](LICENSE).
