<?php
function printButtonN($key)
{
    $hidden = '';
    $half = '';
    if ($key === '') {
        $hidden = 'hidden';
        $half = 'half';
    }

    if ($key == 'bs') {
        return "<div class='numeric-block'>
            <button class='num-btn btn btn-danger small-font-size kbd wide-btn backspace'>Стереть</button>
            <input type='hidden' class='target' value='target'>
        </div>";
    } elseif ($key == 'ok') {
        return "<div class='numeric-block'>
            <button class='num-btn btn btn-primary medium-font-size kbd wide-btn ok'>OK</button>
            <input type='hidden' class='target' value='target'>
        </div>";
    }

    return "<div class='numeric-block'>
            <button class='num-btn btn btn-default medium-font-size kbd'>$key</button>
            <input type='hidden' class='target' value='target'>
            <input type='hidden' class='char' value='$key'>
        </div>";
}

function getKbdN()
{
    $keySeq = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bs', '0', 'ok'];

    $keys = '';
    foreach ($keySeq as $char) {
        $keys .= printButtonN($char);
    }

    return "<div class='flex-container keyboard'>$keys</div>";
}
