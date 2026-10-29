fx_version 'cerulean'
use_experimental_fxv2_oal 'yes'
lua54 'yes'
game 'gta5'

name 'vexxd_hud'
author 'Vexxd Scripts'
description 'HUD and speedometer with in-game settings. discord.gg/TzNJ6Z92Y5 for support'
version '1.3.0'

dependencies {
    'ox_lib',
    'oxmysql',
}

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua',
}

ox_libs {
    'locale',
    'table',
}

client_scripts {
    'client/bridge.lua',
    'client/main.lua',
    'client/vehicle.lua',
    'client/weapon.lua',
    'client/postal.lua',
    'client/stress.lua',
    'client/api.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'server/settings.lua',
    'server/stress.lua',
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/speedos.css',
    'html/speedos.js',
    'html/menu.css',
    'html/icons.js',
    'html/app.js',
    'html/menu.js',
    'html/fonts/*.ttf',
    'html/sounds/*.ogg',
    'locales/*.json',
    'data/postals/*.json',
}
