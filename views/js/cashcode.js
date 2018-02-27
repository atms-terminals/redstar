/*jshint unused:false*/
/*global doAction, timerNoMoney, timerPay : true, tTimeoutPay*/
var ws;
// const DISPATCHER_URL = 'ws://192.168.3.216:8011'; 
const DISPATCHER_URL = 'ws://localhost:8011'; 

/**
 * Блокировка/разблокировка купюрника
 */
function setCashmachineEnabled(flag) {
    'use strict';
    if (ws.readyState === ws.OPEN) {
        if (flag === true) {
            ws.send('{"object": "cashmachine", "cmd": "enabled", "enable": true}');
        } else if (flag === false) {
            ws.send('{"object": "cashmachine", "cmd": "enabled", "enable": false}');
        }
    }
}

/**
 * Запрос проверки состояния ФР
 * В ответ придут флаги - работает или нет, наличие бумаги
 */
function frGetState() {
    'use strict';
    if (ws.readyState === ws.OPEN) {
        ws.send('{"object": "fr", "cmd": "getstate"}');
    }
}

/**
 * Печать Z-отчета
 */
function frPrintZReport() {
    'use strict';
    if (ws.readyState === ws.OPEN) {
        ws.send('{"object": "fr", "cmd": "printzreports"}');
    }
}

/**
 * Печать X-отчета
 */
function frPrintXReport() {
    'use strict';
    if (ws.readyState === ws.OPEN) {
        ws.send('{"object": "fr", "cmd": "printxreport"}');
    }
}

/**
 * обработчик событий купюрника
 */
function handleCashmachineEvent(eventType, eventValue) {
    'use strict';
    var event;
    
    if (eventType === 'banknote') {
        var currAmount = parseInt($('.amount').val());
        currAmount += parseInt(eventValue);

        $('.amount').val(currAmount);
        $('.amountScreen').html(currAmount);

        // если деньги приняты - то останавливаем таймер, который отслеживает невненсение денег
        if (currAmount) {
            clearTimeout(timerNoMoney);
            // $('.btn.action.pay').removeClass('hidden');
            $('.btn.action.cancel').addClass('hidden');

            // перезапускаем таймер для кнопки оплатить
            $('.btn.action.pay').addClass('hidden');
            clearTimeout(timerPay);
            timerPay = setTimeout(function() {$('.btn.action.pay').removeClass('hidden');} , tTimeoutPay * 1000);
        }

        // Проверяем минимальную сумму платежа, если достигнута, то оплачиваем автоматом
        var minAmount = +$('.minamount').val() || 0;
        if (minAmount && currAmount >= minAmount) {
            $('.btn.action.pay').trigger('click');
        }

        console.log('Купюроприемник: банкнота принята ' + eventValue);
        event = {
            type: 'cash',
            isError: 0,
            message: 'банкнота принята ' + eventValue
        };
        doAction('writeLog', 0, event);
    } else if (eventType === 'started') {
        console.log('Купюроприемник: запущен');
        event = {
            type: 'cash',
            isError: 0,
            message: 'запущен (связь восстановилась)'
        };
        doAction('writeLog', 1, event);
    } else if (eventType === 'stopped') {
        console.log('Купюроприемник: остановлен');
        event = {
            type: 'cash',
            isError: 1,
            message: 'остановлен (пропала до него связь)'
        };
        doAction('writeLog', 8, event);
    } else if (eventValue === 'DropCassetteOutOfPosition') {
        // инкассация
        frPrintZReport();
        console.log('Купюроприемник: Кассета изъята');
        doAction('collection', 9);
    } else if (eventType === 'cassetInserted') {
        console.log('Купюроприемник: Кассета вставлена');
        // конец инкассации
        event = {
            type: 'cash',
            isError: 0,
            message: 'Кассета вставлена'
        };
        doAction('writeLog', 1, event);
    } else if (eventType === 'error') {
        console.log('Купюроприемник: ошибка ' + eventValue);
        event = {
            type: 'cash',
            isError: 1,
            message: 'ошибка ' + eventValue
        };
        doAction('writeLog', 8, event);
    } else {
        console.log('Купюроприемник: неизвестная ошибка ' + eventType);
        event = {
            type: 'cash',
            isError: 1,
            message: 'неизвестная ошибка ' + eventType
        };
        doAction('writeLog', 8, event);
    }
}

/**
 * Обработчик событий принтера
 */
function handleFRResponse(result, obj) {
    'use strict';
    var event = {
        type: 'fr',
        isError: 0,
        message: obj
        },
        nextScreen = 0;

    if (result !== 'ok') {
        nextScreen = 8;
        event.isError = 1;
    }

    doAction('writeLog', nextScreen, event);
    console.log('ФР: ' + result + '\n' + obj);
}

/**
 * Инициализация купюрника
 */
function DispatcherWebSocket() {
    'use strict';
    var event;
    if ('WebSocket' in window) {
        // Let us open a web socket
        ws = new WebSocket(DISPATCHER_URL);
        if (ws.readyState !== ws.OPEN) {
            event = {
                type: 'webSocket',
                isError: 1,
                message: 'Нет соединения с оборудованием'
            };
            doAction('writeLog', 8, event);
        }
        
        ws.onerror = function function_name(argument) {
            var event = {
                type: 'webSocket',
                isError: 1,
                message: 'ошибка'
            };
            doAction('writeLog', 8, event);
        };

        ws.onopen = function() {
            var event = {
                type: 'webSocket',
                isError: 0,
                message: 'OK'
            };
            doAction('writeLog', 0, event);

            var msg = '{"object": "common", "cmd": "connect"}';
            ws.send(msg);
        };
        
        ws.onmessage = function (evt) { 
            var eventObj;
            /* jshint ignore:start */
            eventObj = eval('(' + evt.data + ')');
            /* jshint ignore:end */
          
            if (eventObj.object === 'common' && eventObj.result === 'connected') {
                // init();
            }
          
            if (eventObj.object === 'cashmachine') {
                if (eventObj.event != null) {
                    handleCashmachineEvent(eventObj.event, eventObj.eventValue);
                }
            } else if (eventObj.object === 'fr') {
                handleFRResponse(eventObj.result, evt.data);
            }
        };
       
       ws.onclose = function() {};
    } else {
        event = {
            type: 'webSocket',
            isError: 1,
            message: 'WebSocket NOT supported by your Browser!'
        };
        doAction('writeLog', 8, event);
       // The browser doesn't support WebSocket
        // window.alert('WebSocket NOT supported by your Browser!');
    }
}

/**
 * 
 * Полный функционал по созданию фискального чека
 *
 * Позиции задаются списком "название";"цена";"количество";"налог";, разделенных между собой символом '|'
 * Пример: товар 1;100;2;3000;|товар2;300;1;3000;
 * 
 * Комментарии печатаются до позиций и после, разделитель в комментариях - конец строки '\n'
 * 
 * Налог передается одним словом состоящим из 4-х цифр от 0 до 4 («0» – нет, «1»...«4» – налоговая группа)
 * 1 - НДС 18%, 2 - НДС 10%, 3 - НДС 0%, 4 - Без налога
 *
 * address - адрес (email/телефон) куда отправить копию чека
 *
 */
function frPrintCheck(positions, summ, comment1, comment2, tax, address) {
    'use strict';
    if (ws.readyState === ws.OPEN) {
        ws.send('{"object": "fr",' + 
            ' "cmd": "printcheck",' + 
            ' "text": "' + positions + '",' + 
            ' "summ": "' + summ + '",' +
            ' "info": "' + tax + '",' +
            ' "address": "' + address + '",' +
            ' "comment1": "' + encodeURIComponent(comment1) + '",' + 
            ' "comment2": "' + encodeURIComponent(comment2) + '"' + 
            '}');
    }
}


/**
* 
* Печать не фискального чека
*
* Текст передается одной строкой, разделитель строк - символ конца строки '\\n'
*/
function frPrintTicket(comments) {
    'use strict';
    if (ws.readyState === ws.OPEN) {
        ws.send('{"object": "fr", ' +
            '"cmd": "printticket", ' +
            '"text": "' + encodeURIComponent(comments) + '"' +
        '}');
    }
}

$(document).ready(function() {
    'use strict';
    $(document).contextmenu(function function_name() {
        // return false;
    });

    DispatcherWebSocket();
});
