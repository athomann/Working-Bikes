import 'mapbox-gl/dist/mapbox-gl.css';
import { NavigationControl, StaticMap, ViewState } from 'react-map-gl';
import { useMapState } from 'Map/MapProvider';
import Deck from 'deck.gl';
import React from 'react';
import styled from 'styled-components';

type Props = {
	children?: React.ReactNode;
	layers?: any[];
	mapStyle?: string;
};

const config = {
	styles: {
		streets: 'athomann/ck5g2v6c1088v1ipthfqqofpn',
		chrome: 'athomann/ck5zz6hve2dmp1imrdwv27qpi',
		satellite: 'mapbox/satellite-streets-v10',
	},
	accessToken:
		'pk.eyJ1IjoiYXRob21hbm4iLCJhIjoiY2p0aGo1a2VtMmV5cTQzcDdnOGZ0bWJuMyJ9.TEE_Hc2FNPkfOjfa2H69bA',
};

const Map: React.FC<Props> = (props: Props) => {
	const { mapRef, viewState, setViewState } = useMapState();
	const mapStyle = `mapbox://styles/${props.mapStyle || config.styles.streets}`;

	return (
		<StaticMap
			{...viewState}
			height="100%"
			mapboxApiAccessToken={config.accessToken}
			mapStyle={mapStyle}
			ref={mapRef}
			width="100%"
		>
			<Deck
				controller={true}
				height={'100%'}
				initialViewState={viewState}
				layers={props.layers}
				width={'100%'}
				viewState={viewState}
				onViewStateChange={(e: { viewState: ViewState }) => {
					setViewState && setViewState(e.viewState);
				}}
			/>
			{props.children}

			<NavContainer>
				<NavigationControl
					onViewStateChange={({
						viewState: { longitude, latitude, zoom, ...rest },
					}) => {
						setViewState &&
							setViewState({ latitude, longitude, zoom, ...rest });
					}}
					showCompass={false}
				/>
			</NavContainer>
		</StaticMap>
	);
};

export default Map;

const NavContainer = styled.div`
	width: 30px;
	position: absolute;
	right: 1rem;
	top: 1rem;
	z-index: 10;
`;
