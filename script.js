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

// Variável para armazenar as regras de acordo com o idioma selecionado
let rules = {};
let currentLanguage = 'pt-br';
let lastRuleCounts = {};
let lastReadabilityMetrics = [];
let customRules = null;

// Módulos do Node disponíveis apenas no ambiente Electron
let fs = null;
let path = null;
if (typeof window.require === 'function') {
    try {
        fs = window.require('fs');
        path = window.require('path');
    } catch (e) {
        console.warn('Módulos Node não disponíveis:', e);
    }
}

// Obtenha a chave da API da Maritaca do processo principal
// Verifique se estamos no ambiente Electron antes de tentar importar ipcRenderer


// NOVO: Função para carregar as regras do JSON de acordo com o idioma
async function loadRules(lang = currentLanguage) {
    currentLanguage = lang;
    try {
        let jsonRules;
        if (customRules) {
            jsonRules = customRules;
        } else {
            const response = await fetch('rules.json');
            if (!response.ok) {
                throw new Error(`Erro ao carregar rules.json: ${response.statusText}`);
            }
            jsonRules = await response.json();
        }

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
    lastRuleCounts = ruleReplacements;

    var warningsRatio = warnings / words;
    var warningsClass = "text-success";
    if (warningsRatio > 0.05) {
        warningsClass = "text-danger";
    } else if (warningsRatio > 0.03) {
        warningsClass = "text-warning";
    }
    document.getElementById('warnings').className = warningsClass;

    // Atualiza os índices de leiturabilidade na barra lateral
    lastReadabilityMetrics = updateReadabilityMetrics(outputText);

    loadPopovers();
    hljs.highlightAll();
    addEventListener("beforeunload", beforeUnloadListener, { capture: true });
    // Atualiza o título da janela com o número de palavras
    document.title = `Verbalize - ${words} palavras`;
    lastReadabilityMetrics = updateReadabilityMetrics(outputText);
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
    return metrics;
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

// Upload de arquivo de regras personalizado
document.getElementById('upload-rules-button').addEventListener('click', function () {
    document.getElementById('rules-file-input').click();
});

document.getElementById('rules-file-input').addEventListener('change', function (event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                customRules = JSON.parse(e.target.result);
                loadRules().then(updateView);
            } catch (err) {
                console.error('Erro ao processar arquivo de regras:', err);
            }
        };
        reader.readAsText(file);
    }
});

// ====== Editor das regras ======
let loadedRulesJson = null;

function populateRulesForm(json) {
    const container = document.getElementById('rules-form');
    container.innerHTML = '';
    for (const lang in json) {
        const langDiv = document.createElement('div');
        langDiv.classList.add('mb-4');
        const h4 = document.createElement('h4');
        h4.textContent = lang;
        langDiv.appendChild(h4);
        const langRules = json[lang];
        for (const ruleKey in langRules) {
            const rule = langRules[ruleKey];
            const fieldset = document.createElement('fieldset');
            fieldset.classList.add('border', 'p-2', 'mb-3');
            const legend = document.createElement('legend');
            legend.classList.add('w-auto', 'px-2');
            legend.textContent = ruleKey;
            fieldset.appendChild(legend);
            for (const prop in rule) {
                const group = document.createElement('div');
                group.classList.add('mb-2');
                const label = document.createElement('label');
                label.classList.add('form-label');
                label.setAttribute('for', `${lang}-${ruleKey}-${prop}`);
                label.textContent = prop;
                let input;
                if (prop === 'message' || prop === 'suggestion' || prop === 'condition') {
                    input = document.createElement('textarea');
                    input.rows = 2;
                } else {
                    input = document.createElement('input');
                    input.type = 'text';
                }
                input.classList.add('form-control');
                input.id = `${lang}-${ruleKey}-${prop}`;
                input.value = rule[prop];
                group.appendChild(label);
                group.appendChild(input);
                fieldset.appendChild(group);
            }
            langDiv.appendChild(fieldset);
        }
        container.appendChild(langDiv);
    }
}

function openRulesEditor() {
    fetch('rules.json')
        .then(r => r.json())
        .then(json => {
            loadedRulesJson = json;
            populateRulesForm(json);
            const modal = new bootstrap.Modal(document.getElementById('editRulesModal'));
            modal.show();
        })
        .catch(err => console.error('Erro ao carregar rules.json para edição:', err));
}

function saveRulesFromForm() {
    if (!loadedRulesJson) return;
    const result = {};
    for (const lang in loadedRulesJson) {
        result[lang] = {};
        for (const ruleKey in loadedRulesJson[lang]) {
            const rule = {};
            for (const prop in loadedRulesJson[lang][ruleKey]) {
                const element = document.getElementById(`${lang}-${ruleKey}-${prop}`);
                if (element) {
                    rule[prop] = element.value;
                }
            }
            result[lang][ruleKey] = rule;
        }
    }

    if (fs) {
        try {
            const filePath = path.join(__dirname, 'rules.json');
            fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf8');
            alert('Regras salvas com sucesso!');
            customRules = result;
            loadRules().then(updateView);
        } catch (e) {
            console.error('Erro ao salvar regras:', e);
            alert('Erro ao salvar regras.');
        }
    } else {
        alert('Salvar não disponível no modo web. Utilize a versão desktop.');
    }
    const modalEl = document.getElementById('editRulesModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}

document.getElementById('edit-rules-button').addEventListener('click', openRulesEditor);
document.getElementById('save-rules-button').addEventListener('click', saveRulesFromForm);

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

// Gera o relatório em Markdown
function generateReport() {
    let report = '# Relatório de Análise\n\n';
    report += `Sentenças: ${document.getElementById('sentences').textContent}\n`;
    report += `Palavras: ${document.getElementById('words').textContent}\n`;
    report += `Caracteres: ${document.getElementById('characters').textContent}\n`;
    report += `Avisos: ${document.getElementById('warnings').textContent}\n\n`;

    report += '## Índices de Leitura\n';
    if (Array.isArray(lastReadabilityMetrics)) {
        lastReadabilityMetrics.forEach(m => {
            report += `- **${m.label}**: ${m.value}\n`;
        });
    }

    report += '\n## Avisos\n';
    for (const label in lastRuleCounts) {
        const count = lastRuleCounts[label];
        if (count > 0) {
            const summaryText = count === 1 ? rules[label].summarySingle : rules[label].summary;
            report += `- ${summaryText}: ${count}\n`;
        }
    }
    return report;
}

// Faz o download do relatório em Markdown
document.getElementById('download-report').addEventListener('click', function () {
    const reportContent = generateReport();
    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8' });
    const filename = 'relatorio.md';

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
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

// ====== Theme Handling ======
function setTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    editor.setTheme(theme === 'dark' ? 'ace/theme/custom_dark' : 'ace/theme/chrome');
    localStorage.setItem('verbalize-theme', theme);
    updateView();
}

var themeSelector = document.getElementById('theme-selector');
if (themeSelector) {
    var saved = localStorage.getItem('verbalize-theme') || 'light';
    themeSelector.value = saved;
    setTheme(saved);
    themeSelector.addEventListener('change', function (e) {
        setTheme(e.target.value);
    });
}

// ====== Keyboard Shortcuts ======
function wrapSelection(wrapper) {
    var range = editor.getSelectionRange();
    var value = editor.session.getTextRange(range);
    editor.session.replace(range, wrapper + value + wrapper);
}

editor.commands.addCommand({
    name: 'bold',
    bindKey: {win: 'Ctrl-B', mac: 'Command-B'},
    exec: function(){ wrapSelection('**'); }
});

editor.commands.addCommand({
    name: 'italic',
    bindKey: {win: 'Ctrl-I', mac: 'Command-I'},
    exec: function(){ wrapSelection('*'); }
});

editor.commands.addCommand({
    name: 'toggleTheme',
    bindKey: {win: 'Ctrl-D', mac: 'Command-D'},
    exec: function(){
        var current = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        if(themeSelector) themeSelector.value = next;
        setTheme(next);
    }
});
