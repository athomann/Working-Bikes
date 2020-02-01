import { Feature, Point } from 'geojson';

export type PinFeature = Feature<
	Point,
	{
		address: string;
		id: string;
		opportunityZoneId?: string;
		submarket: string;
		active: boolean;
	}
>;

export type PinFeatures = {
	features: PinFeature[];
};

export type HoverState = {
	submarketFeature?: SubmarketFeature;
	opportunityZoneFeature?: OpportunityZoneFeature;
	pinFeature?: PinFeature;
	mapFilterCoords: number[];
	pinCoords: number[];
};

export type MapHoverInfo = {
	object: OpportunityZoneFeature | PinFeature | SubmarketFeature | null;
	lngLat: number[];
};
