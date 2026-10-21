Bridge = { name = 'standalone', loaded = false }

local listeners = {}

local function started(resource)
    return GetResourceState(resource) == 'started'
end

local function emit(kind, data)
    for i = 1, #listeners do
        listeners[i](kind, data)
    end
end

function Bridge.on(fn)
    listeners[#listeners + 1] = fn
end

local function qbInfo(pd)
    if not pd or not pd.money then return end

    local job = pd.job or {}

    emit('info', {
        job = job.label or '',
        grade = job.grade and (job.grade.name or '') or '',
        cash = pd.money.cash or 0,
        bank = pd.money.bank or 0,
    })

    local meta = pd.metadata

    if meta then
        emit('status', { hunger = meta.hunger, thirst = meta.thirst, stress = meta.stress })
    end
end

local function esxInfo(pd)
    if not pd then return end

    local info = {}

    if pd.job then
        info.job = pd.job.label or ''
        info.grade = pd.job.grade_label or ''
    end

    for _, account in ipairs(pd.accounts or {}) do
        if account.name == 'money' then info.cash = account.money end
        if account.name == 'bank' then info.bank = account.money end
    end

    emit('info', info)
end

local function statebag(key)
    AddStateBagChangeHandler(key, ('player:%s'):format(cache.serverId), function(_, _, value)
        emit('status', { [key] = value })
    end)
end

if started('qbx_core') then
    Bridge.name = 'qbx'

    local function load()
        local pd = exports.qbx_core:GetPlayerData()

        if not pd or not pd.citizenid then return end

        Bridge.loaded = true
        qbInfo(pd)
        emit('status', { hunger = LocalPlayer.state.hunger, thirst = LocalPlayer.state.thirst, stress = LocalPlayer.state.stress })
        emit('loaded')
    end

    RegisterNetEvent('QBCore:Client:OnPlayerLoaded', load)
    RegisterNetEvent('QBCore:Client:OnPlayerUnload', function() Bridge.loaded = false emit('unloaded') end)
    RegisterNetEvent('QBCore:Player:SetPlayerData', qbInfo)
    statebag('hunger')
    statebag('thirst')
    statebag('stress')
    CreateThread(load)
elseif started('qb-core') then
    Bridge.name = 'qb'

    local QBCore = exports['qb-core']:GetCoreObject()

    local function load()
        local pd = QBCore.Functions.GetPlayerData()

        if not pd or not pd.citizenid then return end

        Bridge.loaded = true
        qbInfo(pd)
        emit('loaded')
    end

    RegisterNetEvent('QBCore:Client:OnPlayerLoaded', load)
    RegisterNetEvent('QBCore:Client:OnPlayerUnload', function() Bridge.loaded = false emit('unloaded') end)
    RegisterNetEvent('QBCore:Player:SetPlayerData', qbInfo)
    RegisterNetEvent('hud:client:UpdateNeeds', function(hunger, thirst) emit('status', { hunger = hunger, thirst = thirst }) end)
    RegisterNetEvent('hud:client:UpdateStress', function(stress) emit('status', { stress = stress }) end)
    CreateThread(load)
elseif started('es_extended') then
    Bridge.name = 'esx'

    local ESX = exports.es_extended:getSharedObject()

    local function load(pd)
        pd = pd or ESX.GetPlayerData()

        if not pd or not pd.identifier then return end

        Bridge.loaded = true
        esxInfo(pd)
        emit('loaded')
    end

    RegisterNetEvent('esx:playerLoaded', function(pd) load(pd) end)
    RegisterNetEvent('esx:onPlayerLogout', function() Bridge.loaded = false emit('unloaded') end)
    RegisterNetEvent('esx:setAccountMoney', function(account)
        if account.name == 'money' then emit('info', { cash = account.money }) end
        if account.name == 'bank' then emit('info', { bank = account.money }) end
    end)
    RegisterNetEvent('esx:setJob', function(job) emit('info', { job = job.label or '', grade = job.grade_label or '' }) end)
    AddEventHandler('esx_status:onTick', function(data)
        local s = {}

        for i = 1, #data do
            local name = data[i].name

            if name == 'hunger' or name == 'thirst' or name == 'stress' then s[name] = data[i].percent end
        end

        emit('status', s)
    end)
    CreateThread(function() load() end)
else
    CreateThread(function()
        Bridge.loaded = true
        emit('loaded')
    end)
end

local notifySystem = started('vexxd_notify') and 'vexxd' or 'ox'

function Bridge.notify(text, kind)
    if notifySystem == 'vexxd' and pcall(function() exports.vexxd_notify:Notify({ description = text, type = kind or 'inform' }) end) then
        return
    end

    lib.notify({ description = text, type = kind or 'inform' })
end
