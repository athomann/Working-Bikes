import { Feature, Point } from 'geojson';

export type PinFeature = Feature<
	Point,
	{
		id: string;
		active: boolean;
	}
>;

export type PinFeatures = {
	features: PinFeature[];
};

export type HoverState = {
	pinFeature?: PinFeature;
	mapFilterCoords: number[];
	pinCoords: number[];
};

export type MapHoverInfo = {
	object: PinFeature | null;
	lngLat: number[];
};
