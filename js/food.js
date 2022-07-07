window.addEventListener('DOMContentLoaded', function () {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'), //all tabs in the list
        tabsContent = document.querySelectorAll('.tabcontent'), //tabs content
        tabsParent = document.querySelector('.tabheader__items'); //parent of tabs items

    function hideTabContent() { // hide tab content, where there are img, add and remove classes and remove active class for the all tabs 

        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) { //we need to understand to which element we are refering(obrashaemsia) to show display, [i] is a number(argument)
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active'); //add active class
    }

    hideTabContent();
    showTabContent(); // empty () means 0 (first index) becaus we equated [i] to 0

    tabsParent.addEventListener('click', function (event) { //deligate method, clicking on parent div we pass action to all childs
        const target = event.target; //create const with event.target for ease of use in the future
        if (target && target.classList.contains('tabheader__item')) { //if target on which we clicked, equel with item which we match with the element(item) we are currently iterating, call 2 functions, when we toggle the tab, we need to hide all other tabs and show only one which is needed.
            tabs.forEach((item, i) => {
                if (target === item) {
                    hideTabContent();
                    showTabContent(i); // [i] is a number which was matched
                }
            });
        }
    });

    //TIMER

    const deadline = '2022-07-09';

    function getTimeRemainig(endtime) { //function task is to get total time difference
        const t = Date.parse(endtime) - Date.parse(new Date()); // we get a milisec difference in the endtime
        const days = Math.floor(t / (1000 * 60 * 60 * 24)); //total days before sale, count amount days which are left untill sale = t(difference msec) divede on / (msec in min * msec in 1 hour * msec in 1 day) 
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24); //total hours before sale,  (total difference time / milisec in one hour) % 24(hours a day) = 48 hours and rest 2 hours which will be displayed in hours tab
        const minutes = Math.floor((t / 1000 / 60) % 60); // total minutes
        const seconds = Math.floor((t / 1000) % 60); //total sec

        return { //return object from function
            'total': t, // total amount of miliseconds
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000); //run fn updateclock every second

        function updateClock() { //remaining time calculation
            const t = getTimeRemainig(endtime); //return object with all data

            days.innerHTML = t.days;
            hours.innerHTML = t.hours;
            minutes.innerHTML = t.minutes;
            seconds.innerHTML = t.seconds;

            if (t.total <= 0) { //t.total(total amount of miliseconds <= 0 ) turn off update timer
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);

    //MODAL WINDOW

    const modalTrigger = document.querySelectorAll('[data-modal]'), //button
        modal = document.querySelector('.modal'); //all page content (div modal) when modal is opened 


    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; //can't scroll page while modal window is opened
        clearInterval(modalTimerId); //if user open modal window clear timeInterval fn
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }



    modal.addEventListener('click', (e) => { //close modal window clicking on background document or X button, data-close it's a X button
        if (e.target === modal || e.target.getAttribute('data-close') === '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000); //show modal window after 50 sec.

    function showModalByScroll() { //when user scroll page to the end show modal window 1 time
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll); //remove to do not show modal window more times
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // USE CLASSES FOR THE CARDS

    class MenuCard { //create a Class constructor
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector); //we need an element to transmit(render) our context
            this.transfer = 27;
            this.changeToUAH();
        }
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
        render() { //help to draw html,css code at the page
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">price:</div>
                        <div class="menu__item-total"><span><div class="menu__item-cost">${this.price}</div>
                        </span> грн/день</div>
                    </div>
                </div>
                `;
            this.parent.append(element);
        }
    }
    //1 variant
    //fn to get data from server, argument url, throw - means alert, new Error - it's a method where we are writing the text
    const getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };

    getResource('http://food.local')
        .then(data => {//for many cards to create
            data.forEach(({ img, altimg, title, descr, price }) => {//destructive object(img.altimg...), call and render constructor, Menucard will be created as many times as there are objects in the array
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    //2 variant
    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));
    // //fn to create card without constructor(shablon), use for one time 
    // function createCard(data) {
    //     data.forEach(({ img, altimg, title, descr, price }) => {
    //         const element = document.createElement('div');
    //         element.innerHTML = `
    //             <div class="menu__item">
    //                 <img src=${img} alt=${altimg}>
    //                 <h3 class="menu__item-subtitle">${title}</h3>
    //                 <div class="menu__item-descr">${descr}</div>
    //                 <div class="menu__item-divider"></div>
    //                 <div class="menu__item-price">
    //                     <div class="menu__item-cost">price:</div>
    //                     <div class="menu__item-total"><span><div class="menu__item-cost">${price}</div>
    //                     </span> грн/день</div>
    //                 </div>
    //             </div>
    //             `;
    //         document.querySelector('.menu .container').append(element);
    //     });

    // }


    // FORMS!!!
    const forms = document.querySelectorAll('form');//get all forms on the web
    const message = {//create object for the messages to the user
        loading: 'img/forms/Animation_2.svg',
        success: 'Thanks, we will contact you soon',
        failure: 'Something went wrong',
    };

    forms.forEach(item => {//pass fn Postdata to all forms, which is event listener in our request sending
        bindPostData(item);
    });

    //async means async code in the fn, await means to wait a response
    const postData = async (url, data) => {//fn set ups our request to the server(fetchit), get responce and then transform response to the json file. url pass to fetch, data to post
        const result = await fetch(url, {//add promise returning from fetch
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await result.json();//waiting promise response, convert to json and returning to the postData
    };

    function bindPostData(form) {//bind actions, pass argument in this case our (form)
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
                margin: 0 auto;
                `;
            form.insertAdjacentElement('afterend', statusMessage);//insert the message after the last element in the form

            const formData = new FormData(form);//special object FORMDATA() helps us to collect all data from form and generate data for the new form in the future
            const json = JSON.stringify(Object.fromEntries(formData.entries()));//transform formData to arrays in the arrays(entries) then to the object(Object.fromEntries) and then to the JSON.stringify for the server

            //send JSON.stringify file to the server, below
            postData('http://food.local', json)
                .then(data => {//data from our promise which have recieved from the server
                    console.log(data);
                    showThanksModal(message.success);//after response.ok start our fn which are showing a modal window and closing after 4 sec
                    statusMessage.remove();//remove our loading content(spiner)
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();//reset form value after entering values
                });
        });
    }

    function showThanksModal(message) {//pass argument message which will show out message
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');//we need to hide previous modal window
        openModal();// response for opening modal windows

        const thanksModal = document.createElement('div');//create new content
        thanksModal.classList.add('modal__dialog');//add prev class
        thanksModal.innerHTML = `
        <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
                </div>
                `;

        document.querySelector('.modal').append(thanksModal);//append our new element with a content
        setTimeout(() => {
            thanksModal.remove();//remove element after 4 sec
            prevModalDialog.classList.add('show');//show prev content
            prevModalDialog.classList.remove('hide');//hide prev content
            closeModal();
        }, 4000);

    }

    fetch('http://food.local')
        .then(data => data.json())
        .then(res => console.log(res));


    // BLOCK WITH XML REQUEST, OLD VERSION OF FETCH 
    //WE DON'T NEED WRITE SET REQUEST HEADER WHEN WE USE A BUNCH(sviazka) FORMDATA, OBJECT(MESSAGE) AND XMLHTTPREQUEST TOGETHER
    // function postData(form) {//pass argument in this case(form)
    //     form.addEventListener('submit', (e) => {
    //         e.preventDefault();

    //         let statusMessage = document.createElement('img');
    //         statusMessage.src = message.loading;
    //         statusMessage.style.cssText = `
    //             display: block;
    //             margin: 0 auto;
    //         `;
    //         form.insertAdjacentElement('afterend', statusMessage);//we can insert element after,before, inside div, here we are inserting our message after form(afterend)
    //         //create and send simple file to the server
    //         const request = new XMLHttpRequest();//create our request to the server with simple data,(php)
    //         request.open('POST', 'server.php');//collect settings, to set up method

    //         request.setRequestHeader('Content-type', 'application/json', 'utf-8');//header title
    //         const formData = new FormData(form);//special object FORMDATA() helps us to collect data from passed form and generate data for the new form

    //         //send JSON file to the server, below
    //         // //OBJECT FormData is a specific method, if we want to transform it to json file we need to loop it
    //         const object = {}; //create var for a new object which we'll transform data to json file
    //         formData.forEach(function (value, key) {
    //             object[key] = value;//pass values to our new object, we get a simple object not a FormData and now we can use a JSON method
    //         });
    //         let json = JSON.stringify(object);//convert object to JSON, for the server

    //         request.send(json);//we send body(our form)

    //         request.addEventListener('load', () => {//load - tracking the final load of request
    //             if (request.status === 200) {
    //                 console.log(request.response);
    //                 showThanksModal(message.success);//after response.ok start our fn which are showing a modal window and closing after 4 sec
    //                 form.reset();//reset form value after entering values
    //                 statusMessage.remove();//remove our loading content(spiner)
    //             } else {
    //                 showThanksModal(message.failure);
    //             }
    //         });
    //     });
    // }


});
