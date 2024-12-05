// netlify/functions/scrape.js
const puppeteer = require('puppeteer');

exports.handler = async function(event, context) {
    const url = event.queryStringParameters.url;
    if (!url) {
        return {
            statusCode: 400,
            body: 'Se requiere una URL.'
        };
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const content = await page.evaluate(() => {
            const titleDiv = document.querySelector('.ui-pdp-header__title-container');
            const title = titleDiv ? titleDiv.textContent.trim() : 'Título no encontrado.';
            
            const sellerHeaderDiv = document.querySelector('.ui-pdp-seller__header');
            const sellerName = sellerHeaderDiv ? sellerHeaderDiv.textContent.trim() : 'Vendedor no encontrado.';
            
            const priceDiv = document.querySelector('.ui-pdp-price__second-line');
            const priceText = priceDiv ? priceDiv.textContent.trim() : 'Precio no encontrado.';
            
            return { title, sellerName, priceText };
        });

        await browser.close();
        return {
            statusCode: 200,
            body: JSON.stringify(content)
        };
    } catch (error) {
        console.error('Error al hacer scraping:', error);
        return {
            statusCode: 500,
            body: 'Error interno del servidor.'
        };
    }
};
