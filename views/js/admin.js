/**
* запрос чего-то с сервера
**/
function get(action, $area, values) {
    'use strict';
    values = values || false;

    var sid = $('#sid').val();
    $.get(sid + '/admin/' + action, values, function(data) {
        $area.find('.resultArea').html(data);

        if (action === 'getPriceGroup') {
            $area.find('.time').datetimepicker({
                format: 'LT',
                locale: 'ru',
            });
            // редактирование времени
            $('.time').on('dp.change', function() {
                var sid = $('#sid').val(),
                    $checkbox = $(this).closest('li').find('.serviceItem'),
                    $form = $(this).closest('.times'),
                    req = {
                        id: $checkbox.attr('id'), 
                        idDay: $form.find('.dayStatus').val(),
                        timeStart: $form.find('.timeStart').val(),
                        timeFinish: $form.find('.timeFinish').val()
                    };

                $.post(sid + '/admin/setWorkTime', req, function() {

                }, 'json')
                    .fail(function(){
                        get('getPriceGroup', $('#priceGroup'));
                    });
            });
        }
    });

}

$(document).ready(function() {
    'use strict';

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        switch (e.target.hash) {
            case '#hws': 
                get('getHwsState', $('#hws'));
                break;
            case '#collections': 
                get('getCollections', $('#collections'));
                break;
            case '#priceGroup': 
                get('getPriceGroup', $('#priceGroup'), 
                    {
                        type: $('.day-type .active').val(),
                        active: $('#priceStatus').prop('checked') ? 1 : 0
                    }
                );
                break;
            case '#admin': 
                get('getTerminals', $('#terminals'));
                get('getUsers', $('#users'));
                break;
        }
    });

    $(document).on('click', '.del-date', function() {
        var id = $(this).val(),
            year = $('.year').val(),
            sid = $('#sid').val();

        var req = {
                year: year,
                id: id
            };

        $.post(sid + '/admin/delDate', req, function(response) {
            $('#schedule .resultArea .dates').html(response.html);
        }, 'json')
            .fail(function(){
            });
    });

    $('.add-dt').click(function() {
        var dt = $('.dt').find('input').val(),
            year = $('.year').val(),
            sid = $('#sid').val(),
            isWork = $(this).closest('.row').find('input[type=checkbox]').prop('checked') ? 1 : 2;

        if ($.trim(dt) === '') {
            return false;
        }
        var req = {
                dt: dt,
                year: year,
                isWork: isWork
            };

        $.post(sid + '/admin/addDate', req, function(response) {
            $('#schedule .resultArea .dates').html(response.html);
        }, 'json')
            .fail(function(){
            });
    });

    // дата
    $('.dt').datetimepicker({
        format: 'DD.MM.YYYY',
        locale: 'ru',
    });

    $('.year').change(function() {
        var year = $('.year').val(),
            sid = $('#sid').val();

        var req = {
                year: year,
            };

        $.post(sid + '/admin/getSchedule', req, function(response) {
            $('#schedule .resultArea .dates').html(response.html);
        }, 'json')
            .fail(function(){
            });
    });

    // удаление услуги
    $(document).on('click', 'button.delete', function() {
        var sid = $('#sid').val(),
            $checkbox = $(this).siblings('.serviceItem'),
            req = {
                id: $checkbox.attr('id'), 
                text: $(this).val()
            };

        $.post(sid + '/admin/setClientsDesc', req, function() {

        }, 'json')
            .fail(function(){
                get('getPriceGroup', $('#priceGroup'));
            });
    });

    // детализация инкассации
    $(document).on('click', 'button.getCollectionSummary', function() {
        var sid = $('#sid').val(),
            dt = $(this).siblings('.dt').val(),
            id = $(this).siblings('.id').val(),
            req = {
                dt: dt,
                id: id
            };

        $.post(sid + '/admin/getCollectionSummary', req, function(response) {
            var $a = $('<a>');
            $a.attr('href', response.file);
            $('body').append($a);
            $a.attr('download', 'collectionSummary.xls');
            $a[0].click();
            $a.remove();

        }, 'json')
            .fail(function(){
            });
    });

    // детализация инкассации
    $(document).on('click', 'button.getCollectionDetails', function() {
        var sid = $('#sid').val(),
            dt = $(this).siblings('.dt').val(),
            id = $(this).siblings('.id').val(),
            req = {
                dt: dt,
                id: id
            };

        $.post(sid + '/admin/getCollectionDetails', req, function(response) {
            var $a = $('<a>');
            $a.attr('href', response.file);
            $('body').append($a);
            $a.attr('download', 'collectionDetail.xls');
            $a[0].click();
            $a.remove();

        }, 'json')
            .fail(function(){
            });
    });

    // редактирование комментария
    $(document).on('change', '.commentItem', function() {
        var sid = $('#sid').val(),
            $checkbox = $(this).siblings('.serviceItem'),
            req = {
                id: $checkbox.attr('id'), 
                text: $(this).val()
            };

        $.post(sid + '/admin/setCommentItem', req, function() {

        }, 'json')
            .fail(function(){
                get('getPriceGroup', $('#priceGroup'));
            });
    });

    // редактирование названия услуги для терминала
    $(document).on('change', '.clientsDesc', function() {
        var sid = $('#sid').val(),
            $checkbox = $(this).siblings('.serviceItem'),
            req = {
                id: $checkbox.attr('id'), 
                text: $(this).val()
            };

        $.post(sid + '/admin/setClientsDesc', req, function() {

        }, 'json')
            .fail(function(){
                get('getPriceGroup', $('#priceGroup'));
            });
    });

    // редактирование цены услуги для терминала
    $(document).on('change', '.price', function() {
        var sid = $('#sid').val(),
            $checkbox = $(this).siblings('.serviceItem'),
            req = {
                id: $checkbox.attr('id'), 
                price: $(this).val()
            };

        $.post(sid + '/admin/setPrice', req, function() {

        }, 'json')
            .fail(function(){
                get('getPriceGroup', $('#priceGroup'));
            });
    });

    // редактирование ндс для услуги для терминала
    $(document).on('change', '.nds', function() {
        var sid = $('#sid').val(),
            $checkbox = $(this).siblings('.serviceItem'),
            req = {
                id: $checkbox.attr('id'), 
                nds: $(this).val()
            };

        $.post(sid + '/admin/setNds', req, function() {

        }, 'json')
            .fail(function(){
                get('getPriceGroup', $('#priceGroup'));
            });
    });

    // редактирование типа чека для терминала
    $(document).on('change', '.bill', function() {
        var sid = $('#sid').val(),
            $checkbox = $(this).siblings('.serviceItem'),
            req = {
                id: $checkbox.attr('id'), 
                status: $(this).prop('checked') ? 1 : 0
            };

        $.post(sid + '/admin/setBill', req, function() {

        }, 'json')
            .fail(function(){
                get('getPriceGroup', $('#priceGroup'));
            });
    });

    // редактирование цвета кнопки
    $(document).on('change', '.color input', function() {
        var sid = $('#sid').val(),
            $this = $(this).closest('li'),
            color = $this.find('.color input:checked').val(),
            $checkbox = $this.find('.serviceItem'),
            req = {
                id: $checkbox.attr('id'), 
                color: color
            };

        $.post(sid + '/admin/setColor', req, function() {

        }, 'json')
            .fail(function(){
                get('getPriceGroup', $('#priceGroup'));
            });
    });

    // редактирование цвета кнопки
    $(document).on('change', '.dayStatus', function() {
        var sid = $('#sid').val(),
            $this = $(this).closest('li'),
            idDay = $(this).val(),
            $checkbox = $this.find('.serviceItem'),
            req = {
                id: $checkbox.attr('id'), 
                idDay: idDay,
                status: $(this).prop('checked') ? 1 : 0
            };

        $.post(sid + '/admin/setDayStatus', req, function() {

        }, 'json')
            .fail(function(){
                get('getPriceGroup', $('#priceGroup'));
            });
    });

    // разрешение/запрещение услуги
    $(document).on('click', '.serviceItem', function() {
        var sid = $('#sid').val(),
            req = {
                id: $(this).attr('id'), 
                status: $(this).prop('checked') ? 1 : 0
            };

        $.post(sid + '/admin/setPriceGroupStatus', req, function() {

        }, 'json')
            .fail(function(){
                get('getPriceGroup', $('#priceGroup'));
            });
    });

    // изменение типа меню
    $('.day-type button').click(function() {
        $('.day-type button').removeClass('active');
        $(this).addClass('active');
        get('getPriceGroup', $('#priceGroup'),
            {
                type: $('.day-type .active').val(),
                active: $('#priceStatus').prop('checked') ? 1 : 0
            }
        );
    });

    // показ услуг
    $(document).on('click', '#priceStatus', function() {
        get('getPriceGroup', $('#priceGroup'),
            {
                type: $('.day-type .active').val(),
                active: $('#priceStatus').prop('checked') ? 1 : 0
            }
        );
    });

    // сворачивание-разворачивание меню
    $(document).on('click', '#priceGroup .dropdown', function() {
        var $span = $(this).children('span'),
            $ul = $(this).siblings('ul');

        if ($span.hasClass('glyphicon-triangle-bottom')) {
            $span.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-top');
            $ul.addClass('hidden');
        } else {
            $span.removeClass('glyphicon-triangle-top').addClass('glyphicon-triangle-bottom');
            $ul.removeClass('hidden');
        }
    });

    // запрос инкассаций
    $('#refreshCollections').click(function(event) {
        event.preventDefault();
        get('getCollections', $('#collections'));
    });

    // запрос статусов оборудования
    $('#refreshHwsStatus').click(function(event) {
        event.preventDefault();
        get('getHwsState', $('#hws'));
    });

    // запрос авансов по карте
    $('#getPrepaid').click(function(event) {
        event.preventDefault();
        get('getPrepaidStatus', $('#prepaid'), {searchStr: $('#searchStr').val()});
    });

    // изменение авансов по карте
    $(document).on('click', '#changePrepaid', function(event) {
        event.preventDefault();
        var sid = $('#sid').val(),
            req = {
                card: $('#changePrepaymentDialog .card').val(), 
                amount: $('#changePrepaymentDialog .amount').val()
            };

        $.post(sid + '/admin/changePrepaid', req, function() {
            $('#getPrepaid').trigger('click');
        }, 'json')
            .fail(function(){
                get('getPrepaidStatus', $('#prepaid'), {searchStr: $('#searchStr').val()});
            });
    });

    // показ диалога изменения аванса
    $(document).on('click', '.changePrepayment', function(event) {
        event.preventDefault();
        var $tr = $(this).closest('tr');
        $('#changePrepaymentDialog .amount').val($tr.find('span.amount').text());
        $('#changePrepaymentDialog .card').val($tr.find('span.card').text());
    });

    // изменение статуса терминала
    $(document).on('click', '.changeStatus', function(event) {
        event.preventDefault();
        var sid = $('#sid').val(),
            $this = $(this),
            $tr = $this.closest('tr'),
            req = {
                id: $tr.find('.id').val(), 
                status: $this.hasClass('enable') ? 1 : 0
            };

        $.post(sid + '/admin/changeStatus', req, function() {
            if ($this.hasClass('user')) {
                get('getUsers', $('#users'));
            } else {
                get('getTerminals', $('#terminals'));
            }
        }, 'json')
            .fail(function(){
                if ($this.hasClass('user')) {
                    get('getUsers', $('#users'));
                } else {
                    get('getTerminals', $('#terminals'));
                }
            });
    });

    // окно добавление/редактирования пользователя
    $(document).on('click', '.changeUser', function(event) {
        event.preventDefault();
        var $this = $(this),
            $tr = $this.closest('tr'),
            action = '';

        if ($this.hasClass('user')) {
            $('#changeUserDialog .user').show();
            $('#changeUserDialog .terminal').hide();
            action = 'User';
        } else {
            $('#changeUserDialog .user').hide();
            $('#changeUserDialog .terminal').show();
            action = 'Terminal';
        }

        $('#changeUserDialog input[type=text]').val('');
        $('#changeUserDialog .id').val(0);
        $('#changeUserDialog .confirm').show();

        if ($this.hasClass('add')) {
            action = 'add' + action;
            $('#changeUserDialog .edit').hide();
        } else {
            action = 'edit' + action;
            $('#changeUserDialog .add').hide();
            $('#changeUserDialog .id').val($tr.find('.id').val());

            if ($this.hasClass('user')) {
                $('#changeUserDialog .login').val($tr.find('.login').text());
            } else {
                $('#changeUserDialog .address').val($tr.find('.address').text());
                $('#changeUserDialog .ip').val($tr.find('.ip').text());
            }
        }

        $('#changeUserDialog .action').val(action);

    });

    $('#changeUserDialog .confirm').click(function(event) {
        event.preventDefault();
        var sid = $('#sid').val(),
            action = $('#changeUserDialog .action').val(), 
            req = {
                id: $('#changeUserDialog .id').val(), 
                ip: $('#changeUserDialog .ip').val(), 
                address: $('#changeUserDialog .address').val(), 
                login: $('#changeUserDialog .login').val(), 
            };

        $.post(sid + '/admin/' + action, req, function() {
            if (action === 'addUser' || action === 'editUser') {
                get('getUsers', $('#users'));
            } else {
                get('getTerminals', $('#terminals'));
            }
        }, 'json')
            .fail(function(){
            if (action === 'addUser' || action === 'editUser') {
                    get('getUsers', $('#users'));
                } else {
                    get('getTerminals', $('#terminals'));
                }
            });

    });

    // окно ввода нового пароля
    $(document).on('click', '.changeUserPassword', function(event) {
        event.preventDefault();
        var $tr = $(this).closest('tr');
        $('#changePasswordDialog .password').val('');
        $('#changePasswordDialog .modal-body .id').val($tr.find('.id').val());
    });

    // сохранение нового пароля
    $(document).on('click', '#changePassword', function(event) {
        event.preventDefault();
        var sid = $('#sid').val(),
            action = 'changePassword', 
            req = {
                id: $('#changePasswordDialog .id').val(), 
                new: $('#changePasswordDialog .password').val(), 
            };

        $.post(sid + '/admin/' + action, req, function() {
        }, 'json')
            .fail(function(){
            });

    });

    // окно подтверждения удаления
    $(document).on('click', '.confirmDelete', function(event) {
        event.preventDefault();
        var $this = $(this);
        if ($this.hasClass('user')) {
            $('#confirmDeleteDialog .modal-body span').html('пользователя');
            $('#confirmDeleteDialog .modal-body .id').val($this.siblings('.id').val());
            $('#confirmDeleteDialog .modal-body .action').val('deleteUser');
        } else if ($this.hasClass('terminal')) {
            $('#confirmDeleteDialog .modal-body span').html('терминал');
            $('#confirmDeleteDialog .modal-body .id').val($this.siblings('.id').val());
            $('#confirmDeleteDialog .modal-body .action').val('deleteTerminal');
        } else if ($this.hasClass('price')) {
            $('#confirmDeleteDialog .modal-body span').html('элемент меню');
            $('#confirmDeleteDialog .modal-body .id').val($this.siblings('.serviceItem').attr('id'));
            $('#confirmDeleteDialog .modal-body .action').val('deletePriceItem');
        }
    });

    // удаление
    $(document).on('click', '#deleteThis', function(event) {
        event.preventDefault();
        var sid = $('#sid').val(),
            action = $('#confirmDeleteDialog .action').val(), 
            req = {
                id: $('#confirmDeleteDialog .id').val(), 
            };

        $.post(sid + '/admin/' + action, req, function() {
            if (action === 'deleteUser') {
                get('getUsers', $('#users'));
            } else if (action === 'deleteTerminal') {
                get('getTerminals', $('#terminals'));
            } else if (action === 'deletePriceItem') {
                get('getPriceGroup', $('#priceGroup'), 
                    {
                        type: $('.day-type .active').val(),
                        active: $('#priceStatus').prop('checked') ? 1 : 0
                    }
                );
            }
        }, 'json')
            .fail(function(){
                if (action === 'deleteUser') {
                    get('getUsers', $('#users'));
                } else if (action === 'deleteTerminal') {
                    get('getTerminals', $('#terminals'));
                } else if (action === 'deletePriceItem') {
                    get('getPriceGroup', $('#priceGroup'), 
                        {
                            type: $('.day-type .active').val(),
                            active: $('#priceStatus').prop('checked') ? 1 : 0
                        }
                    );
                }
            });

    });
});