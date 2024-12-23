const apiURL = ' https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';


function fetchDataWithThen() {
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      renderData(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}


async function fetchDataWithAsyncAwait() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderData(data) {
  const tableBody = document.getElementById('cryptoTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ''; 

  data.forEach(coin => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td><img src="${coin.image}" alt="${coin.name}" width="30" height="30"></td>
      <td>${coin.name}</td>
      <td>${coin.symbol.toUpperCase()}</td>
      <td>$${coin.current_price.toFixed(2)}</td>
      <td>$${coin.total_volume.toLocaleString()}</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
    `;
  });
}

document.getElementById('search').addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  const rows = document.querySelectorAll('#cryptoTable tbody tr');
  rows.forEach(row => {
    const name = row.cells[1].textContent.toLowerCase();
    row.style.display = name.includes(query) ? '' : 'none';
  });
});

function sortData(criteria, ascending = true) {
  const tableBody = document.getElementById('cryptoTable').getElementsByTagName('tbody')[0];
  const rows = Array.from(tableBody.rows);
  rows.sort((rowA, rowB) => {
    const valueA = parseFloat(rowA.cells[criteria].textContent.replace(/[^0-9.-]+/g, ''));
    const valueB = parseFloat(rowB.cells[criteria].textContent.replace(/[^0-9.-]+/g, ''));

    return ascending ? valueA - valueB : valueB - valueA;
  });
  rows.forEach(row => tableBody.appendChild(row)); 
}

document.getElementById('sortByMarketCapAsc').addEventListener('click', () => {
  sortData(5, true);  
});

document.getElementById('sortByMarketCapDesc').addEventListener('click', () => {
  sortData(5, false); 
});

document.getElementById('sortByPercentageChangeAsc').addEventListener('click', () => {
  sortData(6, true); 
});

document.getElementById('sortByPercentageChangeDesc').addEventListener('click', () => {
  sortData(6, false);
});

fetchDataWithAsyncAwait();
