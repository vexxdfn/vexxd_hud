local MPH = 2.236936

local function on(v)
    return v == true or v == 1
end
local electricModels = {}

for _, model in ipairs(Config.ElectricModels) do electricModels[joaat(model)] = true end

local nativeElectric = GetGameBuildNumber() >= 3258

local function isElectric(model)
    if electricModels[model] then return true end

    return nativeElectric and GetIsVehicleElectric(model)
end

local function vehicleType(vehicle)
    local class = GetVehicleClass(vehicle)

    if class == 13 then return 'cycle' end
    if class == 21 then return 'train' end
    if class == 8 then return 'bike' end
    if class == 14 then return 'boat' end
    if class == 15 or class == 16 then return 'air' end

    return isElectric(GetEntityModel(vehicle)) and 'ev' or 'car'
end

local state = {
    seatbelt = false,
    cruise = false,
    cruiseSpeed = 0.0,
    indicators = false,
}

local hasMileage = GetResourceState('jg-vehiclemileage') == 'started'
local lastOdo

local externalBelt = GetResourceState('qbx_seatbelt') == 'started'
local ownBelt = Config.Seatbelt.enabled and not externalBelt

local function beltOn()
    if ownBelt then return state.seatbelt end

    return LocalPlayer.state.seatbelt == true or LocalPlayer.state.harness == true
end

local function setEject(on)
    local speed = (on and Config.Seatbelt.ejectSpeedBuckled or Config.Seatbelt.ejectSpeedUnbuckled) / MPH

    SetPedConfigFlag(cache.ped, 32, true)
    SetFlyThroughWindscreenParams(speed, 1.0, 17.0, 10.0)
end

local NO_EJECT = { [8] = true, [13] = true, [14] = true, [15] = true, [16] = true, [21] = true }

local function eject(vehicle, velocity)
    local ped = cache.ped

    if not IsPedInVehicle(ped, vehicle, false) then return end

    local pos = GetOffsetFromEntityInWorldCoords(vehicle, 1.0, 0.0, 1.0)

    SetEntityCoords(ped, pos.x, pos.y, pos.z, false, false, false, false)
    Wait(1)
    SetPedToRagdoll(ped, 5000, 5000, 0, false, false, false)
    SetEntityVelocity(ped, velocity.x, velocity.y, velocity.z + 2.0)
    SetEntityHealth(ped, math.max(101, GetEntityHealth(ped) - math.floor(#velocity * 1.5)))
end

local function watchEject(vehicle)
    local debug = GetConvarInt('vexxd_hud:debugEject', 0) == 1

    if debug then print(('[vexxd_hud] eject watch: class %d, own belt %s, belt on %s'):format(GetVehicleClass(vehicle), tostring(ownBelt), tostring(beltOn()))) end
    if NO_EJECT[GetVehicleClass(vehicle)] then return end

    local ejectAt = Config.Seatbelt.ejectSpeedUnbuckled / MPH
    local peak, peakAt, peakBody, peakVel = 0.0, 0, 1000.0, vec3(0, 0, 0)

    while cache.vehicle == vehicle do
        local speed = GetEntitySpeed(vehicle)

        if beltOn() or (speed < ejectAt and peak < ejectAt) then
            peak = 0.0
            Wait(250)
        else
            local now = GetGameTimer()
            local body = GetVehicleBodyHealth(vehicle)

            if peak >= ejectAt and speed < peak * 0.6 then
                if debug then print(('[vexxd_hud] crash: %.1f -> %.1f mph, body %.0f -> %.0f, belt %s'):format(peak * MPH, speed * MPH, peakBody, body, tostring(beltOn()))) end

                if body < peakBody then
                    eject(vehicle, peakVel)
                    return
                end
            end

            if speed >= peak or now - peakAt > 300 then
                peak, peakAt, peakBody, peakVel = speed, now, body, GetEntityVelocity(vehicle)
            end

            Wait(0)
        end
    end
end

if ownBelt then
    setEject(false)

    local beltKey = lib.addKeybind({
        name = 'vexxd_hud_seatbelt',
        description = locale('key_seatbelt'),
        defaultKey = Config.Seatbelt.key,
        onPressed = function()
            local vehicle = cache.vehicle

            if not vehicle then return end

            local class = GetVehicleClass(vehicle)

            if class == 8 or class == 13 or class == 14 then return end

            state.seatbelt = not state.seatbelt
            LocalPlayer.state:set('seatbelt', state.seatbelt, true)
            setEject(state.seatbelt)
            Bridge.notify(locale(state.seatbelt and 'belt_on' or 'belt_off'), state.seatbelt and 'success' or 'inform')
            Hud.send('belt', { on = state.seatbelt, key = Hud.beltKey() })

            if state.seatbelt and Config.Seatbelt.blockExitWhenBuckled then
                CreateThread(function()
                    local warnedAt = 0

                    while state.seatbelt and cache.vehicle do
                        DisableControlAction(0, 75, true)
                        DisableControlAction(27, 75, true)

                        if IsDisabledControlJustPressed(0, 75) and GetGameTimer() > warnedAt then
                            warnedAt = GetGameTimer() + 2000
                            Bridge.notify(locale('belt_exit'), 'error')
                        end

                        Wait(0)
                    end
                end)
            end
        end,
    })

    Hud.beltKey = function()
        return beltKey:getCurrentKey()
    end
end

local function stopCruise()
    state.cruise = false
end

if Config.Cruise.enabled then
    lib.addKeybind({
        name = 'vexxd_hud_cruise',
        description = locale('key_cruise'),
        defaultKey = Config.Cruise.key,
        onPressed = function()
            local vehicle = cache.vehicle

            if not vehicle or cache.seat ~= -1 then return end

            if state.cruise then return stopCruise() end

            local speed = GetEntitySpeed(vehicle)

            if speed < 4.0 then return end

            state.cruise = true
            state.cruiseSpeed = speed

            CreateThread(function()
                while state.cruise and cache.vehicle == vehicle do
                    if IsControlPressed(0, 72) or IsControlPressed(0, 76) or HasEntityCollidedWithAnything(vehicle) then
                        stopCruise()
                        break
                    end

                    if not IsControlPressed(0, 71) and GetEntitySpeed(vehicle) < state.cruiseSpeed then
                        SetControlNormal(0, 71, 1.0)
                    end

                    Wait(0)
                end

                state.cruise = false
            end)
        end,
    })
end

local function applyIndicators(vehicle, value)
    SetVehicleIndicatorLights(vehicle, 1, value == 'left' or value == 'hazard')
    SetVehicleIndicatorLights(vehicle, 0, value == 'right' or value == 'hazard')
end

if Config.Indicators.enabled then
    local function toggle(which)
        local vehicle = cache.vehicle

        if not vehicle or cache.seat ~= -1 then return end

        state.indicators = state.indicators ~= which and which or false
        applyIndicators(vehicle, state.indicators)
        Entity(vehicle).state:set('vexxd_ind', state.indicators, true)
    end

    Hud.toggleIndicator = toggle

    lib.addKeybind({
        name = 'vexxd_hud_ind_left',
        description = locale('key_left'),
        defaultKey = Config.Indicators.left,
        onPressed = function() toggle('left') end,
    })
    lib.addKeybind({
        name = 'vexxd_hud_ind_right',
        description = locale('key_right'),
        defaultKey = Config.Indicators.right,
        onPressed = function() toggle('right') end,
    })
    lib.addKeybind({
        name = 'vexxd_hud_hazards',
        description = locale('key_hazards'),
        defaultKey = Config.Indicators.hazards,
        onPressed = function() toggle('hazard') end,
    })

    AddStateBagChangeHandler('vexxd_ind', nil, function(bagName, _, value)
        local vehicle = GetEntityFromStateBagName(bagName)

        if vehicle == 0 or vehicle == cache.vehicle then return end

        applyIndicators(vehicle, value)
    end)
end

local function navigation(pos)
    if not Config.Navigation.enabled or not IsWaypointActive() then return nil end

    local dest = GetBlipInfoIdCoord(GetFirstBlipInfoId(8))
    local _, direction, _, toNext = GenerateDirectionsToCoord(dest.x, dest.y, dest.z, true)
    local total = CalculateTravelDistanceBetweenPoints(pos.x, pos.y, pos.z, dest.x, dest.y, dest.z)

    if total >= 100000.0 then total = #(pos.xy - dest.xy) * 1.25 end

    local dirs = { [2] = 'straight', [3] = 'left', [4] = 'right', [5] = 'straight', [6] = 'left', [7] = 'right' }

    if total < 40.0 then return { dir = 'arrive', next = 0, total = total } end

    return { dir = dirs[direction] or 'straight', next = toNext * Config.Navigation.distanceScale, total = total }
end

local function run(vehicle)
    local kind = vehicleType(vehicle)
    local tick, lastNav = 0, false
    local trip = { start = nil, done = false, peak = 0.0, best = 0.0 }
    local range = { dist = 0.0, fuel = GetVehicleFuelLevel(vehicle), perPct = 1250.0, pos = GetEntityCoords(vehicle) }
    local prevSpeed = 0.0
    local ride = { dist = 0.0, start = GetGameTimer(), pos = GetEntityCoords(vehicle) }
    local crashAt = 0
    local crashDecel = Config.Crash.enabled and Config.Crash.minG * 9.81 or nil
    local tickRate = 1000 / Config.UpdateRate.vehicle
    local lastRange = nil
    local lastTemp = nil
    local lastSent = {}
    lastOdo = nil
    local target = GetConvar('vexxd_hud:zeroTo', '') == '100' and 27.78 or 26.82

    state.indicators = Entity(vehicle).state.vexxd_ind or false

    if ownBelt and not beltOn() then setEject(false) end

    while cache.vehicle == vehicle do
        local speed = GetEntitySpeed(vehicle)
        local rpm = GetVehicleCurrentRpm(vehicle)
        local gear = GetVehicleCurrentGear(vehicle)
        local slow = tick % 5 == 0
        local pos = GetEntityCoords(vehicle)
        local _, lowBeam, highBeam = GetVehicleLightsState(vehicle)
        local data = {
            type = kind,
            speed = math.floor(speed * 10) / 10,
            gear = (gear == 0 and speed > 0.5) and 'R' or (speed < 0.3 and 'N' or tostring(gear)),
            seatbelt = beltOn(),
            cruise = state.cruise,
            cruiseSpeed = state.cruiseSpeed,
            indicators = state.indicators,
            lights = on(highBeam) and 2 or (on(lowBeam) and 1 or 0),
            engineOn = GetIsVehicleEngineRunning(vehicle),
            engineHealth = math.floor(GetVehicleEngineHealth(vehicle)),
        }

        if kind == 'ev' then
            local accel = (speed - prevSpeed) * (1000 / Config.UpdateRate.vehicle)

            data.gear = speed < 0.3 and 'P' or (gear == 0 and 'R' or 'D')
            data.rpm = math.floor(math.max(-1.0, math.min(1.0, accel / 6.0)) * 100) / 100
            data.battery = math.floor(GetVehicleFuelLevel(vehicle))
        else
            data.rpm = math.floor(math.max(0.0, (rpm - 0.2) / 0.8) * 100) / 100
            data.fuel = math.floor(GetVehicleFuelLevel(vehicle))
        end

        if kind == 'cycle' then
            ride.dist += #(pos - ride.pos)
            ride.pos = pos
            data.ride = math.floor(ride.dist)
            data.rideTime = math.floor((GetGameTimer() - ride.start) / 1000)
        elseif kind == 'train' then
            data.reverse = GetEntitySpeedVector(vehicle, true).y < -0.5
        end

        if kind == 'air' then
            data.altitude = math.floor(pos.z)
            data.vspeed = math.floor(GetEntityVelocity(vehicle).z * 10) / 10
            local gearState = GetLandingGearState(vehicle)
            data.gearDown = gearState == 0 or gearState == 3
        elseif kind == 'boat' then
            data.anchor = IsBoatAnchored(vehicle)
        end

        if slow then
            local fuelNow = GetVehicleFuelLevel(vehicle)

            range.dist += #(pos - range.pos)
            range.pos = pos

            if range.fuel - fuelNow >= 1.0 then
                range.perPct = range.perPct * 0.7 + (range.dist / (range.fuel - fuelNow)) * 0.3
                range.dist = 0.0
                range.fuel = fuelNow
            elseif fuelNow > range.fuel then
                range.fuel = fuelNow
                range.dist = 0.0
            end

            lastRange = math.floor(fuelNow * range.perPct)

            if kind ~= 'ev' then lastTemp = math.floor(GetVehicleEngineTemperature(vehicle)) end

            if hasMileage then
                local km = Entity(vehicle).state.vehicleMileage

                lastOdo = type(km) == 'number' and km or nil
            end

            local nav = (kind == 'car' or kind == 'ev' or kind == 'bike' or kind == 'cycle') and navigation(pos) or nil

            if nav or lastNav then
                Hud.send('nav', nav)
                lastNav = nav ~= nil
            end
        end

        if cache.seat == -1 and (kind == 'car' or kind == 'ev' or kind == 'bike') then
            if speed < 0.5 then
                trip.start, trip.done = nil, false
            elseif not trip.start and prevSpeed < 0.5 then
                trip.start = GetGameTimer()
            end

            if trip.start and not trip.done and speed >= target then
                trip.done = true
                local secs = (GetGameTimer() - trip.start) / 1000

                if secs < 20.0 then Hud.send('trip', { kind = 'zero60', value = secs }) end
            end

            if speed > trip.peak then trip.peak = speed end

            if trip.peak > 30.0 and speed < trip.peak * 0.92 then
                if trip.peak > trip.best + 0.5 then
                    trip.best = trip.peak
                    Hud.send('trip', { kind = 'top', value = trip.peak })
                end

                trip.peak = speed
            end
        end

        if crashDecel and prevSpeed - speed > 0 then
            local decel = (prevSpeed - speed) * tickRate
            local now = GetGameTimer()

            if decel >= crashDecel and now > crashAt then
                crashAt = now + 1500
                Hud.send('crash', { force = math.min(1.0, decel / (crashDecel * 3)) })
            end
        end

        data.range = lastRange
        data.temp = lastTemp
        data.odo = lastOdo

        local changed = false

        for k, v in pairs(data) do
            if lastSent[k] ~= v then
                changed = true
                break
            end
        end

        for k in pairs(lastSent) do
            if data[k] == nil then changed = true end
        end

        if changed or next(lastSent) == nil then
            Hud.send('vehicle', data)
            lastSent = data
        end

        prevSpeed = speed
        tick += 1
        Wait(Config.UpdateRate.vehicle)
    end
end

lib.onCache('vehicle', function(vehicle)
    if not vehicle then
        Hud.send('vehicle', nil)
        Hud.send('nav', nil)

        if ownBelt and state.seatbelt then
            state.seatbelt = false
            LocalPlayer.state:set('seatbelt', false, true)
            setEject(false)
        end

        state.cruise = false
        return
    end

    CreateThread(function() run(vehicle) end)

    if Config.Seatbelt.enabled then CreateThread(function() watchEject(vehicle) end) end
end)

CreateThread(function()
    if not cache.vehicle then return end

    if Config.Seatbelt.enabled then CreateThread(function() watchEject(cache.vehicle) end) end

    run(cache.vehicle)
end)

exports('IsSeatbeltOn', beltOn)
