import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import CITIES from './src/cities.json';
import OBSTRUCTIONS from './src/data/obstructions.json';
import turf from '@turf/turf';

const MAIN_URL = 'https://api.airtable.com/v0/appNDnVLdhJwdr5Kt/Obstructions';
const TYPE_URL =
	'https://api.airtable.com/v0/appNDnVLdhJwdr5Kt/Obstruction%20Type';

type ObstructionRecord = {
	fields: {
		Images: { url: string }[];
		'Serial #': number;
		'Obstruction Type': string;
		'Geo location': string;
		'Date & Time of Incident': string;
	};
};

interface ObstructionsTable {
	records: ObstructionRecord[];
}

type ObstructionsTypeRecord = {
	id: number;
	fields: { 'Obstruction Type': string };
};

interface ObstructionTypeTable {
	records: ObstructionsTypeRecord[];
}

const airtableApiKey = process.argv[2];

const sleep = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const fetchPage = async (url: string, offset: string) => {
	const offsetQueryParam = !!offset ? `?offset=${offset}` : '';
	const networkResult = await fetch(`${url}${offsetQueryParam}`, {
		headers: {
			Authorization: `Bearer ${airtableApiKey}`,
		},
	});
	return await networkResult.json();
};

const fetchAllData = async (url: string): Promise<any> => {
	let records: ObstructionRecord[] | ObstructionsTypeRecord[] = [];
	let offset = '';

	// while (offset != null) {
	const page = await fetchPage(url, offset);
	console.log(JSON.stringify(page));
	// records = [...records, ...page.records];
	// offset = page.offset;
	// await sleep(500);
	// }

	return { records: page.records };
};

// const processData = ([mainRes, typeRes]: [
// 	ObstructionsTable,
// 	ObstructionTypeTable
// ]) => {
// 	const filteredTypes = typeRes.records.map(item => {
// 		return {
// 			id: item.id,
// 			name: item.fields['Obstruction Type'],
// 		};
// 	});

// 	return mainRes.records
// 		.map(item => {
// 			const { fields } = item;
// 			const imageUrl =
// 				fields['Images'] != null &&
// 				fields['Images'].length &&
// 				fields['Images'][0].url
// 					? fields['Images'][0].url
// 					: '';

// 			return {
// 				id: fields['Serial #'],
// 				obstructionIds: fields['Obstruction Type'],
// 				rawLocation: fields['Geo location'],
// 				obstructionType: fields['Obstruction Type'],
// 				incidentDate: fields['Date & Time of Incident'],
// 				imageUrl,
// 			};
// 		})
// 		.map(item => {
// 			const { id, obstructionIds, rawLocation = '', ...data } = item;

// 			let obstruction;
// 			if (obstructionIds != null && obstructionIds.length == 1) {
// 				obstruction = filteredTypes.find(
// 					typeItem => typeItem.id === obstructionIds[0]
// 				).name;
// 			} else {
// 				console.log(`${id} has messed up obstruction IDs`);
// 				return null;
// 			}

// 			const locationParts = rawLocation.split(',');
// 			let latitude, longitude;
// 			if (locationParts != null && locationParts.length == 2) {
// 				latitude = parseFloat(locationParts[0].trim());
// 				longitude = parseFloat(locationParts[1].trim());

// 				reportLoner(id, latitude, longitude);
// 			} else {
// 				console.log(`${id} has poorly formatted location: ${rawLocation}`);
// 				return null;
// 			}

// 			return turf.point([longitude, latitude], {
// 				id,
// 				obstruction,
// 				latitude,
// 				longitude,
// 				...data,
// 			});
// 		})
// 		.filter(Boolean);
// };

// const sortPoints = (left, right) => {
// 	if (right.count === left.count) {
// 		return right.lat - left.lat;
// 	} else {
// 		return right.count - left.count;
// 	}
// };

// const groupPoints = points => {
// 	const groupedMap = points.reduce((acc, point) => {
// 		const key = `${point.lat},${point.long}`;
// 		const value = acc[key];
// 		const count = (value && value.count) || 0;
// 		return {
// 			...acc,
// 			[key]: {
// 				latitude: point.lat,
// 				longitude: point.long,
// 				count: count + 1,
// 				...point,
// 			},
// 		};
// 	}, {});

// 	return Object.values(groupedMap)
// 		.sort(sortPoints)
// 		.map(({ lat, long, count, ...data }) => ({ lat, long, count, ...data }));
// };

// const outputFiles = (folderName: string, points) => {
// 	const directory = path.join(__dirname, `/public/data/${folderName}`);
// 	!fs.existsSync(directory) && fs.mkdirSync(directory);

// 	const filteredPoints = groupPoints(points);
// 	fs.writeFileSync(
// 		path.join(__dirname, `/public/data/${folderName}/all.json`),
// 		JSON.stringify(filteredPoints, null, 4)
// 	);

// 	Object.values(OBSTRUCTIONS.obstructionMap).map(obstruct => {
// 		const filteredObstruct = points.filter(
// 			({ obstruction }) => obstruction === obstruct.DATA
// 		);
// 		const filteredGroupedObstruct = groupPoints(filteredObstruct);

// 		fs.writeFileSync(
// 			path.join(__dirname, `/public/data/${folderName}/${obstruct.KEY}.json`),
// 			JSON.stringify(filteredGroupedObstruct, null, 4)
// 		);
// 	});
// };

// const outputAllFiles = processedData => {
// 	outputFiles('all', processedData);

// 	Object.keys(CITIES).map(cityName => {
// 		const { min_lat, max_lat, min_long, max_long } = CITIES[cityName];
// 		const filtered = processedData.filter(({ lat, long }) => {
// 			return (
// 				min_lat < lat && lat < max_lat && min_long < long && long < max_long
// 			);
// 		});

// 		outputFiles(cityName, filtered);
// 	});
// };

// const reportLoner = (id: number, lat: number, long: number) => {
// 	const hasCity = Object.keys(CITIES).some(cityName => {
// 		const { min_lat, max_lat, min_long, max_long } = CITIES[cityName];
// 		return min_lat < lat && lat < max_lat && min_long < long && long < max_long;
// 	});

// 	if (!hasCity) {
// 		console.log(
// 			`ID #${id} has no associated city map. Location: ${lat}, ${long}`
// 		);
// 	}
// };

// Main

Promise.all([fetchAllData(MAIN_URL), fetchAllData(TYPE_URL)])
	.then(data => console.log(data))
	// .then(processData)
	// .then(outputAllFiles)
	.catch(error => console.error(error));
