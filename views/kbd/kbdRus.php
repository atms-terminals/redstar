<?php
function printButtonA($key)
{
    $hidden = $key ? '' : 'hidden';
    $half = $key ? '' : 'half';
    if ($key == 'bs') {
        return "<div class='rus-block'>
                <button class='btn btn-danger small-font-size kbd rus-btn wide backspace wide-btn'>Стереть</button>
                <input type='hidden' class='target' value='target'>
            </div>";
    } elseif ($key == 'ok') {
        return "<div class='rus-block'>
                <button class='btn btn-primary medium-font-size kbd rus-btn wide ok wide-btn'>OK</button>
                <input type='hidden' class='target' value='target'>
            </div>";
    } elseif ($key == 'space') {
        return "<div class='rus-block'>
                <button class='btn btn-default medium-font-size kbd  rus-btn space-btn'></button>
                <input type='hidden' class='target' value='target'>
                <input type='hidden' class='char' value=' '>
            </div>";
    }

    return "<div class='rus-block $half'>
                <button class='btn btn-default medium-font-size kbd rus-btn $hidden'>$key</button>
                <input type='hidden' class='target' value='target'>
                <input type='hidden' class='char' value='$key'>
            </div>";
}

function getKbdA()
{
    $keySeq = [
                'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'bs',
                '-', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', '/',
                'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'ok',
                'space'];

    $keys = '';
    foreach ($keySeq as $char) {
        $keys .= printButtonA($char);
    }

    return "<div class='flex-container keyboard'>$keys</div>";
}
