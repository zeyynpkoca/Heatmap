
const fs = require('fs');
const MapSectionId = require('./MapSectionId.json')


// Dönüşüm fonksiyonu
function convertCoordinates(item) {
  const latRad = 2 * Math.atan(Math.exp(item.Latitude / 6378137)) - Math.PI / 2;
  const latDeg = (latRad * 180) / Math.PI;
  const lonDeg = (item.Longitude / 20037508.34) * 180;

  item.Latitude = latDeg;
  item.Longitude = lonDeg;
}

const outputArray = [];

for (const item of MapSectionId) {
    const newItem = { ...item }; 
    convertCoordinates(newItem);
    console.log(item+" bastım.")
    outputArray.push(newItem);
}

// Yeni JSON verisini dosyaya yaz
fs.writeFileSync('yeni_veri.json', JSON.stringify(outputArray, null, 2), 'utf-8');