local labelOf

if GetResourceState('ox_inventory') == 'started' then
    local current

    AddEventHandler('ox_inventory:currentWeapon', function(item)
        current = item
    end)

    labelOf = function()
        return current and (current.metadata?.label or current.label) or nil
    end
elseif Bridge.name == 'qb' then
    local weapons = exports['qb-core']:GetCoreObject().Shared.Weapons

    labelOf = function(hash)
        local w = weapons[hash]

        return w and w.label or nil
    end
elseif Bridge.name == 'esx' then
    local ESX = exports.es_extended:getSharedObject()

    labelOf = function(hash)
        local w = ESX.GetWeaponFromHash(hash)

        return w and w.label or nil
    end
end

local function run(weapon)
    local ped = cache.ped
    local melee = GetWeaponDamageType(weapon) == 2
    local maxClip = melee and 0 or GetMaxAmmoInClip(ped, weapon, true)
    local last = {}
    local hide = Config.HideGameAmmo
    local nextRead = 0

    while cache.weapon == weapon do
        local now = GetGameTimer()

        if now >= nextRead then
            nextRead = now + (melee and 1000 or 150)
            local label = labelOf and labelOf(weapon) or ''
            local clip, total = 0, 0

            if not melee then
                local _, inClip = GetAmmoInClip(ped, weapon)

                clip = inClip
                total = math.max(0, GetAmmoInPedWeapon(ped, weapon) - inClip)
            end

            if last.clip ~= clip or last.total ~= total or last.label ~= label then
                last = { label = label, clip = clip, total = total, max = maxClip, melee = melee }
                Hud.send('weapon', last)
            end
        end

        if hide then
            HideHudComponentThisFrame(2)
            DisplayAmmoThisFrame(false)
            Wait(0)
        else
            Wait(nextRead - now)
        end
    end
end

lib.onCache('weapon', function(weapon)
    if not weapon then
        Hud.send('weapon', false)
        return
    end

    CreateThread(function()
        Wait(0)
        run(weapon)
    end)
end)
