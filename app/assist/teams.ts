export interface Team {
  name: string;
  city: string;
  fullName: string;
}

export interface League {
  name: string;
  teams: Team[];
}

export const SPORTS_LEAGUES: Record<string, League> = {
  nfl: {
    name: 'NFL',
    teams: [
      { name: 'Cardinals', city: 'Arizona', fullName: 'Arizona Cardinals' },
      { name: 'Falcons', city: 'Atlanta', fullName: 'Atlanta Falcons' },
      { name: 'Ravens', city: 'Baltimore', fullName: 'Baltimore Ravens' },
      { name: 'Bills', city: 'Buffalo', fullName: 'Buffalo Bills' },
      { name: 'Panthers', city: 'Carolina', fullName: 'Carolina Panthers' },
      { name: 'Bears', city: 'Chicago', fullName: 'Chicago Bears' },
      { name: 'Bengals', city: 'Cincinnati', fullName: 'Cincinnati Bengals' },
      { name: 'Browns', city: 'Cleveland', fullName: 'Cleveland Browns' },
      { name: 'Cowboys', city: 'Dallas', fullName: 'Dallas Cowboys' },
      { name: 'Broncos', city: 'Denver', fullName: 'Denver Broncos' },
      { name: 'Lions', city: 'Detroit', fullName: 'Detroit Lions' },
      { name: 'Packers', city: 'Green Bay', fullName: 'Green Bay Packers' },
      { name: 'Texans', city: 'Houston', fullName: 'Houston Texans' },
      { name: 'Colts', city: 'Indianapolis', fullName: 'Indianapolis Colts' },
      { name: 'Jaguars', city: 'Jacksonville', fullName: 'Jacksonville Jaguars' },
      { name: 'Chiefs', city: 'Kansas City', fullName: 'Kansas City Chiefs' },
      { name: 'Raiders', city: 'Las Vegas', fullName: 'Las Vegas Raiders' },
      { name: 'Chargers', city: 'Los Angeles', fullName: 'Los Angeles Chargers' },
      { name: 'Rams', city: 'Los Angeles', fullName: 'Los Angeles Rams' },
      { name: 'Dolphins', city: 'Miami', fullName: 'Miami Dolphins' },
      { name: 'Vikings', city: 'Minnesota', fullName: 'Minnesota Vikings' },
      { name: 'Patriots', city: 'New England', fullName: 'New England Patriots' },
      { name: 'Saints', city: 'New Orleans', fullName: 'New Orleans Saints' },
      { name: 'Giants', city: 'New York', fullName: 'New York Giants' },
      { name: 'Jets', city: 'New York', fullName: 'New York Jets' },
      { name: 'Eagles', city: 'Philadelphia', fullName: 'Philadelphia Eagles' },
      { name: 'Steelers', city: 'Pittsburgh', fullName: 'Pittsburgh Steelers' },
      { name: '49ers', city: 'San Francisco', fullName: 'San Francisco 49ers' },
      { name: 'Seahawks', city: 'Seattle', fullName: 'Seattle Seahawks' },
      { name: 'Buccaneers', city: 'Tampa Bay', fullName: 'Tampa Bay Buccaneers' },
      { name: 'Titans', city: 'Tennessee', fullName: 'Tennessee Titans' },
      { name: 'Commanders', city: 'Washington', fullName: 'Washington Commanders' }
    ]
  },
  nba: {
    name: 'NBA',
    teams: [
      { name: 'Hawks', city: 'Atlanta', fullName: 'Atlanta Hawks' },
      { name: 'Celtics', city: 'Boston', fullName: 'Boston Celtics' },
      { name: 'Nets', city: 'Brooklyn', fullName: 'Brooklyn Nets' },
      { name: 'Hornets', city: 'Charlotte', fullName: 'Charlotte Hornets' },
      { name: 'Bulls', city: 'Chicago', fullName: 'Chicago Bulls' },
      { name: 'Cavaliers', city: 'Cleveland', fullName: 'Cleveland Cavaliers' },
      { name: 'Mavericks', city: 'Dallas', fullName: 'Dallas Mavericks' },
      { name: 'Nuggets', city: 'Denver', fullName: 'Denver Nuggets' },
      { name: 'Pistons', city: 'Detroit', fullName: 'Detroit Pistons' },
      { name: 'Warriors', city: 'Golden State', fullName: 'Golden State Warriors' },
      { name: 'Rockets', city: 'Houston', fullName: 'Houston Rockets' },
      { name: 'Pacers', city: 'Indiana', fullName: 'Indiana Pacers' },
      { name: 'Clippers', city: 'LA', fullName: 'LA Clippers' },
      { name: 'Lakers', city: 'Los Angeles', fullName: 'Los Angeles Lakers' },
      { name: 'Grizzlies', city: 'Memphis', fullName: 'Memphis Grizzlies' },
      { name: 'Heat', city: 'Miami', fullName: 'Miami Heat' },
      { name: 'Bucks', city: 'Milwaukee', fullName: 'Milwaukee Bucks' },
      { name: 'Timberwolves', city: 'Minnesota', fullName: 'Minnesota Timberwolves' },
      { name: 'Pelicans', city: 'New Orleans', fullName: 'New Orleans Pelicans' },
      { name: 'Knicks', city: 'New York', fullName: 'New York Knicks' },
      { name: 'Thunder', city: 'Oklahoma City', fullName: 'Oklahoma City Thunder' },
      { name: 'Magic', city: 'Orlando', fullName: 'Orlando Magic' },
      { name: '76ers', city: 'Philadelphia', fullName: 'Philadelphia 76ers' },
      { name: 'Suns', city: 'Phoenix', fullName: 'Phoenix Suns' },
      { name: 'Trail Blazers', city: 'Portland', fullName: 'Portland Trail Blazers' },
      { name: 'Kings', city: 'Sacramento', fullName: 'Sacramento Kings' },
      { name: 'Spurs', city: 'San Antonio', fullName: 'San Antonio Spurs' },
      { name: 'Raptors', city: 'Toronto', fullName: 'Toronto Raptors' },
      { name: 'Jazz', city: 'Utah', fullName: 'Utah Jazz' },
      { name: 'Wizards', city: 'Washington', fullName: 'Washington Wizards' }
    ]
  },
  mlb: {
    name: 'MLB',
    teams: [
      { name: 'Diamondbacks', city: 'Arizona', fullName: 'Arizona Diamondbacks' },
      { name: 'Braves', city: 'Atlanta', fullName: 'Atlanta Braves' },
      { name: 'Orioles', city: 'Baltimore', fullName: 'Baltimore Orioles' },
      { name: 'Red Sox', city: 'Boston', fullName: 'Boston Red Sox' },
      { name: 'White Sox', city: 'Chicago', fullName: 'Chicago White Sox' },
      { name: 'Cubs', city: 'Chicago', fullName: 'Chicago Cubs' },
      { name: 'Reds', city: 'Cincinnati', fullName: 'Cincinnati Reds' },
      { name: 'Guardians', city: 'Cleveland', fullName: 'Cleveland Guardians' },
      { name: 'Rockies', city: 'Colorado', fullName: 'Colorado Rockies' },
      { name: 'Tigers', city: 'Detroit', fullName: 'Detroit Tigers' },
      { name: 'Astros', city: 'Houston', fullName: 'Houston Astros' },
      { name: 'Royals', city: 'Kansas City', fullName: 'Kansas City Royals' },
      { name: 'Angels', city: 'Los Angeles', fullName: 'Los Angeles Angels' },
      { name: 'Dodgers', city: 'Los Angeles', fullName: 'Los Angeles Dodgers' },
      { name: 'Marlins', city: 'Miami', fullName: 'Miami Marlins' },
      { name: 'Brewers', city: 'Milwaukee', fullName: 'Milwaukee Brewers' },
      { name: 'Twins', city: 'Minnesota', fullName: 'Minnesota Twins' },
      { name: 'Mets', city: 'New York', fullName: 'New York Mets' },
      { name: 'Yankees', city: 'New York', fullName: 'New York Yankees' },
      { name: 'Athletics', city: 'Oakland', fullName: 'Oakland Athletics' },
      { name: 'Phillies', city: 'Philadelphia', fullName: 'Philadelphia Phillies' },
      { name: 'Pirates', city: 'Pittsburgh', fullName: 'Pittsburgh Pirates' },
      { name: 'Padres', city: 'San Diego', fullName: 'San Diego Padres' },
      { name: 'Giants', city: 'San Francisco', fullName: 'San Francisco Giants' },
      { name: 'Mariners', city: 'Seattle', fullName: 'Seattle Mariners' },
      { name: 'Cardinals', city: 'St. Louis', fullName: 'St. Louis Cardinals' },
      { name: 'Rays', city: 'Tampa Bay', fullName: 'Tampa Bay Rays' },
      { name: 'Rangers', city: 'Texas', fullName: 'Texas Rangers' },
      { name: 'Blue Jays', city: 'Toronto', fullName: 'Toronto Blue Jays' },
      { name: 'Nationals', city: 'Washington', fullName: 'Washington Nationals' }
    ]
  },
  nhl: {
    name: 'NHL',
    teams: [
      { name: 'Ducks', city: 'Anaheim', fullName: 'Anaheim Ducks' },
      { name: 'Coyotes', city: 'Arizona', fullName: 'Arizona Coyotes' },
      { name: 'Bruins', city: 'Boston', fullName: 'Boston Bruins' },
      { name: 'Sabres', city: 'Buffalo', fullName: 'Buffalo Sabres' },
      { name: 'Flames', city: 'Calgary', fullName: 'Calgary Flames' },
      { name: 'Hurricanes', city: 'Carolina', fullName: 'Carolina Hurricanes' },
      { name: 'Blackhawks', city: 'Chicago', fullName: 'Chicago Blackhawks' },
      { name: 'Avalanche', city: 'Colorado', fullName: 'Colorado Avalanche' },
      { name: 'Blue Jackets', city: 'Columbus', fullName: 'Columbus Blue Jackets' },
      { name: 'Stars', city: 'Dallas', fullName: 'Dallas Stars' },
      { name: 'Red Wings', city: 'Detroit', fullName: 'Detroit Red Wings' },
      { name: 'Oilers', city: 'Edmonton', fullName: 'Edmonton Oilers' },
      { name: 'Panthers', city: 'Florida', fullName: 'Florida Panthers' },
      { name: 'Kings', city: 'Los Angeles', fullName: 'Los Angeles Kings' },
      { name: 'Wild', city: 'Minnesota', fullName: 'Minnesota Wild' },
      { name: 'Canadiens', city: 'Montreal', fullName: 'Montreal Canadiens' },
      { name: 'Predators', city: 'Nashville', fullName: 'Nashville Predators' },
      { name: 'Devils', city: 'New Jersey', fullName: 'New Jersey Devils' },
      { name: 'Islanders', city: 'New York', fullName: 'New York Islanders' },
      { name: 'Rangers', city: 'New York', fullName: 'New York Rangers' },
      { name: 'Senators', city: 'Ottawa', fullName: 'Ottawa Senators' },
      { name: 'Flyers', city: 'Philadelphia', fullName: 'Philadelphia Flyers' },
      { name: 'Penguins', city: 'Pittsburgh', fullName: 'Pittsburgh Penguins' },
      { name: 'Sharks', city: 'San Jose', fullName: 'San Jose Sharks' },
      { name: 'Kraken', city: 'Seattle', fullName: 'Seattle Kraken' },
      { name: 'Blues', city: 'St. Louis', fullName: 'St. Louis Blues' },
      { name: 'Lightning', city: 'Tampa Bay', fullName: 'Tampa Bay Lightning' },
      { name: 'Maple Leafs', city: 'Toronto', fullName: 'Toronto Maple Leafs' },
      { name: 'Canucks', city: 'Vancouver', fullName: 'Vancouver Canucks' },
      { name: 'Golden Knights', city: 'Vegas', fullName: 'Vegas Golden Knights' },
      { name: 'Capitals', city: 'Washington', fullName: 'Washington Capitals' },
      { name: 'Jets', city: 'Winnipeg', fullName: 'Winnipeg Jets' }
    ]
  }
};

export const getTeamsByLeague = (league: string): Team[] => {
  return SPORTS_LEAGUES[league]?.teams || [];
};

export const getAllTeamsForDropdown = (league: string) => {
  const teams = getTeamsByLeague(league);
  return [
    { value: '', label: "I don't know" },
    { value: 'custom', label: 'Type custom team...' },
    ...teams.map(team => ({
      value: team.fullName,
      label: team.fullName
    }))
  ];
};