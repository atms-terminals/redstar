<?php
return array(
    '.*?/(terminal.php)' => 'terminal/index',
    '.*?/(admin.php)' => 'admin/index',
    '.*?/ajax/move' => 'ajax/move',
    '.*?/ajax/getBalance' => 'ajax/getBalance',
    '.*?/ajax/getMoneyScreen' => 'ajax/getMoneyScreen',
    '.*?/ajax/pay' => 'ajax/pay',
    '.*?/ajax/writeLog' => 'ajax/writeLog',
    '.*?/ajax/collection' => 'ajax/collection',
    '.*?/ajax/getServiceList' => 'ajax/getServiceList',
    '.*?/ajax/addToBasket' => 'ajax/addToBasket',

    '.*?/admin/getHwsState' => 'admin/getHwsState',
    '.*?/admin/getCollections' => 'admin/getCollections',
    '.*?/admin/getCollectionDetails' => 'admin/getCollectionDetails',
    '.*?/admin/getCollectionSummary' => 'admin/getCollectionSummary',

    '.*?/admin/addDate' => 'admin/addDate',
    '.*?/admin/delDate' => 'admin/delDate',
    '.*?/admin/getSchedule' => 'admin/getSchedule',

    '.*?/admin/getPriceGroup' => 'admin/getPriceGroup',
    '.*?/admin/setPriceGroupStatus' => 'admin/setPriceGroupStatus',
    '.*?/admin/setClientsDesc' => 'admin/setClientsDesc',
    '.*?/admin/setCommentItem' => 'admin/setCommentItem',
    '.*?/admin/setPrice' => 'admin/setPrice',
    '.*?/admin/setNds' => 'admin/setNds',
    '.*?/admin/setBill' => 'admin/setBill',
    '.*?/admin/setColor' => 'admin/setColor',
    '.*?/admin/setDayStatus' => 'admin/setDayStatus',
    '.*?/admin/setWorkTime' => 'admin/setWorkTime',
    '.*?/admin/deletePriceItem' => 'admin/deletePriceItem',

    '.*?/admin/getTerminals' => 'admin/getTerminals',
    '.*?/admin/changeStatus' => 'admin/changeStatus',
    '.*?/admin/addTerminal' => 'admin/addUser',
    '.*?/admin/editTerminal' => 'admin/editUser',
    '.*?/admin/deleteTerminal' => 'admin/deleteUser',

    '.*?/admin/getUsers' => 'admin/getUsers',
    '.*?/admin/addUser' => 'admin/addUser',
    '.*?/admin/editUser' => 'admin/editUser',
    '.*?/admin/deleteUser' => 'admin/deleteUser',
    '.*?/admin/changePassword' => 'admin/changePassword',

    '.*?/admin/getPrepaidStatus' => 'admin/getPrepaidStatus',
    '.*?/admin/changePrepaid' => 'admin/changePrepaid',
);
