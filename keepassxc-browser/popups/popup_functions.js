'use strict';

var $ = jQuery.noConflict(true);

const DEFAULT_POPUP_SIZE = '460px';
const PINNED_POPUP_SIZE = '380px';

function updateAvailableResponse(available) {
    if (available) {
        $('#update-available').show();
    }
}

async function initSettings() {
    $('#settings #options-button').click(() => {
        browser.runtime.openOptionsPage().then(close());
    });

    $('#settings #choose-custom-login-fields-button').click(async () => {
        await browser.windows.getCurrent();
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        await browser.runtime.getBackgroundPage();

        browser.tabs.sendMessage(tab.id, {
            action: 'choose_credential_fields'
        });
        close();
    });
}

async function initColorTheme() {
    const colorTheme = await browser.runtime.sendMessage({
        action: 'get_color_theme'
    });

    if (colorTheme === undefined || colorTheme === 'system') {
        document.body.removeAttribute('data-color-theme');
    } else {
        document.body.setAttribute('data-color-theme', colorTheme);
    }
}

// Resizes the popup to the default size if the width is too small
async function resizePopup() {
    if (document.body.offsetWidth > 0 && document.body.offsetWidth < 180) {
        document.body.style.width = isFirefox() ? PINNED_POPUP_SIZE : DEFAULT_POPUP_SIZE;
    } else {
        document.body.style.width = DEFAULT_POPUP_SIZE;
    }
}

$(async () => {
    await initSettings();
    updateAvailableResponse(await browser.runtime.sendMessage({
        action: 'update_available_keepassxc'
    }));
});
