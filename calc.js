const MAX_LIST_ITEMS = 7;
const REAL_TIME_INTERVAL_MS = 1000;

const volume = document.getElementById("volume");
const initialValue = document.getElementById("initial-value");
const alavancagem = document.getElementById("alavancagem");
const valuesTable = document.getElementById("values-table");
const dataTable = document.getElementById("data-table");
const horizontalList = document.getElementById("horizontal-list");
const realTimeCheck = document.getElementById("real-time-check");
const table = document.getElementById("custom-table");
let intervalId;

function addToTable() {
  var v = volume.value;
  var iv = initialValue.value;
  var al = alavancagem.value;
  var lucro = (v * iv * al).toFixed(2);

  var newRow = table.insertRow(-1);
  newRow.insertCell(0).innerHTML = new Date().toLocaleString();
  newRow.insertCell(1).innerHTML = volume.value;
  newRow.insertCell(2).innerHTML = initialValue.value;
  newRow.insertCell(3).innerHTML = alavancagem.value;
  newRow.insertCell(4).innerHTML = "."
  newRow.insertCell(5).innerHTML = "."
  newRow.insertCell(6).innerHTML = "."
}

function addDataToTable(data) {
  colorizeMinMax();

  const newRow = valuesTable.insertRow(-1);

  const dateCell = newRow.insertCell(0);
  const volumeCell = newRow.insertCell(1);
  const priceCell = newRow.insertCell(2);
  const leverageCell = newRow.insertCell(3);
  const spreadCell = newRow.insertCell(4);
  const costCell = newRow.insertCell(5);
  const saldoCell = newRow.insertCell(6);

  dateCell.textContent = new Date().toLocaleString();
  volumeCell.textContent = data.volume;
  priceCell.textContent = data.initialValue;
  leverageCell.textContent = data.alavancagem;
  spreadCell.textContent = data.spread;
  costCell.textContent = data.custoOperacao;
  saldoCell.textContent = data.saldoNecessario;
  console.log(data);

  if (valuesTable.rows.length > 10) {
    valuesTable.deleteRow(1);
  }
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
        saldoNecessario: (volume * initialValue * alavancagem).toFixed(2),
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

function colorizeMinMax() {
  var rows = valuesTable.getElementsByTagName("tr");

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
