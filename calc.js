
let intervalId;

function addToTable() {
  var volume = document.getElementById("volume").value;
  var initialValue = document.getElementById("initial-value").value;
  var alavancagem = document.getElementById("alavancagem").value;

  var profit = (volume * initialValue * alavancagem);

  var table = document.getElementById("myTable");

  var newRow = table.insertRow(-1);

  newRow.insertCell(0).innerHTML = new Date().toLocaleString();
  newRow.insertCell(1).innerHTML = volume;
  newRow.insertCell(2).innerHTML = initialValue;
  newRow.insertCell(3).innerHTML = alavancagem;
//  newRow.insertCell(4).innerHTML = profit.toFixed(2);
//  newRow.insertCell(5).innerHTML = profit.toFixed(2) * 5;
//  newRow.insertCell(5).innerHTML = profit.toFixed(2) * alavancagem * volume;

}

function addDataToTable(data) {
  colorizeMinMax();
  const table = document.getElementById("values-table");

  // Insert a new row at the end of the table
  const newRow = table.insertRow(-1);

  // Insert cells into the new row
  const dateCell = newRow.insertCell(0);
  const volumeCell = newRow.insertCell(1);
  const priceCell = newRow.insertCell(2);
  const leverageCell = newRow.insertCell(3);
  const spreadCell = newRow.insertCell(4);
  const costCell = newRow.insertCell(5);
  const profitCell = newRow.insertCell(6);

  // Fill the cells with data
  dateCell.textContent = new Date().toLocaleString();
  volumeCell.textContent = data.volume;
  priceCell.textContent = data.initialValue;
  leverageCell.textContent = data.alavancagem;
  spreadCell.textContent = data.spread;
  costCell.textContent = data.custoOperacao;
  profitCell.textContent = data.lucro;

  // Remove the first row if the table has more than 10 rows
  if (table.rows.length > 10) {
    table.deleteRow(1);
  }
  colorizeMinMax();
}


function addListItem(item) {
  colorizeMinMax();
  const table = document.getElementById("data-table");

  if (table.rows.length >= MAX_LIST_ITEMS) {
    table.deleteRow(-1);
  }

  addTableRow(table, item);

  console.log("added item", item, "to table", table);
  colorizeMinMax();
}


function updateValueRealTime() {
  const volumeEl = document.getElementById("volume");
  const initialValueEl = document.getElementById("initial-value");
  const alavancagemEl = document.getElementById("alavancagem");

  fetch("http://localhost:5001/values")
    .then(response => response.json())
    .then(data => {
      const value = (Number(data.lastAsk) / 100).toFixed(2);
      initialValueEl.value = value;

      const volume = Number(volumeEl.value);
      const initialValue = Number(initialValueEl.value);
      const alavancagem = Number(alavancagemEl.value);
      const spread = Number(data.spread);

    addDataToTable({
        volume,
        initialValue,
        alavancagem,
        spread,
        custoOperacao: spread * 5,
        lucro: (volume * initialValue * alavancagem).toFixed(2),
      });
    });
}


function toggleRequests() {
  const checkbox = document.getElementById('real-time-check');

  if (checkbox.checked) {
    console.log("checked");
    intervalId = setInterval(updateValueRealTime, 1000);
  } else {
    console.log("unchecked");
    clearInterval(intervalId);
  }
}
document.getElementById('real-time-check').addEventListener("change", toggleRequests);
// -----------------------------------------------------


const MAX_LIST_ITEMS = 7;

function addListItem(item) {
  colorizeMinMax();
  const list = document.getElementById("horizontal-list");

  if (list.children.length >= MAX_LIST_ITEMS) {
    list.removeChild(list.lastElementChild);
  }

  const listItem = document.createElement("li");
  listItem.className = "list-group-item";
  listItem.textContent = `${new Date().toLocaleString()} | Volume:${item.volume} | Preco:${item.initialValue} | Alavancagem:${item.alavancagem} | Spread:${item.spread} | CustoOperacao:${item.custoOperacao} | ${item.lucro}`;

  list.insertBefore(listItem, list.firstChild);
  console.log("added item", item, "to list", list);
  colorizeMinMax();
}

function colorizeMinMax() {
  var rows = document.getElementById("values-table").getElementsByTagName("tr");

  var values = [];
  for (var i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
    var row = rows[i];
    var value = parseFloat(row.cells[row.cells.length - 1].innerText.trim());
    values.push(value);
  }

  var max = Math.max.apply(Math, values);
  var min = Math.min.apply(Math, values);

  for (var i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
    var row = rows[i];
    var value = parseFloat(row.cells[row.cells.length - 1].innerText.trim());
    if (value >= max - 0.0001) {
      row.style.backgroundColor = "lightgreen";
    } else if (value <= min + 0.0001) {
      row.style.backgroundColor = "lightcoral";
    } else {
      row.style.backgroundColor = "";
    }
  }
}
