
local function setStatus(id, data)
    if type(id) ~= 'string' or type(data) ~= 'table' then return end

    data.id = id
    Hud.send('customStatus', data)
end

local function removeStatus(id)
    if type(id) ~= 'string' then return end

    Hud.send('customStatus', { id = id, remove = true })
end

local function setVisible(on)
    Hud.visible = on ~= false
    Hud.send('visible', { on = Hud.visible })
    DisplayRadar(Hud.visible and Hud.mapWanted())
end

exports('SetStatus', setStatus)
exports('RemoveStatus', removeStatus)
exports('SetVisible', setVisible)
exports('IsVisible', function() return Hud.visible end)

RegisterNetEvent('vexxd_hud:client:setStatus', function(id, data) setStatus(id, data) end)
RegisterNetEvent('vexxd_hud:client:removeStatus', removeStatus)
