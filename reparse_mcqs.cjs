const fs = require('fs');
const path = require('path');

const units = [
  { id: 'DSA unit1', file: '../DSA_unit1.txt' },
  { id: 'DSA unit2', file: '../DSA_unit2.txt' },
  { id: 'DSA unit3', file: '../DSA_unit3.txt' },
  { id: 'DSA unit4', file: '../DSA_unit4.txt' },
  { id: 'DSA unit5', file: '../DSA_unit5.txt' },
];

const results = {};

units.forEach(unit => {
  const filePath = path.resolve(__dirname, unit.file);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Split into content and answer key
  let mainContent = content;
  let answerKeyContent = '';
  
  const lowerContent = content.toLowerCase();
  let splitIndex = -1;
  const markers = ['answer key', '✅ answer key', 'answers:'];
  for (const marker of markers) {
    const idx = lowerContent.lastIndexOf(marker);
    if (idx !== -1) {
      splitIndex = idx;
      break;
    }
  }

  if (splitIndex !== -1) {
    mainContent = content.substring(0, splitIndex);
    answerKeyContent = content.substring(splitIndex);
  }

  // Parse Answers from key
  const answers = {};
  const answerMatches = answerKeyContent.matchAll(/(\d+)\s*[\.\)]?\s*([a-d])(?:\s|$)/gi);
  for (const m of answerMatches) {
    answers[m[1]] = m[2].toLowerCase();
  }

  // Parse Questions
  const questions = [];
  const blocks = mainContent.split(/\n\s*(?=\d+[\.\)])/);

  blocks.forEach(block => {
    const trimmed = block.trim();
    if (!trimmed) return;

    // Check for inline answer first (like "✅ Answer: b")
    let inlineAnswer = "";
    const inlineMatch = trimmed.match(/(?:✅\s*Answer|Answer):\s*([a-d])/i);
    if (inlineMatch) {
      inlineAnswer = inlineMatch[1].toLowerCase();
    }

    // Extract Question Number and Text
    const qMatch = trimmed.match(/^(\d+)[\.\)]\s*([\s\S]+?)(?=\s+[a-d][\)\.])/i);
    let qNum, qText, optionsPart;

    if (qMatch) {
      qNum = qMatch[1];
      qText = qMatch[2].replace(/\s+/g, ' ').trim();
      optionsPart = trimmed.substring(qMatch[0].length);
    } else {
      const firstLineMatch = trimmed.match(/^(\d+)[\.\)]\s*(.*)/);
      if (!firstLineMatch) return;
      qNum = firstLineMatch[1];
      qText = firstLineMatch[2].trim();
      optionsPart = trimmed.substring(trimmed.indexOf('\n') + 1);
    }

    // Extract Options
    const options = [];
    const optMatches = optionsPart.matchAll(/([a-d])[\)\.]\s*([\s\S]+?)(?=\s+[a-d][\)\.]|(?:✅\s*Answer|Answer):|$)/gi);
    for (const m of optMatches) {
      options.push({
        key: m[1].toLowerCase(),
        text: m[2].replace(/\s+/g, ' ').trim().replace(/✅\s*Answer:\s*[a-d]/i, '').trim()
      });
    }

    if (qNum && qText) {
      questions.push({
        id: qNum,
        question: qText,
        options: options,
        answer: answers[qNum] || inlineAnswer || ""
      });
    }
  });

  results[unit.id] = questions;
});

fs.writeFileSync('./src/data/mcqs.json', JSON.stringify(results, null, 2));
console.log('Regenerated mcqs.json successfully!');
