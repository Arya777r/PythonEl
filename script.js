async function fetchFlightsFromCSV() {
    try {
        const response = await fetch('flightnew.csv');
        const csvData = await response.text();
        window.flights = parseCSV(csvData);
    } catch (error) {
        console.error('Error fetching CSV file:', error);
    }
}

function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const flights = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        if (currentLine.length === headers.length) {
            const flight = {};
            for (let j = 0; j < headers.length; j++) {
                flight[headers[j].trim()] = currentLine[j]?.trim();
            }
            flights.push(flight);
        } else {
            console.warn(`Skipping invalid line at index ${i}: ${lines[i]}`);
        }
    }
    return flights;
}

function getUserInputs() {
    const destinationInput = document.getElementById('destination');
    const startingPointInput = document.getElementById('startingPoint');
    const daysAfterInput = document.getElementById('daysAfter');

    const userInputs = {
        destination: destinationInput.value.toLowerCase(),
        startingPoint: startingPointInput.value.toLowerCase(),
        daysAfter: parseInt(daysAfterInput.value, 10)
    };

    return userInputs;
}

function comparePrices() {
    const { destination, startingPoint, daysAfter } = getUserInputs();

    const filteredFlights = flights.filter(flight =>
        flight.destination.toLowerCase() === destination &&
        flight.starting_point.toLowerCase() === startingPoint &&
        parseInt(flight.days_after, 10) === daysAfter
    );

    displayFlights(filteredFlights);
}

function displayFlights(flightsToDisplay) {
    const flightContainer = document.getElementById('flightResults');
    flightContainer.innerHTML = '';

    if (flightsToDisplay.length === 0) {
        flightContainer.innerHTML = '<p>No flights found for the given criteria.</p>';
        return;
    }

    flightsToDisplay.forEach((flight) => {
        const flightCard = document.createElement('div');
        flightCard.classList.add('flight-card');
        flightCard.innerHTML = `<p>${flight.airline}</p><p>${flight.price} INR</p>`;
        flightContainer.appendChild(flightCard);
    });
}

window.addEventListener('load', fetchFlightsFromCSV);

