
# HUD

HUD and speedometer with an in-game settings menu, layout editor, profiles and share codes. Free and open source.

## Support

Join the Discord for support: https://discord.gg/TzNJ6Z92Y5

<img width="1920" height="1080" alt="hud11" src="https://github.com/user-attachments/assets/7dbaf8ff-1a52-4190-bb85-a239f10b8f8b" />
<img width="1920" height="1080" alt="hud" src="https://github.com/user-attachments/assets/2b8125ae-a526-4f87-b533-6a10ad9493d6" />
<img width="1920" height="1080" alt="hud10" src="https://github.com/user-attachments/assets/8f2796e2-bcaf-41cf-8901-9d5bb313fb2f" />
<img width="1920" height="1080" alt="hud9" src="https://github.com/user-attachments/assets/574d82a5-d723-4aac-8eac-5a2ba5ce5703" />
<img width="1920" height="1080" alt="hud1" src="https://github.com/user-attachments/assets/6a72b0bb-9ef0-4632-b0b7-20fc8f2bdcc4" />
<img width="1920" height="1080" alt="hud2" src="https://github.com/user-attachments/assets/ed357311-03d1-49d5-8218-5e3ed2806318" />
<img width="1920" height="1080" alt="hud3" src="https://github.com/user-attachments/assets/e6f4afa5-a229-4464-8b7f-d1ec0f51692b" />
<img width="1920" height="1080" alt="hud4" src="https://github.com/user-attachments/assets/3ef69083-28d1-486c-8514-f699e0602492" />
<img width="1920" height="1080" alt="hud5" src="https://github.com/user-attachments/assets/c911a682-c2a0-4fc8-aa59-272319b2f3f5" />
<img width="1920" height="1080" alt="hud6" src="https://github.com/user-attachments/assets/44fa290b-2331-4018-85ad-d783e740fe5d" />
<img width="1920" height="1080" alt="hud7" src="https://github.com/user-attachments/assets/dcd8399d-5842-449b-95ee-8c50b1587a37" />
<img width="1920" height="1080" alt="hud8" src="https://github.com/user-attachments/assets/e5c2e77c-1db8-4985-bafa-a00b4f658b60" />

## Features

- `/hud` settings menu, players set everything themselves (you can lock any group in the config)
- 3 themes and 5 status styles (gauges, slim, rings, bars, minimal)
- Speedometer styles per vehicle type: cars, electric, bikes, bicycles, boats, aircraft and trains
- Drag-and-drop layout editor with snapping, size and opacity per widget
- Profiles, plus share codes so players can copy each other's setup
- Seatbelt with buckle sounds, a warning while driving unbuckled and windshield ejection on crashes
- Cruise control, turn signals and hazards
- Shift light, crash pulse, 0-60 times and top speed pops
- Fuel shown as percent or remaining range
- Minimap you can move and resize, square or round
- Compass, street names, postal codes and turn-by-turn directions to your waypoint
- Cash and bank, job, ID and voice (range, talking and radio)
- Weapon and ammo display
- Streamer mode (blurs money and server ID) and cinematic mode with letterbox bars
- Odometer when jg-vehiclemileage is running
- Exports for custom statuses (drunk, stress or anything else)

## Requirements

- [ox_lib](https://github.com/overextended/ox_lib)
- [oxmysql](https://github.com/overextended/oxmysql) (share codes)
- Qbox, QBCore or ESX (works standalone with fewer fields)
- Optional: pma-voice (voice range, talking and radio), esx_status (ESX hunger/thirst)

## Install

1. Put `vexxd_hud` in your resources folder.
2. Add `ensure vexxd_hud` to `server.cfg` after ox_lib, oxmysql and your framework.
3. Stop any other HUD (qbx_hud, qb-hud, esx_hud) so they don't draw on top of each other.
4. The share code table is created automatically on first start.

## Commands and keys

| What | Default |
|------|---------|
| Settings menu | `/hud` |
| Seatbelt | `B` |
| Cruise control | `Y` |
| Left / right signal | `Left` / `Right` arrow |
| Hazards | `Down` arrow |
| Waypoint to a postal | `/postal 123` (`/postal` clears it) |

Players can rebind keys in GTA Settings > Key Bindings > FiveM.

## Config

Everything is in `config.lua`.

- `Config.Defaults` sets the starting look for new players.
- `Config.Locks` locks a group so players can't change it.
- `Config.UpdateRate` controls how often game data is read.
- `Config.Seatbelt.enabled = false` if another script handles seatbelts. qbx_seatbelt is detected automatically and the HUD reads its state.
- The minimap frame lines itself up with the GTA map. If it's a few pixels off on your setup, nudge it with `Config.Minimap.adjust`.
- `Config.Postal.map` picks the postal set (`new`, `old` or `ocrp`). Use the one that matches the postal map your server streams.
- `Config.Minimap.movable` lets players move and resize the minimap in the layout editor. Set it to `false` to keep it in GTA's default spot.
- `Config.Crash.minG` sets how hard a hit has to be for the crash pulse.
- `Config.HideMinimapBars` hides GTA's health and armor bars under the map. Use `'off'` if you stream an edited `minimap.gfx`.

### jg-vehiclemileage

Detected automatically and shown as an odometer on the speedometer. Hide jg's own box so it doesn't draw over the HUD, either way works:

- Set `Config.ShowMileage = false` in jg-vehiclemileage's `config.lua` (mileage still tracks and saves), or
- In `jg-vehiclemileage/client/client.lua`, change `if GetResourceState("jg-hud") == "started" then` to `if GetResourceState("jg-hud") == "started" or GetResourceState("vexxd_hud") == "started" then`

### Round minimap

Works out of the box. The round mask texture ships in `stream/` (from ps-hud, GPL-3.0, see `licenses/`).

## Exports

```lua
exports.vexxd_hud:SetStatus('drunk', { icon = 'beer', color = '#f59e0b', value = 60, lowAt = 20 })
exports.vexxd_hud:RemoveStatus('drunk')
exports.vexxd_hud:SetVisible(false)
exports.vexxd_hud:IsVisible()
exports.vexxd_hud:IsSeatbeltOn()
exports.vexxd_hud:getPostal()
exports.vexxd_hud:getPostalDistance()
```

Server side: `TriggerClientEvent('vexxd_hud:client:setStatus', source, 'drunk', { value = 60 })`.

Icons available for custom statuses: `beer`, `flame`, `pill`, `bandage`, `bolt`, `droplet-half-2`, `heart`, `brain`, `alert-triangle`. Pass `svg` with your own markup to use any other icon.

## Supported

- Frameworks: Qbox, QBCore, ESX
- Voice: pma-voice
- Seatbelt: built in, or qbx_seatbelt
- Fuel: anything that sets the native fuel level (ox_fuel, LegacyFuel, cdn-fuel and most others)
- Notifications: vexxd_notify, ox_lib
- Mileage: jg-vehiclemileage (shown as an odometer on the speedometer)
- Weapon names: ox_inventory, QBCore, ESX
- Round minimap mask: from [ps-hud](https://github.com/Project-Sloth/ps-hud) (GPL-3.0, license in `licenses/`)
- Seatbelt sounds: from [qbx_seatbelt](https://github.com/Qbox-project/qbx_seatbelt) (GPL-3.0, license in `html/sounds/LICENSE`)
- Postal codes: data from [nearest-postal](https://github.com/DevBlocky/nearest-postal) (MIT, license in `data/postals/LICENSE`). If you also run nearest-postal you'll see two postal displays.

## License

[CC BY-NC-SA 4.0](LICENSE). Free to use and edit on your server. Don't sell it or reupload it as your own.

## 💎 Paid Scripts

Looking for more scripts? Check out the full collection of paid scripts available on my Tebex store!

🛒 [VEXXD SCRIPTS | Tebex Store](https://vexxd-scripts.tebex.store)
