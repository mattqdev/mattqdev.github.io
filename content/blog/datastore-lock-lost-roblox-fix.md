---
title: "DataStore Lock Lost in Roblox: What It Means and How to Fix It"
description: "Kicked with 'DataStore lock lost, please rejoin the game'? Here's what the message means, whether your progress is gone, and how developers fix it."
date: "2026-09-25"
tags: ["Roblox", "Luau", "DataStore", "ProfileStore", "Debugging", "Game Dev"]
cover: null
---

You were playing, and suddenly a message appears: **"DataStore lock lost. Please rejoin the game."** Then you're kicked.

If you're a player, you want to know if your progress is gone. If you're a developer, you want to know why your game is doing this to people. This article answers both.

**The short answer:** _DataStore lock lost_ is not an official Roblox error. It's a message written by the game's developer, or by the data module the game uses. It means the server you were playing on **lost the exclusive right to save your data**, so the game kicked you to stop two servers from overwriting each other's saves. In most cases your progress is not deleted.

---

## What does "DataStore lock lost" mean in Roblox?

Roblox's `DataStoreService` doesn't have an error called "lock lost". You won't find it in the Roblox docs or in the numbered DataStore error codes. The text comes from the game's own code.

Here is what happens behind the scenes. Most serious Roblox games use **session locking**. When you join a server, the game writes a marker to your save that says "this player's data belongs to server X right now". While that marker is in place, no other server is allowed to load or save your data.

**The lock is lost** when that ownership is taken away or can no longer be confirmed. This can happen when:

- Another server started a session for your account (you joined the game a second time)
- The server couldn't talk to Roblox's data services for too long (an outage or throttling)
- The session ended because the server was closing

At that point the server can't safely write your data anymore, so the game **kicks you on purpose**. It's the game protecting your save, not destroying it. If the server kept playing with stale data and saved it later, it could overwrite your newer progress.

---

## What does "please rejoin the game" mean? Is my progress gone?

Usually, **no**. The kick exists precisely so your saved data stays intact.

What you can lose is the progress made **since the last save**. Many games only auto-save every few minutes. ProfileStore, for example, defaults to a 300-second auto-save interval. So the last few minutes of coins, XP or items might not have been written.

Here is what to do as a player:

1. **Rejoin the game.** That's what the message asks, and it works most of the time.
2. **If it says the data is still loading, wait a minute or two** and try again. The old server may still be releasing your data.
3. **Don't play the same game on two devices** with the same account at the same time. That's the #1 cause.
4. **Don't rejoin 10 times in a row.** Each attempt can create a new session conflict.
5. **Check [status.roblox.com](https://status.roblox.com)** if other games kick you too. It may be a Roblox-side issue.
6. **If it keeps happening in only one game**, report it to the developer. It's a bug in their data code. Give them your username, the time it happened, and what you were doing.

---

## Why does DataStore lock lost keep happening?

For players, the common triggers are:

| Cause                            | What happened                                                           |
| -------------------------------- | ----------------------------------------------------------------------- |
| Joined from two devices          | The second join took the lock from the first                            |
| Teleported between places        | The new server asked for your data before the old one released it       |
| Rejoined very fast after leaving | The old server hadn't finished saving yet                               |
| Bad connection                   | The server couldn't renew or confirm the lock                           |
| Roblox outage or throttling      | DataStore or MemoryStore requests failed for everyone                   |
| Bug in the game                  | The developer's code releases the session too early or handles it badly |

If it happens to you in every server of one game, and other games are fine, it's almost certainly the developer's code.

---

## How to fix "DataStore lock lost" as a developer

If your players see this message, one of your servers is losing a session lock and your code is reacting to it. Fixing it means two things: **handle the lost lock correctly**, and **remove what causes it**.

### 1. Handle session end properly

If you use [ProfileStore](https://madstudioroblox.github.io/ProfileStore/) (the successor to ProfileService), the lock is exposed through `Profile.OnSessionEnd`. When it fires, you must stop touching `Profile.Data` and remove the player, because saves are no longer accepted:

```lua
local Players = game:GetService("Players")
local ProfileStore = require(game.ServerScriptService.ProfileStore)

local DATA_TEMPLATE = {
	Coins = 0,
	Level = 1,
}

local PlayerStore = ProfileStore.New("PlayerData_v1", DATA_TEMPLATE)
local Profiles = {}

local function onPlayerAdded(player)
	local profile = PlayerStore:StartSessionAsync(tostring(player.UserId), {
		Cancel = function()
			return player.Parent ~= Players -- stop waiting if they left
		end,
	})

	if profile == nil then
		-- Session could not be started (player left, or another server got there first)
		player:Kick("Your data is still being released by another server. Please rejoin in a minute.")
		return
	end

	profile:AddUserId(player.UserId)
	profile:Reconcile()

	profile.OnSessionEnd:Connect(function()
		Profiles[player] = nil
		player:Kick("Your data session ended. Your progress is safe, please rejoin.")
	end)

	if player.Parent == Players then
		Profiles[player] = profile
	else
		profile:EndSession() -- player left while we were loading
	end
end

local function onPlayerRemoving(player)
	local profile = Profiles[player]
	if profile then
		profile:EndSession() -- final save + releases the lock
	end
end

Players.PlayerAdded:Connect(onPlayerAdded)
Players.PlayerRemoving:Connect(onPlayerRemoving)

for _, player in Players:GetPlayers() do
	task.spawn(onPlayerAdded, player)
end
```

Notice the kick messages. The default "DataStore lock lost" text tells the player nothing. A message that says **their progress is safe** and **what to do next** cuts panic, bad reviews and Discord tickets. If you copied a message from a template, rewrite it.

### 2. Never write to a profile after its session ended

A very common source of these kicks is a script that keeps a reference to `profile.Data` and keeps changing it after `OnSessionEnd`. Those changes are lost. Always go through the `Profiles[player]` table, and check `profile:IsActive()` before important writes.

### 3. Don't let Studio steal the lock

If **Enable Studio Access to API Services** is on, your Studio playtests read and write the same DataStore as the live game. Testing with your own account while you're also in the live game can create a session conflict, and one of the two gets kicked. Use a separate DataStore name for testing, for example by adding a `_Dev` suffix when `game:GetService("RunService"):IsStudio()` is true.

### 4. Look at your teleports

Teleporting a player between places is the second most common cause. The new server requests the profile while the old one is still holding it. A correct session-locking library retries until the old server releases the lock, so:

- Don't call `StartSessionAsync` from several scripts for the same key.
- Don't set `Steal = true` to "fix" it. The documentation itself says that flag bypasses the protection against item duplication.
- Make sure the old server actually calls `EndSession()` on `PlayerRemoving`.

### 5. Handle outages gracefully

Some session-locking systems rely on Roblox services that can fail during incidents (there are DevForum threads about players being kicked in loops because of MemoryStore failures). You can't fix Roblox's outage, but you can:

- Retry with a delay instead of kicking immediately
- Show a clear message ("Roblox data services are having issues") instead of a generic one
- Log every failure to a webhook so you know it's not just one player

---

## Pre-fix checklist

- [ ] The kick message tells the player their progress is safe
- [ ] `OnSessionEnd` removes the profile from your tables
- [ ] Nothing writes to `Profile.Data` after the session ended
- [ ] `PlayerRemoving` calls `EndSession()`
- [ ] Studio tests use a different DataStore name
- [ ] Only one script loads the profile for a given key
- [ ] `Steal` isn't used in production

---

## FAQ

### Is "DataStore lock lost" a Roblox ban or an account error?

No. It's not tied to your account's standing. It's a game-level message about data sessions.

### Can Roblox support restore my progress?

Roblox support can't edit or restore per-game save data. Only the game's developer can. See [what to do when you lose progress in a Roblox game](/blog/roblox-data-loss-what-to-do-2026).

### Why does it only happen in one game?

Because the message is written by that game's developer. If other games work fine, the problem is in that game's data code.

### I'm the developer and I don't use ProfileStore. Should I?

If you're using raw `SetAsync`, yes, or at least implement session locking yourself. I explain why in [the DataStore Safety Manual](/blog/how-to-make-datastore-more-safe-roblox-studio) and compare the libraries in [ProfileService vs DataStore2](/blog/profileservice-datastore-in-roblox-studio-2026-developer-guide).

---

"Lock lost" sounds scary, but it's the sign that your protection is working. The real problem is a game that _doesn't_ kick and quietly overwrites a player's save. Handle it cleanly, tell players their progress is safe, and it stops being a problem.
