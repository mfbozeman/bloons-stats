# Introduction

This is a RESTful API allowing requests to get statistics for various towers
and upgrades within Bloons Tower Defense 6. All requests can be made to
https://btd6-stats.onrender.com .
This API collects much of the publicly available data for Bloons TD 6 and
presents it in a RESTful API to be easily accessible for players and developers
working to build community resources.
All data is sourced from [Blooncyclopedia](https://www.bloonswiki.com/).

Currently, no API key is required to make a request.
To facilitate this free, unrestricted access, the server spins down after 15
minutes of inactivity. As a result, the first request made after an extended
idle period can take a large time to resolve, sometimes upwards of a minute.

# Endpoints

GET https://btd6-stats.onrender.com/tower
returns an object of all towers.

GET https://btd6-stats.onrender.com/tower/{id}
returns the full info for the given tower

GET https://btd6-stats.onrender.com/stats/{id}
return full info for stat block

## TODO List

- on attack:
  - effects: slow, DoT, etc.?
  - no projectiles means: either buffs or spawner attack, should correspond to a subtower
  - conditional modifiers:
  - crits, bloons/towers in range, more?
  - (burstCount, burstInterval) for Desperado
