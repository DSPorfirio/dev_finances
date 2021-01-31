const modal = {
    open(){
        //Abrir modal
        //Adicionar a class active do modal
        let element = document.querySelector('.modal-overlay');
        element.setAttribute('class', 'modal-overlay active');
    },
    
    close(){
        //Fechar modal
        //Remover a class active do modal
        let element = document.querySelector('.modal-overlay');
        element.setAttribute('class', 'modal-overlay');
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
    }, 

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction);

        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1);

        App.reload();
    },

    incomes() {
        let income = 0;
        console.log(Transaction.all)
        
        Transaction.all.forEach(element => {
            element.amount > 0 ? income+= element.amount : '';
        })

        console.log("entradas: " + income)

        return income;
    },

    expenses() {
        let expense = 0;
        
        Transaction.all.forEach(element => {
            element.amount < 0 ? expense+= element.amount : '';
        })

        console.log("saidas: " + expense)

        return expense;
    },

    total() {
        const incomes = Transaction.incomes();
        const expenses = Transaction.expenses();

        console.log("total:" + incomes + " " + expenses);

        return incomes + expenses;
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction, index) {
        console.log(transaction)
        const CSSclass = transaction.amount > 0 ? "income" : "expense";
        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `

        return html;
    },

    updateBalance() {
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());

    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100

        return value;
    },

    formatDate(date) {
        const splittedDate = date.split("-");
        
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

        value = value.toLocaleString('pt-BR', {
            style: "currency",
            currency: "BRL"
       });

        return signal + value;
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validadeFields() {
        const { description, amount, date } = Form.getValues();


        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Preencha todos os campos!");
        }
    },

    formatData() {
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount);

        date = Utils.formatDate(date);

        return {description, amount, date}
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },

    submit(e) {
        e.preventDefault();

        try {
            Form.validadeFields();
            const transaction = Form.formatData();
            Form.saveTransaction(transaction);
            Form.clearFields();
            modal.close();

        } catch (error) {
            alert(error.message)
        } 
    }
}

const App = {
    init() {
        Transaction.all.forEach((element, index) => {
            DOM.addTransaction(element, index)
        });

        DOM.updateBalance();

        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions();
        App.init();
    }
}

App.init();




    
        
