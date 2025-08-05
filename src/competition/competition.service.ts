import { Match } from "../match/match.entity.js"
import { Competition } from "./competition.entity.js"
import { Team } from "../team/team.entity.js"


function generateMatches(teams: Team[], competition: Competition, startDate: Date): Match[] {
  const matches: Match[] = []
  const isOdd = teams.length % 2 !== 0

  // Si es impar, agregamos un "equipo fantasma"
  if (isOdd) {
    teams.push({ id: -1 } as Team)
  }

  const rounds = teams.length - 1
  const halfSize = teams.length / 2
  const teamList = [...teams]

  for (let round = 0; round < rounds; round++) {
    const matchDate = new Date(startDate)
    matchDate.setDate(startDate.getDate() + round * 7)

    for (let i = 0; i < halfSize; i++) {
      const home = teamList[i]
      const away = teamList[teams.length - 1 - i]

      if (home.id !== -1 && away.id !== -1) {
        const match = new Match()
        match.matchDate = matchDate
        match.round = `Round ${round + 1}`
        match.competition = competition
        match.teams.add(home)
        match.teams.add(away)
        matches.push(match)
      }
    }

    // Rotación de equipos
    const fixed = teamList.shift()
    const last = teamList.pop()
    if (fixed && last) {
      teamList.unshift(fixed)
      teamList.splice(1, 0, last)
    }
  }

  return matches
}

export { generateMatches }