//Need to install pexels to run this program

try {
  require('pexels');
} catch {
  console.log("* To install pexels, 'npm i pexels'");
  process.exit(1);
}

require('dotenv').config();
const fs = require('fs');
const { createClient } = require('pexels');
const pg = require('../postgres/postgres');

const client = createClient(process.env.PEXELS_API_KEY);

async function getPhotoURL(query, height = 680, width = 580) {
  try {
    const result = await client.photos.search({ query: query + ' jewelry', per_page: 80 });

    return result.photos[Math.floor(Math.random() * 80)].src.original + `?auto=compress&cs=tinysrgb&fit=crop&h=${height}&w=${width}`;
  } catch (err) {
    console.log(err.message);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//SELECT id, name FROM product where id in (59, 63, 66, 67, 73, 75, 77, 76, 113, 149)

/*
SELECT id, name from product where img_url in (
	SELECT img_url FROM (
		SELECT img_url, count(*)::int num FROM public.product
		GROUP BY img_url
	) a WHERE num > 1
)
*/

//Products
pg.query('SELECT id, name FROM product ORDER BY id', (err, result) => {
  if (err) {
    console.log(err.message);
  } else {
    const productArr = result.rows;

    productArr.forEach(async (product) => {
      const imgURL = await getPhotoURL(product.name);

      await delay(50);

      fs.appendFileSync(`${__dirname}/temp.txt`, `UPDATE product SET img_url = '${imgURL}' WHERE id = ${product.id};\n`, (err) => {
        if (err) {
          console.error(err.message);
        }
      });
    });

    // Promise.all(productArr.map((product) => getPhotoURL(product.name)))
    //   .then((urlArr) => {
    //     const stringArr = [];

    //     urlArr.forEach((url, i) => stringArr.push(`UPDATE product SET img_url = '${url}' WHERE id = ${i + 1}`));

    //     stringArr.forEach((string) => {
    //       fs.appendFileSync(`${__dirname}/temp.txt`, `${string};\n`, (err) => {
    //         if (err) {
    //           console.error(err.message);
    //         }
    //       });
    //     });
    //   })
    //   .catch((err) => console.log(err.message));
  }
});

//Categories
pg.query(`SELECT id, name FROM category ORDER BY id`, (err, result) => {
  if (err) {
    console.log(err.message);
  } else {
    const categoryArr = result.rows;

    categoryArr.forEach(async (category) => {
      const imgURL = await getPhotoURL(category.name, 1080, 540);

      await delay(50);

      fs.appendFileSync(`${__dirname}/temp.txt`, `UPDATE category SET img_url = '${imgURL}' WHERE id = ${category.id};\n`, (err) => {
        if (err) {
          console.error(err.message);
        }
      });
    });
  }
});

//Collections
pg.query(`SELECT id, name FROM collection ORDER BY id`, (err, result) => {
  if (err) {
    console.log(err.message);
  } else {
    const collectionArr = result.rows;

    collectionArr.forEach(async (collection) => {
      const imgURL = await getPhotoURL(collection.name, 620, 730);

      await delay(50);

      fs.appendFileSync(`${__dirname}/temp.txt`, `UPDATE collection SET img_url = '${imgURL}' WHERE id = ${collection.id};\n`, (err) => {
        if (err) {
          console.error(err.message);
        }
      });
    });
  }
});
