// Inicialização do editor Ace
var editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/markdown");
editor.setOptions({
    fontSize: "14px",
    vScrollBarAlwaysVisible: true,
    wrap: true
});

// Função para carregar os popovers do Bootstrap
function loadPopovers() {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (element) {
        return new bootstrap.Popover(element, {
            trigger: 'hover focus',
            html: true
        });
    });
}

// Inicializa o Markdown-it com o plugin de notas de rodapé
var md = window.markdownit().use(window.markdownitFootnote);

// Listener para antes de fechar a janela
const beforeUnloadListener = (event) => {
    event.preventDefault();
    return event.returnValue = "Você tem certeza que deseja sair?";
};

// Funções para contar palavras e sentenças
function countWords(str) {
    const arr = str.trim().split(/\s+/);
    return arr.filter(word => word !== '').length;
}

function countSentences(str) {
    const matches = str.match(/[^\.!\?]+[\.!\?]+/g);
    return matches ? matches.length : 0;
}

// Regras de análise gramatical e estilística em português (atualizadas)
const rulesPtBr = {
    "fraseLonga": {
        "regex": /([^\.\?\!]+[\.!\?]+)/g,
        "message": "Esta frase é muito longa. Considere dividir em sentenças menores.",
        "color": "#f4cccc",
        "summary": " frases longas detectadas.",
        "summarySingle": " frase longa detectada.",
        "condition": function (match) {
            // Conta palavras na frase
            const wordCount = match.trim().split(/\s+/).length;
            return wordCount > 20; // Frases com mais de 20 palavras
        }
    },
    "palavraComplexa": {
        "regex": /\b\w{13,}\b/g,
        "message": "Considere usar palavras mais curtas para melhorar a legibilidade.",
        "color": "#d9ead3",
        "summary": " palavras complexas detectadas.",
        "summarySingle": " palavra complexa detectada."
    },
    "vozPassiva": {
        "regex": /\b(foi|foram|será|serão|é|são|era|eram|seja|sejam|fosse|fossem)\s+(?:\w+\s+)*(ado|ido|ada|ida|ados|idos|adas|idas)\b/gi,
        "message": "Voz passiva detectada. Considere usar a voz ativa.",
        "color": "#fff2cc",
        "summary": " utilizações de voz passiva.",
        "summarySingle": " utilização de voz passiva."
    },
    "adverbioExcessivo": {
        "regex": /\b\w+mente\b/gi,
        "message": "Uso de advérbio em excesso. Verifique se é necessário.",
        "color": "#d0e0e3",
        "summary": " advérbios detectados.",
        "summarySingle": " advérbio detectado."
    },
    "cliches": {
        "regex": /\b(a nível de|literalmente|sustentabilidade|paradigma|proativo|sinergia|agregar valor|pensar fora da caixa|no final do dia|mais do que nunca)\b/gi,
        "message": "Evite clichês e expressões muito usadas.",
        "color": "#fce5cd",
        "summary": " clichês detectados.",
        "summarySingle": " clichê detectado."
    },
    "jargao": {
        "regex": /\b(alavancar|stakeholders|empowerment|benchmarking|downsizing|feedback|brainstorming|core business)\b/gi,
        "message": "Termo técnico detectado. Considere usar linguagem mais simples.",
        "color": "#ead1dc",
        "summary": " jargões detectados.",
        "summarySingle": " jargão detectado."
    },
    "transicaoExcessiva": {
        "regex": /\b(portanto|além disso|contudo|no entanto|assim|consequentemente|desse modo|por conseguinte|em suma)\b/gi,
        "message": "Uso excessivo de palavras de transição pode afetar a fluidez do texto.",
        "color": "#c9daf8",
        "summary": " palavras de transição em excesso.",
        "summarySingle": " palavra de transição em excesso."
    },
    "negacaoDupla": {
        "regex": /\b(não\s+.*\bnão\b|nunca\s+.*\bnão\b|nunca\s+.*\bnunca\b)\b/gi,
        "message": "Dupla negativa detectada. Isso pode confundir o leitor.",
        "color": "#e6b8af",
        "summary": " negativas duplas detectadas.",
        "summarySingle": " negativa dupla detectada."
    },
    "palavrasRepetidas": {
        "regex": /\b(\w+)\b\s+\b\1\b/gi,
        "message": "Evite repetir a mesma palavra consecutivamente.",
        "color": "#b6d7a8",
        "summary": " repetições de palavras.",
        "summarySingle": " repetição de palavra."
    },
    // Adicione mais regras conforme necessário
};

// Função para atualizar a visualização
function updateView() {
    // Renderiza o Markdown em um elemento DOM
    var mdContent = md.render(editor.getValue());
    var parser = new DOMParser();
    var doc = parser.parseFromString(mdContent, 'text/html');

    var ruleReplacements = {};
    for (var label in rulesPtBr) {
        ruleReplacements[label] = 0;
    }

    function traverseNodes(node) {
        // Se for um nó de texto, aplicar as regras
        if (node.nodeType === Node.TEXT_NODE) {
            var textContent = node.textContent;
            var parent = node.parentNode;

            var hasMatch = false;
            var newContent = document.createDocumentFragment();

            for (var label in rulesPtBr) {
                var rule = rulesPtBr[label];
                var regex = new RegExp(rule.regex); // Criar nova instância para evitar problemas com lastIndex
                var lastIndex = 0;
                var match;

                while ((match = regex.exec(textContent)) !== null) {
                    // Se houver uma condição adicional, verificar
                    if (rule.condition && !rule.condition(match[0])) {
                        continue;
                    }

                    hasMatch = true;

                    // Adiciona o texto antes da correspondência
                    if (match.index > lastIndex) {
                        newContent.appendChild(document.createTextNode(textContent.substring(lastIndex, match.index)));
                    }

                    // Cria o elemento com popover
                    var span = document.createElement('span');
                    span.setAttribute('style', `background: ${rule.color};`);
                    span.setAttribute('tabindex', '0');
                    span.setAttribute('data-bs-toggle', 'popover');
                    span.setAttribute('data-bs-trigger', 'focus');
                    span.setAttribute('data-bs-placement', 'top');
                    span.setAttribute('data-bs-content', rule.message);
                    span.textContent = match[0];
                    newContent.appendChild(span);

                    ruleReplacements[label]++;

                    lastIndex = match.index + match[0].length;

                    // Prevenir loops infinitos em regexes vazias
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                }

                // Se houve correspondência, adiciona o texto restante
                if (hasMatch) {
                    if (lastIndex < textContent.length) {
                        newContent.appendChild(document.createTextNode(textContent.substring(lastIndex)));
                    }
                    break; // Evita aplicar múltiplas regras no mesmo trecho
                }
            }

            if (hasMatch) {
                parent.replaceChild(newContent, node);
            }
        } else {
            // Se for outro tipo de nó, percorrer os filhos
            var children = Array.from(node.childNodes); // Cria uma cópia da lista de filhos
            for (var i = 0; i < children.length; i++) {
                traverseNodes(children[i]);
            }
        }
    }

    traverseNodes(doc.body);

    // Atualiza o resumo das regras aplicadas
    var rulesSummary = "";
    for (var label in rulesPtBr) {
        var count = ruleReplacements[label];
        var summaryText = count === 1 ? rulesPtBr[label].summarySingle : rulesPtBr[label].summary;
        if (count > 0) {
            rulesSummary += `<div class="warning-badge" style="background: ${rulesPtBr[label].color};">
                                <span class="badge bg-secondary">${count}</span>
                                ${summaryText}
                             </div>`;
        }
    }
    document.getElementById('mdviewSummary').innerHTML = rulesSummary;

    // Atualiza o conteúdo do visualizador
    document.getElementById('mdview').innerHTML = doc.body.innerHTML;

    // Atualiza as estatísticas
    var outputText = doc.body.textContent || "";
    var sentences = countSentences(outputText);
    var words = countWords(outputText);
    var characters = outputText.length;
    var warnings = Object.values(ruleReplacements).reduce((a, b) => a + b, 0);

    document.getElementById('sentences').innerHTML = sentences;
    document.getElementById('words').innerHTML = words;
    document.getElementById('characters').innerHTML = characters;
    document.getElementById('warnings').innerHTML = warnings;

    var warningsRatio = warnings / words;
    var warningsClass = "text-success";
    if (warningsRatio > 0.05) {
        warningsClass = "text-danger";
    } else if (warningsRatio > 0.03) {
        warningsClass = "text-warning";
    }
    document.getElementById('warnings').className = warningsClass;

    // Atualiza os índices de leiturabilidade na barra lateral
    updateReadabilityMetrics(outputText);

    loadPopovers();
    hljs.highlightAll();
    addEventListener("beforeunload", beforeUnloadListener, { capture: true });
}

function updateReadabilityMetrics(text) {
    if (!window.textstat) return; // Garante que textstat está carregado
    const metrics = [
        { label: "Flesch Reading Ease (EN)", value: textstat.flesch_reading_ease(text).toFixed(1), type: "flesch" },
        { label: "Flesch-Kincaid Grade", value: textstat.flesch_kincaid_grade(text).toFixed(1) },
        { label: "Flesch BR", value: textstat.flesch_reading_ease_ptbr(text).toFixed(1), type: "flesch" },
        { label: "SMOG", value: textstat.smog_index(text).toFixed(1) },
        { label: "Coleman-Liau", value: textstat.coleman_liau_index(text).toFixed(1) },
        { label: "Gunning Fog", value: textstat.gunning_fog(text).toFixed(1) }
    ];
    const ul = document.getElementById('metrics-list');
    ul.innerHTML = '';
    metrics.forEach(m => {
        const li = document.createElement('li');
        li.textContent = `${m.label}: `;

        const span = document.createElement('span');
        span.textContent = m.value;

        // Destaque visual para Flesch (EN e BR)
        if (m.type === "flesch") {
            const v = parseFloat(m.value);
            if (v >= 60) li.classList.add('easy');
            else if (v >= 30) li.classList.add('medium');
            else li.classList.add('hard');
        }

        li.appendChild(span);
        ul.appendChild(li);
    });
}

// Chama updateView inicialmente e ao mudar o conteúdo do editor
updateView();

let debounceTimer;
editor.session.on('change', function (delta) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateView, 300);
});

// Função para lidar com o upload de arquivo
document.getElementById('upload-button').addEventListener('click', function () {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', function (event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            editor.setValue(e.target.result, -1); // -1 move o cursor para o início
            updateView();
        };
        reader.readAsText(file);
    }
});

// Função para fazer o download do conteúdo do editor
document.getElementById('download-button').addEventListener('click', function () {
    var textToSave = editor.getValue();
    var blob = new Blob([textToSave], { type: "text/markdown;charset=utf-8" });
    var filename = "documento.md";

    if (window.navigator.msSaveOrOpenBlob) {
        // Para IE e Edge
        window.navigator.msSaveBlob(blob, filename);
    } else {
        // Para outros navegadores
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});