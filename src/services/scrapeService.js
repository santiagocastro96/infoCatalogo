const puppeteer = require('puppeteer');

exports.scrapeProductData = async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send('Se requiere una URL.');

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
        res.json(content);
    } catch (error) {
        console.error('Error al hacer scraping:', error);
        res.status(500).send('Error interno del servidor.');
    }
};