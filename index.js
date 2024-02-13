const fs = require('fs');
const http = require('http');
const url = require('url');

// Syncronous and blocking code
// const inputvalue = fs.readFileSync('./txt/input.txt', 'utf-8')
// const outputvalue = `${inputvalue} .\n ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', outputvalue)

// Asyncronous and non-blocking code
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     let Url = data;
//     console.log(Url, "url")
//     fs.readFile(`./txt/${Url}.txt`, 'utf-8', (err, data1) => {
//         console.log(data1, "avacado")
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data2) => {
//             console.log(data2, "avacado")
//             fs.writeFile('./txt/final.txt', `${data1}\n ${data2} \n done`, (err) => {
//                 console.log(err)
//             })
//         })
//     })
// })

// Server
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const Card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const Product = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const Replaceelement=(temp,product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
output = output.replace(/{%IMAGE%}/g, product.image);
output = output.replace(/{%PRICE%}/g, product.price);
output = output.replace(/{%FROM%}/g, product.from);
output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
output = output.replace(/{%QUANTITY%}/g, product.quantity);
output = output.replace(/{%DESCRIPTION%}/g, product.description);
output = output.replace(/{%ID%}/g, product.id);

if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
return output;
}

const ProductObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    console.log(req.url);
    const pathname = req.url;
    if (pathname === '/' || pathname === '/overview') {
        
        let objectCards=ProductObj.map(el=>Replaceelement(Card,el)).join("")
        let output=overview.replace('{%PRODUCT_CARDS%}', objectCards);
        
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        res.end(output);
    } else if (pathname === '/product') {
        res.end("Hello from the Product buddy ");
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end("Page not found ");
    }
});

server.listen('8000', '127.0.0.1', () => {
    console.log("Server is listening");
});
