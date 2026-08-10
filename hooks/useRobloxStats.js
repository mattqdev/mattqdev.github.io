"use client";
// hooks/useRobloxStats.js
//
// Static-export compatible live Roblox stats.
// Roblox's official API domains (games.roblox.com, apis.roblox.com,
// friends.roblox.com) don't send Access-Control-Allow-Origin, so a
// browser fetch from a static site always fails CORS. roproxy.com
// mirrors the same endpoints with permissive CORS and is the common
// community workaround for exactly this case. We try it first, then
// the official domain as a secondary attempt, and let the caller fall
// back to a static value if both fail.

import { useEffect, useState } from "react";

const ROBLOX_USER_ID = "2992118050";

const cache = {};

function extractPlaceId(url) {
  if (!url) return null;
  const match = url.match(/roblox\.com\/games\/(\d+)/);
  return match ? match[1] : null;
}

async function fetchJson(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (res.ok) return await res.json();
    } catch {
      // try next candidate
    }
  }
  return null;
}

async function getUniverseId(placeId) {
  const key = `universe:${placeId}`;
  if (key in cache) return cache[key];
  const data = await fetchJson([
    `https://apis.roproxy.com/universes/v1/places/${placeId}/universe`,
    `https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
  ]);
  const id = data?.universeId ?? null;
  cache[key] = id;
  return id;
}

async function getGameData(universeId) {
  const key = `game:${universeId}`;
  if (key in cache) return cache[key];
  const data = await fetchJson([
    `https://games.roproxy.com/v1/games?universeIds=${universeId}`,
    `https://games.roblox.com/v1/games?universeIds=${universeId}`,
  ]);
  const game = data?.data?.[0] ?? null;
  cache[key] = game;
  return game;
}

async function getVotes(universeId) {
  const key = `votes:${universeId}`;
  if (key in cache) return cache[key];
  const data = await fetchJson([
    `https://games.roproxy.com/v1/games/votes?universeIds=${universeId}`,
    `https://games.roblox.com/v1/games/votes?universeIds=${universeId}`,
  ]);
  const votes = data?.data?.[0] ?? null;
  cache[key] = votes;
  return votes;
}

/* ── Live stats for a single Roblox game, from its play/live URL ── */
export function useRobloxGameStats(placeUrl) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const placeId = extractPlaceId(placeUrl);
    if (!placeId) return;

    let cancelled = false;
    setLoading(true);
    setError(false);

    (async () => {
      try {
        const universeId = await getUniverseId(placeId);
        if (!universeId) throw new Error("no universe id");
        const [game, votes] = await Promise.all([
          getGameData(universeId),
          getVotes(universeId),
        ]);
        if (!game) throw new Error("no game data");
        if (cancelled) return;

        const upVotes = votes?.upVotes ?? 0;
        const downVotes = votes?.downVotes ?? 0;
        const totalVotes = upVotes + downVotes;

        setStats({
          visits: game.visits ?? null,
          playing: game.playing ?? null,
          favorites: game.favoritedCount ?? null,
          likeRatio:
            totalVotes > 0 ? Math.round((upVotes / totalVotes) * 100) : null,
        });
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [placeUrl]);

  return { stats, loading, error };
}

/* ── Live follower count for the site owner's Roblox profile ── */
export function useRobloxFollowers(userId = ROBLOX_USER_ID) {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const key = `followers:${userId}`;
    if (key in cache) {
      setCount(cache[key]);
      if (cache[key] === null) setError(true);
      return;
    }

    (async () => {
      const data = await fetchJson([
        `https://friends.roproxy.com/v1/users/${userId}/followers/count`,
        `https://friends.roblox.com/v1/users/${userId}/followers/count`,
      ]);
      if (cancelled) return;
      const c = data?.count ?? null;
      cache[key] = c;
      setCount(c);
      if (c === null) setError(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { count, error };
}

/* ── Summed visits across multiple games, from their play/live URLs ── */
export function useRobloxVisitsTotal(placeUrls) {
  const key = (placeUrls || []).join(",");
  const [total, setTotal] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const placeIds = key ? key.split(",").map(extractPlaceId).filter(Boolean) : [];
    if (placeIds.length === 0) return;

    (async () => {
      try {
        const universeIds = (
          await Promise.all(placeIds.map(getUniverseId))
        ).filter(Boolean);
        if (universeIds.length === 0) throw new Error("no universe ids");
        const games = await Promise.all(universeIds.map(getGameData));
        if (cancelled) return;
        const sum = games.reduce((acc, g) => acc + (g?.visits ?? 0), 0);
        setTotal(sum);
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { total, error };
}
