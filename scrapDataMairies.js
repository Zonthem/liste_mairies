import fetch from 'node-fetch';
import fs from 'fs';

var isFileNew = false;

function readUrlFromFile() {
  const data = fs.readFileSync('mairies.txt', { encoding: 'utf8', flag: 'r' });
  return data.split('\n').filter(ln => !ln.startsWith('page') && ln.length > 0);
}

function clearFile() {
  fs.writeFileSync('data.json', '[\n');
  isFileNew = true;
}

function endJsonFile() {
  fs.appendFileSync('data.json', ']', 'utf8');
}

function writeFile(data) {
  console.log('Écriture : ' + JSON.parse(data).name);
  if (!isFileNew) {
    fs.appendFileSync('data.json', ',\n', 'utf8');
  }
  fs.appendFileSync('data.json', data, 'utf8');
  isFileNew = false;
}

async function httpGet(url)
{
  const response = await fetch(url);
  const body = await response.text();
  return body.split('<script type="application/ld+json" data-test="micro-datas-ld-json">')[1].split('</script>')[0];
}

clearFile();
const urlList = readUrlFromFile();
for (let url of urlList) {
  console.log('mairie suivante : ' + url);
  writeFile(await httpGet(url));
  await new Promise(resolve => setTimeout(resolve, 500));
}
endJsonFile();
