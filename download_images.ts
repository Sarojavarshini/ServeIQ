import fs from 'fs';
import https from 'https';
import path from 'path';

const urls = [
  'https://storage.googleapis.com/aistudio-user-assets/2026-03-21/1742662062638_medu_vada.png',
  'https://storage.googleapis.com/aistudio-user-assets/2026-03-21/1742662062640_ghee_roast.png',
  'https://storage.googleapis.com/aistudio-user-assets/2026-03-21/1742662062641_filter_coffee.png',
  'https://storage.googleapis.com/aistudio-user-assets/2026-03-21/1742662062643_chicken_65.png'
];

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

urls.forEach(url => {
  const filename = url.split('/').pop();
  if (!filename) return;
  const filePath = path.join(publicDir, filename);
  
  https.get(url, (res) => {
    console.log(`${filename}: ${res.statusCode}`);
    if (res.statusCode === 200) {
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
      });
    } else {
      console.error(`Failed to download ${filename}: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}: ${err.message}`);
  });
});
