# HUD

HUD and speedometer with an in-game settings menu, layout editor, profiles and share codes. Free and open source.

## Support

Join the Discord for support: https://discord.gg/TzNJ6Z92Y5

<img width="1920" height="1080" alt="hud11" src="https://github.com/user-attachments/assets/63aebefc-42d2-48e8-a67f-aee67630e5ba" />
<img width="1920" height="1080" alt="hud" src="https://github.com/user-attachments/assets/45f1d970-83f9-4388-a00b-926517bc3e63" />
<img width="1920" height="1080" alt="hud6" src="https://github.com/user-attachments/assets/88c26d3e-a5f9-4f00-8afa-948bdfd07e78" />
<img width="1920" height="1080" alt="hud7" src="https://github.com/user-attachments/assets/3d7825c5-cf66-4e93-bd97-af5024fbfe90" />
<img width="1920" height="1080" alt="hud8" src="https://github.com/user-attachments/assets/c80b8af8-acab-44d2-8c1a-5bae869be8fe" />
<img width="1920" height="1080" alt="hud9" src="https://github.com/user-attachments/assets/4f1f913f-e3e0-471a-a34e-b3418a76872f" />
<img width="1920" height="1080" alt="hud10" src="https://github.com/user-attachments/assets/28105859-ef91-4e17-ac2b-27ed9145f63b" />
<img width="1920" height="1080" alt="hud11" src="https://github.com/user-attachments/assets/720f6872-ccb3-4dea-a3c3-2309da7d93dd" />

## Features

- `/hud` settings menu, players set everything themselves (you can lock any group in the config)
- 3 themes and 5 status styles (gauges, slim, rings, bars, minimal)
- Speedometer styles per vehicle type: cars, electric, bikes, bicycles, boats, aircraft and trains
- Drag-and-drop layout editor with snapping, size and opacity per widget
- Profiles, plus share codes so players can copy each other's setup
- Settings save to your database, so players keep their setup on any PC
- Force any info element on or off for everyone from the config
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
- [oxmysql](https://github.com/overextended/oxmysql) (saved settings and share codes)
- Qbox, QBCore or ESX (works standalone with fewer fields)
- Optional: pma-voice (voice range, talking and radio), esx_status (ESX hunger/thirst)

## Install

1. Put `vexxd_hud` in your resources folder.
2. Add `ensure vexxd_hud` to `server.cfg` after ox_lib, oxmysql and your framework.
3. Stop any other HUD (qbx_hud, qb-hud, esx_hud) so they don't draw on top of each other.
4. The database tables are created automatically on first start. Players who already had settings saved on their PC keep them, they're moved to the database the first time they join.

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
- `Config.Elements` forces single elements (cash, bank, job, ID, time, voice, compass, street, postal, navigation, weapon) to `'show'` or `'hide'` for everyone. Leave it on `'player'` to let players choose. Forced ones show as "Set by server" in `/hud`.
- `Config.SaveSettings` is `'database'` (saved by license, follows the player to any PC) or `'local'` (saved on the player's PC only).
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
