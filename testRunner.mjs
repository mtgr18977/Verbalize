export const testSuites = [];

export function describe(description, fn) {
  testSuites.push({ description, fn });
}

export function it(description, fn) {
  return { description, fn };
}

export function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
  };
}

export function runTests() {
  console.log('\nRunning tests...');

  testSuites.forEach((suite) => {
    console.log(`\nSuite: ${suite.description}`);
    const tests = suite.fn();
    let passed = 0;
    let failed = 0;
    tests.forEach((test) => {
      try {
        test.fn();
        console.log(`  ✓ ${test.description}`);
        passed++;
      } catch (error) {
        console.error(`  ✕ ${test.description}`);
        console.error(`    ${error.message}`);
        failed++;
      }
    });
    console.log(`  Passed: ${passed}, Failed: ${failed}`);
  });

  console.log('\nTests finished.');
}