if Config.SaveSettings ~= 'database' then return end

MySQL.ready(function()
    MySQL.query.await([[
        CREATE TABLE IF NOT EXISTS `vexxd_hud_settings` (
            `license` VARCHAR(64) NOT NULL,
            `settings` LONGTEXT DEFAULT NULL,
            `profiles` LONGTEXT DEFAULT NULL,
            `updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`license`)
        )
    ]])
end)

local QUERY = {
    settings = 'INSERT INTO `vexxd_hud_settings` (`license`, `settings`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `settings` = VALUES(`settings`)',
    profiles = 'INSERT INTO `vexxd_hud_settings` (`license`, `profiles`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `profiles` = VALUES(`profiles`)',
}

local lastSave = {}

local function license(src)
    return GetPlayerIdentifierByType(src, 'license')
end

local function decode(raw)
    if not raw then return nil end

    local ok, v = pcall(json.decode, raw)

    return ok and type(v) == 'table' and v or nil
end

lib.callback.register('vexxd_hud:load', function(source)
    local id = license(source)

    if not id then return nil end

    local row = MySQL.single.await('SELECT `settings`, `profiles` FROM `vexxd_hud_settings` WHERE `license` = ?', { id })

    if not row then return {} end

    return { settings = decode(row.settings), profiles = decode(row.profiles) }
end)

RegisterNetEvent('vexxd_hud:save', function(kind, value)
    local src = source

    if not QUERY[kind] or type(value) ~= 'table' then return end

    local now = GetGameTimer()
    local key = src .. kind

    if lastSave[key] and now - lastSave[key] < 1000 then return end

    lastSave[key] = now

    local encoded = json.encode(value)

    if #encoded > 60000 then return end

    local id = license(src)

    if id then MySQL.prepare(QUERY[kind], { id, encoded }) end
end)

AddEventHandler('playerDropped', function()
    lastSave[source .. 'settings'] = nil
    lastSave[source .. 'profiles'] = nil
end)
