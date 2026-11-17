import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeMessage,
  analyzeUrl,
  calculateQuizScore,
  QUIZ_QUESTIONS,
  SCAM_LIBRARY,
  SAFETY_TIPS
} from './logic.js';

test('analyzeMessage rejects empty or whitespace input', () => {
  const res = analyzeMessage('   ');
  assert.equal(res.isValid, false);
  assert.ok(res.error && res.error.length > 0);
});

test('analyzeMessage detects multiple high-risk indicators in KYC/OTP scam', () => {
  const sample =
    'URGENT: Your bank account will be blocked today. Update KYC and share OTP immediately at http://sbi-kyc.xyz/login';
  const res = analyzeMessage(sample);
  assert.equal(res.isValid, true);
  assert.equal(res.riskLevel, 'high');
  assert.ok(res.indicatorCount >= 4);
  assert.ok(res.indicators.some((i) => i.id === 'otp_request'));
  assert.ok(res.indicators.some((i) => i.id === 'account_blocking'));
  assert.ok(res.indicators.some((i) => i.id === 'suspicious_links'));
});

test('analyzeMessage does not claim 100% safe when no indicators match', () => {
  const res = analyzeMessage('Hi Mom, I reached home safely. Let us have dinner at 8 PM.');
  assert.equal(res.isValid, true);
  assert.equal(res.riskLevel, 'low');
  assert.equal(res.indicatorCount, 0);
  assert.match(res.summaryNote, /does not guarantee safety/i);
  assert.doesNotMatch(res.summaryNote, /100% safe/i);
});

test('analyzeUrl rejects empty and malformed URLs', () => {
  assert.equal(analyzeUrl('').isValid, false);
  assert.equal(analyzeUrl('not a valid url').isValid, false);
  assert.equal(analyzeUrl('javascript:alert(1)').isValid, false);
});

test('analyzeUrl detects IP address, HTTP, @ symbol, and brand impersonation', () => {
  const res = analyzeUrl('http://192.168.1.50/sbi-kyc-update@evil.xyz/verify');
  assert.equal(res.isValid, true);
  assert.equal(res.riskLevel, 'high');
  assert.ok(res.indicators.some((i) => /IP-Address/i.test(i.title)));
  assert.ok(res.indicators.some((i) => /HTTP/i.test(i.title)));
  assert.ok(res.indicators.some((i) => /@/i.test(i.title)));
  assert.ok(res.indicators.some((i) => /SBI/i.test(i.title)));
});

test('analyzeUrl handles official bank domain cleanly with no false impersonation warning', () => {
  const res = analyzeUrl('https://onlinesbi.sbi');
  assert.equal(res.isValid, true);
  assert.equal(res.riskLevel, 'low');
  assert.equal(res.indicatorCount, 0);
});

test('educational datasets cover all 8 scam types, 8 safety topics, and 10 quiz questions', () => {
  assert.equal(SCAM_LIBRARY.length, 8);
  assert.equal(SAFETY_TIPS.length, 8);
  assert.equal(QUIZ_QUESTIONS.length, 10);
});

test('calculateQuizScore computes exact score and per-question review', () => {
  const allCorrect = QUIZ_QUESTIONS.map((q) => q.correctIndex);
  const perfect = calculateQuizScore(QUIZ_QUESTIONS, allCorrect);
  assert.equal(perfect.score, 10);
  assert.equal(perfect.total, 10);
  assert.equal(perfect.percentage, 100);

  const halfCorrect = QUIZ_QUESTIONS.map((q, idx) =>
    idx < 5 ? q.correctIndex : (q.correctIndex + 1) % q.options.length
  );
  const partial = calculateQuizScore(QUIZ_QUESTIONS, halfCorrect);
  assert.equal(partial.score, 5);
  assert.equal(partial.percentage, 50);
  assert.equal(partial.review.length, 10);
});
