class BankAccount {
  #balance = 100;

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const accountBCA = new BankAccount();
// console.log(accountBCA.getBalancebalance); // 0
accountBCA.balance = 1000;
console.log(accountBCA.getBalancebalance()); // 0
