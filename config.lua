Config = {}

-- Command that opens the HUD settings menu.
Config.Command = 'hud'

-- Defaults for players who haven't changed anything yet.
-- Anything you leave out uses the built-in default.
Config.Defaults = {
    theme = 'instrument',        -- 'instrument', 'float' or 'panel'
    unit = 'mph',                -- 'mph' or 'kmh'
    statusStyle = 'gauges',      -- 'gauges', 'slim', 'rings', 'bars' or 'minimal'
    vehicle = {
        car = { speedo = 'dial' },   -- 'dial' (instrument), 'tech', 'analog', 'cluster', 'apex', 'linear' or 'hud' (windshield)
        ev = { speedo = 'dial' },
        bike = { speedo = 'linear' },
    },
    fuelDisplay = 'percent',     -- 'percent' or 'range'
    mapShape = 'square',         -- 'square' or 'circle'
    mapOnFoot = true,
    autoHide = true,             -- hide stats while they're full
    shiftLight = true,
    crashPulse = true,
    colors = { accent = '#ef4444' },
}

-- Lock a setting group so players can't change it (it stays at the default above).
Config.Locks = {
    theme = false,
    speedo = false,
    unit = false,
    statusStyle = false,
    colors = false,
    layout = false,
    map = false,
    info = false,
}

-- Force parts of the HUD on or off for everyone. Forced ones are locked in the /hud menu.
-- 'player' lets each player choose, 'show' always shows it, 'hide' always hides it.
Config.Elements = {
    cash = 'player',
    bank = 'player',
    job = 'player',
    id = 'player',
    time = 'player',
    voice = 'player',
    compass = 'player',
    street = 'player',
    postal = 'player',
    navigation = 'player',
    weapon = 'player',
}

-- Where player settings and profiles are saved.
-- 'database' saves them to your database by license, so they follow the player to any PC.
-- 'local' keeps them on the player's PC only.
Config.SaveSettings = 'database'

-- How often the HUD reads game data, in milliseconds. Lower = smoother, higher = cheaper.
Config.UpdateRate = {
    vehicle = 100,
    status = 250,
    location = 1000,
    heading = 50,
}

Config.Seatbelt = {
    enabled = true,              -- set false if another script handles seatbelts (qbx_seatbelt is detected automatically)
    key = 'B',
    ejectSpeedUnbuckled = 25,    -- mph, speed of impact that throws you through the windshield
    ejectSpeedBuckled = 160,
    blockExitWhenBuckled = true, -- must unbuckle before leaving the vehicle
    sounds = true,               -- buckle / unbuckle click
    warning = true,              -- warning chime and on-screen prompt while driving unbuckled
    warningSpeed = 10,           -- mph, the warning starts above this speed
}

Config.Postal = {
    enabled = true,
    map = 'new',                 -- 'new', 'old' or 'ocrp' (match the postal map your server streams)
    command = 'postal',          -- /postal 123 sets a waypoint, /postal on its own clears it
}

Config.Crash = {
    enabled = true,
    minG = 4.0,                  -- how hard a hit has to be (in g) to trigger the crash pulse
}

Config.Cruise = {
    enabled = true,
    key = 'Y',
}

Config.Indicators = {
    enabled = true,
    left = 'LEFT',
    right = 'RIGHT',
    hazards = 'DOWN',
}

Config.Navigation = {
    enabled = true,
    distanceScale = 0.1,         -- GTA reports distance to the next turn in tenths of a meter
}

-- Stress. Goes up from shooting and speeding, and other scripts can raise or lower it
-- with the usual hud:server:GainStress / hud:server:RelieveStress events.
-- Turns itself off when qbx_hud or qb-hud is running. Set enabled = false if another script handles stress.
-- Qbox and QBCore keep stress in player metadata. ESX keeps it in the vexxd_hud_stress table.
Config.Stress = {
    enabled = true,
    notify = true,                   -- "You feel more stressed" / "You feel more relaxed"
    noGainJobs = { 'police', 'sheriff' }, -- these jobs never gain stress
    noGainJobTypes = { 'leo' },      -- Qbox / QBCore job types that never gain stress

    shooting = {
        enabled = true,
        chance = 0.1,                -- chance per shot (0.1 = 10%)
        amount = { 1, 5 },           -- stress added, random between these
        ignore = { `WEAPON_PETROLCAN`, `WEAPON_HAZARDCAN`, `WEAPON_FIREEXTINGUISHER` },
    },

    speeding = {
        enabled = true,
        buckled = false,             -- mph to start gaining stress with a seatbelt on, false = never
        unbuckled = 50,              -- mph to start gaining stress without a seatbelt, false = never
        amount = { 1, 3 },
        every = 10,                  -- seconds between checks while driving that fast
    },

    -- Blur and camera shake that come more often the higher stress gets.
    effects = {
        enabled = true,
        shake = 0.08,                -- camera shake strength
        ragdollAtMax = true,         -- at 100 stress the player stumbles and falls when on foot
        levels = {
            { min = 50, every = { 50, 60 }, blur = 1500 }, -- every = seconds between effects, blur = ms
            { min = 60, every = { 40, 50 }, blur = 2000 },
            { min = 70, every = { 30, 40 }, blur = 2500 },
            { min = 80, every = { 20, 30 }, blur = 2700 },
            { min = 90, every = { 15, 20 }, blur = 3000 },
        },
    },
}

-- Hides GTA's own health/armor bars under the minimap.
-- 'lua' runs a small per-frame call while the map is visible.
-- 'off' if you stream an edited minimap.gfx instead (no per-frame cost).
Config.HideMinimapBars = 'lua'

-- Minimap frame position on a 1080p screen, in pixels from the bottom-left corner.
-- Adjust once so the frame lines up with the GTA minimap on your server.
Config.Minimap = {
    movable = true,              -- players can move and resize the minimap in the layout editor
    adjust = { x = 0, y = 0, w = 0, h = 0 }, -- nudge the frame around the GTA map in pixels (1080p scale) if it's off
    circleSize = 0.85,           -- size of the round minimap, 1.0 = full size
    circleTexture = 'vexxd_circlemap', -- texture dictionary for the round mask (ships in stream/)
}

-- Models treated as electric when the game build can't tell (game builds before 3258).
Config.ElectricModels = {
    'voltic', 'voltic2', 'cyclone', 'cyclone2', 'neon', 'raiden', 'tezeract', 'imorgon', 'dilettante', 'dilettante2',
    'surge', 'khamelion', 'caddy', 'caddy2', 'caddy3', 'airtug', 'iwagen', 'omnisegt', 'virtue', 'powersurge', 'teslax',
}

-- Short share codes for HUD layouts (needs oxmysql).
Config.ShareCodes = true
