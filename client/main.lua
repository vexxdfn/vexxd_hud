Hud = { settings = {}, visible = true, nuiReady = false }

local LOCK_KEYS = {
    theme = { 'theme' },
    speedo = { 'speedo', 'vehicle' },
    unit = { 'unit' },
    statusStyle = { 'statusStyle', 'vitalsOnMap' },
    colors = { 'colors' },
    layout = { 'layout', 'layoutByType', 'uiScale' },
    map = { 'mapShape', 'mapOnFoot' },
    info = { 'show' },
}

function Hud.send(action, data)
    SendNUIMessage({ action = action, data = data })
end

local function stripLocked(s)
    for group, locked in pairs(Config.Locks) do
        if locked and LOCK_KEYS[group] then
            for _, key in ipairs(LOCK_KEYS[group]) do s[key] = nil end
        end
    end

    return s
end

local function loadSettings()
    local raw = GetResourceKvpString('settings')
    local ok, saved = pcall(json.decode, raw or '{}')

    return stripLocked(ok and type(saved) == 'table' and saved or {})
end

local function nuiLocale()
    local out = { ui = {}, menu = {} }

    for key, value in pairs(lib.getLocales()) do
        local group, name = key:match('^(%a+)_(.+)$')

        if group and out[group] then out[group][name] = value end
    end

    return out
end

local circleReady = false

local function features()
    return {
        circle = circleReady,
        shareCodes = Config.ShareCodes and GetResourceState('oxmysql') == 'started',
        navigation = Config.Navigation.enabled,
        mileage = GetResourceState('jg-vehiclemileage') == 'started',
        beltWarning = Config.Seatbelt.enabled and Config.Seatbelt.warning,
        beltWarnSpeed = Config.Seatbelt.warningSpeed,
        beltSounds = Config.Seatbelt.sounds,
        beltKey = Hud.beltKey and Hud.beltKey() or Config.Seatbelt.key,
    }
end

local function sendInit()
    Hud.settings = lib.table.merge(lib.table.deepclone(Config.Defaults), loadSettings())
    Hud.send('init', {
        settings = Hud.settings,
        defaults = Config.Defaults,
        locks = Config.Locks,
        locale = nuiLocale(),
        features = features(),
        mapFrame = Hud.mapFrame,
    })
end

RegisterNUICallback('ready', function(_, cb)
    Hud.nuiReady = true

    if Bridge.loaded then sendInit() end

    cb(1)
end)

RegisterNUICallback('saveSettings', function(data, cb)
    if type(data.settings) == 'table' then
        Hud.settings = stripLocked(data.settings)
        SetResourceKvp('settings', json.encode(Hud.settings))
        Hud.applyMap()
    end

    cb(1)
end)

RegisterNUICallback('profiles', function(data, cb)
    local ok, list = pcall(json.decode, GetResourceKvpString('profiles') or '[]')

    list = ok and type(list) == 'table' and list or {}

    if data.op == 'save' and type(data.name) == 'string' and type(data.settings) == 'table' then
        for i = #list, 1, -1 do
            if list[i].name == data.name then table.remove(list, i) end
        end

        table.insert(list, 1, { name = data.name:sub(1, 24), date = data.date or '', settings = stripLocked(data.settings) })

        while #list > 10 do table.remove(list) end

        SetResourceKvp('profiles', json.encode(list))
    elseif data.op == 'delete' then
        for i = #list, 1, -1 do
            if list[i].name == data.name then table.remove(list, i) end
        end

        SetResourceKvp('profiles', json.encode(list))
    end

    cb({ list = list })
end)

RegisterNUICallback('shareCode', function(data, cb)
    if not features().shareCodes then return cb({}) end

    cb({ code = lib.callback.await('vexxd_hud:shareCode', 2000, stripLocked(data.settings or {})) })
end)

RegisterNUICallback('importCode', function(data, cb)
    if not features().shareCodes or type(data.code) ~= 'string' then return cb({}) end

    local settings = lib.callback.await('vexxd_hud:importCode', 1000, data.code)

    cb({ settings = settings and stripLocked(settings) or nil })
end)

RegisterNUICallback('copy', function(data, cb)
    if type(data.text) == 'string' then lib.setClipboard(data.text) end

    cb(1)
end)

RegisterNUICallback('close', function(_, cb)
    SetNuiFocus(false, false)
    cb(1)
end)

RegisterNUICallback('cinematic', function(data, cb)
    Hud.cinematic = data.on == true
    DisplayRadar(not Hud.cinematic and Hud.mapWanted())
    cb(1)
end)

RegisterNUICallback('mapRect', function(data, cb)
    cb(1)

    if not Config.Minimap.movable or type(data) ~= 'table' then return end

    local x, y, w, h = tonumber(data.x), tonumber(data.y), tonumber(data.w), tonumber(data.h)

    if not (x and y and w and h) or w <= 0.01 or h <= 0.01 or w > 1 or h > 1 then return end

    Hud.mapRect = { x = x, y = y, w = w, h = h }
    Hud.applyMap()
end)

RegisterCommand(Config.Command, function()
    if not Bridge.loaded then return end

    SetNuiFocus(true, true)
    Hud.send('openMenu', { locks = Config.Locks })
end, false)

local last = {}

local function diff(kind, data)
    local prev = last[kind]

    if not prev then
        prev = {}
        last[kind] = prev
    end

    local out, changed = {}, false

    for k, v in pairs(data) do
        if prev[k] ~= v then
            prev[k] = v
            out[k] = v
            changed = true
        end
    end

    if changed then Hud.send(kind, out) end
end

Hud.diff = diff

Bridge.on(function(kind, data)
    if kind == 'loaded' then
        if Hud.nuiReady then sendInit() end
        diff('info', { id = cache.serverId })
        Hud.applyMap()
        return
    end

    if kind == 'unloaded' then
        Hud.send('visible', { on = false })
        return
    end

    if kind == 'status' then
        local s = {}

        for k, v in pairs(data) do
            if type(v) == 'number' then s[k] = math.floor(v + 0.5) end
        end

        diff('status', s)
    elseif kind == 'info' then
        diff('info', data)
    end
end)

local hasVoice = GetResourceState('pma-voice') == 'started'

if hasVoice then
    local bag = ('player:%s'):format(cache.serverId)

    AddStateBagChangeHandler('proximity', bag, function(_, _, value)
        if type(value) == 'table' then diff('voice', { range = value.index or 2 }) end
    end)

    AddStateBagChangeHandler('radioChannel', bag, function(_, _, value)
        diff('voice', { radio = value or 0 })
    end)

    AddEventHandler('pma-voice:radioActive', function(active)
        diff('voice', { radioTalking = active == true })
    end)

    CreateThread(function()
        local p = LocalPlayer.state.proximity

        diff('voice', { range = p and p.index or 2, radio = LocalPlayer.state.radioChannel or 0 })
    end)
end

local function paused()
    return not Bridge.loaded or not Hud.visible or IsPauseMenuActive()
end

Hud.paused = paused

SetInterval(function()
    if paused() then return end

    local ped, pid = cache.ped, cache.playerId
    local maxHealth = math.max(1, GetEntityMaxHealth(ped) - 100)
    local underwater = IsPedSwimmingUnderWater(ped)

    diff('status', {
        health = math.max(0, math.floor((GetEntityHealth(ped) - 100) / maxHealth * 100 + 0.5)),
        armor = GetPedArmour(ped),
        stamina = math.floor(100 - GetPlayerSprintStaminaRemaining(pid) + 0.5),
        oxygen = underwater and math.floor(GetPlayerUnderwaterTimeRemaining(pid) * 10 + 0.5) or 100,
        underwater = underwater,
        sprinting = IsPedSprinting(ped),
    })

    if hasVoice then diff('voice', { talking = NetworkIsPlayerTalking(pid) }) end
end, Config.UpdateRate.status)

SetInterval(function()
    if paused() then return end

    local vehicle = cache.vehicle

    if not vehicle and Hud.settings.compass == false then return end

    local class = vehicle and GetVehicleClass(vehicle)
    local h = (class == 15 or class == 16) and GetEntityHeading(vehicle) or GetGameplayCamRot(2).z

    diff('location', { heading = math.floor((360.0 - h) % 360) })
end, Config.UpdateRate.heading or 50)

local lastPos = vec3(0, 0, 0)

SetInterval(function()
    if paused() then return end

    local pos = GetEntityCoords(cache.ped)

    diff('info', { time = ('%02d:%02d'):format(GetClockHours(), GetClockMinutes()) })

    if #(pos - lastPos) < 6.0 then return end

    lastPos = pos

    local s1, s2 = GetStreetNameAtCoord(pos.x, pos.y, pos.z)
    diff('location', {
        street = GetStreetNameFromHashKey(s1),
        cross = s2 ~= 0 and GetStreetNameFromHashKey(s2) or '',
        zone = GetLabelText(GetNameOfZone(pos.x, pos.y, pos.z)),
    })
end, Config.UpdateRate.location)

function Hud.mapWanted(vehicle)
    if Hud.cinematic then return false end

    if vehicle == nil then vehicle = cache.vehicle end

    return (vehicle and vehicle ~= 0) or Hud.settings.mapOnFoot ~= false
end

local function loadCircleMask()
    local dict = Config.Minimap.circleTexture

    if not dict then return false end

    RequestStreamedTextureDict(dict, false)

    local timeout = GetGameTimer() + 1500

    while not HasStreamedTextureDictLoaded(dict) do
        if GetGameTimer() > timeout then return false end

        Wait(50)
    end

    return true
end

local mapApplied, mapBusy

local function mapKey()
    local resX, resY = GetActiveScreenResolution()

    local r = Hud.mapRect
    local rect = r and ('%.4f,%.4f,%.4f,%.4f'):format(r.x, r.y, r.w, r.h) or ''

    return (Hud.settings.mapShape == 'circle' and circleReady and 'c' or 's') .. resX .. 'x' .. resY .. rect
end

local STOCK_MAP = {
    minimap = { -0.0045, 0.002, 0.150, 0.188888 },
    minimap_mask = { 0.020, 0.032, 0.111, 0.159 },
    minimap_blur = { -0.03, 0.022, 0.266, 0.237 },
}

local function circleMap()
    local resX, resY = GetActiveScreenResolution()
    local aspect = resX / resY
    local offset = aspect > 1920 / 1080 and ((1920 / 1080 - aspect) / 3.6) - 0.008 or 0

    local base = {
        minimap = { -0.0100 + offset, -0.030, 0.180, 0.258 },
        minimap_mask = { 0.200 + offset, 0.0, 0.065, 0.20 },
        minimap_blur = { -0.00 + offset, 0.015, 0.252, 0.338 },
    }
    local size = Config.Minimap.circleSize or 1.0

    if size == 1.0 then return base end

    local m = base.minimap
    local out = {}

    for name, v in pairs(base) do
        out[name] = { m[1] + (v[1] - m[1]) * size, m[2] + (v[2] - m[2]) * size, v[3] * size, v[4] * size }
    end

    return out
end

local function screenRect(v)
    SetScriptGfxAlign(76, 66)
    local x0, y0 = GetScriptGfxPosition(v[1], v[2] - v[4])
    local x1, y1 = GetScriptGfxPosition(v[1] + v[3], v[2])
    ResetScriptGfxAlign()

    return x0, y0, x1, y1
end

local function adjustNorm()
    local resX, resY = GetActiveScreenResolution()
    local stageW = 1080 * resX / resY
    local adj = Config.Minimap.adjust or {}

    return (adj.x or 0) / stageW, (adj.y or 0) / 1080, (adj.w or 0) / stageW, (adj.h or 0) / 1080
end

local BAR_STRIP = 20 / 204

local function frameOf(v)
    local resX, resY = GetActiveScreenResolution()
    local stageW = 1080 * resX / resY
    local x0, y0, x1, y1 = screenRect(v)
    local ax, ay, aw, ah = adjustNorm()
    local strip = (y1 - y0) * BAR_STRIP

    return {
        dx = math.floor((x0 + ax) * stageW + 0.5),
        dy = math.floor((y1 - strip - ay - 1.0) * 1080 + 0.5),
        w = math.floor((x1 - x0 + aw) * stageW + 0.5),
        h = math.floor((y1 - y0 - strip + ah) * 1080 + 0.5),
    }
end

local function placeMap(base, rect)
    if not rect or not Config.Minimap.movable then return base end

    local m = base.minimap
    local x0, y0, x1, y1 = screenRect(m)
    local ax, ay, aw = adjustNorm()
    local w = rect.w - aw

    if w <= 0 then return base end

    local k = w / (x1 - x0)
    local strip = (y1 - y0) * BAR_STRIP * k
    local nx = m[1] + (rect.x - ax - x0) * m[3] / (x1 - x0)
    local ny = m[2] + (rect.y + rect.h + ay + strip - y1) * m[4] / (y1 - y0)
    local out = {}

    for name, v in pairs(base) do
        out[name] = { nx + (v[1] - m[1]) * k, ny + (v[2] - m[2]) * k, v[3] * k, v[4] * k }
    end

    return out
end

local function setupMap(key)
    local circle = key:sub(1, 1) == 'c'
    local base = circle and circleMap() or STOCK_MAP

    if circle then
        SetMinimapClipType(1)
        AddReplaceTexture('platform:/textures/graphics', 'radarmasksm', Config.Minimap.circleTexture, 'radarmasksm')
        AddReplaceTexture('platform:/textures/graphics', 'radarmask1g', Config.Minimap.circleTexture, 'radarmasksm')
    else
        SetMinimapClipType(0)
        RemoveReplaceTexture('platform:/textures/graphics', 'radarmasksm')
        RemoveReplaceTexture('platform:/textures/graphics', 'radarmask1g')
    end

    for name, v in pairs(placeMap(base, Hud.mapRect)) do
        SetMinimapComponentPosition(name, 'L', 'B', v[1], v[2], v[3], v[4])
    end

    Hud.mapFrame = frameOf(base.minimap)
    Hud.mapFrame.movable = Config.Minimap.movable
    Hud.mapFrame.circle = circle
    Hud.send('mapFrame', Hud.mapFrame)

    SetBlipAlpha(GetNorthRadarBlip(), 0)
    SetMinimapClipType(circle and 1 or 0)
    SetBigmapActive(true, false)
    Wait(50)
    SetBigmapActive(false, false)
    Wait(50)
end

function Hud.applyMap()
    DisplayRadar(Hud.mapWanted())

    if mapBusy or mapKey() == mapApplied then return end

    mapBusy = true

    CreateThread(function()
        while mapKey() ~= mapApplied do
            mapApplied = mapKey()
            setupMap(mapApplied)
        end

        mapBusy = false
        DisplayRadar(Hud.mapWanted())
    end)
end

CreateThread(function()
    circleReady = loadCircleMask()

    if circleReady then
        Hud.send('features', { circle = true })
        Hud.applyMap()
    end

    if Config.HideMinimapBars ~= 'lua' then return end

    local minimap = RequestScaleformMovie('minimap')

    while true do
        if IsRadarHidden() then
            Wait(500)
        else
            BeginScaleformMovieMethod(minimap, 'SETUP_HEALTH_ARMOUR')
            ScaleformMovieMethodAddParamInt(3)
            EndScaleformMovieMethod()
            Wait(0)
        end
    end
end)

lib.onCache('vehicle', function(vehicle)
    DisplayRadar(Hud.mapWanted(vehicle or false))
end)

AddEventHandler('onResourceStop', function(resource)
    if resource ~= cache.resource then return end

    RemoveReplaceTexture('platform:/textures/graphics', 'radarmasksm')
    RemoveReplaceTexture('platform:/textures/graphics', 'radarmask1g')
end)
