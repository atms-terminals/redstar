<?php
/**
 * Получение уровня в меню
 *
 * @param int $id Уровень меню
 * @return string html-код списка;
 */
function getMenuLevel($menu, $id)
{
    $days = array(
        0 => 'Пн.',
        1 => 'Вт.',
        2 => 'Ср.',
        3 => 'Чт.',
        4 => 'Пт.',
        5 => 'Сб.',
        6 => 'Вс.',
    );

    $html = '';
    if (!empty($menu[$id])) {
        $i = 0;
        foreach ($menu[$id] as $key => $item) {
            $i++;
            $status = $item['status'] ? 'checked' : '';
            $checkedDanger = $item['color'] == 'danger' ? 'checked' : '';
            $checkedSuccess = $item['color'] == 'success' ? 'checked' : '';
            $checkedWarning = $item['color'] == 'warning' ? 'checked' : '';
            $checkedPrimary = $item['color'] == 'primary' ? 'checked' : '';

            $checkedNullNds = $item['nds'] == '0000' ? 'selected' : '';
            $checkedWoNds = $item['nds'] == '4000' ? 'selected' : '';
            $checkedWithllNds = $item['nds'] == '1000' ? 'selected' : '';

            $dropDown = (!empty($menu[$item['id']])) ? "<button class='dropdown'><span class='glyphicon glyphicon-triangle-top' aria-hidden='true'></span></button>" : '';

            $daySchedule = '';
            foreach ($item['schedule'] as $dayId => $dayStatus) {
                $timeStart = $dayStatus['start'];
                $timeFinish = $dayStatus['finish'];
                $checked = $dayStatus['en'] == 0 ? '' : 'checked';
                $daySchedule .= "
                    <div class='form-group times col-md-6'>
                        <label><input class='dayStatus' type='checkbox' $checked value='$dayId'> {$days[$dayId]}</label>
                        <label>Время работы: с </label>
                        <div class='input-group time'>
                            <input type='text' class='form-control timeStart' maxlength='5' size='5' value='$timeStart' placeholder=''/>
                            <span class='input-group-addon'>
                                <span class='glyphicon glyphicon-time'></span>
                            </span>
                        </div>
                        <label> по </label>
                        <div class='input-group time'>
                            <input type='text' class='form-control timeFinish' maxlength='5' size='5' value='$timeFinish' placeholder=''/>
                            <span class='input-group-addon'>
                                <span class='glyphicon glyphicon-time'></span>
                            </span>
                        </div>
                    </div>
                    ";
            }

            $commentItem = empty($menu[$item['id']]) ? '' : "<textarea rows='3' cols='80' class='commentItem' placeholder='Комментарий'>{$item['comment']}</textarea><br>";

            $html .= "<br><li>$dropDown<input class='serviceItem id' type='checkbox' id='{$item['id']}' $status title='запретить/разрешить'>
                <span class='lead'>{$item['desc']} (id={$item['id']}) </span>

                <button class='confirmDelete price'><span class='glyphicon glyphicon-remove' title='Удалить' data-toggle='modal' data-target='#confirmDeleteDialog'></span></button><br>

                <form class='form-inline'>
                    <div class='row'>
                        $daySchedule
                    </div>
                </form>
                $commentItem
                
                <span class='color btn btn-danger'><input type='radio' $checkedDanger name='color$id$i' value='danger' ></span>
                <span class='color btn btn-success'><input type='radio' $checkedSuccess name='color$id$i' value='success' ></span>
                <span class='color btn btn-warning'><input type='radio' $checkedWarning name='color$id$i' value='warning' ></span>
                <span class='color btn btn-primary'><input type='radio' $checkedPrimary name='color$id$i' value='primary' ></span>
                <input type='text' value='{$item['clients_desc']}' class='clientsDesc' size='50' placeholder='Название для терминала' title='Название для терминала' />";

            if (empty($menu[$item['id']])) {
                $billType = $item['bill'] ? 'checked' : '';
                $html .= "<input type='text' value='{$item['price']}' class='price' size='8' placeholder='Цена услуги' title='Цена услуги' />
                <select class='nds'>
                    <option value='0000' $checkedNullNds></option>
                    <option value='4000' $checkedWoNds>Без НДС</option>
                    <option value='1000' $checkedWithllNds>с НДС</option>
                </select>
                <input type='checkbox' id='bill{$item['id']}' $billType class='bill'>
                <label for='bill{$item['id']}' title='указывается количество вместо печати пачки чеков'>Общий чек</label>
                ";
            } else {
                $html .= "<ul class='hidden'>";
                $html .= getMenuLevel($menu, $item['id']);
                $html .= "</ul>";
            }
            $html .= "</li>";
        }
    }
    return $html;
}

// создаем структуру меню
?>
<ul>
<?=getMenuLevel($list, 0);?>
</ul>
