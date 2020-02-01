import React from 'react';
import styled from 'styled-components';
import Media from 'react-media';

export const Legend = (props: { city: string; stats: any; total: number }) => {
	return (
		<Container>
			<Media query={{ minWidth: 699 }}>
				<React.Fragment></React.Fragment>
			</Media>
		</Container>
	);
};

let Container = styled.div`
	background-color: white;
	border-radius: 4px;
	bottom: 2rem;
	box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
	font-size: 0.75rem;
	left: 1rem;
	padding: 1rem;
	position: absolute;
	width: 300px;
	z-index: 999;
`;
