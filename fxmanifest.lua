fx_version ('cerulean')
game ('gta5')

author ({ 'rk' })
version ({ '1.0.0' })
description ({ 'Experimental typescript project / Police Report System.' })

shared_scripts ({
    '@ox_lib/init.lua',
})

client_scripts ({
    'build/client/*.js'
})

server_scripts ({
    'build/server/*.js'
})

files ({
    'config.json',
    'locales/*.json'
})

dependencies ({
    'ox_lib',
    'oxmysql'
})

lua54 ('yes')