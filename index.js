const fs = require("fs"); // fs = file system
const http = require("http");
const url = require("url");

/////////////////////////////////////////////////
// Files

// Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");

// // Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (error, data1) => {
//   if (error) return console.log("Error! 💥");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (error, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written 😊");
//       });
//     });
//   });
// });

/////////////////////////////////////////////////
// Server
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const templOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  console.log(query);
  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templCard, el))
      .join("");
    const renderOutput = templOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(renderOutput);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const productOutput = replaceTemplate(templProduct, product);
    res.end(productOutput);

    // Api page
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "applications/json", // for JSON
    });
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(data); // string, comes from top level code

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html", // for HTML
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
