# HUD

HUD and speedometer with an in-game settings menu, layout editor, profiles and share codes. Free and open source.
<img width="2560" height="1440" alt="hudpreset" src="https://github.com/user-attachments/assets/4af76000-1e81-499e-93b5-3e06e3058438" />
<img width="2560" height="1440" alt="hudspeedometer" src="https://github.com/user-attachments/assets/ef0f74ab-9e4e-42ec-97a4-0d7d6e39e65a" />
<img width="2555" height="1440" alt="hudspeedometer1" src="https://github.com/user-attachments/assets/7414b348-82d1-45ca-9930-bb0439abefc2" />
<img width="2560" height="1440" alt="hudspeedometer2" src="https://github.com/user-attachments/assets/555db5cf-5ed4-4083-ad92-53897fc789d2" />
<img width="2560" height="1440" alt="hudspeedometer3" src="https://github.com/user-attachments/assets/b9830841-3b29-4db8-b3a5-08152651c160" />
<img width="2553" height="1440" alt="hudspeedometer4" src="https://github.com/user-attachments/assets/5307796e-96f9-4d5c-8a50-3f349c4cba8c" />
<img width="2560" height="1440" alt="hudlookstatus" src="https://github.com/user-attachments/assets/6728fa5b-5ec9-4583-92a6-dd81d08dc67b" />
<img width="2561" height="1440" alt="hudmapnav" src="https://github.com/user-attachments/assets/85b0085f-80e6-4252-b354-b41f8b8bc9c3" />
<img width="2562" height="1440" alt="hudplayerinfo" src="https://github.com/user-attachments/assets/378c0ac1-6246-4482-860d-d95065ec66e7" />
<img width="2560" height="1440" alt="hudcolors" src="https://github.com/user-attachments/assets/68610743-c6ff-4b18-ae96-5fbab5ccf69f" />
<img width="2562" height="1440" alt="hudlayout" src="https://github.com/user-attachments/assets/8e4769e8-12fc-4986-ad7b-78e8e29613eb" />
<img width="2557" height="1440" alt="hudprofiles" src="https://github.com/user-attachments/assets/cf8b4bbe-2172-4625-9b0b-1fbb10615a82" />
<img width="2548" height="1440" alt="hudmodes" src="https://github.com/user-attachments/assets/b9dec2e0-4afb-44cb-850c-502d564b2779" />
<img width="2554" height="1440" alt="hudpresetexample" src="https://github.com/user-attachments/assets/3c2756bb-12be-4022-8082-9c28262102bc" />
<img width="2560" height="1440" alt="hudpresetexample1" src="https://github.com/user-attachments/assets/1024d65e-1227-4824-9cd2-125f0741fc7f" />
<img width="2565" height="1440" alt="hudpresetexample2" src="https://github.com/user-attachments/assets/4e186ca8-5f0d-4064-8eb4-332bbb467d12" />
<img width="2560" height="1440" alt="hudpresetexample3" src="https://github.com/user-attachments/assets/8981abec-b572-4213-8ad5-ed96edc4aef9" />
<img width="2560" height="1440" alt="hudpresetexample4" src="https://github.com/user-attachments/assets/185c89dc-a2cc-4451-9d50-b744d37b5c33" />

## Support

Join the Discord for support: https://discord.gg/TzNJ6Z92Y5

## Features

- `/hud` settings menu, players set everything themselves (you can lock any group in the config)
- 20 one-click presets that set the speedometer, finish, status style, font and colors together
- 25 speedometers to pick per vehicle type (car, electric, motorcycle), plus bicycle, boat, aircraft and train displays
- 9 speedometer finishes: default, dark, glass, light, carbon, brushed metal, frosted, neon edge and wood
- Speedometer options: needle style, tick marks, show or hide RPM, fuel, gear and warning lights, glow on or off
- Speedometer colors: needle, face, numbers and outer glow, or leave them on Auto
- 3 themes, 13 status styles and 4 status layouts (row, column, grid or stacked next to the minimap)
- 14 number fonts and 18 color presets
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
- Stress from shooting and speeding, with blur and camera shake at high stress
- Exports for custom statuses (drunk or anything else)

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
- `Config.Stress` sets how stress is gained, which jobs never gain it, and the blur and shake effects. Set `enabled = false` if another script handles stress.
- `Config.HideGameAmmo` hides GTA's own weapon icon and ammo count while a weapon is out. Set it to `false` if another script already does this.
- `Config.HideMinimapBars` hides GTA's health and armor bars under the map. Use `'off'` if you stream an edited `minimap.gfx`.

### jg-vehiclemileage

Detected automatically and shown as an odometer on the speedometer. Hide jg's own box so it doesn't draw over the HUD, either way works:

- Set `Config.ShowMileage = false` in jg-vehiclemileage's `config.lua` (mileage still tracks and saves), or
- In `jg-vehiclemileage/client/client.lua`, change `if GetResourceState("jg-hud") == "started" then` to `if GetResourceState("jg-hud") == "started" or GetResourceState("vexxd_hud") == "started" then`

### Stress

Built in, so you don't lose stress when you remove qbx_hud or qb-hud. If either of those is still running, the HUD leaves stress to it.

- Shooting has a chance to add stress on each shot. Fuel cans and fire extinguishers don't count.
- Driving over the speed limit in `Config.Stress.speeding` adds stress every few seconds. Boats, aircraft, bicycles and trains don't count.
- Jobs in `noGainJobs` (and Qbox / QBCore job types in `noGainJobTypes`) never gain stress.
- Scripts that already use `hud:server:GainStress` and `hud:server:RelieveStress` (food, drinks, smoking and so on) keep working.
- Qbox and QBCore save stress in player metadata like their own HUDs do. ESX saves it in the `vexxd_hud_stress` table, created on first start.

Server exports:

```lua
exports.vexxd_hud:GetStress(source)
exports.vexxd_hud:SetStress(source, 50)
exports.vexxd_hud:AddStress(source, 10)
exports.vexxd_hud:RemoveStress(source, 10)
```

### Round minimap

Works out of the box. The round mask texture ships in `stream/` (from ps-hud, GPL-3.0, see `licenses/`).

## Translations

Comes in English, Spanish, French, German and Portuguese. Set the language in your `server.cfg`:

```
setr ox:locale es
```

Use `en`, `es`, `fr`, `de` or `pt-br` (`pt` works too). To add another language, copy `locales/en.json`, translate it and name it after the language code.

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
