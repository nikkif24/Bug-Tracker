// Bug Class: Represents a Bug
class Bug {
    constructor(type, priority, description) {
        this.type = type;
        this.priority = priority;
        this.description = description;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBugs() {
        const bugs = Store.getBugs();

        bugs.forEach((bug) => UI.addBugToList(bug));
    }

    static addBugToList(bug) {
        const list = document.querySelector('#bug-list');

        const row = document.createElement('tr');

        row.innerHTML = `
      <td>${bug.type}</td>
      <td>${bug.priority}</td>
      <td>${bug.description}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

        list.appendChild(row);
    }

    static deleteBug(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#bug-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#type').value = '';
        document.querySelector('#priority').value = '';
        document.querySelector('#description').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getBugs() {
        let bugs;
        if (localStorage.getItem('bugs') === null) {
            bugs = [];
        } else {
            bugs = JSON.parse(localStorage.getItem('bugs'));
        }

        return bugs;
    }

    static addBug(bug) {
        const bugs = Store.getBugs();
        bugs.push(bug);
        localStorage.setItem('bugs', JSON.stringify(bugs));
    }

    static removeBug(description) {
        const bugs = Store.getBugs();

        bugs.forEach((bug, index) => {
            if (bug.description === description) {
                bugs.splice(index, 1);
            }
        });

        localStorage.setItem('bugs', JSON.stringify(bugs));
    }
}

// Event: Display Bugs
document.addEventListener('DOMContentLoaded', UI.displayBugs);

// Event: Add a Bug
document.querySelector('#bug-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const type = document.querySelector('#type').value;
    const priority = document.querySelector('#priority').value;
    const description = document.querySelector('#description').value;

    // Validate
    if (type === '' || priority === '' || description === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instatiate bug
        const bug = new Bug(type, priority, description);

        // Add Bug to UI
        UI.addBugToList(bug);

        // Add bug to store
        Store.addBug(bug);

        // Show success message
        UI.showAlert('Bug Added', 'success'); 

        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove a Bug
document.querySelector('#bug-list').addEventListener('click', (e) => {
    // Remove bug from UI
    UI.deleteBug(e.target);

    // Remove bug from store
    Store.removeBug(e.target.parentElement.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Bug Removed', 'success');
}); 
