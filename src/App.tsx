import React from 'react';
import './App.css';
import MapProvider from 'Map/MapProvider';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const WorkingBikes = React.lazy(() => import('WorkingBikes/WorkingBikes'));

const App: React.FC = () => {
	return (
		<Router basename={process.env.PUBLIC_URL}>
			<MapProvider>
				<React.Suspense fallback={null}>
					<Switch>
						<Route path="/" component={WorkingBikes} />
					</Switch>
				</React.Suspense>
			</MapProvider>
		</Router>
	);
};

export default App;
