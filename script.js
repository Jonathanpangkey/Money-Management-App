let transactions = JSON.parse(localStorage.getItem("transactions")) || []; //mengambil data transaksi dari local storage

const descInput = document.getElementById("input-desc"); //mengambil elemen yang diperlukan
const amountInput = document.getElementById("input-amount");
const transactionList = document.getElementById("transaction-list");
const balanceAmount = document.getElementById("balance-amount"); //

function displayTransactions() {
  //fungsi menampilkan riwayat transaksi-transaksi
  transactionList.innerHTML = "";

  transactions.forEach((transaction, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      ${transaction.desc} <span>${transaction.amount}</span>
      <button class="delete" onclick="deleteTransaction(${index})">x</button>
    `;
    transactionList.appendChild(listItem);
  }); // meanmpilkan list transaksi dengan metode perulangan

  updateBalance();
  updateExpenses();
}

function addTransaction(desc, amount, category) {
  //fungsi menambahkan transaksi
  const transaction = { category, desc, amount }; //membuat object baru yakni transaction

  transactions.push(transaction); //push transaksi baru tadi ke transaction
  localStorage.setItem("transactions", JSON.stringify(transactions)); //mengupdate data di local storage

  displayTransactions();
}

function deleteTransaction(index) {
  //fungsi menghapus transaksi
  transactions.splice(index, 1);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  displayTransactions();
}

function updateExpenses() {
  //fungsi mengupdate dan menset budgeting planning
  const needsExpenses = transactions
    .filter((transaction) => transaction.amount < 0 && transaction.category === "needs")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const wantsExpenses = transactions
    .filter((transaction) => transaction.amount < 0 && transaction.category === "wants")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const incomeAmount = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  // menghitung percentage dari pengeluaran needs dan wants
  let needsPercentage = (Math.abs(needsExpenses) / incomeAmount) * 100;
  let wantsPercentage = (Math.abs(wantsExpenses) / incomeAmount) * 100;

  if (isNaN(needsPercentage) || isNaN(wantsPercentage)) {
    needsPercentage = 0;
    wantsPercentage = 0;
  } //jika nilai incomeAmount dan expense belum ada percentagenya akan 0

  const needsElement = document.getElementById("needs-expenses");
  const wantsElement = document.getElementById("wants-expenses");

  needsElement.textContent = `Rp${new Intl.NumberFormat("id-ID").format(
    Math.abs(needsExpenses)
  )} (${needsPercentage.toFixed(1)}%)`;
  wantsElement.textContent = `Rp${new Intl.NumberFormat("id-ID").format(
    Math.abs(wantsExpenses)
  )} (${wantsPercentage.toFixed(1)}%)`;

  // mengatur warna dan text dari needs dan wants expense
  if (needsPercentage > 50) {
    needsElement.style.color = "#f00";
    needsElement.innerHTML +=
      ' <span style="color: #f00;">(Pengeluaran melebihi 50% dari pendapatan)</span>';
  } else {
    needsElement.style.color = "";
  }
  if (wantsPercentage > 30) {
    wantsElement.style.color = "#f00";
    wantsElement.innerHTML +=
      ' <span style="color: #f00;"> ! Pengeluaran melebihi 30% dari pendapatan</span>';
  } else {
    wantsElement.style.color = "";
  }
}

function updateBalance() {
  //fungsi mengupdate dan menset balance
  const totalAmount = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  balanceAmount.textContent = `Rp${new Intl.NumberFormat("id-ID").format(totalAmount)}`;

  const expenseAmount = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  const incomeAmount = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  const needsAmount = incomeAmount * 0.5;
  const wantsAmount = incomeAmount * 0.3;
  const savingsAmount = incomeAmount * 0.2;

  //mengupdate text amount di pop up box
  document.getElementById("needs-amount").textContent = `Rp${new Intl.NumberFormat(
    "id-ID"
  ).format(needsAmount)}`;
  document.getElementById("wants-amount").textContent = `Rp${new Intl.NumberFormat(
    "id-ID"
  ).format(wantsAmount)}`;
  document.getElementById("savings-amount").textContent = `Rp${new Intl.NumberFormat(
    "id-ID"
  ).format(savingsAmount)}`;

  const expenseRatio = Math.abs(expenseAmount) / incomeAmount;

  //mengupdate text di balance
  if (expenseRatio >= 0.8) {
    balanceAmount.style.color = "#f00";
    balanceAmount.innerHTML +=
      '<br><span style="color: #f00; font-size: 20px;">!Pengeluaran telah melebihi 80% dari pendapatan!</span>';
  }
  // else if (expenseRatio >= 0.7) {
  //   balanceAmount.style.color = "#FFFF00";
  //   balanceAmount.innerHTML +=
  //     '<br><span style="color: #FFFF00; font-size: 20px;">!Pengeluaran hampir melebihi 80% dari pendapatan!</span>';
  // }
  else {
    balanceAmount.style.color = "#4CAF50";
  }
}

function addExpense() {
  // Function to add an expense transaction
  const desc = descInput.value;
  const amount = -amountInput.value;
  const categorySelect = document.getElementById("expense-category");
  const category = categorySelect.options[categorySelect.selectedIndex].value;
  addTransaction(desc, amount, category);
  descInput.value = "";
  amountInput.value = "";
}

function addIncome() {
  // Function to add an income transaction
  const desc = descInput.value;
  const amount = +amountInput.value;
  addTransaction(desc, amount);
  descInput.value = "";
  amountInput.value = "";
}

displayTransactions();

// Get the modal
function showModal() {
  const modal = document.getElementById("myModal");
  const close = document.getElementById("closeBtn");
  modal.style.display = "block";

  close.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// for darkmode
function toggleDarkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}
