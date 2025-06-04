// Inicialização do editor Ace
var editor = ace.edit("editor");

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        editor.setTheme('ace/theme/monokai');
    } else {
        document.body.classList.remove('dark-theme');
        editor.setTheme('ace/theme/chrome');
    }
    localStorage.setItem('editor-theme', theme);
    var selector = document.getElementById('theme-selector');
    if (selector) selector.value = theme;
}

var savedTheme = localStorage.getItem('editor-theme') || 'light';
setTheme(savedTheme);
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

// Variável para armazenar as regras de acordo com o idioma selecionado
let rules = {};
let currentLanguage = 'pt-br';

// Obtenha a chave da API da Maritaca do processo principal
// Verifique se estamos no ambiente Electron antes de tentar importar ipcRenderer


// NOVO: Função para carregar as regras do JSON de acordo com o idioma
async function loadRules(lang = currentLanguage) {
    currentLanguage = lang;
    try {
        const response = await fetch('rules.json');
        if (!response.ok) {
            throw new Error(`Erro ao carregar rules.json: ${response.statusText}`);
        }
        const jsonRules = await response.json();

        const selected = jsonRules[lang] || {};
        rules = {};

        for (const key in selected) {
            if (selected.hasOwnProperty(key)) {
                const rule = selected[key];
                rule.regex = new RegExp(rule.regex, 'gi');
                if (rule.condition && typeof rule.condition === 'string') {
                    rule.condition = new Function('match', rule.condition);
                }
                rules[key] = rule;
            }
        }
        console.log('Regras carregadas com sucesso para', lang, rules);
    } catch (error) {
        console.error("Falha ao carregar ou processar as regras:", error);
        // Fallback para regras vazias se o carregamento falhar
        rules = {};
    }
}


// Função para atualizar a visualização
function updateView() {
    // Renderiza o Markdown em um elemento DOM
    var mdContent = md.render(editor.getValue());
    var parser = new DOMParser();
    var doc = parser.parseFromString(mdContent, 'text/html');

    var ruleReplacements = {};
    for (var label in rules) {
        ruleReplacements[label] = 0;
    }

   function traverseNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        var textContent = node.textContent;
        var parent = node.parentNode;

        var hasMatch = false;
        var newContent = document.createDocumentFragment();

        for (var label in rules) {
            var rule = rules[label];
            // Use a regex já criada a partir do JSON
            var regex = rule.regex;
            regex.lastIndex = 0; // Resetar para cada nova busca no textContent
            var lastIndex = 0;
            var match;

            while ((match = regex.exec(textContent)) !== null) {
                // Condição agora é uma função (se existir)
                if (rule.condition && !rule.condition(match[0])) {
                    continue;
                }

                hasMatch = true;

                if (match.index > lastIndex) {
                    newContent.appendChild(document.createTextNode(textContent.substring(lastIndex, match.index)));
                }

                // Cria o elemento com popover e botão IA
                var span = document.createElement('span');
                span.setAttribute('style', `background: ${rule.color};`);
                span.setAttribute('tabindex', '0');
                span.setAttribute('data-bs-toggle', 'popover');
                span.setAttribute('data-bs-trigger', 'focus');
                span.setAttribute('data-bs-placement', 'top');
                span.setAttribute('data-bs-html', 'true');
                span.setAttribute('data-bs-content', `
                    <div><strong>${rule.message}</strong></div>
                    <div style="margin-top:6px;"><em>Sugestão:</em> ${rule.suggestion || ''}</div>
                `);
                span.textContent = match[0];
                newContent.appendChild(span);

                ruleReplacements[label]++;

                lastIndex = match.index + match[0].length;

                if (match.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
            }

            if (hasMatch) {
                if (lastIndex < textContent.length) {
                    newContent.appendChild(document.createTextNode(textContent.substring(lastIndex)));
                }
                break;
            }
        }

        if (hasMatch) {
            parent.replaceChild(newContent, node);
        }
    } else {
        var children = Array.from(node.childNodes);
        for (var i = 0; i < children.length; i++) {
            traverseNodes(children[i]);
        }
    }
}

    traverseNodes(doc.body);

    // Atualiza o resumo das regras aplicadas
    var rulesSummary = "";
    for (var label in rules) {
        var count = ruleReplacements[label];
        var summaryText = count === 1 ? rules[label].summarySingle : rules[label].summary;
        if (count > 0) {
            rulesSummary += `<div class="warning-badge" style="background: ${rules[label].color};">
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
    // Atualiza o título da janela com o número de palavras
    document.title = `Verbalize - ${words} palavras`;
    updateReadabilityMetrics(outputText);
}
// Função para atualizar os índices de leiturabilidade
function updateReadabilityMetrics(text) {
    if (!window.textstat) return; // Garante que textstat está carregado
    const metrics = [
        { label: "Flesch Reading Ease (EN)", value: textstat.flesch_reading_ease(text).toFixed(1), type: "flesch" },
        { label: "Flesch-Kincaid Grade", value: textstat.flesch_kincaid_grade(text).toFixed(1) },
        { label: "Flesch BR", value: textstat.flesch_reading_ease_ptbr(text).toFixed(1), type: "flesch" },
        { label: "SMOG", value: textstat.smog_index(text).toFixed(1) },
        { label: "Coleman-Liau", value: textstat.coleman_liau_index(text).toFixed(1) },
        { label: "Gunning Fog", value: textstat.gunning_fog(text).toFixed(1) },
        { label: "Automated Readability", value: textstat.automated_readability_index(text).toFixed(1) },
        { label: "Dale-Chall", value: textstat.dale_chall_readability_score(text).toFixed(1) },
        { label: "Linsear Write", value: textstat.linsear_write_formula(text).toFixed(1) }
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

        if (m.type === 'flesch') {
            const bar = document.createElement('div');
            bar.className = 'metric-bar';
            const inner = document.createElement('div');
            inner.className = 'metric-bar-inner';
            const width = Math.max(0, Math.min(100, parseFloat(m.value)));
            inner.style.width = width + '%';
            bar.appendChild(inner);
            li.appendChild(bar);
        }

        ul.appendChild(li);
    });
}

// Chama updateView inicialmente e ao mudar o conteúdo do editor
// AGORA CHAMAOS updateView SOMENTE DEPOIS QUE AS REGRAS FOREM CARREGADAS
loadRules().then(() => {
    updateView();
});

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

// Alteração de idioma via seletor
var langSelector = document.getElementById('language-selector');
if (langSelector) {
    langSelector.addEventListener('change', function (e) {
        loadRules(e.target.value).then(updateView);
    });
}

var themeSelector = document.getElementById('theme-selector');
if (themeSelector) {
    themeSelector.addEventListener('change', function (e) {
        setTheme(e.target.value);
    });
}

// Keyboard shortcuts for upload (Ctrl+O) and download (Ctrl+S)
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        document.getElementById('download-button').click();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        document.getElementById('file-input').click();
    }
});
