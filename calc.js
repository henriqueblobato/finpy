
let intervalId;

function addToTable() {
  var volume = document.getElementById("volume").value;
  var initialValue = document.getElementById("initial-value").value;
  var alavancagem = document.getElementById("alavancagem").value;

  var profit = (volume * initialValue * alavancagem);

  var table = document.getElementById("myTable");

  var newRow = table.insertRow(-1);

  newRow.insertCell(0).innerHTML = volume;
  newRow.insertCell(1).innerHTML = initialValue;
  newRow.insertCell(2).innerHTML = alavancagem;
  newRow.insertCell(3).innerHTML = profit.toFixed(2);

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

      addListItem({
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
  var items = document.getElementById("horizontal-list").getElementsByTagName("li");

  var values = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i].innerText;
    var value = parseFloat(item.split("|")[item.split("|").length - 1].trim());
    values.push(value);
  }

  var max = Math.max.apply(Math, values);
  var min = Math.min.apply(Math, values);

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var value = parseFloat(item.innerText.split("|")[item.innerText.split("|").length - 1].trim());
    if (value >= max - 0.0001) {
      item.style.backgroundColor = "lightgreen";
    } else if (value <= min + 0.0001) {
      item.style.backgroundColor = "lightcoral";
    } else {
      item.style.backgroundColor = "";
    }
  }
}
