# Verbalize
Verbalize is an advanced Markdown editor with grammatical and stylistic analysis. Initially built for Brazilian Portuguese, it now includes rule sets for English and Spanish as well. Designed to help writers, students, and professionals improve the clarity and readability of their texts, Verbalize provides an intuitive interface for enhancing writing.

***

## Features

- **Real-Time Markdown Editor**: Write in Markdown and preview your content instantly.
- **Grammatical and Stylistic Analysis**: Receive feedback on text readability, including long sentences, passive voice, overused adverbs, clichés, jargon, and more.
- **Multilingual Support**: Rules available for Portuguese, English and Spanish.
- **Syntax Highlighting**: Automatically highlights inserted code for better readability.
- **Import and Export Files**: Import `.md`, `.markdown`, and `.txt` files, and export your work in Markdown format.
- **Minimalist Interface**: A clean, writing-focused design with a responsive layout adaptable to different screen sizes.
- **Desktop Application**: Available as a cross-platform desktop app using Electron.
- **More Readability Metrics**: Extra formulas and progress bars to visualize Flesch scores.
- **Theme Selection and Shortcuts**: Use the toolbar selector or `Ctrl-D` to switch between light and dark modes.

## Screenshots

### Overview

![](https://raw.githubusercontent.com/mtgr18977/Verbalize/refs/heads/main/imgs/01.png)

### Highlighted Document View

![](https://raw.githubusercontent.com/mtgr18977/Verbalize/refs/heads/main/imgs/02-en.png)

## Installation

### Run as a Web App

1. Clone the Repository: `git clone https://github.com/your-user/verbalize.git`
2. Navigate to the Project Directory: `cd verbalize`
3. Install Dependencies: `npm install`
4. Start a Local Server: `npx live-server`
5. Open the App in Your Browser.
   - Typically, live-server will automatically open at `http://127.0.0.1:8080`. If not, open it manually in your browser.

### Run as a Desktop App (Electron)

1. Clone the Repository: `git clone https://github.com/your-user/verbalize.git`
2. Navigate to the Project Directory: `cd verbalize`
3. Install Dependencies: `npm install`
4. Start the Electron App: `npm start`
5. Package the App (Optional): `npm run dist`
   - Uses **electron-packager** to create binaries in the `dist/` folder.

## How to Use

### Write in the Editor:
- Use Markdown syntax to format your text.
- The editor supports features such as headings, lists, links, images, code blocks, and more.

### Preview the Result:
- The side preview shows the rendered result of your Markdown.
- Syntax highlighting is automatically applied to code blocks.

### Get Real-Time Feedback:
- The app analyzes your text and highlights areas for improvement.
- Hover over the highlighted sections to see suggestions.

### Use the Top Toolbar:
- **Upload**: Load `.md` or `.txt` files to continue editing.
- **Download**: Download the current editor content as a Markdown (`.md`) file.
- **Language Selector**: Switch the analysis rules between Portuguese, English, and Spanish.

### View Statistics:
- The bottom bar displays the number of sentences, words, characters, and warnings in the text.

## Grammatical and Stylistic Analysis

The Verbalize editor analyzes your text for:

- **Long Sentences**: Highlights sentences with over 20 words for possible simplification.
- **Complex Words**: Flags words with more than 12 characters, suggesting simpler alternatives.
- **Passive Voice**: Recommends using active voice for more direct communication.
- **Excessive Adverbs**: Identifies adverbs ending in "-mente" that may be unnecessary.
- **Clichés and Overused Expressions**: Highlights terms that may make the text less original.
- **Technical Jargon**: Flags technical terms that could be replaced with more accessible language.
- **Overuse of Transition Words**: Suggests revision when excessive connectors are present.
- **Double Negatives**: Identifies constructions that may confuse the reader.
- **Word Repetition**: Highlights consecutive repetitions that can be avoided.

## Features

- **Ace Editor**: Advanced text editor with syntax highlighting and line numbering.
- **Markdown-it**: Library for rendering Markdown with extension support.
- **Highlight.js**: Syntax highlighting for code blocks in the preview.
- **Bootstrap Popovers**: Displays warning messages when interacting with highlighted sections.
- **DOMPurify**: Sanitizes content to prevent malicious code execution.

## Technologies Used

- **HTML5 and CSS3**: Basic structure and styles of the app.
- **JavaScript (ES6+)**: App logic and DOM manipulation.
- **Ace Editor**: Embedded advanced text editor.
- **Markdown-it**: Markdown rendering.
- **Highlight.js**: Code syntax highlighting.
- **Bootstrap**: UI components and popovers.
- **jQuery**: Simplified DOM manipulation.
- **Electron**: Desktop app packaging.
- **DOMPurify**: Ensures security when handling HTML content.

## Contribution

Contributions are welcome! Feel free to open issues and pull requests in the project repository.

### To contribute:
1. Fork the repository.
2. Create a Branch for your Feature or Bug Fix: `git checkout -b my-feature`
3. Make the changes and commit: `git commit -m "My new feature"`
4. Push to the remote repository: `git push origin my-feature`
5. Open a Pull Request (PR).

## License

This project is licensed under the MIT license. See the LICENSE file for details.

***

# Portuguese version

***

# Verbalize
Verbalize é um editor Markdown avançado com análise gramatical e estilística em português brasileiro. Projetado para ajudar escritores, estudantes e profissionais a melhorar a clareza e a legibilidade de seus textos, o Verbalize oferece uma interface intuitiva para aprimorar a escrita.

***

## Recursos

- **Editor Markdown em Tempo Real**: Escreva em Markdown e veja a pré-visualização instantaneamente.
- **Análise Gramatical e Estilística**: Receba feedback sobre a legibilidade do texto, incluindo frases longas, voz passiva, advérbios em excesso, clichês, jargões, entre outros.
- **Realce de Sintaxe**: Código inserido é automaticamente destacado para melhor legibilidade.
- **Importar e Exportar Arquivos**: Importe arquivos nos formatos .md, .markdown e .txt e exporte seu trabalho em Markdown.
- **Interface Minimalista**: Design limpo e focado na escrita, com um layout responsivo que se adapta a diferentes tamanhos de tela.
- **Aplicativo Desktop**: Disponível como aplicativo desktop multiplataforma usando Electron.

## Capturas de Tela

### Visão geral

![](https://raw.githubusercontent.com/mtgr18977/Verbalize/refs/heads/main/imgs/01.png)

### Visão com highlights de um documento

![](https://raw.githubusercontent.com/mtgr18977/Verbalize/refs/heads/main/imgs/02-pt.png)

## Instalação

### Executar como Aplicativo Web

1. Clone o Repositório: `git clone https://github.com/seu-usuario/verbalize.git`
2. Navegue até o Diretório do Projeto: `cd verbalize`
3. Instale as Dependências: `npm install`
4. Inicie um Servidor Local: `npx live-server`
5. Abra o Aplicativo no Navegador.
  6. Normalmente, o live-server abrirá automaticamente em `http://127.0.0.1:8080`. Se não, abra manualmente no navegador.

### Executar como Aplicativo Desktop (Electron)

1. Clone o Repositório: `git clone https://github.com/seu-usuario/verbalize.git`
2. Navegue até o Diretório do Projeto: `cd verbalize`
3. Instale as Dependências: `npm install`
4. Inicie o Aplicativo Electron: `npm start`
5. Empacotar o Aplicativo (Opcional): `npm run dist`
   - Utiliza o **electron-packager** para gerar binários na pasta `dist/`.

## Como Usar

### Escreva no Editor:
- Utilize a sintaxe Markdown para formatar seu texto.
- O editor suporta recursos como títulos, listas, links, imagens, blocos de código, e mais.

### Visualize o Resultado:
- A pré-visualização ao lado mostra o resultado renderizado do seu Markdown.
- O realce de sintaxe é aplicado automaticamente aos blocos de código.

### Receba Feedback em Tempo Real:
- O aplicativo analisa seu texto e destaca áreas para melhoria.
- Passe o mouse sobre as seções destacadas para ver as sugestões.

### Utilize a Barra Superior:
- **Upload**: Carregue arquivos `.md` ou `.txt` para continuar editando.
- **Download**: Baixe o conteúdo atual do editor como um arquivo Markdown ( `.md` ).
- **Seletor de Idioma**: Altere as regras de análise entre Português, Inglês e Espanhol.

### Consulte as Estatísticas:
- A barra inferior exibe o número de sentenças, palavras, caracteres e avisos no texto.

## Análise Gramatical e Estilística

O editor Verbalize analisa seu texto em busca de:

- **Frases longas**: Sentenças com mais de 20 palavras são destacadas para possível simplificação.
- **Palavras complexas**: Palavras com mais de 12 caracteres são sinalizadas para possível substituição por termos mais simples.
- **Voz passiva**: Sugestão de uso da voz ativa para tornar o texto mais direto.
- **Advérbios em excesso**: Identificação de advérbios terminados em "-mente" que podem ser desnecessários.
- **Clichês e Expressões Muito Usadas**: Destaca termos que podem tornar o texto menos original.
- **Jargões técnicos**: Sinaliza termos técnicos que podem ser substituídos por linguagem mais acessível.
- **Palavras de transição em excesso**: Sugere revisão quando há uso excessivo de conectivos.
- **Negativas duplas**: Identifica construções que podem confundir o leitor.
- **Repetição de palavras**: Destaca repetições consecutivas que podem ser evitadas.

## Funcionalidades

- **Ace Editor**: Editor de texto avançado com realce de sintaxe e numeração de linhas.
- **Markdown-it**: Biblioteca para renderização de Markdown com suporte a extensões.
- **Highlight.js**: Realce de sintaxe para blocos de código na pré-visualização.
- **Bootstrap popovers**: Exibição de mensagens de aviso ao interagir com trechos destacados.
- **DOMPurify**: Sanitização do conteúdo para evitar execução de código malicioso.
- **Escolha de tema e atalhos**: Selecione entre os modos claro e escuro e utilize atalhos de teclado.

## Tecnologias Utilizadas

- **HTML5 e CSS3**: Estrutura e estilos básicos do aplicativo.
- **JavaScript (ES6+)**: Lógica do aplicativo e manipulação do DOM.
- **Ace Editor**: Editor de texto avançado embutido.
- **Markdown-it**: Renderização de Markdown.
- **Highlight.js**: Realce de sintaxe de código.
- **Bootstrap**: Componentes de UI e popovers.
- **jQuery**: Simplificação da manipulação do DOM.
- **Electron**: Empacotamento como aplicativo desktop.
- **DOMPurify**: Segurança ao manipular conteúdo HTML.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests no repositório do projeto.

### Para contribuir:
1. Faça um fork do repositório
2. Crie uma Branch para sua Feature ou Correção de Bug: `git checkout -b minha-feature`
3. Faça as alterações e após o commit: `git commit -m "Minha nova feature"`
4. Envie para o repositório remoto: `git push origin minha-feature`
5. Abra um _Pull Request_ (PR).

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para obter mais detalhes.
