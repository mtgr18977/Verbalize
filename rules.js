// rules.js
const rulesPtBr = {
    "fraseLonga": {
        "regex": /([^.?!]+[.?!]+)/g,
        "message": "Esta frase é muito longa. Considere dividir em sentenças menores.",
        "color": "#f4cccc",
        "summary": " frases longas detectadas.",
        "summarySingle": " frase longa detectada.",
        "condition": function (match) {
            const wordCount = match.trim().split(/\s+/).length;
            return wordCount > 20;
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
};

function applyAllRules(text) {
    const ruleReplacements = {};
    for (var label in rulesPtBr) {
        ruleReplacements[label] = 0;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<span>${text}</span>`, 'text/html');
    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            var textContent = node.textContent;
            var parent = node.parentNode;

            var hasMatch = false;
            var newContent = document.createDocumentFragment();

            for (var label in rulesPtBr) {
                var rule = rulesPtBr[label];
                var regex = new RegExp(rule.regex);
                var lastIndex = 0;
                var match;

                while ((match = regex.exec(textContent)) !== null) {
                    if (rule.condition && !rule.condition(match[0])) {
                        continue;
                    }

                    hasMatch = true;

                    if (match.index > lastIndex) {
                        newContent.appendChild(document.createTextNode(textContent.substring(lastIndex, match.index)));
                    }

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

    return {
        html: doc.body.innerHTML,
        ruleReplacements: ruleReplacements
    };
}

export { rulesPtBr, applyAllRules };