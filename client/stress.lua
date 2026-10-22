local cfg = Config.Stress

if not cfg or not cfg.enabled then return end
if GetResourceState('qbx_hud') == 'started' or GetResourceState('qb-hud') == 'started' then return end
if Bridge.name == 'standalone' then return end

local MPH = 2.236936
local NO_STRESS_CLASS = { [13] = true, [14] = true, [15] = true, [16] = true, [21] = true }

local stress = 0
local effectsRunning = false

local function gain(range)
    TriggerServerEvent('hud:server:GainStress', math.random(range[1], range[2]))
end

local function levelFor(value)
    local found

    for _, level in ipairs(cfg.effects.levels) do
        if value >= level.min then found = level end
    end

    return found
end

local function stumble(level)
    local ped = cache.ped
    local time = math.random(2, 4) * 1750
    local forward = GetEntityForwardVector(ped)

    SetPedToRagdollWithFall(ped, time, time, 1, forward.x, forward.y, forward.z, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
    Wait(500)
    DoScreenFadeOut(200)
    Wait(1000)
    DoScreenFadeIn(200)
    TriggerScreenblurFadeIn(1000.0)
    Wait(level.blur)
    TriggerScreenblurFadeOut(1000.0)
end

local function runEffects()
    if effectsRunning or not cfg.effects.enabled or not levelFor(stress) then return end

    effectsRunning = true

    CreateThread(function()
        while true do
            local level = levelFor(stress)

            if not level then break end

            Wait(math.random(level.every[1], level.every[2]) * 1000)
            level = levelFor(stress)

            if not level then break end

            ShakeGameplayCam('SMALL_EXPLOSION_SHAKE', cfg.effects.shake)

            if stress >= 100 and cfg.effects.ragdollAtMax and not cache.vehicle then
                stumble(level)
            else
                TriggerScreenblurFadeIn(1000.0)
                Wait(level.blur)
                TriggerScreenblurFadeOut(1000.0)
            end
        end

        effectsRunning = false
    end)
end

Bridge.on(function(kind, data)
    if kind ~= 'status' or type(data) ~= 'table' or data.stress == nil then return end

    stress = tonumber(data.stress) or 0
    runEffects()
end)

RegisterNetEvent('vexxd_hud:client:stressNotify', function(key)
    if key ~= 'stress_gain' and key ~= 'stress_relief' then return end

    Bridge.notify(locale(key), key == 'stress_gain' and 'error' or 'success')
end)

if cfg.speeding.enabled and (cfg.speeding.buckled or cfg.speeding.unbuckled) then
    local timer

    local function belted()
        return LocalPlayer.state.seatbelt == true or LocalPlayer.state.harness == true
    end

    local function onVehicle(vehicle)
        if timer then
            ClearInterval(timer)
            timer = nil
        end

        if not vehicle or NO_STRESS_CLASS[GetVehicleClass(vehicle)] then return end

        timer = SetInterval(function()
            local veh = cache.vehicle

            if not veh then return end

            local limit = cfg.speeding.unbuckled

            if belted() then limit = cfg.speeding.buckled end
            if not limit then return end
            if GetEntitySpeed(veh) * MPH < limit then return end

            gain(cfg.speeding.amount)
        end, cfg.speeding.every * 1000)
    end

    lib.onCache('vehicle', onVehicle)

    if cache.vehicle then onVehicle(cache.vehicle) end
end

if cfg.shooting.enabled then
    local ignore = {}

    for _, hash in ipairs(cfg.shooting.ignore or {}) do ignore[hash] = true end

    local watching = 0

    local function watch(weapon, id)
        local last = GetAmmoInPedWeapon(cache.ped, weapon)

        while cache.weapon == weapon and watching == id do
            Wait(200)

            if cache.weapon ~= weapon or watching ~= id or GetSelectedPedWeapon(cache.ped) ~= weapon then break end

            local ammo = GetAmmoInPedWeapon(cache.ped, weapon)
            local shots = last - ammo

            last = ammo

            for _ = 1, math.min(shots, 30) do
                if math.random() <= cfg.shooting.chance then
                    gain(cfg.shooting.amount)
                    break
                end
            end
        end
    end

    local function onWeapon(weapon)
        watching += 1

        if not weapon or ignore[weapon] or GetWeaponDamageType(weapon) == 2 then return end

        local id = watching

        CreateThread(function()
            Wait(0)
            watch(weapon, id)
        end)
    end

    lib.onCache('weapon', onWeapon)

    if cache.weapon then onWeapon(cache.weapon) end
end
