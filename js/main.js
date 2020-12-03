const formSearch = document.querySelector('.form-search');
const inputCitiesFrom = document.querySelector('.input__citites-from');
const dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');
const inputCitiesTo = document.querySelector('.input__cities-to');
const dropdownCitiesTo = document.querySelector('.dropdown__cities-to');
const inputDateDepart = document.querySelector('.input__date-depart');
const cheapestTicket = document.getElementById('cheapest-ticket');
const otherCheapTicket = document.getElementById('other-cheap-tickets');

//Данные
const CITI_API = 'database/cities.json',
        PROXY = 'https://cors-anywhere.herokuapp.com/',
        //API_KEY = ,
        calendar = 'http://min-prices.aviasales.ru/calendar_preload',
        MAX_COUNT = 10;
let city = [];

// Функции
const getData = (url, callback, reject = console.error) => {
        const request = new XMLHttpRequest();

        request.open('GET', url);
        request.addEventListener('readystatechange', () => {
                if (request.readyState !== 4) return;
                if(request.status === 200) {
                        callback(request.response);
                } else {
                        reject(request.status);
                }
        });

        request.send();
};

const showCity = (input, list) => {
        list.textContent = '';

        if(input.value !== '') {
                const filterCity = city.filter((item) => {
                
                        const fixItem = item.name.toLowerCase();
                        return fixItem.startsWith(input.value.toLowerCase());  
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
};

const getNameCity = (code) => {
        const objCity = city.find((item) => item.code === code);
        return objCity.name;
};

const getDate = (date) => {
        return new Date(date).toLocaleString('ru', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
        });
};

const getChanges = (num) =>{
        if (num) {
                return num === 1 ? 'Со одной пересадкой' : 'С двумя пересадками';
        }else {
                return 'Без пересадок'
        }
};
const getLinkAviasales = (data) => {
        let link = 'https://www.aviasales.ru/search/SVX2905KGD1';

        link += data.origin;

        const date = new Date(data.depart_date);

        const day = date.getDate();
        link += day < 0 ? '0' + day : day;

        const month = date.getMonth() + 1;
        link += month < 10 ? '0' + month : month;

        link += data.destination;

        link += '1';
        return link;
};

const createCard = () => {
        const ticket =  document.createElement('article');
        ticket.classList.add('ticket');

        let deep = '';
        if(data) {
                deep = `
                <h3 class="agent">${data.gate}</h3>
                <div class="ticket__wrapper">
                        <div class="left-side">
                                <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
                                        за ${data.value}</a>
                        </div>
                        <div class="right-side">
                                <div class="block-left">
                                        <div class="city__from">Вылет из города
                                                <span class="city__name">${getNameCity(data.origin)}</span>
                                        </div>
                                        <div class="date">${getDate(data.depart_date)}</div>
                                </div>

                                <div class="block-right">
                                        <div class="changes">${getChanges(data.number_of_changes)}</div>
                                        <div class="city__to">Город назначения:
                                                <span class="city__name">${getNameCity(data.destination)}</span>
                                        </div>
                                </div>
                        </div>
                </div>
                `;
        }else {
                deep = '<h3>К сожалению, на текущую дату билетов не нашлось</h3>'
        }

        ticket.insertAdjacentHTML('afterbegin'.deep);

        return ticket;
};

const renderCheapDay = (cheapTicket) => {
        cheapestTicket.style.display = 'block';
        cheapestTicket.innerHTML('<h2>Самый дешевый билет на выбранную дату</h2>');
        
        const ticket = createCard(cheapTicket[0]);
        cheapestTicket.append(ticket);
};
const renderCheapYear = (cheapTickets) => {
        otherCheapTicket.style.display = 'block';
        otherCheapTicket.innerHTML('<h2>Самые дешевые билеты на другие даты</h2>');

        cheapTickets.sort((a, b) => {
                if (a.value > b.value) {
                        return 1;
                }
                if (a.value < b.value) {
                        return -1;
                }
                // a должно быть равным b
                return 0;
        });

        for (let i =0; i < cheapTickets.length && i < MAX_COUNT; i++) {
                const ticket = createCard(cheapTickets[i]);
                otherCheapTicket.append(ticket);
        }
};

const renderCheap = (data, date) => {
        const cheapTicketYear = JSON.parse(data).best_prices;
        const cheapTicketDay = cheapTicketYear.filter((item) => {
                return item.depart_date === date;
        });

        renderCheapDay(cheapTicketDay);
        renderCheapYear(cheapTicketYear);
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
formSearch.addEventListener('submit', (event) => {
        event.preventDefault();

        const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
        const cityTo = city.find((item) => inputCitiesTo.value === item.name);
        const formData = {
                from: cityFrom.code,
                to: cityTo.code,
                when: inputDateDepart.value,
        };
        if (formData.from && formData.to) {
                const requestData = '?depart_date='+formData.when+
                '&origin='+formData.from.code+
                '&destination='+formData.to.code+
                '&one_way=true';
                //'&one_way=true&token='+API_KEY;
                getData(calendar + requestData, 
                        (data) => {
                                renderCheap(data, formData.when);
                        }, 
                        (error) => {
                                alert('В этом направлении нет рейсов');
                                console.log('Ошибка', error);
                        }) ;
        } else {
                alert('Введите корректное название города');
        }
        

});

//Вызовы функций 
getData(citiesApi, (data) => {
        city = JSON.parse(data).filter((item) => item.name);

        city.sort((a, b) => {
                if (a.name > b.name) {
                        return 1;
                }
                if (a.name < b.name) {
                        return -1;
                }
                // a должно быть равным b
                return 0;
        });
});


