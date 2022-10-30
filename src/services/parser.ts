function parseText(text: string, type: string) {
  const newLines = text.split(/\r?\n|\r|\n/g).filter(i => i);
  const obj: Record<string, []> = {};
  const csvRegex = /,(?!\s)/g;
  const prnRegex = /(?<!,)\s{2,}|(?<=Postcode|Limit)\s|\s(?=\d{8}|\d{4}\s)/g;
  const regexToUse = type === 'text/csv' ? csvRegex : prnRegex;

  newLines.forEach((line, idx) => {
    const values = line.split(regexToUse);

    if (idx === 0) {
      values.forEach(val => obj[val] = [])
    } else {
      const keys = Object.keys(obj);
      values.forEach((val, i) => {
        // @ts-ignore
        obj[keys[i]].push(parseValues(val, type, keys[i]));
      });
    }
  })

  return JSON.stringify(obj, null, 2);
}


function parseValues(val: string, type: string, key: string) {
  const parsed = val.replace(/["\\]/g, '');

  if (key === 'Birthday') {
    return formatMonth(parsed, type)
  }

  if (key === 'Credit Limit') {
    return formatNumber(parsed, type);
  }
  return parsed;
}


function formatMonth(val: string, type: string) {
  let day = '';
  let month = '';
  let year = '';
  if (type === 'text/csv') {
    const arr = val.split('/');
    day = arr[0];
    month = arr[1];
    year = arr[2];
  } else {
    year = val.substring(0, 4);
    month = val.substring(4, 6);
    day = val.substring(6, 8)
  }
  return new Date(`${year}, ${month}, ${day}`).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatNumber(val: string, type: string) {
  let parsed = parseFloat(val).toFixed(2);
  if (type !== 'text/csv') {
    // @ts-ignore
    parsed = parsed / 100;
  }
  // return val; // uncomment to test diff
  return Number(parsed).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function useParser() {
  return {
    formatNumber,
    formatMonth,
    parseValues,
    parseText
  }
}