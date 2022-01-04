const covidData = async () => {
	const response = await fetch('https://www.mohfw.gov.in/data/datanew.json');
	const data = await response.json();

	return data;
};

export default covidData;
