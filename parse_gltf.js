const fs = require('fs');
const data = JSON.parse(fs.readFileSync('static/vrgallerygltf/galleryedit.gltf', 'utf8'));

data.nodes.forEach((node, i) => {
  if (node.name && node.name.toLowerCase().includes('wall')) {
    console.log(`Node ${i}: ${node.name}`);
    if (node.translation) console.log(`  Translation: ${node.translation}`);
    if (node.scale) console.log(`  Scale: ${node.scale}`);
  }
});
