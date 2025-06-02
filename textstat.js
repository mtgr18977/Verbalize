// leiturabilidade/textstat.js
const textstat = {
    flesch_reading_ease: function(text) {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]/).filter(Boolean).length;
        // Usa countSyllables genérico/aprimorado
        const syllables = text.split(/\s+/).reduce((acc, word) => acc + countSyllables(word), 0);

        const ASL = sentences === 0 ? 0 : words / sentences;
        const ASW = words === 0 ? 0 : syllables / words;

        // Fórmula Flesch Reading Ease original (Inglês)
        return 206.835 - (1.015 * ASL) - (84.6 * ASW);
    },
    flesch_kincaid_grade: function(text) {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]/).filter(Boolean).length;
        // Usa countSyllables genérico/aprimorado
        const syllables = text.split(/\s+/).reduce((acc, word) => acc + countSyllables(word), 0);

        const ASL = sentences === 0 ? 0 : words / sentences;
        const ASW = words === 0 ? 0 : syllables / words;

        return (0.39 * ASL) + (11.8 * ASW) - 15.59;
    },
    // NOVO: Índice Flesch de Facilidade de Leitura para Português (Brasil)
    flesch_reading_ease_ptbr: function(text) {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]/).filter(Boolean).length;
        // Usamos countSyllables para o português
        const syllables = text.split(/\s+/).reduce((acc, word) => acc + countSyllablesPtBr(word), 0);

        const ASL = sentences === 0 ? 0 : words / sentences;
        const ASW = words === 0 ? 0 : syllables / words;

        // Fórmula Flesch Brasileiro conforme o PDF [cite: 33]
        return 248.835 - (1.015 * ASL) - (84.6 * ASW);
    },
    smog_index: function(text) {
        const words = text.split(/\s+/).length; // Não usado na fórmula SMOG, mas útil para validação
        const sentences = text.split(/[.!?]/).filter(Boolean).length;
        // Conta palavras polissilábicas usando a função de contagem de sílabas genérica
        const polysyllabicWords = text.split(/\s+/).filter(word => countSyllables(word) >= 3).length;

        if (sentences === 0) return 0;
        // SMOG é projetado para inglês, mas usa a contagem de sílabas.
        // A fórmula do PDF [cite: 62] é ligeiramente diferente (3 + sqrt(polysyllabicWords)).
        // A sua atual é 1.043 * Math.sqrt(polysyllabicWords * (30 / sentences)) + 3.1291.
        // Vou manter a sua fórmula atual, mas vamos indicar que é para inglês no relatório.
        return 1.043 * Math.sqrt(polysyllabicWords * (30 / sentences)) + 3.1291;
    },
    coleman_liau_index: function(text) {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]/).filter(Boolean).length;
        const characters = text.replace(/\s+/g, '').length;

        if (words === 0) return 0;
        const L = (characters / words) * 100;
        const S = (sentences / words) * 100;

        return (0.0588 * L) - (0.296 * S) - 15.8;
    },
    automated_readability_index: function(text) {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]/).filter(Boolean).length;
        const characters = text.replace(/\s+/g, '').length;

        if (words === 0 || sentences === 0) return 0;
        return (4.71 * (characters / words)) + (0.5 * (words / sentences)) - 21.43;
    },
    dale_chall_readability_score: function(text) {
        const words = text.split(/\s+/).length;
        if (words === 0) return 0;
        // NOTA: dale_chall_word_list é para inglês.
        const difficultWords = text.split(/\s+/).filter(word => !dale_chall_word_list.includes(word.toLowerCase())).length;

        const percentageDifficultWords = (difficultWords / words) * 100;
        const sentences = text.split(/[.!?]/).filter(Boolean).length;

        if (sentences === 0) return 0;
        const score = (0.1579 * percentageDifficultWords) + (0.0496 * (words / sentences));

        if (percentageDifficultWords > 5) {
            return score + 3.6365;
        } else {
            return score;
        }
    },
    difficult_words: function(text) {
        // Usa countSyllables genérico/aprimorado
        return text.split(/\s+/).filter(word => countSyllables(word) >= 3).length;
    },
    linsear_write_formula: function(text) {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]/).filter(Boolean).length;
        // NOTA: linsear_easy_word_list é para inglês.
        const easyWords = text.split(/\s+/).filter(word => linsear_easy_word_list.includes(word.toLowerCase())).length;

        if (words === 0 || sentences === 0) return 0;
        return (words / sentences) + ((easyWords / words) * 100) * 0.05;
    },
    gunning_fog: function(text) {
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]/).filter(Boolean).length;
        // Usa countSyllables genérico/aprimorado
        const complexWords = text.split(/\s+/).filter(word => countSyllables(word) >= 3).length;

        if (words === 0 || sentences === 0) return 0;
        return 0.4 * ((words / sentences) + (100 * (complexWords / words)));
    },
    text_standard: function(text, lang = 'en-us') { // Adiciona parâmetro de idioma
        let flesch_kincaid_grade_score;
        if (lang === 'pt-br') {
            // Para português, usamos a interpretação do Flesch Brasileiro, que não é um "grau escolar" direto
            // mas podemos mapeá-lo para um nível de ensino brasileiro com base na tabela do PDF[cite: 34].
            // Para manter a consistência com o nome da função (text_standard), vamos retornar a classificação de ensino.
            return interpretFleschReadingEasePtBr(this.flesch_reading_ease_ptbr(text))[0];
        } else {
            flesch_kincaid_grade_score = this.flesch_kincaid_grade(text);
        }

        if (flesch_kincaid_grade_score < 6) {
            return "Ensino Fundamental";
        } else if (flesch_kincaid_grade_score < 12) {
            return "Ensino Médio";
        } else if (flesch_kincaid_grade_score < 16) {
            return "Ensino Superior";
        } else {
            return "Pós-graduação";
        }
    }
};

// Heurística de contagem de sílabas para inglês (aprimorada para ser mais genérica)
// Remove regras específicas de sufixos e foca em grupos de vogais.
function countSyllables(word) {
    word = word.toLowerCase();
    word = word.replace(/[^a-záéíóúâêôãõüç]/g, ''); // Remove caracteres não alfabéticos (mantém acentuados)
    if (word.length === 0) return 0;
    if (word.length <= 3) return 1; // Palavras muito curtas geralmente têm 1 sílaba

    // Heurística: conta grupos de vogais. Isso é uma simplificação.
    // Inclui vogais acentuadas comuns no português.
    const matches = word.match(/[aeiouáéíóúâêôãõü]{1,}/g);
    return matches ? matches.length : 0;
}

// NOVO: Heurística de contagem de sílabas para Português (Brasil)
// Esta é uma heurística simplificada, mas tenta ser mais adequada para o PT-BR.
// Contar sílabas em português é complexo devido a ditongos, tritongos, hiatos, etc.
// Uma solução perfeita exigiria um dicionário ou um analisador fonológico.
function countSyllablesPtBr(word) {
    word = word.toLowerCase();
    word = word.replace(/[^a-záéíóúâêôãõüç]/g, ''); // Remove caracteres não alfabéticos (mantém acentuados)
    if (word.length === 0) return 0;

    let syllables = 0;
    let lastCharVowel = false;
    const vowels = 'aeiouáéíóúâêôãõü';

    // Para evitar que ditongos sejam contados como 2 sílabas, e tentar lidar com hiatos básicos.
    // Esta é uma heurística que ainda pode não ser 100% precisa.
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const isVowel = vowels.includes(char);

        if (isVowel) {
            if (!lastCharVowel) { // Nova sílaba começa com vogal
                syllables++;
            }
        }
        lastCharVowel = isVowel;
    }

    // Ajustes para palavras curtas ou sem vogais, se necessário
    if (syllables === 0 && word.length > 0) return 1; // Ex: "cr" (sem vogal), dar 1 sílaba
    if (word.length <= 3 && syllables === 0) return 1; // Ex: "que" (sem vogal contada)

    return Math.max(1, syllables); // Garante que a palavra tenha pelo menos 1 sílaba
}


const dale_chall_word_list = [
    // Lista de palavras fáceis (em inglês - manter assim já que o índice é para inglês)
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren’t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can’t', 'cannot', 'could', 'couldn’t', 'did', 'didn’t', 'do', 'does', 'doesn’t', 'doing', 'don’t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn’t', 'has', 'hasn’t', 'have', 'haven’t', 'having', 'he', 'he’d', 'he’ll', 'he’s', 'her', 'here', 'here’s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how’s', 'i', 'i’d', 'i’ll', 'i’m', 'i’ve', 'if', 'in', 'into', 'is', 'isn’t', 'it', 'it’s', 'its', 'itself', 'let’s', 'me', 'more', 'most', 'mustn’t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan’t', 'she', 'she’d', 'she’ll', 'she’s', 'should', 'shouldn’t', 'so', 'some', 'such', 'than', 'that', 'that’s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there’s', 'these', 'they', 'they’d', 'they’ll', 'they’re', 'they’ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn’t', 'we', 'we’d', 'we’ll', 'we’re', 'we’ve', 'were', 'weren’t', 'what', 'what’s', 'when', 'when’s', 'where', 'where’s', 'which', 'while', 'who', 'who’s', 'whom', 'why', 'why’s', 'with', 'won’t', 'would', 'wouldn’t', 'you', 'you’d', 'you’ll', 'you’re', 'you’ve', 'your', 'yours', 'yourself', 'yourselves'
];

const linsear_easy_word_list = [
    // Lista de palavras fáceis (em inglês - manter assim já que o índice é para inglês)
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren’t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can’t', 'cannot', 'could', 'couldn’t', 'did', 'didn’t', 'do', 'does', 'doesn’t', 'doing', 'don’t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn’t', 'has', 'hasn’t', 'have', 'haven’t', 'having', 'he', 'he’d', 'he’ll', 'he’s', 'her', 'here', 'here’s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how’s', 'i', 'i’d', 'i’ll', 'i’m', 'i’ve', 'if', 'in', 'into', 'is', 'isn’t', 'it', 'it’s', 'its', 'itself', 'let’s', 'me', 'more', 'most', 'mustn’t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan’t', 'she', 'she’d', 'she’ll', 'she’s', 'should', 'shouldn’t', 'so', 'some', 'such', 'than', 'that', 'that’s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there’s', 'these', 'they', 'they’d', 'they’ll', 'they’re', 'they’ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn’t', 'we', 'we’d', 'we’ll', 'we’re', 'we’ve', 'were', 'weren’t', 'what', 'what’s', 'when', 'when’s', 'where', 'where’s', 'which', 'while', 'who', 'who’s', 'whom', 'why', 'why’s', 'with', 'won’t', 'would', 'wouldn’t', 'you', 'you’d', 'you’ll', 'you’re', 'you’ve', 'your', 'yours', 'yourself', 'yourselves'
];

window.textstat = textstat;