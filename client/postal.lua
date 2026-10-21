if not Config.Postal.enabled then return end

local raw = LoadResourceFile(cache.resource, ('data/postals/%s.json'):format(Config.Postal.map))
local postals = raw and json.decode(raw) or {}
local byCode = {}

for i = 1, #postals do
    local p = postals[i]

    postals[i] = { vector2(p[1], p[2]), p[3] }
    byCode[p[3]] = postals[i]
end

local current, lastPos = nil, nil

local function nearest(pos)
    local best, bestDist = nil, math.huge

    for i = 1, #postals do
        local d = #(pos - postals[i][1])

        if d < bestDist then
            best, bestDist = postals[i], d
        end
    end

    return best, bestDist
end

SetInterval(function()
    if Hud.paused() or #postals == 0 then return end

    local c = GetEntityCoords(cache.ped)
    local pos = vector2(c.x, c.y)

    if lastPos and #(pos - lastPos) < 8.0 then return end

    lastPos = pos

    local p, dist = nearest(pos)

    current = { code = p[2], dist = math.floor(dist) }
    Hud.diff('location', { postal = current.code, postalDist = current.dist })
end, Config.UpdateRate.location)

RegisterCommand(Config.Postal.command, function(_, args)
    local code = args[1]

    if not code then
        SetWaypointOff()
        Bridge.notify(locale('postal_cleared'))
        return
    end

    local p = byCode[code]

    if not p then
        Bridge.notify(locale('postal_bad', code), 'error')
        return
    end

    SetNewWaypoint(p[1].x, p[1].y)
    Bridge.notify(locale('postal_set', code), 'success')
end, false)

TriggerEvent('chat:addSuggestion', '/' .. Config.Postal.command, locale('postal_help'), {
    { name = 'code', help = locale('postal_code') },
})

exports('getPostal', function() return current and current.code or nil end)
exports('getPostalDistance', function() return current and current.dist or nil end)
