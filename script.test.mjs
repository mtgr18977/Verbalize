import { countWords, countSentences, renderMarkdown, updateStats, applyRules, updateSummary, LONG_SENTENCE_MAX_WORDS } from './script.js';
import { describe, it, expect } from './testRunner.mjs';

describe('Script', () => {
    return [
        it('should count zero words in an empty string', () => {
            expect(countWords('')).toBe(0);
        }),
        it('should count one word', () => {
            expect(countWords('word')).toBe(1);
        }),
        it('should count multiple words', () => {
            expect(countWords('multiple words here')).toBe(3);
        }),
        it('should ignore leading/trailing spaces', () => {
            expect(countWords('  leading and trailing spaces  ')).toBe(4);
        }),
        it('should ignore multiple spaces between words', () => {
            expect(countWords('multiple   spaces   here')).toBe(3);
        }),
        it('should count zero sentences in an empty string', () => {
            expect(countSentences('')).toBe(0);
        }),
        it('should count one sentence', () => {
            expect(countSentences('This is a sentence.')).toBe(1);
        }),
        it('should count multiple sentences', () => {
            expect(countSentences('Sentence one. Sentence two? Sentence three!')).toBe(3);
        }),
        it('should render empty markdown', () => {
            expect(renderMarkdown('')).toBe('');
        }),
        it('should render markdown', () => {
            expect(renderMarkdown('# Title')).toContain('<h1>Title</h1>');
        }),
        it('should update stats with empty text', () => {
            const stats = updateStats('');
            expect(stats.sentences).toBe(0);
            expect(stats.words).toBe(0);
            expect(stats.characters).toBe(0);
            expect(stats.warnings).toBe(0);
        }),
        it('should update stats with a full text', () => {
            const stats = updateStats('One two three.');
            expect(stats.sentences).toBe(1);
            expect(stats.words).toBe(3);
            expect(stats.characters).toBe(14);
        }),
        it('should have zero warnings with empty text', () => {
          const result = applyRules('');
          const warnings = Object.values(result).reduce((a, b) => a + b, 0);
          expect(warnings).toBe(0);
        }),
        it('should have multiple warnings', () => {
          const result = applyRules('This text has a very longwordcalledsupercalifragilisticexpialidocious and it is very important to think outside the box. It was done by me.');
          const warnings = Object.values(result).reduce((a, b) => a + b, 0);
          expect(warnings).toBeGreaterThan(1);
        }),
        it('should update summary with no warnings', () => {
          const summary = updateSummary({});
          expect(summary).toBe('');
        }),
        it('should update summary with warnings', () => {
          const summary = updateSummary({ fraseLonga: 1 });
          expect(summary).toContain('frase longa detectada.');
        }),
        it('should update summary with multiple warnings', () => {
          const summary = updateSummary({ fraseLonga: 2, palavraComplexa: 1 });
          expect(summary).toContain('frases longas detectadas.');
          expect(summary).toContain('palavra complexa detectada.');
        }),
    ];
});