# Verbalize is a fork based on the Techscriptor editor for English. Please, check the work of Constantin Brîncoveanu @ https://github.com/cbrincoveanu/techscriptor

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

![](https://raw.githubusercontent.com/mtgr18977/Verbalize/refs/heads/main/imgs/tela_1.png)

### Visão com highlights de um documento

![](https://raw.githubusercontent.com/mtgr18977/Verbalize/refs/heads/main/imgs/tela_2.png)

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

> Os pacotes serão gerados na pasta `dist/`.

## Como Usar

### Escreva no Editor:
- Utilize a sintaxe Markdown para formatar seu texto.
- O editor suporta recursos como títulos, listas, links, imagens, blocos de código, etc.

### Visualize o Resultado:
- A pré-visualização ao lado mostra o resultado renderizado do seu Markdown.
- O realce de sintaxe é aplicado automaticamente aos blocos de código.

### Receba Feedback em Tempo Real:
- O aplicativo analisa seu texto e destaca trechos que podem ser melhorados.
- Passe o mouse sobre os trechos destacados para ver as sugestões.

### Utilize os Botões de Upload e Download:
- **Upload**: Carregue arquivos `.md` ou `.txt` para continuar editando.
- **Download**: Baixe o conteúdo atual do editor como um arquivo Markdown ( `.md` ).

### Consulte as Estatísticas:
- A barra inferior mostra o número de sentenças, palavras, caracteres e avisos presentes no texto.

## Análise Gramatical e Estilística

O ecitor Verbalize analisa seu texto em busca de:

- **Frases longas**: Sentenças com mais de 20 palavras são destacadas para possível simplificação.
- **Palavras complexas**: Palavras com mais de 12 caracteres são sinalizadas para possível substituição por termos mais simples.
- **Voz passiva**: Sugestão de uso da voz ativa para tornar o texto mais direto.
- **Advérbios em excesso**: Identificação de advérbios terminados em "-mente" que podem ser desnecessários.
- **Clichês e expressões** Muito Usadas: Destaca termos que podem tornar o texto menos original.
- **Jargões técnicos**: Sinaliza termos técnicos que podem ser substituídos por linguagem mais acessível.
- **Palavras de transição em excesso**: Sugere revisão quando há uso excessivo de conectivos.
- **Negativas duplas**: Identifica construções que podem confundir o leitor.
- **Repetição de palavras**: Destaca repetições consecutivas que podem ser evitadas.

## Funcionalidades

- **Editor ace**: Editor de texto avançado com realce de sintaxe e numeração de linhas.
- **Markdown-it**: Biblioteca para renderização de Markdown com suporte a extensões.
- **Highlight.js**: Realce de sintaxe para blocos de código na visualização.
- **Bootstrap popovers**: Exibição de mensagens de aviso ao interagir com trechos destacados.
- **DOMPurify**: Sanitização do conteúdo para evitar execução de código malicioso.

## Tecnologias Utilizadas

- **HTML5 e CSS3**: Estrutura e estilos básicos do aplicativo.
- **JavaScript (ES6+)**: Lógica do aplicativo e manipulação do DOM.
- **Ace editor**: Editor de texto avançado embutido.
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
2. Crie uma Branch para sua _Feature_ ou _Correção de Bug_: `git checkout -b minha-feature`
3. Faça as alterações e após o commit: `git commit -m "Minha nova feature"`
4. Envie para o repositório remoto: `git push origin minha-feature`
5. Abra um _Pull Request_ (PR).

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para obter mais detalhes.
