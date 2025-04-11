import { applyAllRules } from './rules.js';
import { describe, it, expect } from './testRunner.mjs';

describe('Rules', () => {
    return [
        it('should not have warnings with empty text', () => {
            const result = applyAllRules('');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBe(0);
        }),
        it('should not have warnings without rule violations', () => {
            const result = applyAllRules('This is a simple text.');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBe(0);
        }),
        it('should have long sentence warning', () => {
            const result = applyAllRules('This is a very long sentence that should trigger a warning because it exceeds the maximum allowed length.');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBeGreaterThan(0);
        }),
        it('should have complex word warning', () => {
            const result = applyAllRules('This text has a very longwordcalledsupercalifragilisticexpialidocious.');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBeGreaterThan(0);
        }),
        it('should have passive voice warning', () => {
            const result = applyAllRules('The book was read by John.');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBeGreaterThan(0);
        }),
        it('should have adverb warning', () => {
            const result = applyAllRules('He walked quickly.');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBeGreaterThan(0);
        }),
        it('should have cliché warning', () => {
            const result = applyAllRules('He will think outside the box.');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBeGreaterThan(0);
        }),
        it('should have jargon warning', () => {
            const result = applyAllRules('We need to leverage our core business.');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBeGreaterThan(0);
        }),
        it('should have transition warning', () => {
            const result = applyAllRules('Thus, the result will be the best.');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBeGreaterThan(0);
        }),
        it('should have double negation warning', () => {
            const result = applyAllRules('He did not do nothing.');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBeGreaterThan(0);
        }),
        it('should have word repetition warning', () => {
            const result = applyAllRules('This test test should return a warning');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBeGreaterThan(0);
        }),
        it('should have multiple warnings', () => {
            const result = applyAllRules('This text has a very longwordcalledsupercalifragilisticexpialidocious and it is very important to think outside the box.');
            const warnings = Object.values(result).reduce((a, b) => a + b, 0);
            expect(warnings).toBeGreaterThan(1);
        })
    ];
});