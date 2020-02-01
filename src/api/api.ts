import { useEffect, useState } from 'react';

export function useFetch<R>(url: string) {
	const [data, setDataState] = useState<R | null>(null);
	const [loading, setLoadingState] = useState(true);
	const [error, setErrorState] = useState(null);

	useEffect(() => {
		setLoadingState(true);
		fetch(url)
			.then(j => j.json())
			.then(data => {
				setDataState(data);
				setLoadingState(false);
			})
			.catch(error => setErrorState(error));
	}, [url]);

	return { data, loading, error };
}

const citiBikeStations = 'https://feeds.citibikenyc.com/stations/stations.json';
