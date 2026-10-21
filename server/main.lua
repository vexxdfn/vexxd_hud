if not Config.ShareCodes or GetResourceState('oxmysql') ~= 'started' then return end

local ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

MySQL.ready(function()
    MySQL.query.await([[
        CREATE TABLE IF NOT EXISTS `vexxd_hud_codes` (
            `code` VARCHAR(12) NOT NULL,
            `settings` LONGTEXT NOT NULL,
            `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`code`)
        )
    ]])
end)

local function newCode()
    local out = {}

    for i = 1, 6 do
        local n = math.random(1, #ALPHABET)
        out[i] = ALPHABET:sub(n, n)
    end

    return 'VX-' .. table.concat(out)
end

local lastShare = {}

lib.callback.register('vexxd_hud:shareCode', function(source, settings)
    if type(settings) ~= 'table' then return nil end

    local now = os.time()

    if lastShare[source] and now - lastShare[source] < 10 then return nil end

    lastShare[source] = now

    local encoded = json.encode(settings)

    if #encoded > 20000 then return nil end

    for _ = 1, 5 do
        local code = newCode()
        local ok = MySQL.insert.await('INSERT IGNORE INTO `vexxd_hud_codes` (`code`, `settings`) VALUES (?, ?)', { code, encoded })

        if ok and ok > 0 then return code end
    end

    return nil
end)

lib.callback.register('vexxd_hud:importCode', function(_, code)
    if type(code) ~= 'string' or not code:match('^VX%-[%u%d]+$') or #code > 12 then return nil end

    local row = MySQL.scalar.await('SELECT `settings` FROM `vexxd_hud_codes` WHERE `code` = ?', { code })

    if not row then return nil end

    local ok, settings = pcall(json.decode, row)

    return ok and settings or nil
end)

AddEventHandler('playerDropped', function()
    lastShare[source] = nil
end)
