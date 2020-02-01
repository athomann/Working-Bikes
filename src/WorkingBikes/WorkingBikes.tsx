import { GeoJsonLayer } from 'deck.gl';
import { RouteComponentProps } from 'react-router-dom';
import { useMapState } from 'Map/MapProvider';
import logo from 'data/logo.png';
import Map from 'Map/Map';
import React from 'react';
import styled from 'styled-components';
import donations from './chicago_donations.json';
import donationTotals from './donationTotals.json';
import { center } from '@turf/turf';

import { Popup } from 'react-map-gl';

const chicago = {
	name: 'Chicago',
	longitude: -87.623177,
	latitude: 41.881832,
	zoom: 11,
};

const WorkingBikes = (
	props: RouteComponentProps<{ city: string; layerType?: string }>
) => {
	const { setViewState } = useMapState();
	if (setViewState == null) {
		throw Error('Testl');
	}

	React.useEffect(() => {
		setViewState({
			latitude: chicago.latitude,
			longitude: chicago.longitude,
			zoom: 9.7,
		});
	}, []);

	const COLOR_RANGE = [
		[237, 250, 234, 200],
		[199, 234, 191, 200],
		[163, 216, 154, 200],
		[66, 171, 94, 200],
		[35, 139, 71, 200],
	];

	const getColor = (total: number) => {
		switch (true) {
			case total == null:
			case total === 0:
				return COLOR_RANGE[0];
			case total < 5:
				return COLOR_RANGE[1];
			case total < 10:
				return COLOR_RANGE[2];
			case total < 29:
				return COLOR_RANGE[3];
			case total < 120:
				return COLOR_RANGE[4];
			default:
				return COLOR_RANGE[0];
		}
	};

	return (
		<div className="App">
			<MapContainer>
				<Map
					mapStyle="athomann/ck5zz6hve2dmp1imrdwv27qpi"
					layers={[
						new GeoJsonLayer({
							id: 'boundaries-layer',
							data: donationTotals,
							opacity: 1,
							stroked: true,
							filled: true,
							extruded: false,
							intensity: 1,
							threshold: 0.3,
							radiusPixels: 30,
							getFillColor: (f: any) => {
								return getColor(f.properties.total);
							},
							visible: true,
							getLineColor: [100, 100, 100, 100],
							getLineWidth: 10,
							highlightColor: [50, 100, 200, 100],
							lineWidthMinPixels: 1,
							lineWidthScale: 2,
						}),
					]}
				>
					<header className="App-header">
						<img src={logo} alt="Bike Lane Uprising" />
					</header>
					{donationTotals
						.filter(a => a.properties.total != null)
						.map((donation: any) => {
							const cent = center(donation);
							return (
								cent?.geometry != null && (
									<Popup
										dynamicPosition
										closeButton={false}
										latitude={cent.geometry.coordinates[1]}
										longitude={cent.geometry.coordinates[0]}
									>
										<Container>
											<span>
												{donation.properties.zip} Total:{' '}
												{donation.properties.total}
											</span>
										</Container>
									</Popup>
								)
							);
						})}

					<WorkingBikesLegend />
				</Map>
			</MapContainer>
		</div>
	);
};

const MapContainer = styled.div`
	position: relative;
	height: 100vh;
	width: 100%;

	.mapboxgl-popup {
		z-index: 10;
	}
`;

const WorkingBikesLegend = () => <span />;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 0.75rem;

	h3 {
		margin: 0 0 0.4rem;
	}

	h4 {
		padding: 0;
		margin: 0;
	}

	span {
		margin: 0 0 0.2rem;
	}
`;

export default WorkingBikes;
