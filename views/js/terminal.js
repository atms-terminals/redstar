/*jshint unused:false*/
/* global setCashmachineEnabled, ws, DispatcherWebSocket, frGetState, frPrintCheck, frPrintTicket*/
/* global getCard*/

var currScreen, currAction,
    timer, timerNoMoney, timerPay,
    tTimeoutPay,
    flash = 1,
    currDate = new Date(),
    stopAjax = 0;

function sleep(milliseconds) {
    'use strict';
    var start = new Date().getTime();
    while (new Date().getTime() < start + milliseconds) {

    }
}

///////////////////////////////////////////////////////////////////////////////////
// Добавление лидирующего нуля
function addZero(i) {
    'use strict';
    return (i < 10) ? '0' + i : i;
}
///////////////////////////////////////////////////////////////////////////////////
// получить текущую дату с учетом часового пояса
// diff в минутах
function getCurrDate() {
    'use strict';
    return addZero(currDate.getDate()) + '.' + addZero(currDate.getMonth() + 1) + '.' + currDate.getFullYear();
}
///////////////////////////////////////////////////////////////////////////////////
// получить текущее время с оффсетом с учетом часового пояса
// diff в минутах
function getCurrTime(needDot) {
    'use strict';
    var hour = addZero(currDate.getHours());
    var minutes = addZero(currDate.getMinutes());
    var secs = addZero(currDate.getSeconds());
    var ret = {
        delimeter: (needDot) ? ':' : ' ',
        hours: hour, 
        minutes: minutes, 
        secs: secs
    };

    return ret;
}

/////////////////////////////////////////////////////////////////////////////////////
// получение содержимого экрана с сервера
function doAction(activity, nextScreen, values){
    'use strict';
    // останавливаем таймеры
    if (nextScreen) {
        clearTimeout(timer);
        clearTimeout(timerNoMoney);
        clearTimeout(timerPay);
    }

    values = values || {};
    if (stopAjax === 1 && false) {
        return false;
    }
    stopAjax = 1;

    var sid = $('#sid').val();

    var req = {
        nextScreen: nextScreen,
        values: values
    };

    // $('#loadingMessage').show();
    if (activity === 'pay') {
        $('.btn.action.pay').addClass('hidden');
    }

    $.post(sid + '/ajax/' + activity, req, function (response) {
        stopAjax = 0;
        if (response.code === 0 && nextScreen) {

            if (response.check.hw && response.check.hw === '1') {
                // проверка установленного соединения
                if (ws.readyState !== ws.OPEN) {
                    DispatcherWebSocket();
                } else {
                    // проверка фискальника
                    frGetState();
                }
            }

            // сохраняем время
            currDate = new Date(response.dt.year, response.dt.month, response.dt.date, 
                response.dt.hours, response.dt.minutes, response.dt.seconds);

            if (response.html !== '') {
                $('#main').html(response.html);
            }
            $('#main').show();
            
            // обработка статуса купюрника
            if (response.cash && response.cash === '1') {
                setCashmachineEnabled(true);
            } else {
                setCashmachineEnabled(false);
            }

            // обработка статуса считки карт
            if (response.rfid && response.rfid.length !== 0) {
                getCard(response.rfid);
            }

            // если есть печатная форма - печатаем
            if (response.printForm !== undefined && response.printForm !== '') {
                var i, needDelay = false;

                if (response.printForm.fr !== undefined) {
                    for (i in response.printForm.fr) {
                        if (response.printForm.fr.hasOwnProperty(i)) {
                            if (needDelay) {
                                sleep(9000);
                            }
                            var elements = response.printForm.fr[i].elements || ';;',
                                tax = response.printForm.fr[i].tax || '0000',
                                top = response.printForm.fr[i].top || '',
                                bottom = response.printForm.fr[i].bottom || '',
                                amount = response.printForm.fr[i].amount || 0;

                            frPrintCheck(elements, amount, top, bottom, tax, '');
                            needDelay = true;
                        }
                    }
                }
                if (response.printForm.nofr !== undefined) {
                    if (needDelay) {
                        sleep(9000);
                    }
                    for (i in response.printForm.nofr) {
                        if (response.printForm.nofr.hasOwnProperty(i)) {
                            var line = response.printForm.nofr[i].line || '';

                            frPrintTicket(line);
                        }
                    }
                }

            }

            if (response.tTimeoutPay !== undefined) {
                tTimeoutPay = response.tTimeoutPay;
            }

            // если есть таймер и нет аудио для автоматического перехода
            if (response.tScreen !== undefined && response.tScreen !== '') {
                timer = setTimeout(function() {doAction(response.tAction, response.tScreen);} , response.tTimeout * 1000);
                if (response.tTimeoutNoMoney) {
                    timerNoMoney = setTimeout(function() {doAction(response.tAction, response.tScreen);} , response.tTimeoutNoMoney * 1000);
                }
            }
        }
    }, 'json')
        .fail(function () {
            // скрываем сообщение "подождите"
            $('#main').hide();
            stopAjax = 0;
            $('#loadingMessage').hide();
            timer =  setTimeout(function() {
                    // первый скрин, который надо запросить
                    currScreen = $('#idScreen').val();
                    currAction = $('#action').val();
                    doAction(currAction, currScreen);
                } , 3000);
        });
}

//////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
    'use strict';

    document.oncontextmenu = function () {
        return false;
    };

    var clockTimer =  setInterval(function() {
            var today = new Date();
            var time = getCurrTime(today.getSeconds() % 2);
            $('.currHour').html(time.hours);
            $('.currMinute').html(time.minutes);

            $('.currDate').html(getCurrDate());
            $('.currTime').html(getCurrTime());

            if (flash === 1) {
                flash = 0;
                $('.flashing').css('visibility', 'visible');
                $('.currDelim').css('visibility', 'visible');
            } else {
                flash = 1;
                $('.flashing').css('visibility', 'hidden');
                $('.currDelim').css('visibility', 'hidden');
            }
            currDate.setSeconds(currDate.getSeconds() + 1);

        } , 1000);

    timer =  setTimeout(function() {
            // первый скрин, который надо запросить
            currScreen = $('#idScreen').val();
            currAction = $('#action').val();
            doAction(currAction, currScreen);
        } , 3000);

    $(document).on('click', '.action', function(event) {
        event.preventDefault();
        // следующий экран куда перейти
        var nextScreen = $(this).siblings('.nextScreen').val();
        // действие
        var activity = $(this).siblings('.activity').val();
        // значение
        var values = {};
        $(this).parent().find('.value').each(function() {
            var theClass = $(this).attr('class');
            var classes = theClass.match(/\w+|"[^"]+"/g);
            var i;
            for (i in classes) {
                if (classes.hasOwnProperty(i)) {
                    if (classes[i] !== 'value') {
                        values[classes[i]] = $(this).val();
                    }
                }
            }
        });

        doAction(activity, nextScreen, values);
    });
});

