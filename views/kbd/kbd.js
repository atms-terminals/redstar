'use strict';
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function getMaskedString(text, mask, char) {
    for (var i in text) {
        if (text.hasOwnProperty(i)) {
            if (text[i] === '_') {
                i *= 1;
                var m = mask[i];
                if (m === '*' ||
                    (m === 'd' && Number.isInteger(char * 1)) ||
                    (m === 's' && !Number.isInteger(char * 1))
                    ) {
                    return text.replaceAt(i, char);
                }
            }
        }
    }
    return text + char;
}

function getLastMaskedPos(mask, pos) {
    mask = mask.substring(0, pos);
    return Math.max(mask.lastIndexOf('*'), mask.lastIndexOf('d'), mask.lastIndexOf('s'));
}

function deleteLastSym(text, mask) {
    if (text.length > mask.length) {
        return text.substring(0, text.length - 1);
    } else {
        var pos = text.indexOf('_');
        if (pos === -1) {
            pos = text.length - 1;
        } else {
            pos = getLastMaskedPos(mask, pos);
            if (pos === -1) {
                return text;
            }
        }
        return text.replaceAt(pos, '_');
    }
}

$(document).ready(function() {
    $(document).on('click', '.kbd', function(event) {
        event.preventDefault();
        var target = '#' + $(this).siblings('.target').val(),
            char = $(this).siblings('.char').val(),
            $customerInput = $(target),
            mask = $customerInput.siblings('.mask').val(),
            customerText = $customerInput.val(),
            min = +$(target).siblings('.min').val() || 0,
            max = +$(target).siblings('.max').val() || 0;

        if ($(this).hasClass('backspace')) {
            $customerInput.val(deleteLastSym(customerText, mask));
        } else if ($(this).hasClass('ok')) {
            // проверяем минимальную длину
            var clearStr = customerText.replaceAll('_', '');
            if (clearStr.length >= min) {
                $(this).closest('.keyboard').siblings('.action').trigger('click');
            }
        } else {
            if (max && customerText.length < max) {
                $customerInput.val(getMaskedString(customerText, mask, char));
            }
        }
    });

    $(document).on('click', '.btn.qtyAction', function(event) {
        event.preventDefault();
        var $qty = $('.qtyScreen'),
            qty = +$qty.text();
        if ($(this).hasClass('plus')) {
            qty++;
        } else {
            if (qty > 1) {
                qty--;
            }
        }
        $qty.val(qty);
        $('.qtyScreen').text(qty);
        $('input.value.qty').val(qty);
    });

});