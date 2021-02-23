class Fine {
  constructor(sno, student, amount, type) {
    this.sno = sno;
    this.student = student;
    this.amount = amount;
    this.type = type;
  }
}

class UI {
  addFine(fine) {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${fine.sno}</td>
    <td>${fine.student}</td>
    <td>${fine.amount}</td>
    <td>${fine.type}</td>
    <td><a href="#" class="delete"><i class="fas fa-times-circle"></i></a></td>
    `;
    const list = document.querySelector('tbody');
    list.appendChild(row);
  }

  static showAlert(message, alertClass) {
    const div = document.createElement('div');
    div.className = `${alertClass} alert`;
    div.appendChild(document.createTextNode(message));
    const card = document.querySelector('.card-body');
    const form = document.querySelector('form');
    card.insertBefore(div, form);

    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  clearValues() {
    document.querySelector('#sno').value = '';
    document.querySelector('#student').value = '';
    document.querySelector('#amount').value = '';
    document.querySelector('#type').value = 'Select';
  }

  static clearTable() {
    const list = document.querySelector('tbody');
    if(confirm('Are you sure?')) {
      while(list.firstChild) {
        list.removeChild(list.firstChild);
      }
    }
  }
}

class Store {
  static getFromLs() {
    let fines;
    if(localStorage.getItem('fines') === null) {
      fines = [];
    } else {
      fines = JSON.parse(localStorage.getItem('fines'));
    }
    return fines;
  }
  
  static addToLs(fine) {
    const fines = Store.getFromLs();

    fines.push(fine);

    localStorage.setItem('fines', JSON.stringify(fines));
  }

  static removeFromLs(sno) {
    const fines = Store.getFromLs();

    fines.forEach(function(fine,index) {
      if(fine.sno === sno) {
        fines.splice(index,1);
      }
    });

    localStorage.setItem('fines', JSON.stringify(fines));
  }

  static clearLS() {
    localStorage.clear();
  }
}

// Display table event listener
document.addEventListener('DOMContentLoaded', function() {
  const fines = Store.getFromLs();

  fines.forEach(function(fine) {
    const ui = new UI();
    ui.addFine(fine);
  });
});

// Add Fine event listener
document.querySelector('form').addEventListener('submit', function(e) {
  const sno = document.querySelector('#sno').value;
  const student = document.querySelector('#student').value;
  const amount = document.querySelector('#amount').value;
  const type = document.querySelector('#type').value;
  
  const fine = new Fine(sno, student, amount, type);
  
  const ui = new UI();

  if(sno == '' || student === '' || amount == '' || type === 'Select') {
    UI.showAlert('Please fill all the fields', 'error');
  } else {
    ui.addFine(fine);

    Store.addToLs(fine);

    UI.showAlert('Fine Added', 'success');

    ui.clearValues();
  }

  e.preventDefault();
});

// Clear Table event listener
document.querySelector('#clear').addEventListener('click', function(e) {
  UI.clearTable();
  Store.clearLS();
  
  e.preventDefault();
});

// Delete fine event listener
document.querySelector('.table').addEventListener('click', function(e) {
  if(e.target.parentElement.classList.contains('delete')) {
    e.target.parentElement.parentElement.parentElement.remove();
  }

  UI.showAlert('Fine Removed', 'success');

  Store.removeFromLs(e.target.parentElement.parentElement.parentElement.firstChild.nextElementSibling.textContent);

  e.preventDefault();
});

// Calculate result event listener
document.querySelector('#total').addEventListener('click', function(e) {
  const list = document.querySelector('tbody');
  let i;
  let sum = 0;

  for(i = 0; i < list.childElementCount; i++) {
    sum += Number(list.children[i].children[1].textContent);
  }

  document.querySelector('.result').style.display = 'block';
  document.querySelector('#total-fine').value = sum;
  
  e.preventDefault();
});