---
title: "Why Does My Roblox Game Get Slower Over Time? Memory Leaks in Luau"
description: "If your server lags after 30 minutes, you probably have leaked connections. Here's how to find them and clean them up."
date: "2026-08-24"
tags: ["Roblox", "Luau", "Performance", "Optimization"]
cover: null
---

Your game runs perfectly for the first 10 minutes. After an hour, servers stutter and memory keeps climbing. Nothing looks broken.

> **Quick answer:** You're creating event connections and never disconnecting them. Every leaked connection keeps running (and keeps its data alive) forever.

---

## What is a leaked connection?

Every `:Connect()` returns a connection object. If the thing you connected to lives longer than your logic, the connection stays alive.

```lua
-- ❌ Runs every time a player spawns
local function onCharacterAdded(character)
    RunService.Heartbeat:Connect(function()
        updateHealthBar(character)
    end)
end
```

`RunService.Heartbeat` lives forever. When the character dies, that function keeps firing every frame for a character that no longer exists. After 50 respawns, you have 50 loops running for nothing.

---

## Fix 1: Store and disconnect

```lua
local function onCharacterAdded(character)
    local connection
    connection = RunService.Heartbeat:Connect(function()
        updateHealthBar(character)
    end)

    character.Humanoid.Died:Once(function()
        connection:Disconnect()
    end)
end
```

Rule of thumb: **if you connect to something global, you must disconnect.** Global means `RunService`, `UserInputService`, `Players`, `Workspace`, and so on.

---

## Fix 2: Use `Once` when you only need one event

```lua
-- Disconnects itself after the first call
button.Activated:Once(function()
    startGame()
end)
```

---

## Fix 3: Clean up per-player tables

A very common leak: a table indexed by player that never gets cleared.

```lua
local cooldowns = {}

Players.PlayerRemoving:Connect(function(player)
    cooldowns[player] = nil
end)
```

Without that, the `Player` object (and everything inside it) can never be garbage collected.

---

## Fix 4: Group connections in a cleanup list

When you have many, track them together.

```lua
local connections = {}

table.insert(connections, RunService.Heartbeat:Connect(update))
table.insert(connections, UserInputService.InputBegan:Connect(onInput))

local function cleanup()
    for _, conn in connections do
        conn:Disconnect()
    end
    table.clear(connections)
end
```

Libraries like **Janitor** and **Trove** do exactly this with extra features, if you'd rather not roll your own.

---

## Good news: `Destroy()` helps

Calling `:Destroy()` on an instance disconnects all connections to **that instance's own events**. So connecting to `part.Touched` and then destroying the part is fine. The leaks come from connecting to _other_ objects that outlive your logic.

---

## How to spot leaks

- Open the **Developer Console** (F9) → **Memory** tab and watch whether it keeps growing in a long test.
- Look at **Scripts** activity: a script with rising activity and no reason for it is usually a leaked loop.
- Search your code for `Heartbeat:Connect`, `RenderStepped:Connect` and `InputBegan:Connect` inside functions that run more than once.

---

## Checklist

- ✅ Every global `:Connect()` has a matching `:Disconnect()`
- ✅ One-shot events use `:Once()`
- ✅ Tables keyed by player are cleared on `PlayerRemoving`
- ✅ Character-related connections die with the character
