/** Riot Community Dragon CDN (primary) + official Data Dragon aliases */
const DG = "https://ddragon.leagueoflegends.com";

export function championSplashUrl(championId: string, skin = 0) {
  return `${DG}/cdn/img/champion/splash/${championId}_${skin}.jpg`;
}

export function championLoadingUrl(championId: string, skin = 0) {
  return `${DG}/cdn/img/champion/loading/${championId}_${skin}.jpg`;
}

export function itemIconUrl(itemId: string, patch: string) {
  return `${DG}/cdn/${patch}/img/item/${itemId}.png`;
}

export function summonerSpellUrl(name: string, patch: string) {
  const file = name.replace(/\s/g, "");
  return `${DG}/cdn/${patch}/img/spell/Summoner${file}.png`;
}

/** Rune perk icon — path fragment under perk-images */
export function runeIconUrl(iconPath: string) {
  const path = iconPath.startsWith("perk-images/")
    ? iconPath
    : `perk-images/${iconPath}`;
  return `${DG}/cdn/img/${path}`;
}

export function runeStyleIconUrl(tree: string) {
  const map: Record<string, string> = {
    Domination: "7200_Domination",
    Inspiration: "7203_Whimsy",
    Sorcery: "7202_Sorcery",
    Precision: "7201_Precision",
    Resolve: "7204_Resolve",
  };
  const id = map[tree] ?? map.Domination;
  return `${DG}/cdn/img/perk-images/Styles/${id}.png`;
}
