# BTD6 Stats Project

Upgrades in Bloons Tower Defense 6 are often vague in describing their effect. Viewing the
numbers behind each upgrade allows for more quantitative comparison and analysis
The actual raw data is available publicly through (for example)
[Blooncyclopedia](https://www.bloonswiki.com/).
While this is a great resource, viewing the data there can be difficult,
requiring you to sift through a variety of wiki pages and confusing JSON objects.
This website provides a more user-friendly view for various stats for BTD6
towers, including damage, pierce, attack speed, and more.
Uses the unofficial BTD6 Stats API to get data, which in turn gets its numbers
from the Blooncyclopedia wiki. Information on the API can be found at
../stats-api.

Features include...

copyright disclaimer
Bloons Tower Defense 6 and all related names and images belong to Ninja Kiwi.

## TODO List

- error boundary
- Hero needs stat cards carousel

- Loading pages throughout - include a game of some sort
  - ideas: memory ? dino style game ?
- include damage mods in DPS
- better display damage modifiers
- effects on projectiles
- option for jungle drums, alch buffs
- handle collidables
- range normalization option
- activated abilities

- Heroes?

### Current Issue List

- Beast Handler - getting subtowers
- Desperado - conditional aspd buffs
- Druid - income
- Engineer Monkey - subtowers, buffs (not projectiles in this case),
- Monkey Buccaneer - parsing apostrophe in upgrade name, income
- Spike Factory - hits camo
