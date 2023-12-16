// const express = require("express");


// const app = express();

// const PORT = process.env.PORT || 8080;

// app.use(express.json());

// app.get("/",(req,res) => {
//        res.send("Welcome to tours  vijay api");
//      })

// app.listen(PORT,() => console.log(`Server running on port ${PORT}`));




const express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');

const app = express();

const baseUrl = "https://www.flipkart.com/search?q=phones&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off";
const maxProducts = 100; // Maximum number of products to scrape

app.get('/', async (req, res) => {
  try {
    let products = [];
    let count = 0;
    let nextPageUrl = baseUrl;

    while (count < maxProducts) {
      const html = await rp(nextPageUrl);
      const $ = cheerio.load(html);

      const allPhones = $('a._1fQZEK');

      allPhones.each((index, element) => {
        if (count < maxProducts) {
          const name = $(element).find('div._4rR01T');
          const price = $(element).find('div._30jeq3._1_WHN1');
          const rating = $(element).find('div._3LWZlK');

          products.push({
            name: name.text().trim(),
            price: price.text().trim(),
            rating: rating.text().trim(),
          });

          count++;
        }
      });

      // Check if there is a next page
      const nextPageButton = $('a._1LKTO3');
      if (nextPageButton.length === 0) {
        break; // No more pages
      }

      // Get the next page URL
      nextPageUrl = `https://www.flipkart.com${nextPageButton.attr('href')}`;
    }

    const productListHTML = generateProductListHTML(products);
    res.send(productListHTML);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function generateProductListHTML(products) {
  let html = `
    <html>
      <head>
        <title>Product List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          header {
            
            color: #fff;
            text-align: center;
            padding: 10px;
          }
          h1 {
           
          }
          ul {
            list-style-type: none;
            padding: 0;
            margin: 20px;
          }
          li {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            background-color: #fff;
          }
          strong {
           
          }
        </style>
      </head>
      <body>
        <header>
          <h1>Product List</h1>
        </header>
        <ul>
  `;

  products.forEach(product => {
    html += `<li><strong>Product:</strong> ${product.name}, <strong>Price:</strong> ${product.price}, <strong>Review Rating:</strong> ${product.rating}</li>`;
  });

  html += `
        </ul>
      </body>
    </html>
  `;

  return html;
}

const port = 3000;
const ipAddress = '192.168.160.7'; // Replace with your machine's actual IP address
app.listen(port, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});































// const express = require('express');
// const rp = require('request-promise');
// const cheerio = require('cheerio');

// const app = express();

// const baseUrl = "https://www.flipkart.com/search?q=phones&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off";
// const maxProducts = 100; // Maximum number of products to scrape

// app.get('/', async (req, res) => {
//   try {
//     let products = [];
//     let count = 0;
//     let nextPageUrl = baseUrl;

//     while (count < maxProducts) {
//       const html = await rp(nextPageUrl);
//       const $ = cheerio.load(html);

//       const allPhones = $('a._1fQZEK');

//       allPhones.each((index, element) => {
//         if (count < maxProducts) {
//           const name = $(element).find('div._4rR01T');
//           const price = $(element).find('div._30jeq3._1_WHN1');
//           const rating = $(element).find('div._3LWZlK');

//           products.push({
//             name: name.text().trim(),
//             price: price.text().trim(),
//             rating: rating.text().trim(),
//           });

//           count++;
//         }
//       });

//       // Check if there is a next page
//       const nextPageButton = $('a._1LKTO3');
//       if (nextPageButton.length === 0) {
//         break; // No more pages
//       }

//       // Get the next page URL
//       nextPageUrl = `https://www.flipkart.com${nextPageButton.attr('href')}`;
//     }

//     res.json({ products });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
