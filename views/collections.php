<h1>Текущая наличность терминала</h1>
<table class='table table-striped'>
    <thead>
        <tr>
            <th>Адрес</th>
            <th>Сумма</th>
        </tr>
    </thead>
    <tbody>
        <?php
        foreach ($collections['money'] as $address => $current) {
            echo "<tr>
                    <td class=''>$address</td>
                    <td class='' align='center'>{$current['summ']}</td>
                </tr>";
        }
        ?>
    </tbody>
</table>

<h1>Статистика по дням</h1>
<table class='table table-striped'>
    <thead>
        <tr>
            <th>Адрес</th>
            <th>Дата</th>
            <th>Сумма</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <?php
        foreach ($collections['collections'] as $collection) {
            echo "<tr>
                    <td class=''>{$collection['address']}</td>
                    <td class='' align='center'>{$collection['dt']}</td>
                    <td class='' align='center'>{$collection['amount']}</td>
                    <td class='' align='center'>
                        <button class='getCollectionDetails btn btn-default'>Детализация</button>
                        <button class='getCollectionSummary btn btn-default'>Итоги</button>
                        <input type='hidden' class='dt' value='{$collection['dt']}'>
                        <input type='hidden' class='id' value='{$collection['id']}'>
                    </td>
                </tr>";
        }
        ?>
    </tbody>
</table>
