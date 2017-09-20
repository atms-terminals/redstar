<?php
namespace controllers\AdminController;

include_once ROOT.'/models/Admin.php';
use models\Admin as admin;
use components\User as user;
use components\DbHelper as dbHelper;

/**
* productController
*/
class AdminController
{
    public function actionIndex()
    {
        $statuses = admin\Admin::getHwsState();
        $devices = admin\Admin::$devices;
        $sid = user\User::getSid();

        require_once(ROOT.'/views/admin.php');
        return true;
    }

    public function actionGetHwsState()
    {
        $statuses = admin\Admin::getHwsState();
        $devices = admin\Admin::$devices;

        require_once(ROOT.'/views/hwsState.php');
        return true;
    }

    public function actionGetCollectionDetails()
    {
        $idCollection = empty($_POST['idCollection']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['idCollection']);
        
        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT date_format(co.dt, '%d.%m.%Y %H:%i') dt_collection, u.address
            from collections co
                join users u on u.id = co.id_user
            where co.id = '$idCollection'";
        $collectionParams = dbHelper\DbHelper::selectSet($query);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT date_format(p.dt_confirm, '%d.%m.%Y %H:%i') dt_oper, a.name `client`, a.card, c.`desc` service, p.amount, p.deposit, p.summ
            from v_payments p
                left join custom_pricelist c on p.abonement = c.id
                left join cards a on p.id_card = a.id
            where p.id_collection = '$idCollection'
            order by p.dt_confirm";
        $opers = dbHelper\DbHelper::selectSet($query);

        require_once(ROOT.'/views/collectionDetailsXls.php');
        return true;
    }

    public function actionGetCollections()
    {
        $collections = admin\Admin::getCollections();

        require_once(ROOT.'/views/collections.php');
        return true;
    }

    public function actionGetTerminals()
    {
        $list = admin\Admin::getTerminals();

        require_once(ROOT.'/views/terminalsList.php');
        return true;
    }

    public function actionGetPriceGroup()
    {
        $active = empty($_GET['active']) ? 0 : dbHelper\DbHelper::mysqlStr($_GET['active']);
        $list = admin\Admin::getPriceGroup($active);

        require_once(ROOT.'/views/priceGroup.php');
        return true;
    }

    public function actionSetPriceGroupStatus()
    {
        $uid = user\User::getId();
        $id = empty($_POST['id']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['id']);
        $status = empty($_POST['status']) ? 0 : 1;

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT custom_price_set_status($uid, 'redstar', '$id', $status)";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }

    public function actionDeletePriceItem()
    {
        $uid = user\User::getId();
        $id = empty($_POST['id']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['id']);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT custom_price_delete($uid, 'redstar', '$id')";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }

    public function actionSetClientsDesc()
    {
        $uid = user\User::getId();
        $id = empty($_POST['id']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['id']);
        $text = empty($_POST['text']) ? '' : dbHelper\DbHelper::mysqlStr($_POST['text']);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT custom_price_set_clients_desc($uid, 'redstar', '$id', '$text')";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }

    public function actionSetPrice()
    {
        $uid = user\User::getId();
        $id = empty($_POST['id']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['id']);
        $price = empty($_POST['price']) ? '' : dbHelper\DbHelper::mysqlStr($_POST['price']);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT custom_price_set_price($uid, 'redstar', '$id', '$price')";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }

    public function actionSetNds()
    {
        $uid = user\User::getId();
        $id = empty($_POST['id']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['id']);
        $nds = empty($_POST['nds']) ? 0 : (int)dbHelper\DbHelper::mysqlStr($_POST['nds']);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT custom_price_set_nds($uid, 'redstar', '$id', $nds)";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }

    public function actionSetColor()
    {
        $uid = user\User::getId();
        $id = empty($_POST['id']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['id']);
        $color = empty($_POST['color']) ? 'primary' : dbHelper\DbHelper::mysqlStr($_POST['color']);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT custom_price_set_color($uid, 'redstar', '$id', '$color')";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }

    public function actionChangeStatus()
    {
        $uid = user\User::getId();
        $id = empty($_POST['id']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['id']);
        $status = empty($_POST['status']) ? 0 : 1;

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT users_change_status($uid, '$id', $status)";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }

    public function actionChangePassword()
    {
        $uid = user\User::getId();
        $id = empty($_POST['id']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['id']);
        $password = empty($_POST['new']) ? '123' : dbHelper\DbHelper::mysqlStr($_POST['new']);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT users_change_password($uid, '$id', '$password')";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }

    public function actionAddUser()
    {
        $uid = user\User::getId();
        // если есть ip то роль - терминал, иначе - пользователь
        $ip = empty($_POST['ip']) ? '' : dbHelper\DbHelper::mysqlStr($_POST['ip']);
        $idRole = $ip ? 2 : 1;
        $address = empty($_POST['address']) ? '' : dbHelper\DbHelper::mysqlStr($_POST['address']);
        $login = empty($_POST['login']) ? '' : dbHelper\DbHelper::mysqlStr($_POST['login']);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT users_add($uid, $idRole, '$ip', '$login', '$address')";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }

    public function actionEditUser()
    {
        $uid = user\User::getId();
        $id = empty($_POST['id']) ? '' : dbHelper\DbHelper::mysqlStr($_POST['id']);
        $ip = empty($_POST['ip']) ? '' : dbHelper\DbHelper::mysqlStr($_POST['ip']);
        $address = empty($_POST['address']) ? '' : dbHelper\DbHelper::mysqlStr($_POST['address']);
        $login = empty($_POST['login']) ? '' : dbHelper\DbHelper::mysqlStr($_POST['login']);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT users_edit($uid, '$id', '$ip', '$login', '$address')";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }

    public function actionDeleteUser()
    {
        $uid = user\User::getId();
        $id = empty($_POST['id']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['id']);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT users_delete($uid, '$id')";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }

    public function actionGetUsers()
    {
        $list = admin\Admin::getUsers();

        require_once(ROOT.'/views/usersList.php');
        return true;
    }

    public function actionGetPrepaidStatus()
    {
        $searchStr = empty($_GET['searchStr']) ? false : $_GET['searchStr'];
        if ($searchStr) {
            $statuses = admin\Admin::findPrepaid($searchStr);
            require_once(ROOT.'/views/showPrepaids.php');
        }
        return true;
    }

    public function actionChangePrepaid()
    {
        $uid = user\User::getId();
        $card = empty($_POST['card']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['card']);
        $amount = empty($_POST['card']) ? 0 : dbHelper\DbHelper::mysqlStr($_POST['amount']);

        $query = "/*".__FILE__.':'.__LINE__."*/ ".
            "SELECT prepayments_change($uid, c.id, '$amount')
            from cards c
            where c.card = '$card'";
        $result = dbHelper\DbHelper::selectRow($query);
        $response['code'] = 0;

        echo json_encode($response);
        return true;
    }
}
