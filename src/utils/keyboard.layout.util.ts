const mappingTh: Record<string, string> = {
  ๅ: '1',
  '+': '!',
  '๑': '@',
  '/': '2',
  '-': '3',
  '๒': '#',
  ภ: '4',
  '๓': '$',
  ถ: '5',
  '๔': '%',
  'ุ': '6',
  'ู': '^',
  'ึ': '7',
  '฿': '&',
  ค: '8',
  '๕': '*',
  ต: '9',
  '๖': '(',
  จ: '0',
  '๗': ')',
  ข: '-',
  '๘': '_',
  ช: '=',
  '๙': '+',
  ๆ: 'q',
  '๐': 'Q',
  ไ: 'w',
  '"': 'W',
  ำ: 'e',
  ฎ: 'E',
  พ: 'r',
  ฑ: 'R',
  ะ: 't',
  ธ: 'T',
  'ั': 'y',
  'ํ': 'Y',
  'ี': 'u',
  '๊': 'U',
  ร: 'i',
  ณ: 'I',
  น: 'o',
  ฯ: 'O',
  ย: 'p',
  ญ: 'P',
  บ: '[',
  ฐ: '{',
  ล: ']',
  '|': '}',
  ฃ: '\\',
  ฅ: '|',
  ฟ: 'a',
  ฤ: 'A',
  ห: 's',
  ฆ: 'S',
  ก: 'd',
  ฏ: 'D',
  ด: 'f',
  โ: 'F',
  เ: 'g',
  ฌ: 'G',
  '้': 'h',
  '็': 'H',
  '่': 'j',
  '๋': 'J',
  า: 'k',
  ษ: 'K',
  ส: 'l',
  ศ: 'L',
  ว: ';',
  ซ: ':',
  ง: "'",
  '.': '"',
  ผ: 'z',
  '(': 'Z',
  ป: 'x',
  ')': 'X',
  แ: 'c',
  ฉ: 'C',
  อ: 'v',
  ฮ: 'V',
  'ิ': 'b',
  'ฺ': 'B',
  'ื': 'n',
  '์': 'N',
  ท: 'm',
  '?': 'M',
  ม: '|',
  ฒ: '<',
  ใ: '.',
  ฬ: '>',
  ฝ: '/',
  ฦ: '?',
}

export function convertEn(thaiWord: string) {
  if (!/^[\u0E00-\u0E7F]/.test(thaiWord)) return thaiWord
  const mapping = thaiWord.split('').map((ch) => mappingTh[ch] || ch)
  return mapping.join('')
}