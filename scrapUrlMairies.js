import fetch from 'node-fetch';
import fs from 'fs';

function writeFile(page, data) {
  console.log('Écriture en cours');
  fs.appendFileSync('mairies.txt', 'page : ' + page + '\n');
  fs.appendFileSync('mairies.txt', data + '\n');
  console.log('Écriture finie');
  return 0;
}

function clearFile() {
  fs.writeFileSync('mairies.txt', '');
}

async function httpGet(url, page)
{
  const response = await fetch(url);
  const body = await response.text();
  const lines = body
      .split('"')
      .filter(txt => txt.trim().startsWith('https://lannuaire.service-public.fr/'))
      .filter(url => 
        !url.match('recherche') 
        && !url.match('theme') 
        && !url.match('navigation')
        && !url.match('navigation')
        && url.length > 36
      );
  console.log(lines.length + ' URL trouvées')
  return await writeFile(page, lines.join('\n'));
}

clearFile();

for (let page = 1; page < 1199; page++) {
  console.log('get de la page : ' + page);
  await httpGet("https://lannuaire.service-public.fr/navigation/mairie?page=" + page, page);
  await new Promise(resolve => setTimeout(resolve, 500));
}
