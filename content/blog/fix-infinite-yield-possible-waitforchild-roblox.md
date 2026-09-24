---
title: "Fix 'Infinite Yield Possible' on WaitForChild in Roblox"
description: "Your output says 'Infinite yield possible on WaitForChild' and your script hangs. Here are the 4 real causes and how to fix each one."
date: "2026-08-18"
tags: ["Roblox", "Luau", "Debugging", "Beginner"]
cover: null
---

You open the Output window and see this:

```
Infinite yield possible on 'Workspace.Map:WaitForChild("Door")'
```

Your script stops right there and nothing after it runs. What's going on?

> **Quick answer:** `WaitForChild` waited 5 seconds and the object never showed up. Either the name is wrong, the object doesn't exist on that side (client/server), it was streamed out, or it was never created.

---

## Cause 1: A typo in the name

Names are **case-sensitive** and spaces count. `"Door"` is not `"door"` and not `"Door "`.

Select the object in the Explorer and copy its name exactly. It sounds silly, but it's the #1 cause.

---

## Cause 2: The object only exists on the other side

A part created by a **server** script exists for everyone. A part created by a **LocalScript** exists only on that player's client — the server will wait for it forever.

```lua
-- LocalScript
local part = Instance.new("Part")
part.Name = "MyPart"
part.Parent = workspace

-- Server Script (never finds it!)
workspace:WaitForChild("MyPart")
```

If the server needs it, the server must create it. Clients never replicate objects to the server.

---

## Cause 3: StreamingEnabled removed it

With `StreamingEnabled`, parts far from the player may not be loaded on the client. `WaitForChild` on a far-away model will hang until the player gets close.

Fixes:

- Set the model's `ModelStreamingMode` to `Persistent` for things you always need.
- Or wait for it only when relevant, and give up gracefully (see below).

---

## Cause 4: The script runs before the object exists

You're waiting for something that gets created later — but by a script that itself errored out. Check the Output for an **earlier** error; the yield warning is often just a symptom.

---

## Use a timeout so it never hangs

`WaitForChild` accepts a second argument: the maximum seconds to wait. If it times out, it returns `nil` instead of hanging forever.

```lua
local door = workspace.Map:WaitForChild("Door", 10)

if not door then
    warn("Door not found — check the name or the map setup")
    return
end
```

Now the failure is loud, explicit, and doesn't freeze the rest of your code.

---

## When NOT to use WaitForChild

If you're sure something already exists (for example, the `Humanoid` inside a character you just received), `FindFirstChild` or plain dot access is faster and clearer. Reserve `WaitForChild` for things that **might not have replicated yet**, like `PlayerGui` or objects inside `ReplicatedStorage` at startup.

---

## Checklist

- ✅ Is the name exactly right (case + spaces)?
- ✅ Was it created by the correct side (server vs client)?
- ✅ Is it `Persistent` if StreamingEnabled is on?
- ✅ Did an earlier error stop the code that creates it?
- ✅ Did you add a timeout and a `nil` check?
