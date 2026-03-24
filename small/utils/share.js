function buildShareToken(caseId) {
  return `LAIAN-${String(caseId).split('').reverse().join('')}-SHARE`;
}

function parseShareToken(token) {
  const match = String(token || '').match(/^LAIAN-(.+)-SHARE$/);
  if (!match) {
    return '';
  }

  return match[1].split('').reverse().join('');
}

module.exports = {
  buildShareToken,
  parseShareToken
};
