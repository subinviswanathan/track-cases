import { useState, useEffect } from 'react';
import covidData from './services/covid-data';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const TableData = ({ onDataChange }) => {
	const [rowData, setRowData] = useState([]);

	useEffect(() => {
		covidData()
			.then(data => {
				const { mData, emitChange } = formatData(data);
				setRowData(mData);
				if (emitChange) {
					onDataChange();
				}
			})
			.catch(err => errorHappened(err));
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
	try {
		const sortData = data.sort((a, b) => b.new_positive - a.new_positive);

		const mData = sortData.map(d => {
			const totalConfirmedTillDate = formatNumber(d.new_positive);
			const totalCasesToday = formatNumber(d.new_positive - d.positive);
			const activeCases = formatNumber(d.new_active);
			const recoveredTillNow = formatNumber(d.new_cured);
			const recoveredToday = formatNumber(d.new_cured - d.cured);
			const deathTillNow = formatNumber(d.new_death);
			const deathToday = formatNumber(d.new_death - d.death);
			const state = d.state_name || 'India';
			const total = d.new_positive;

			return {
				state,
				totalCasesToday,
				activeCases,
				totalConfirmedTillDate,
				recoveredTillNow,
				recoveredToday,
				deathTillNow,
				deathToday,
				total,
			};
		});

		const emitChange = checkChangeInData(mData[0]);
		return { mData, emitChange };
	} catch (err) {
		errorHappened(err);
	}
};

const checkChangeInData = (data = {}) => {
	const cases = typeof data.total === 'string' ? +data.total : 0;
	const inStorage = localStorage.getItem('last-data');
	let changed = false;

	if ((inStorage && cases > +inStorage) || !inStorage) {
		changed = true;
		localStorage.setItem('last-data', cases);
	}

	return changed;
};

const formatNumber = num => {
	if (typeof Intl !== undefined && Intl.NumberFormat) {
		let nf = new Intl.NumberFormat();
		return nf.format(num);
	}

	return num;
};

const errorHappened = err => {
	alert('Error Happened ');
	console.log(err);
};

export default TableData;
