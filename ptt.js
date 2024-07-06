import fetch from 'node-fetch';
import cheerio from 'cheerio';

async function getParcel(trackingNumber) {
	try {
		const response = await fetch("https://gonderitakip.ptt.gov.tr/Track/summaryResult", {
			"headers": {
				"Accept": "text/html",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			"body": `q=${trackingNumber}`,
			"method": "POST",
		});
		const data = await response.text();
		const $ = cheerio.load(data);

		const trackingInfo = [];

		$('table tbody tr').each((index, element) => {
			const date = $(element).find('td').eq(0).text().trim();
			const status = $(element).find('td').eq(1).text().trim();
			const branch = $(element).find('td').eq(2).text().trim();
			const location = $(element).find('td').eq(3).text().trim();
			const description = $(element).find('td').eq(4).text().trim();

			if (status.includes(":")) {
				return;
			}
			trackingInfo.push({ date, status, branch, location, description });
		});

		if (trackingInfo.length === 0) {
			console.log("A shipment with the provided tracking number could not be found.");
			return null;
		}
		return trackingInfo;
	} catch (error) {
		console.error("An error occurred:", error);
		return null;
	}
}

export { getParcel };
