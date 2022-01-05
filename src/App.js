import { useState } from 'react/cjs/react.development';
import TableData from './TableData';

function App() {
	const dataChanged = () => {
		setDateData(setDate(true));
	};

	const [dateData, setDateData] = useState(setDate());
	return (
		<div>
			<p style={{ paddingLeft: 10, paddingRight: 10 }}>
				<strong>Last Updated Data </strong> <em>{dateData}</em>
			</p>
			<TableData onDataChange={dataChanged} />
		</div>
	);
}

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const date = today => {
	let dateIn = localStorage.getItem('last-date');

	if (today) {
		return setTodayDate(new Date());
	}

	if (dateIn) {
		const beforeDate = new Date(dateIn);
		if (Object.prototype.toString.call(beforeDate) === '[object Date]') {
			if (isNaN(beforeDate.getTime())) {
				return setTodayDate(new Date());
			} else {
				return setTodayDate(new Date(dateIn));
			}
		}
		return setTodayDate(new Date());
	}

	return setTodayDate(new Date());
};

const setTodayDate = now => {
	localStorage.setItem('last-date', now);
	return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
};

const setDate = today => {
	return date(today);
};

export default App;
