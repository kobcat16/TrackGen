# [TrackGen](https://strawberrymaster.github.io/TrackGen)

The simplest tropical cyclone track map generator. This is a fork of [TrackGen](https://trackgen.codingcactus.repl.co/) by [CodingCactus](https://github.com/Coding-Cactus). I have made some changes to the code - mostly to ensure it works offline, correctly. The world background is also stored in the repository, instead of an external server.

## Usage

- Each line is a point to be plotted on the map
- Each field gives information about the point to be plotted

| Field      | Description | Example | Required? |
|:----------:|:------------|:-------:|:---------:|
| Name       | Name of the cyclone, used to join points together | Iota | <ul><li> [ ] No </li></ul> |
| Latitude   | Latitude coordinate, choose either °N or °S instead of using negative numbers | 52 °N | <ul><li> [x] Yes </li></ul> |
| Longitude  | Longitude coordinate, choose either °E or °W instead of using negative numbers | 1°W | <ul><li> [x] Yes </li></ul> |
| Wind Speed | Wind speed at that point, leave blank for unknown speeds | 25 kt | <ul><li> [ ] No </li></ul> |
| Stage      | Stage of tropical cyclone (determines shape used for point) | Tropical Cyclone | <ul><li> [x] Yes </li></ul> |
