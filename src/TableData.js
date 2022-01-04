import { useState, useEffect } from 'react';
import covidData from './services/covid-data';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const TableData = () => {
	const [rowData, setRowData] = useState([]);

	useEffect(() => {
		covidData().then(data => {
			const formattedData = formatData(data);
			setRowData(formattedData);
		});
	}, []);

	return (
		<div
			className="ag-theme-alpine"
			style={{ height: window.innerHeight, width: window.innerWidth }}
		>
			<AgGridReact rowData={rowData}>
				<AgGridColumn field="state"></AgGridColumn>
				<AgGridColumn field="totalCasesToday"></AgGridColumn>
				<AgGridColumn field="activeCases"></AgGridColumn>
				<AgGridColumn field="totalConfirmedTillDate"></AgGridColumn>
				<AgGridColumn field="recoveredToday"></AgGridColumn>
				<AgGridColumn field="recoveredTillNow"></AgGridColumn>
				<AgGridColumn field="deathToday"></AgGridColumn>
				<AgGridColumn field="deathTillNow"></AgGridColumn>
			</AgGridReact>
		</div>
	);
};

const formatData = (data = []) => {
	const sortData = data.sort((a, b) => b.new_positive - a.new_positive);

	const mData = sortData.map(d => {
		const totalConfirmedTillDate = d.new_positive;
		const totalCasesToday = totalConfirmedTillDate - d.positive;
		const activeCases = d.new_active;
		//const activeToday = activeCases - d.active;
		const recoveredTillNow = d.new_cured;
		const recoveredToday = recoveredTillNow - d.cured;
		const deathTillNow = d.new_death;
		const deathToday = deathTillNow - d.death;
		const state = d.state_name;

		return {
			state,
			totalCasesToday,
			activeCases,
			totalConfirmedTillDate,
			//activeToday,
			recoveredTillNow,
			recoveredToday,
			deathTillNow,
			deathToday,
		};
	});
	console.log(mData);
	const totalData = mData.shift();
	console.log(totalData);

	return mData;
};

export default TableData;
