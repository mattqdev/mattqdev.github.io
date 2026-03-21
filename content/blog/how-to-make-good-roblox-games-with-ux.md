---
title: "UX for Games: Why Your Simulator's First 30 Seconds Are Failing"
description: "Players join, get confused, and leave. Here's what I learned from 3.2 million visits on a Roblox simulator about FTUE, button placement, and the kind of 'juice' that keeps players engaged."
date: "2026-03-17"
tags: ["Game Dev", "Roblox", "UX", "Game Design", "FTUE", "Retention"]
cover: null
---

You've got a player. They clicked "Play." They waited through the loading screen. They spawned in.

You have about 30 seconds.

Not 30 seconds to impress them with your lore, your backstory, or your progression system. Thirty seconds to answer one question their brain is silently asking: **"Do I understand what I'm supposed to do?"**

If the answer is no, they leave. Not because your game is bad — but because friction kills curiosity faster than anything else.

I learned this the hard way building Brawl Stars Pet Simulator, which hit 3.2 million visits before a DMCA takedown. Here's what I'd tell myself at the start.

---

## What FTUE Actually Is (And Isn't)

**FTUE** stands for First Time User Experience. It's not the tutorial. It's not the popup that explains your game's mechanics.

FTUE is the _feeling_ a player has in the first 30–90 seconds. It's the gut-level read of: "Is this legible? Can I act? Is something happening?"

A good tutorial can't save a bad FTUE. Players don't read tutorials — they skip them. They click through them. They dismiss the modal and then wonder why they don't know what to do.

The goal isn't to _explain_. The goal is to make the right action **obvious without explanation**.

---

## The Three FTUE Killers

### 1. No Clear First Action

Players spawn in and see… everything. A map, some UI, some NPCs, a store. Nothing is calling to them. Nothing has a visual hierarchy that says "start here."

**Fix:** Design for a single, visually dominant first action. In Brawl Stars Pet Sim, the hatch machine had:

- A glowing animation (particles, pulsing outline)
- An arrow pointing to it for new players
- A coin pickup directly on the spawn path, so the first thing you did was collect — which filled your coin counter, which made the "Hatch" button light up

Players never had to _read_ what to do. They just walked and clicked what was glowing.

### 2. UI That Looks Like a Dashboard

New developers treat the game UI like an admin panel. Stats, counters, tabs, sub-menus — all visible at once.

Experienced players want data density. New players are overwhelmed by it.

**Fix:** Hide complexity behind progression. Show only what's relevant to the player's current stage:

- First 2 minutes: coin counter + hatch button
- After first hatch: pet inventory icon appears
- After 5 hatches: trading UI unlocks

This is called **progressive disclosure**. The UI literally grows with the player's understanding. They're never shown a tool they don't yet need.

### 3. Zero Feedback on Actions

Click a button. Nothing happens for 200ms. Then a number changes.

Players interpret silence as broken. If there's no immediate sensory response to an action, they either click again (causing bugs) or assume it didn't work and leave.

This is where **juice** comes in.

---

## Juice: Why Small Feedback Loops Change Everything

"Juice" is game developer slang for the layer of feedback that makes interactions feel alive. It's not a feature — it's the feeling that your game is _responsive_.

Juice elements include:

- **Screen shake** on impact or explosion
- **Scale pop** when a UI element appears (it overshoots, then settles)
- **Particle burst** when you collect a coin or earn a reward
- **Sound design** that matches the visual rhythm (a crisp "ding" when coins are earned)
- **Tween easing** on UI transitions instead of instant state changes

Here's a Roblox/Luau example of a simple scale pop on a button press:

```lua
local TweenService = game:GetService("TweenService")

local function popButton(button)
  local scaleUp = TweenService:Create(button, TweenInfo.new(0.1, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
    Size = button.Size + UDim2.new(0, 10, 0, 10)
  })
  local scaleDown = TweenService:Create(button, TweenInfo.new(0.08, Enum.EasingStyle.Quad, Enum.EasingDirection.In), {
    Size = button.Size
  })

  scaleUp:Play()
  scaleUp.Completed:Connect(function()
    scaleDown:Play()
  end)
end
```

That 180ms animation does more for perceived quality than a week of feature work. The player _feels_ the game responding to them.

---

## Button Placement That Works

Thumb-zone design matters on mobile — and on Roblox, mobile is a massive segment of your playerbase.

The safe thumb zone for mobile is the **bottom-center and bottom-right** of the screen. That's where buttons for primary actions should live.

**Hierarchy by position:**

- **Bottom center:** Most used action (hatch, collect, primary CTA)
- **Bottom right:** Secondary actions (inventory, upgrades)
- **Top right:** Settings, close buttons — places players rarely tap by accident
- **Top left:** Navigation tabs or map

Avoid placing important actions at the top of the screen on mobile. Players' thumbs don't reach there comfortably, and they'll drop their phone or make errors.

---

## The Quiet Tutorial: Environmental Storytelling

The best tutorials are the ones players don't notice.

Instead of a popup that says "Collect coins to hatch pets," you design the spawn area so that:

1. Coins are visually distinct and animated (they glow, spin, or have a magnet effect)
2. They're placed directly on the path every new player walks
3. The hatch machine is visible from spawn, has a particle effect, and is the most visually prominent object in the scene

Players don't need to be _told_ to collect coins if collecting coins is the only satisfying thing in their immediate environment.

This is environmental storytelling applied to game design. Guide through placement, not explanation.

---

## Measuring It: The 1-Minute Retention Metric

Once you're live, track what percentage of players who join are still in your game after 60 seconds. In Roblox Analytics, this is your **D0 retention** broken down by session length.

If you're losing 60%+ in the first minute, your FTUE is broken. Fix that before any other feature.

The things that move 1-minute retention:

- Reduced spawn lag (fast initial load)
- Clear first action visible from spawn
- Sound and visual feedback on the first interaction
- A micro-reward in the first 15 seconds (something drops, something hatches, something levels up)

That last one is key. Give players a _win_ before they have time to feel lost. It reframes the entire experience.

---

## The 30-Second Checklist

Before you ship, playtest your game with someone who has never seen it. Watch them — don't explain anything. After 30 seconds, ask:

- [ ] Did they know what to do first without being told?
- [ ] Did they click something and get immediate feedback?
- [ ] Did they receive some kind of reward or progression in under 30 seconds?
- [ ] Did they feel like they were playing, not reading?

If any answer is no, the UI is the problem — not the player.

---

I've written more about the systems behind Brawl Stars Pet Simulator [here](/how-i-got-3m-visits-roblox). If you build games, find everything else I've shipped at [my portfolio](/).
