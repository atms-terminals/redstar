<?php
namespace models\Admin;

use components\DbHelper as dbHelper;

/**
* model News
*/
class Admin
{
    /**
     * список оборудования на терминале
     * @var array список оборудования
     */
    public static $devices = array(
        'cash' => 'Купюроприемник',
        'fr' => 'Фискальный регистратор',
        'webSocket' => 'Ubuntu',
        );

    /**
     * получение списка инкассаций
     * @return array массива состояний
     */
    public static function getCollections()
    {
        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT date_format(p.dt_insert, '%d.%m.%Y') dt, u.address, sum(p.amount) amount, u.id
            from v_payments p
                join users u on p.id_user = u.id
            group by u.address, date_format(p.dt_insert, '%d.%m.%Y'), u.id
            order by u.address, min(p.dt_insert) desc";
        $collections = dbHelper\DbHelper::selectSet($query);

        // наличка
        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT p.id_user, u.address, sum(p.amount) summ
            from v_payments p
                join users u on u.id = p.id_user
            where p.collected = 0
            group by p.id_user";
        $tmoney = dbHelper\DbHelper::selectSet($query);
        $money = array();
        foreach ($tmoney as $row) {
            $money[$row['address']]['summ'] = $row['summ'];
        }

        return array('collections' => $collections,
            'money' => $money);
    }

    /**
     * получение списка услуг
     * @return array массив услуг
     */
    public static function getPriceGroup($type, $status)
    {
        $sql = $status ? 'p.status = 1' : '1';
        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT p.id, p.id_parent, p.`desc`, p.clients_desc, p.`status`, p.color, p.price, p.nds, o.id_day, 
                date_format(t.`start`, '%H:%i') time_start, date_format(t.`finish`, '%H:%i') time_finish, t.id_day time_day, 
                p.comment, p.bill
            from v_custom_pricelist p
                left join custom_price_redstar_dayoff o on p.id = o.id_item
                left join custom_price_redstar_time t on p.id = t.id_item
            where $sql
                and p.day_type = '$type'
            order by p.id_parent, p.`desc`";
        $tservices = dbHelper\DbHelper::selectSet($query);
        $tlist = array();
        // переупорядочиваем по корневому элементу
        foreach ($tservices as $row) {
            if (empty($tlist[$row['id_parent']][$row['id']])) {
                $tlist[$row['id_parent']][$row['id']] = $row;
                $tlist[$row['id_parent']][$row['id']]['schedule'] = array(
                    '0' => array('en' => 1, 'start' => '', 'finish' => ''),
                    '1' => array('en' => 1, 'start' => '', 'finish' => ''),
                    '2' => array('en' => 1, 'start' => '', 'finish' => ''),
                    '3' => array('en' => 1, 'start' => '', 'finish' => ''),
                    '4' => array('en' => 1, 'start' => '', 'finish' => ''),
                    '5' => array('en' => 1, 'start' => '', 'finish' => ''),
                    '6' => array('en' => 1, 'start' => '', 'finish' => ''),
                );
            }
            if ($row['id_day'] != '') {
                $tlist[$row['id_parent']][$row['id']]['schedule'][$row['id_day']]['en'] = 0;
            }
            if ($row['time_start'] != '') {
                $tlist[$row['id_parent']][$row['id']]['schedule'][$row['time_day']]['start'] = $row['time_start'];
            }
            if ($row['time_finish'] != '') {
                $tlist[$row['id_parent']][$row['id']]['schedule'][$row['time_day']]['finish'] = $row['time_finish'];
            }
        }
        return $tlist;
    }

    /**
     * получение списка состояний оборудования
     * @return array массив состояний
     */
    public static function getHwsState()
    {
        // тех. состояние
        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT u.id, u.address, h.`type`, h.is_error, date_format(h.dt, '%d.%m.%Y %H:%i') dt, h.message
            from hws_status h
                join users u on h.id_user = u.id
            order by u.address, h.`type`";
        $list = dbHelper\DbHelper::selectSet($query);

        // преобразуем
        $result = array();
        foreach ($list as $row) {
            if (empty($result[$row['address']])) {
                foreach (self::$devices as $key => $nameRus) {
                    $result[$row['address']][$key] = array (
                        'dt' => '',
                        'isError' => -1,
                        'message' => ''
                    );
                }
            }
            $result[$row['address']][$row['type']]['dt'] = $row['dt'];
            $result[$row['address']][$row['type']]['isError'] = $row['is_error'];
            $result[$row['address']][$row['type']]['message'] = $row['message'];
        }

        return $result;
    }

    /**
     * получение массива статусов предоплат
     * @return array массива состояний
     */
    public static function findPrepaid($searchStr)
    {
        $searchStr = dbHelper\DbHelper::mysqlStr($searchStr);
        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT c.id, c.card, c.name, ifnull(p.amount, 0) amount
            from cards c
                left join prepayments p on c.id = p.id_card
            where c.card regexp '$searchStr'
                or upper(c.name) regexp upper('$searchStr')
            order by c.card";
        return  dbHelper\DbHelper::selectSet($query);
    }

    /**
     * получение списка пользователей
     * @return array список
     */
    public static function getUsers()
    {
        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT u.id, u.login, u.status
            from v_real_users u
            where u.id_role != 2
                and u.id > 10
            order by u.login";
        $list = dbHelper\DbHelper::selectSet($query);

        return $list;
    }

    /**
     * получение списка дат
     * @return array список
     */
    public static function getDates()
    {
        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT e.id, DATE_FORMAT(e.dt, '%d.%m.%Y') dt
            from extra_days e
            where e.dt_type = 2";
        $works = dbHelper\DbHelper::selectSet($query);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT e.id, DATE_FORMAT(e.dt, '%d.%m.%Y') dt
            from extra_days e
            where e.dt_type = 1";
        $holidays = dbHelper\DbHelper::selectSet($query);

        return array(
            'worked' => $works,
            'holidays' => $holidays,
        );
    }

    /**
     * получение списка терминалов
     * @return array список
     */
    public static function getTerminals()
    {
        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT u.id, u.ip, u.address, u.`status`
            from v_real_users u
            where u.id_role = 2
            order by u.login";
        $list = dbHelper\DbHelper::selectSet($query);

        return $list;
    }
}
