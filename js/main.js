const formSearch = document.querySelector('.form-search');
const inputCitiesFrom = document.querySelector('.input__citites-from');
const dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');
const inputCitiesTo = document.querySelector('.input__cities-to');
const dropdownCitiesTo = document.querySelector('.dropdown__cities-to');
const inputDateDepart = document.querySelector('.input__date-depart');

//Данные
const CITI_API = 'database/cities.json',
        PROXY = 'https://cors-anywhere.herokuapp.com/',
        //API_KEY = ,
        calendar = 'http://min-prices.aviasales.ru/calendar_preload';
let city = [];

// Функции
const getData = (url, callback) => {
        const request = new XMLHttpRequest();

        request.open('GET', url);
        request.addEventListener('readystatechange', () => {
                if (request.readyState !== 4) return;
                if(request.status === 200) {
                        callback(request.response);
                } else {
                        console.error(request.status);
                }
        });

        request.send();
};

const showCity = (input, list) => {
        list.textContent = '';

        if(input.value !== '') {
                const filterCity = city.filter((item) => {
                
                        const fixItem = item.name.toLowerCase();
                        return fixItem.includes(input.value.toLowerCase());  
                });
                filterCity.forEach((item) => {
                        const li = document.createElement('li');
                        li.classList.add('dropdown__city');
                        li.textContent = item.name;
                        list.append(li);
                });
        }
};

const selectCity = (event, input, list) => {
        const target = event.target;
        if (target.tagName.toLowerCase() === 'li') {
                input.value = target.textContent;
                list.textContent = '';
        }
}

// Обработчики
inputCitiesFrom.addEventListener('input', () => {
        showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
        showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
        selectCity(event,inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
        selectCity(event,inputCitiesTo, dropdownCitiesTo);
});

//Вызовы функций
getData(citiesApi, (data) => {
        city = JSON.parse(data).filter((item) => item.name);
});
