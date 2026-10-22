local cfg = Config.Stress

if not cfg or not cfg.enabled then return end

local function started(resource)
    return GetResourceState(resource) == 'started'
end

if started('qbx_hud') or started('qb-hud') then
    lib.print.info('qbx_hud or qb-hud is running, leaving stress to it')
    return
end

local framework

if started('qbx_core') then
    framework = 'qbx'
elseif started('qb-core') then
    framework = 'qb'
elseif started('es_extended') then
    framework = 'esx'
else
    return
end

local QBCore = framework == 'qb' and exports['qb-core']:GetCoreObject() or nil
local ESX = framework == 'esx' and exports.es_extended:getSharedObject() or nil

local noGainJob = {}
local noGainType = {}

for _, name in ipairs(cfg.noGainJobs or {}) do noGainJob[name] = true end
for _, name in ipairs(cfg.noGainJobTypes or {}) do noGainType[name] = true end

local esxStress = {}
local esxIdent = {}
local esxDirty = {}

local function getPlayer(src)
    if framework == 'qbx' then return exports.qbx_core:GetPlayer(src) end
    if framework == 'qb' then return QBCore.Functions.GetPlayer(src) end

    return ESX.GetPlayerFromId(src)
end

local function getStress(src)
    if framework == 'esx' then return esxStress[src] or 0 end

    local player = getPlayer(src)

    return player and tonumber(player.PlayerData.metadata.stress) or 0
end

local function setStress(src, value)
    local player = getPlayer(src)

    if not player then return false end

    value = math.floor(math.max(0, math.min(100, value)) + 0.5)

    if framework == 'esx' then
        esxStress[src] = value
        esxDirty[src] = true
        Player(src).state:set('stress', value, true)
        return true
    end

    player.Functions.SetMetaData('stress', value)

    if framework == 'qb' then
        TriggerClientEvent('hud:client:UpdateStress', src, value)
    end

    return true
end

local function exempt(src)
    local player = getPlayer(src)

    if not player then return true end

    local job = framework == 'esx' and player.job or player.PlayerData.job

    if not job then return false end

    return noGainJob[job.name] == true or (job.type ~= nil and noGainType[job.type] == true)
end

local lastNotify = {}

local function tell(src, key)
    if not cfg.notify then return end

    local now = os.time()
    local tag = src .. key

    if lastNotify[tag] and now - lastNotify[tag] < 10 then return end

    lastNotify[tag] = now
    TriggerClientEvent('vexxd_hud:client:stressNotify', src, key)
end

local function addStress(src, amount)
    if exempt(src) then return false end

    local before = getStress(src)

    if not setStress(src, before + amount) then return false end
    if before < 100 then tell(src, 'stress_gain') end

    return true
end

local function removeStress(src, amount)
    local before = getStress(src)

    if before <= 0 then return false end
    if not setStress(src, before - amount) then return false end

    tell(src, 'stress_relief')

    return true
end

local function validAmount(amount)
    return type(amount) == 'number' and amount == amount and amount > 0 and amount <= 100
end

RegisterNetEvent('hud:server:GainStress', function(amount)
    if not validAmount(amount) then return end

    addStress(source, amount)
end)

RegisterNetEvent('hud:server:RelieveStress', function(amount)
    if not validAmount(amount) then return end

    removeStress(source, amount)
end)

exports('GetStress', getStress)
exports('SetStress', function(src, value)
    if type(value) ~= 'number' or value ~= value then return false end

    return setStress(src, value)
end)

exports('AddStress', function(src, amount)
    if not validAmount(amount) then return false end

    return addStress(src, amount)
end)

exports('RemoveStress', function(src, amount)
    if not validAmount(amount) then return false end

    return removeStress(src, amount)
end)

AddEventHandler('playerDropped', function()
    local src = source

    for _, key in ipairs({ 'stress_gain', 'stress_relief' }) do
        lastNotify[src .. key] = nil
    end
end)

if framework ~= 'esx' then return end

local function esxLoad(src, xPlayer)
    local identifier = xPlayer and xPlayer.identifier

    if not identifier then return end

    local value = MySQL.scalar.await('SELECT `stress` FROM `vexxd_hud_stress` WHERE `identifier` = ?', { identifier }) or 0

    esxIdent[src] = identifier
    esxStress[src] = value
    Player(src).state:set('stress', value, true)
end

local function esxSave(src)
    if not esxDirty[src] or not esxIdent[src] then return end

    esxDirty[src] = nil
    MySQL.prepare('INSERT INTO `vexxd_hud_stress` (`identifier`, `stress`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `stress` = VALUES(`stress`)', {
        esxIdent[src],
        esxStress[src] or 0,
    })
end

AddEventHandler('esx:playerLoaded', function(src, xPlayer)
    esxLoad(src, xPlayer)
end)

AddEventHandler('esx:playerLogout', function(src)
    esxSave(src)
end)

AddEventHandler('playerDropped', function()
    local src = source

    esxSave(src)
    esxStress[src] = nil
    esxIdent[src] = nil
end)

SetInterval(function()
    for src in pairs(esxDirty) do
        esxSave(src)
    end
end, 120000)

MySQL.ready(function()
    MySQL.query.await([[
        CREATE TABLE IF NOT EXISTS `vexxd_hud_stress` (
            `identifier` VARCHAR(64) NOT NULL,
            `stress` TINYINT UNSIGNED NOT NULL DEFAULT 0,
            PRIMARY KEY (`identifier`)
        )
    ]])

    for _, xPlayer in pairs(ESX.GetExtendedPlayers()) do
        esxLoad(xPlayer.source, xPlayer)
    end
end)
