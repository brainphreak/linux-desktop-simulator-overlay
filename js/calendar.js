let currentDate = new Date();
let calendarPopup; // Declare as module-level variable
let calendarMonthYear;
let calendarGrid;
let prevMonthButton;
let nextMonthButton;

function renderCalendar() {
    calendarGrid.innerHTML = '';
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    calendarMonthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(name => {
        const dayNameCell = document.createElement('div');
        dayNameCell.classList.add('calendar-day', 'day-name');
        dayNameCell.textContent = name;
        calendarGrid.appendChild(dayNameCell);
    });
    console.log('Day names appended. calendarGrid.children:', calendarGrid.children);

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.textContent = i;
        if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dayCell.classList.add('today');
        }
        calendarGrid.appendChild(dayCell);
    }
}

function toggleCalendar() {
    console.log('Toggling calendar. Popup element:', calendarPopup);
    console.log('classList before toggle:', calendarPopup.classList);
    calendarPopup.classList.toggle('hidden');
    console.log('classList after toggle:', calendarPopup.classList);
    if (!calendarPopup.classList.contains('hidden')) {
        renderCalendar();
    }
}

function initCalendar() {
    calendarPopup = document.getElementById('calendar-popup'); // Assign to module-level variable
    calendarMonthYear = document.getElementById('calendar-month-year');
    calendarGrid = document.getElementById('calendar-grid');
    prevMonthButton = document.getElementById('prev-month');
    nextMonthButton = document.getElementById('next-month');
    const dateElement = document.getElementById('date'); // dateElement can remain local

    dateElement.addEventListener('click', toggleCalendar);

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Close calendar if clicked outside
    document.addEventListener('click', (event) => {
        if (!calendarPopup.classList.contains('hidden') && !calendarPopup.contains(event.target) && event.target !== dateElement) {
            calendarPopup.classList.add('hidden');
        }
    });

    renderCalendar(); // Initial render
}

export { initCalendar };
