<?php
/**
 * Получение уровня в меню
 *
 * @param int $id Уровень меню
 * @return string html-код списка;
 */
function getMenuLevel($menu, $id)
{
    $html = '';
    if (!empty($menu[$id])) {
        foreach ($menu[$id] as $key => $item) {
            $status = $item['status'] ? 'checked' : '';
            if (empty($menu[$item['id']])) {
                $html .= "<li><input class='serviceItem' type='checkbox' id='{$item['id']}' $status> {$item['desc']} (id={$item['id']})</li>";
            } else {
                $html .= "<li><input class='serviceItem' type='checkbox' id='{$item['id']}' $status> {$item['desc']} (id={$item['id']})";
                $html .= "<ul>";
                $html .= getMenuLevel($menu, $item['id']);
                $html .= "</ul>";
                $html .= "</li>";
            }
        }
    }
    return $html;
}

// создаем структуру меню
?>
<ul>
<?=getMenuLevel($list, 0);?>
</ul>