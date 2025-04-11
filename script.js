import { rulesPtBr, applyAllRules } from './rules.js';

// Constants   
let md; 
if (typeof window !== 'undefined') {
    md = window.markdownit().use(window.markdownitFootnote);
}
export const LONG_SENTENCE_MAX_WORDS = 20;

const WARNING_BADGE_CLASS = "warning-badge";


// Function to load Bootstrap popovers
if (typeof window !== 'undefined') {
  function loadPopovers() {
      const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
      popoverTriggerList.map((popoverTrigger) => {
          new bootstrap.Popover(popoverTrigger, {
            trigger: 'hover focus',
            html: true,
          });
      });
  }
}

// Listener para antes de fechar a janela

const beforeUnloadListener = (event) => {
  event.preventDefault();
  return event.returnValue = "Are you sure you want to leave?";
};
// Remove the window check
function loadPopoversAndHighlight() {    
    try {
        if (typeof window !== 'undefined') {
        loadPopovers();
        hljs.highlightAll();
        addEventListener("beforeunload", beforeUnloadListener, { capture: true });
        }
    } catch (error) {
        console.error('Error in loadPopoversAndHighlight:', error);
    }   
  }


// Functions to count words and sentences  
export function countWords(str) {
  const arr = str.trim().split(/\s+/);
  return arr.filter(word => word !== '').length;
}
export function countSentences(str) {    
    const matches = str.match(/[^\.!\?]+[\.!\?]+/g);

    return matches ? matches.length : 0;
}
// Function to render Markdown    


export function renderMarkdown() {
    try {
        if (typeof DOMParser === 'undefined' || !md) {
            return "";
        }
        const markdownContent = md.render('');
        const parser = new DOMParser();
        const parsed = parser.parseFromString(markdownContent, 'text/html');
        if(!parsed){
          return ""; 
        }
        return parsed;
    } catch (error) {
        console.error('Error in renderMarkdown:', error);
      }
}

export function applyRules(doc) {
    let newDoc;
    if (typeof DOMParser !== 'undefined') {
      newDoc = applyAllRules(doc.body.textContent);
    }
    return newDoc;
}


// Function to update the summary  
export function updateSummary(ruleCounts) {
  if (typeof document !== 'undefined') {
      const summaryContainer = document.getElementById('mdviewSummary');
      let summaryHTML = "";
      for (const label in rulesPtBr) {
          const count = ruleCounts[label];
          const summaryText = count === 1 ? rulesPtBr[label].summarySingle : rulesPtBr[label].summary;
          if (count > 0) {
              summaryHTML += `<div class="${WARNING_BADGE_CLASS}" style="background: ${rulesPtBr[label].color};"><span class="badge bg-secondary">${count}</span>${summaryText}</div>`;
          }
      }
      summaryContainer.innerHTML = summaryHTML;
    }
}export function updateStats(ruleCounts) {
  if (typeof document !== 'undefined') {
      let warningsClass = "text-success";
      const outputText = document.getElementById('mdview').textContent || "";
      const sentences = countSentences(outputText);
      const words = countWords(outputText);
      const characters = outputText.length;
      const warnings = Object.values(ruleCounts).reduce((a, b) => a + b, 0);
      const sentencesElement = document.getElementById('sentences');
      const wordsElement = document.getElementById('words');
      const charactersElement = document.getElementById('characters');
      const warningsElement = document.getElementById('warnings');

      const warningsRatio = warnings / words;
      if (warningsRatio > 0.05) {
        warningsClass = "text-danger";
      } else if (warningsRatio > 0.03) {
        warningsClass = "text-warning";
      }
      sentencesElement.textContent = sentences;
      wordsElement.textContent = words;
      charactersElement.textContent = characters;
      warningsElement.textContent = warnings;
      warningsElement.className = warningsClass;

      document.getElementById('warnings').className = warningsClass;
    }
}
function updateView() {
    const doc = renderMarkdown();
    if (doc) {
        if (doc.body) {
            if (typeof window !== 'undefined') {
              if (typeof document !== 'undefined') {
                const mdview = document.getElementById('mdview');                  
                  if (mdview) {
                    mdview.innerHTML = doc.body.innerHTML;
                  }
                }
                const ruleReplacements = applyRules(doc);   
                if (typeof document !== 'undefined') {             updateSummary(ruleReplacements);                updateStats(ruleReplacements);                loadPopoversAndHighlight();}
                
            }
        }        
      }
    }

if (typeof window !== 'undefined') {
  // Chama updateView inicialmente e ao mudar o conteúdo do editor
  updateView();

  // Import the tests and run them only if running in a browser environment
  const { runTests } = await import('./runTests.mjs');
  runTests();
} else {
  console.log('Running in Node.js, skipping browser-specific code.');
}
