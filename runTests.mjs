import { runTests } from './testRunner.mjs'

if (typeof DOMParser !== 'undefined') {
  await import('./rules.test.mjs')
} else {
  console.log('DOMParser is not defined, skipping Rules tests.')
}

if (typeof document !== 'undefined') {
  await import('./script.test.mjs')
} else {
  console.log('document is not defined, skipping Script tests.')
}
runTests()