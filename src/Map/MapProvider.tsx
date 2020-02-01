import { PinFeatures, HoverState } from './mapTypes';
import InteractiveMap, {
	ViewState,
	ViewportProps,
	FlyToInterpolator,
} from 'react-map-gl';
import MapboxGl from 'mapbox-gl';
import React, { useContext, createContext } from 'react';

interface State {
	hoverState: HoverState;
	map: MapboxGl.Map | null;
	mapRef: React.RefObject<InteractiveMap> | null;
	pins: PinFeatures;
	setHoverState?: React.Dispatch<React.SetStateAction<HoverState>>;
	setPins?: Function;
	setViewState?: React.Dispatch<React.SetStateAction<Partial<ViewportProps>>>;
	viewState: Partial<ViewState>;
}

const INITIAL_VIEW_STATE: Partial<ViewportProps> = {
	latitude: 40.7128,
	longitude: -74.006,
	zoom: 4,
	bearing: 0,
	pitch: 30,
	transitionInterpolator: new FlyToInterpolator(),
	transitionDuration: 1000,
};

const INITIAL_HOVER_STATE: HoverState = {
	mapFilterCoords: [0, 0],
	pinCoords: [0, 0],
};

export const MapContext = createContext<State>({
	viewState: INITIAL_VIEW_STATE,
	hoverState: INITIAL_HOVER_STATE,
	mapRef: null,
	map: null,
	pins: {
		features: [],
	},
});

const MapProvider = ({ children }: { children?: React.ReactNode }) => {
	const [pins, setPins] = React.useState();
	const [viewState, setViewState] = React.useState<Partial<ViewportProps>>(
		INITIAL_VIEW_STATE
	);
	const [hoverState, setHoverState] = React.useState<HoverState>(
		INITIAL_HOVER_STATE
	);
	const mapRef = React.useRef<InteractiveMap>(null);
	return (
		<MapContext.Provider
			value={{
				mapRef,
				map: mapRef.current ? mapRef.current.getMap() : null,
				pins,
				setPins,
				viewState,
				setViewState,
				hoverState,
				setHoverState,
			}}
		>
			{children}
		</MapContext.Provider>
	);
};

export default MapProvider;

export const useMapState = () => {
	const context = useContext<State>(MapContext);
	if (typeof context === 'undefined' || context == null) {
		throw new Error('useMap must be used with a MapProvider');
	}

	return context;
};

export const withMap = <P extends object>(Component: React.ComponentType<P>) =>
	class WithMap extends React.Component<P> {
		map = (context: State) => {
			const mapRef = context ? context.mapRef : null;
			return mapRef && mapRef.current ? mapRef.current.getMap() : null;
		};
		render() {
			return (
				<MapContext.Consumer>
					{context => {
						const map = this.map(context);
						return (
							<Component
								{...this.props}
								hoverState={context.hoverState}
								map={map}
								mapIsLoaded={map && map.loaded()}
								pins={context.pins}
								setHoverState={context.setHoverState}
								setPins={context.setPins}
								setViewState={context.setViewState}
								viewState={context.viewState}
							/>
						);
					}}
				</MapContext.Consumer>
			);
		}
	};
