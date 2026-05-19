---
title: "How to Build a Finite State Machine in Luau (With Real Roblox NPC Examples)"
description: "If/else chains don't scale. Here's how to architect clean, debuggable NPC behavior using a finite state machine in Luau strict mode — with real code from a shipped multiplayer shooter."
date: "2026-05-19"
tags: ["Roblox Studio", "Luau", "Game Dev", "AI", "Architecture", "NPC"]
cover: null
---

You build an NPC. It starts simple — patrol, detect player, chase. Fine. Then you add shooting. Then a retreat state when health is low. Then a search state when the player hides. Then a cover-seeking behavior. Then different behavior near teammates.

By the time you're done, you have 300 lines of nested `if` statements, a `currentState` variable tracked in four different places, and a bug where the NPC sometimes shoots while patrolling because a boolean somewhere wasn't cleared correctly.

This is the spaghetti state problem. The fix is a **Finite State Machine** (FSM) — and once you understand how to build one cleanly in Luau, you'll wonder how you ever shipped AI without one.

---

## What a Finite State Machine Actually Is

An FSM is a system where your entity can be in exactly **one state at a time**, with explicit, named **transitions** between states triggered by defined **events or conditions**.

For an NPC, that might look like:

```
IDLE ──(sees player)──► CHASE ──(in range)──► ATTACK
  ▲                        │                      │
  │                        │ (loses sight)         │ (health < 30%)
  │                        ▼                      ▼
  └────────────────── SEARCH              RETREAT
```

Every arrow is a transition. Every box is a state. The machine is always in exactly one box. No ambiguity. No forgotten boolean. No "wait why is it shooting while patrolling."

The key rule: **state-specific logic lives only in that state.** The attack logic doesn't run when the NPC is patrolling. The retreat logic doesn't run when idle. This isolation is what makes FSMs debuggable.

---

## The Architecture: A Clean Luau FSM

We'll build a reusable FSM module first, then use it in a concrete NPC implementation. All code uses **Luau strict mode** with type annotations.

### The Core FSM Module

```lua
--!strict
-- ReplicatedStorage/Shared/StateMachine.lua

export type StateHandler = {
    onEnter: ((self: StateMachine, previousState: string?) -> ())?,
    onUpdate: ((self: StateMachine, dt: number) -> ())?,
    onExit: ((self: StateMachine, nextState: string?) -> ())?,
}

export type StateMachine = {
    _states: { [string]: StateHandler },
    _current: string?,
    _previous: string?,
    addState: (self: StateMachine, name: string, handler: StateHandler) -> (),
    transition: (self: StateMachine, newState: string) -> (),
    update: (self: StateMachine, dt: number) -> (),
    getState: (self: StateMachine) -> string?,
}

local StateMachine = {}
StateMachine.__index = StateMachine

function StateMachine.new(): StateMachine
    local self = setmetatable({}, StateMachine) :: StateMachine
    self._states = {}
    self._current = nil
    self._previous = nil
    return self
end

function StateMachine:addState(name: string, handler: StateHandler)
    self._states[name] = handler
end

function StateMachine:transition(newState: string)
    assert(self._states[newState], `StateMachine: Unknown state '{newState}'`)

    if self._current == newState then return end

    -- Exit current state
    local currentHandler = self._states[self._current or ""]
    if currentHandler and currentHandler.onExit then
        currentHandler.onExit(self, newState)
    end

    self._previous = self._current
    self._current = newState

    -- Enter new state
    local nextHandler = self._states[newState]
    if nextHandler and nextHandler.onEnter then
        nextHandler.onEnter(self, self._previous)
    end
end

function StateMachine:update(dt: number)
    local handler = self._states[self._current or ""]
    if handler and handler.onUpdate then
        handler.onUpdate(self, dt)
    end
end

function StateMachine:getState(): string?
    return self._current
end

return StateMachine
```

This module is 50 lines and handles the entire lifecycle. `addState` registers a state. `transition` runs the exit/enter hooks and updates the current state. `update` ticks the current state's logic. That's the whole API.

---

## Building an NPC With the FSM

Now the NPC handler. This uses an 8-state FSM based on a real implementation from a shipped Roblox multiplayer shooter:

```lua
--!strict
-- ServerScriptService/BotHandler.lua

local StateMachine = require(game.ReplicatedStorage.Shared.StateMachine)
local PathfindingService = game:GetService("PathfindingService")
local RunService = game:GetService("RunService")

-- Type for our bot's context data, passed around between states
type BotContext = {
    model: Model,
    humanoid: Humanoid,
    rootPart: BasePart,
    target: Player?,
    lastKnownPosition: Vector3?,
    health: number,
    fsm: StateMachine.StateMachine,
}

local DETECTION_RANGE = 60
local ATTACK_RANGE = 20
local RETREAT_HEALTH_THRESHOLD = 0.3  -- 30% health

local function getClosestPlayer(rootPart: BasePart): (Player?, number)
    local closest: Player? = nil
    local closestDist = math.huge

    for _, player in game.Players:GetPlayers() do
        local char = player.Character
        if not char then continue end
        local root = char:FindFirstChild("HumanoidRootPart") :: BasePart?
        if not root then continue end

        local dist = (rootPart.Position - root.Position).Magnitude
        if dist < closestDist then
            closest = player
            closestDist = dist
        end
    end

    return closest, closestDist
end

local function createBot(spawnCFrame: CFrame): BotContext
    -- Assume the bot model is already in workspace
    local model = workspace.Bots:FindFirstChild("Bot") :: Model
    local humanoid = model:WaitForChild("Humanoid") :: Humanoid
    local rootPart = model:WaitForChild("HumanoidRootPart") :: BasePart

    local ctx: BotContext = {
        model = model,
        humanoid = humanoid,
        rootPart = rootPart,
        target = nil,
        lastKnownPosition = nil,
        health = 100,
        fsm = StateMachine.new(),
    }

    -- ── STATE: IDLE ──────────────────────────────────────────────────────────
    ctx.fsm:addState("Idle", {
        onEnter = function(fsm, prev)
            humanoid:MoveTo(rootPart.Position) -- stop moving
        end,

        onUpdate = function(fsm, dt)
            local player, dist = getClosestPlayer(rootPart)
            if player and dist <= DETECTION_RANGE then
                ctx.target = player
                fsm:transition("Chase")
            end
        end,
    })

    -- ── STATE: PATROL ────────────────────────────────────────────────────────
    -- (simplified: moves between two fixed waypoints)
    local patrolPoints = { Vector3.new(0, 0, 0), Vector3.new(50, 0, 0) }
    local patrolIndex = 1

    ctx.fsm:addState("Patrol", {
        onEnter = function(fsm, prev)
            humanoid:MoveTo(patrolPoints[patrolIndex])
        end,

        onUpdate = function(fsm, dt)
            -- Check for player detection
            local player, dist = getClosestPlayer(rootPart)
            if player and dist <= DETECTION_RANGE then
                ctx.target = player
                fsm:transition("Chase")
                return
            end

            -- Advance waypoint when close enough
            if (rootPart.Position - patrolPoints[patrolIndex]).Magnitude < 4 then
                patrolIndex = (patrolIndex % #patrolPoints) + 1
                humanoid:MoveTo(patrolPoints[patrolIndex])
            end
        end,
    })

    -- ── STATE: CHASE ─────────────────────────────────────────────────────────
    ctx.fsm:addState("Chase", {
        onEnter = function(fsm, prev)
            humanoid.WalkSpeed = 18 -- faster when chasing
        end,

        onUpdate = function(fsm, dt)
            if not ctx.target or not ctx.target.Character then
                ctx.fsm:transition("Search")
                return
            end

            local targetRoot = ctx.target.Character:FindFirstChild("HumanoidRootPart") :: BasePart?
            if not targetRoot then
                ctx.fsm:transition("Search")
                return
            end

            local dist = (rootPart.Position - targetRoot.Position).Magnitude

            -- Lost sight (too far)
            if dist > DETECTION_RANGE * 1.5 then
                ctx.lastKnownPosition = targetRoot.Position
                ctx.fsm:transition("Search")
                return
            end

            -- In attack range
            if dist <= ATTACK_RANGE then
                ctx.fsm:transition("Attack")
                return
            end

            -- Health critical
            if ctx.health / 100 <= RETREAT_HEALTH_THRESHOLD then
                ctx.fsm:transition("Retreat")
                return
            end

            humanoid:MoveTo(targetRoot.Position)
            ctx.lastKnownPosition = targetRoot.Position
        end,

        onExit = function(fsm, next)
            humanoid.WalkSpeed = 14 -- reset speed
        end,
    })

    -- ── STATE: ATTACK ────────────────────────────────────────────────────────
    local attackCooldown = 0
    local ATTACK_INTERVAL = 1.2

    ctx.fsm:addState("Attack", {
        onEnter = function(fsm, prev)
            humanoid:MoveTo(rootPart.Position) -- stand still while attacking
        end,

        onUpdate = function(fsm, dt)
            attackCooldown -= dt

            if not ctx.target or not ctx.target.Character then
                ctx.fsm:transition("Search")
                return
            end

            local targetRoot = ctx.target.Character:FindFirstChild("HumanoidRootPart") :: BasePart?
            if not targetRoot then
                ctx.fsm:transition("Search")
                return
            end

            local dist = (rootPart.Position - targetRoot.Position).Magnitude

            -- Target moved out of range
            if dist > ATTACK_RANGE * 1.2 then
                ctx.fsm:transition("Chase")
                return
            end

            -- Health critical — retreat
            if ctx.health / 100 <= RETREAT_HEALTH_THRESHOLD then
                ctx.fsm:transition("Retreat")
                return
            end

            -- Fire
            if attackCooldown <= 0 then
                attackCooldown = ATTACK_INTERVAL
                -- Your shooting logic here (cast ray, deal damage, play VFX)
                print("Bot fires at", ctx.target.Name)
            end
        end,
    })

    -- ── STATE: RETREAT ───────────────────────────────────────────────────────
    ctx.fsm:addState("Retreat", {
        onEnter = function(fsm, prev)
            humanoid.WalkSpeed = 20
        end,

        onUpdate = function(fsm, dt)
            -- Move away from the target
            if ctx.target and ctx.target.Character then
                local targetRoot = ctx.target.Character:FindFirstChild("HumanoidRootPart") :: BasePart?
                if targetRoot then
                    local awayDir = (rootPart.Position - targetRoot.Position).Unit
                    local retreatTarget = rootPart.Position + awayDir * 40
                    humanoid:MoveTo(retreatTarget)
                end
            end

            -- Once far enough or health recovers (e.g. from a regen system), return to idle
            local _, dist = getClosestPlayer(rootPart)
            if dist > DETECTION_RANGE * 2 then
                ctx.fsm:transition("Idle")
            end
        end,

        onExit = function(fsm, next)
            humanoid.WalkSpeed = 14
        end,
    })

    -- ── STATE: SEARCH ────────────────────────────────────────────────────────
    local searchTimer = 0
    local SEARCH_DURATION = 8 -- seconds to search before giving up

    ctx.fsm:addState("Search", {
        onEnter = function(fsm, prev)
            searchTimer = SEARCH_DURATION
            if ctx.lastKnownPosition then
                humanoid:MoveTo(ctx.lastKnownPosition)
            end
        end,

        onUpdate = function(fsm, dt)
            searchTimer -= dt

            -- Check if player re-enters detection range
            local player, dist = getClosestPlayer(rootPart)
            if player and dist <= DETECTION_RANGE then
                ctx.target = player
                ctx.fsm:transition("Chase")
                return
            end

            -- Give up and return to patrol
            if searchTimer <= 0 then
                ctx.target = nil
                ctx.lastKnownPosition = nil
                ctx.fsm:transition("Patrol")
            end
        end,
    })

    -- ── STATE: DEAD ──────────────────────────────────────────────────────────
    ctx.fsm:addState("Dead", {
        onEnter = function(fsm, prev)
            humanoid.WalkSpeed = 0
            -- Play death animation, drop coins, queue respawn
            print("Bot died.")
        end,
    })

    -- Wire up health to the Dead state
    humanoid.Died:Connect(function()
        ctx.fsm:transition("Dead")
    end)

    humanoid.HealthChanged:Connect(function(health)
        ctx.health = health
    end)

    -- Start the FSM
    ctx.fsm:transition("Idle")

    return ctx
end

-- ── MAIN UPDATE LOOP ─────────────────────────────────────────────────────────
local activeBots: { BotContext } = {}
-- (spawn and add bots to activeBots as needed)

RunService.Heartbeat:Connect(function(dt)
    for _, bot in activeBots do
        if bot.fsm:getState() ~= "Dead" then
            bot.fsm:update(dt)
        end
    end
end)
```

---

## Why This Architecture Pays Off

**Debugging is trivial.** To trace any NPC bug, you just log `fsm:getState()` and watch the transition sequence. There's no "why is this boolean set" — there's only "what state is it in and what triggered the transition."

**Adding states doesn't break existing ones.** Need a "Stunned" state that pauses everything for 2 seconds? Add it. It won't touch Chase, Attack, or Retreat.

**Testing individual states is straightforward.** You can force `fsm:transition("Attack")` in Studio to test attack behavior without having to simulate the player detection sequence.

**The pattern transfers.** FSMs are a universal game-engine concept. The Luau syntax is different from Unity's C# or Unreal's Blueprint, but the state/transition/update model is identical. Learning it here means you already know it everywhere.

---

## When to Use an FSM vs. a Behavior Tree

FSMs work well for AI with:
- A small number of clearly-defined states (2–10)
- Clear, single triggers for transitions
- Simple NPC archetypes (guard, shooter, patrol bot)

**Behavior trees** are better when:
- You have complex priority hierarchies ("attack if healthy, but always take cover first")
- You want composable, reusable sub-behaviors
- Your NPC has 15+ states

For most Roblox games, an FSM handles everything you need. When you find yourself creating an FSM with 20+ states and dozens of transitions, that's the signal to graduate to a behavior tree.

---

## Extending the Pattern: FSM + Difficulty Presets

One pattern that works well in multiplayer games is driving FSM parameters from a difficulty config:

```lua
type DifficultyPreset = {
    detectionRange: number,
    walkSpeed: number,
    attackInterval: number,
    retreatThreshold: number,
}

local DIFFICULTIES: { [string]: DifficultyPreset } = {
    Easy = {
        detectionRange = 40,
        walkSpeed = 10,
        attackInterval = 2.0,
        retreatThreshold = 0.15,
    },
    Normal = {
        detectionRange = 60,
        walkSpeed = 14,
        attackInterval = 1.2,
        retreatThreshold = 0.30,
    },
    Hard = {
        detectionRange = 80,
        walkSpeed = 20,
        attackInterval = 0.7,
        retreatThreshold = 0.50,
    },
}
```

Pass the selected preset into `createBot` and use its values instead of hardcoded constants. Now your entire AI difficulty scales from a single config object with no changes to state logic.

---

The FSM module above is production-ready and can be dropped into any Roblox project. For more patterns on Roblox game architecture, see [how to write production Luau code](/blog/how-to-write-code-like-a-pro-roblox-studio) and [protecting player data with ProfileService](/blog/profileservice-vs-datastore2-roblox-studio).
