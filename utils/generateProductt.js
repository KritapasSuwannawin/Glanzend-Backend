const fs = require('fs');

const colorCodeArr = [
  '#E52828',
  '#5E5B5B',
  '#FDC4DF',
  '#F1DBBA',
  '#C4A370',
  '#A4B2CE',
  '#A7D3A0',
  '#C4C4C4',
  '#F08080',
  '#FF69B4',
  '#FF7F50',
  '#FFDAB9',
  '#EE82EE',
  '#9370DB',
  '#98FB98',
];

const collectionArr = ['autumn', 'summer', 'spring'];

const categoryArr = ['rings', 'earrings', 'bracelets', 'necklaces', 'waist chains'];

const materialArr = [
  'gold',
  'metal',
  'silver',
  'diamond',
  'copper',
  'titanium',
  'platinum',
  'aluminium',
  'pearl',
  'textile',
  'glass',
  'topaz',
  'wood',
  'zircon',
  'brass',
];

function generateProduct() {
  // (name, collection_id, category_id, color_id_arr, size_id_arr, price, is_in_stock)
  // 15 products per category = 3 collections with 5 products each

  let productArr = [];

  categoryArr.forEach((cat, j) => {
    collectionArr.forEach((col, k) => {
      for (let i = 0; i < 5; i++) {
        let colorCodeArrCopy = [...colorCodeArr];
        const numberOfColor = Math.floor(Math.random() * 4) + 2;
        const colorIdArr = [];

        for (let i = 1; i <= numberOfColor; i++) {
          const code = colorCodeArrCopy[Math.floor(Math.random() * colorCodeArrCopy.length)];
          const index = colorCodeArr.indexOf(code);
          colorIdArr.push(index + 1);
          colorCodeArrCopy = colorCodeArrCopy.filter((codeInArr) => codeInArr !== code);
        }

        const price = (Math.floor(Math.random() * 22) + 4) * 5; //4 - 25
        const isInStock = Math.random() > 0.2 ? true : false;

        productArr.push(
          `('${materialArr[i + 5 * k]} ${cat === 'earrings' ? cat : cat.slice(0, -1)}', ${k + 1}, ${
            j + 1
          }, ARRAY [${colorIdArr}], ARRAY [1, 2, 3], ${price}, ${isInStock})`
        );
      }
    });
  });

  for (let i = 0; i < 3; i++) {
    let currentIndex = productArr.length;

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      const temp = productArr[currentIndex];
      productArr[currentIndex] = productArr[randomIndex];
      productArr[randomIndex] = temp;
    }
  }

  return productArr;
}

const stringArr = [
  'INSERT INTO product(name, collection_id, category_id, color_id_arr, size_id_arr, price, is_in_stock) VALUES',
  ...generateProduct(),
];

stringArr.forEach((string, i) => {
  fs.appendFileSync(
    `${__dirname}/temp.txt`,
    `${i !== 0 ? '  ' : ''}${string}${i !== 0 ? (i === stringArr.length - 1 ? ';\n\n' : ',\n') : '\n'}`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );
});
