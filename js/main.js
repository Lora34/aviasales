const formSearch = document.querySelector('.form-search');
const inputCitiesFrom = document.querySelector('.input__citites-from');
const dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');
const inputCitiesTo = document.querySelector('.input__cities-to');
const dropdownCitiesTo = document.querySelector('.dropdown__cities-to');
const inputDateDepart = document.querySelector('.input__date-depart');

const city = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Челябинск', 'Керч', 'Волгоград'];

const showCity = (input, list) => {
        list.textContent = '';

        if(input.value !== '') {
                const filterCity = city.filter((item) => {
                        const fixItem = item.toLowerCase();
                        return fixItem.includes(input.value.toLowerCase());
                });
                filterCity.forEach((item) => {
                        const li = document.createElement('li');
                        li.classList.add('dropdown__city');
                        li.textContent = item;
                        list.append(li);
                });
        }
};

const selectCity = (event, input, list) => {
        const target = event.target;
        if (target.tagName.toLowerCase() === 'li') {
                inputCitiesFrom.value = target.textContent;
                dropdownCitiesFrom.textContent = '';
        }
}

inputCitiesFrom.addEventListener('input', () => {
        showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventLictener('input', () => {
        showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
        selectCity(event,inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
        selectCity(event,inputCitiesTo, dropdownCitiesTo);
});
