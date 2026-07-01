export type GameMode = "ranked" | "aram" | "arena" | "casual";

export type ChampionRole = "Top" | "Jungle" | "Mid" | "ADC" | "Support";

export type Champion = {
  id: string;
  name: string;
  title: string;
  roles: ChampionRole[];
  tags: string[];
  accent: string;
};

export type CatalogItem = {
  id: string;
  name: string;
  plaintext: string;
  tags: string[];
  stats: Record<string, number>;
  total: number;
  maps: Record<string, boolean>;
  consumed: boolean;
  inStore: boolean;
  depth?: number;
  into?: string[];
  from?: string[];
};

export type BuildArchetypeId = "meta" | "critico" | "letalidade" | "ap-burst" | "on-hit" | "bruiser" | "tank" | "suporte";

export type BuildArchetype = {
  id: BuildArchetypeId;
  label: string;
  shortLabel: string;
  description: string;
  tags: string[];
  preferredItems: string[];
  runePreset: {
    primary: string;
    keystone: string;
    secondary: string;
    shards: string;
  };
};

export type Build = {
  id: string;
  champion: string;
  archetype: BuildArchetype;
  title: string;
  mode: GameMode;
  role: ChampionRole;
  style: "Meta" | "Scaling" | "Snowball" | "Utility" | "Burst" | "Duel" | "Critical" | "Lethality";
  difficulty: "Easy" | "Medium" | "Hard";
  confidence: number;
  patchNote: string;
  summary: string;
  starting: CatalogItem[];
  core: CatalogItem[];
  situational: CatalogItem[];
  boots?: CatalogItem;
  runes: {
    primary: string;
    keystone: string;
    secondary: string;
    shards: string;
  };
  spells: string[];
  powerSpikes: string[];
  playPattern: string[];
  avoid: string[];
};

type DDragonChampion = {
  id: string;
  name: string;
  title: string;
  tags: string[];
};

type DDragonChampionResponse = {
  data: Record<string, DDragonChampion>;
};

type DDragonItem = {
  name: string;
  plaintext?: string;
  tags?: string[];
  stats?: Record<string, number>;
  gold?: {
    total: number;
    purchasable: boolean;
  };
  maps?: Record<string, boolean>;
  consumed?: boolean;
  inStore?: boolean;
  depth?: number;
  into?: string[];
  from?: string[];
};

type DDragonItemResponse = {
  data: Record<string, DDragonItem>;
};

export type DDragonData = {
  champions: Champion[];
  items: CatalogItem[];
};

export const modes: Array<{ id: GameMode; label: string; hint: string; mapId: string }> = [
  { id: "ranked", label: "Ranked", hint: "Summoner's Rift com escolhas consistentes", mapId: "11" },
  { id: "aram", label: "ARAM", hint: "Howling Abyss, luta constante e poke", mapId: "12" },
  { id: "arena", label: "Arena", hint: "Ringue 2v2v2v2, duelos e sustain", mapId: "30" },
  { id: "casual", label: "Normal Game", hint: "Summoner's Rift com espaco para testar", mapId: "11" }
];

const accents = ["#2dd4bf", "#5da9e9", "#e9c46a", "#f97316", "#d946ef", "#3ddc97", "#ef4444"];

const roleByTag: Record<string, ChampionRole[]> = {
  Marksman: ["ADC"],
  Mage: ["Mid"],
  Assassin: ["Mid"],
  Fighter: ["Top", "Jungle"],
  Tank: ["Top", "Support"],
  Support: ["Support"]
};

const rolePriority: ChampionRole[] = ["Top", "Jungle", "Mid", "ADC", "Support"];

const starterNames = new Set([
  "Doran's Blade",
  "Doran's Ring",
  "Doran's Shield",
  "Cull",
  "World Atlas",
  "Health Potion",
  "Refillable Potion",
  "Guardian's Blade",
  "Guardian's Hammer",
  "Guardian's Horn",
  "Guardian's Orb"
]);

const bootNames = new Set([
  "Berserker's Greaves",
  "Boots of Swiftness",
  "Ionian Boots of Lucidity",
  "Mercury's Treads",
  "Plated Steelcaps",
  "Sorcerer's Shoes",
  "Symbiotic Soles"
]);

const curatedBoosts: Record<string, Partial<Record<string, number>>> = {
  Marksman: {
    "Infinity Edge": 18,
    "Kraken Slayer": 16,
    "Runaan's Hurricane": 12,
    "Lord Dominik's Regards": 10,
    "Bloodthirster": 10
  },
  Mage: {
    "Rabadon's Deathcap": 18,
    "Luden's Companion": 16,
    "Shadowflame": 14,
    "Zhonya's Hourglass": 12,
    "Void Staff": 10
  },
  Assassin: {
    "Youmuu's Ghostblade": 16,
    "Voltaic Cyclosword": 14,
    "Opportunity": 12,
    "Serylda's Grudge": 12,
    "Edge of Night": 10
  },
  Fighter: {
    "Black Cleaver": 16,
    "Sundered Sky": 15,
    "Sterak's Gage": 14,
    "Death's Dance": 12,
    "Spirit Visage": 10
  },
  Tank: {
    "Heartsteel": 16,
    "Sunfire Aegis": 14,
    "Jak'Sho, The Protean": 14,
    "Thornmail": 12,
    "Kaenic Rookern": 12
  },
  Support: {
    "Locket of the Iron Solari": 16,
    "Redemption": 14,
    "Knight's Vow": 12,
    "Moonstone Renewer": 12,
    "Trailblazer": 10
  }
};

export const buildArchetypes: BuildArchetype[] = [
  {
    id: "meta",
    label: "Meta padrao",
    shortLabel: "Meta",
    description: "Escolha mais segura para a identidade principal do campeao.",
    tags: ["Damage", "Health", "Cooldown", "SpellDamage", "AttackSpeed", "CriticalStrike"],
    preferredItems: [],
    runePreset: {
      primary: "Adaptativo",
      keystone: "Melhor runa por classe",
      secondary: "Flex",
      shards: "Ajuste por matchup"
    }
  },
  {
    id: "critico",
    label: "Critico / DPS",
    shortLabel: "Critico",
    description: "Para carregar lutas longas com DPS e chance critica.",
    tags: ["Damage", "CriticalStrike", "AttackSpeed", "ArmorPenetration", "LifeSteal"],
    preferredItems: ["Infinity Edge", "Kraken Slayer", "Yun Tal Wildarrows", "Runaan's Hurricane", "Lord Dominik's Regards", "Bloodthirster"],
    runePreset: {
      primary: "Precision",
      keystone: "Press the Attack",
      secondary: "Sorcery",
      shards: "Attack Speed, Adaptive, Health"
    }
  },
  {
    id: "letalidade",
    label: "Letalidade / Pickoff",
    shortLabel: "Letalidade",
    description: "Para explodir alvos frageis, jogar por flanco e snowball.",
    tags: ["Damage", "ArmorPenetration", "Cooldown", "NonbootsMovement"],
    preferredItems: ["Youmuu's Ghostblade", "Voltaic Cyclosword", "Opportunity", "Hubris", "Serylda's Grudge", "Edge of Night"],
    runePreset: {
      primary: "Domination",
      keystone: "Electrocute",
      secondary: "Precision",
      shards: "Adaptive, Adaptive, Health"
    }
  },
  {
    id: "ap-burst",
    label: "AP / Burst",
    shortLabel: "AP Burst",
    description: "Para poke, dano magico e janelas fortes de ultimate.",
    tags: ["SpellDamage", "MagicPenetration", "Mana", "Cooldown"],
    preferredItems: ["Luden's Companion", "Blackfire Torch", "Shadowflame", "Rabadon's Deathcap", "Void Staff", "Zhonya's Hourglass"],
    runePreset: {
      primary: "Sorcery",
      keystone: "Arcane Comet",
      secondary: "Inspiration",
      shards: "Ability Haste, Adaptive, Health"
    }
  },
  {
    id: "on-hit",
    label: "On-hit / Velocidade",
    shortLabel: "On-hit",
    description: "Para campeoes que abusam de ataque rapido e efeitos ao contato.",
    tags: ["AttackSpeed", "OnHit", "Damage", "LifeSteal", "SpellBlock"],
    preferredItems: ["Guinsoo's Rageblade", "Blade of The Ruined King", "Terminus", "Wit's End", "Kraken Slayer", "Runaan's Hurricane"],
    runePreset: {
      primary: "Precision",
      keystone: "Lethal Tempo",
      secondary: "Resolve",
      shards: "Attack Speed, Adaptive, Health"
    }
  },
  {
    id: "bruiser",
    label: "Bruiser / Lutador",
    shortLabel: "Bruiser",
    description: "Para trocar por tempo, sobreviver e pressionar side lane.",
    tags: ["Damage", "Health", "Cooldown", "LifeSteal", "Armor", "SpellBlock"],
    preferredItems: ["Black Cleaver", "Sundered Sky", "Sterak's Gage", "Death's Dance", "Maw of Malmortius", "Spirit Visage"],
    runePreset: {
      primary: "Precision",
      keystone: "Conqueror",
      secondary: "Resolve",
      shards: "Attack Speed, Adaptive, Health"
    }
  },
  {
    id: "tank",
    label: "Tank / Frontline",
    shortLabel: "Tank",
    description: "Para iniciar, absorver cooldowns e proteger carregadores.",
    tags: ["Health", "Armor", "SpellBlock", "Tenacity", "HealthRegen", "Slow"],
    preferredItems: ["Heartsteel", "Sunfire Aegis", "Jak'Sho, The Protean", "Thornmail", "Kaenic Rookern", "Randuin's Omen"],
    runePreset: {
      primary: "Resolve",
      keystone: "Aftershock",
      secondary: "Inspiration",
      shards: "Ability Haste, Armor/MR, Health"
    }
  },
  {
    id: "suporte",
    label: "Suporte / Utilidade",
    shortLabel: "Suporte",
    description: "Para peel, cura, escudo, engage e utilidade para o time.",
    tags: ["Aura", "Active", "Cooldown", "ManaRegen", "HealthRegen", "Slow"],
    preferredItems: ["Locket of the Iron Solari", "Redemption", "Knight's Vow", "Moonstone Renewer", "Trailblazer", "Zeke's Convergence"],
    runePreset: {
      primary: "Resolve",
      keystone: "Guardian",
      secondary: "Inspiration",
      shards: "Ability Haste, Armor/MR, Health"
    }
  }
];

export function ddragonVersion() {
  return process.env.NEXT_PUBLIC_DDRAGON_VERSION || "16.13.1";
}

export function championImageUrl(championId: string, version = ddragonVersion()) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championId}.png`;
}

export function itemImageUrl(itemId: string, version = ddragonVersion()) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
}

export async function loadDDragonData(version = ddragonVersion()): Promise<DDragonData> {
  const [championResponse, itemResponse] = await Promise.all([
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/champion.json`),
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`)
  ]);

  if (!championResponse.ok || !itemResponse.ok) {
    throw new Error("Nao foi possivel carregar os dados oficiais do Data Dragon.");
  }

  const championJson = (await championResponse.json()) as DDragonChampionResponse;
  const itemJson = (await itemResponse.json()) as DDragonItemResponse;

  return {
    champions: Object.values(championJson.data)
      .map((champion, index) => ({
        id: champion.id,
        name: champion.name,
        title: champion.title,
        roles: inferRoles(champion.tags),
        tags: champion.tags,
        accent: accents[index % accents.length]
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    items: Object.entries(itemJson.data)
      .map(([id, item]) => ({
        id,
        name: item.name,
        plaintext: item.plaintext ?? "",
        tags: item.tags ?? [],
        stats: item.stats ?? {},
        total: item.gold?.total ?? 0,
        maps: item.maps ?? {},
        consumed: item.consumed ?? false,
        inStore: item.inStore !== false && item.gold?.purchasable !== false,
        depth: item.depth,
        into: item.into,
        from: item.from
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
  };
}

export function getModeItems(items: CatalogItem[], mode: GameMode) {
  const mapId = modes.find((item) => item.id === mode)?.mapId ?? "11";

  return items.filter((item) => {
    const availableOnMap = item.maps[mapId] === true;
    return availableOnMap && item.total > 0 && item.inStore;
  });
}

export function getBuildsFor(champion: Champion, allItems: CatalogItem[], mode: GameMode, archetypeId: BuildArchetypeId = "meta"): Build[] {
  const modeItems = getModeItems(allItems, mode);
  const primaryTag = getPrimaryTag(champion);
  const role = champion.roles[0] ?? "Mid";
  const archetype = buildArchetypes.find((a) => a.id === archetypeId) ?? buildArchetypes[0];
  const scored = modeItems
    .filter((item) => isCompletedItem(item))
    .map((item) => ({ item, score: scoreItem(item, primaryTag, mode, archetype) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const boots = pickBoot(modeItems, primaryTag);
  const starters = pickStarters(modeItems, primaryTag, mode);
  const core = uniqueItems(scored.map(({ item }) => item), boots ? [boots.id] : []).slice(0, 3);
  const situational = uniqueItems(scored.map(({ item }) => item), [...core.map((item) => item.id), boots?.id ?? ""]).slice(0, 5);
  const modeText = modeCopy(mode);

  return [
    {
      id: `${champion.id}-${mode}-${primaryTag}-${archetype.id}`,
      champion: champion.id,
      archetype,
      title: `${modeText.title} para ${champion.name}`,
      mode,
      role,
      style: styleByTag(primaryTag, mode),
      difficulty: difficultyByTag(primaryTag),
      confidence: confidenceByMode(mode, scored.length),
      patchNote: `Patch ${ddragonVersion()} via Data Dragon. Meta MVP por tags, mapa e classe; ainda nao usa win rate ao vivo.`,
      summary: `${modeText.summary} O algoritmo prioriza itens disponiveis no modo ${modeText.label} e sinergia com ${champion.tags.join(" / ")}.`,
      starting: starters,
      core,
      situational,
      boots,
      runes: archetype.id !== "meta" ? archetype.runePreset : runesByTag(primaryTag, mode),
      spells: spellsByRole(role, mode),
      powerSpikes: powerSpikesByMode(mode, core),
      playPattern: playPatternByTag(primaryTag, mode),
      avoid: avoidByMode(mode)
    }
  ];
}

function inferRoles(tags: string[]): ChampionRole[] {
  const roles = tags.flatMap((tag) => roleByTag[tag] ?? []);
  const deduped = rolePriority.filter((role) => roles.includes(role));
  return deduped.length > 0 ? deduped : ["Mid"];
}

function getPrimaryTag(champion: Champion) {
  return champion.tags[0] ?? "Fighter";
}

function isCompletedItem(item: CatalogItem) {
  const isBoot = bootNames.has(item.name) || item.tags.includes("Boots");
  const isConsumable = item.consumed || item.tags.includes("Consumable") || item.tags.includes("Trinket");
  const isStarter = starterNames.has(item.name);

  return !isBoot && !isConsumable && !isStarter && item.total >= 1600 && (!item.into || item.into.length === 0);
}

function pickBoot(items: CatalogItem[], tag: string) {
  const preferred =
    tag === "Marksman"
      ? "Berserker's Greaves"
      : tag === "Mage"
        ? "Sorcerer's Shoes"
        : tag === "Assassin"
          ? "Ionian Boots of Lucidity"
          : tag === "Support"
            ? "Ionian Boots of Lucidity"
            : "Plated Steelcaps";

  return items.find((item) => item.name === preferred) ?? items.find((item) => bootNames.has(item.name) || item.tags.includes("Boots"));
}

function pickStarters(items: CatalogItem[], tag: string, mode: GameMode) {
  const aramNames =
    tag === "Mage" || tag === "Support"
      ? ["Guardian's Orb", "Health Potion"]
      : tag === "Marksman"
        ? ["Guardian's Hammer", "Health Potion"]
        : ["Guardian's Blade", "Health Potion"];
  const defaultNames =
    tag === "Mage"
      ? ["Doran's Ring", "Health Potion"]
      : tag === "Tank"
        ? ["Doran's Shield", "Health Potion"]
        : tag === "Support"
          ? ["World Atlas", "Health Potion"]
          : ["Doran's Blade", "Health Potion"];
  const names = mode === "aram" ? aramNames : defaultNames;
  const picked = names.map((name) => items.find((item) => item.name === name)).filter(Boolean) as CatalogItem[];

  if (picked.length > 0) {
    return picked;
  }

  return items.filter((item) => starterNames.has(item.name)).slice(0, 2);
}

function scoreItem(item: CatalogItem, tag: string, mode: GameMode, archetype: BuildArchetype) {
  let score = curatedBoosts[tag]?.[item.name] ?? 0;
  const tags = new Set(item.tags);
  const stats = item.stats;

  if (archetype.id !== "meta") {
    score += hasAny(tags, archetype.tags) * 8;
    if (archetype.preferredItems.includes(item.name)) {
      score += 30; // Grande boost para itens do arquetipo
    }
  } else {
    if (tag === "Marksman") {
      score += hasAny(tags, ["Damage", "CriticalStrike", "AttackSpeed", "LifeSteal", "ArmorPenetration"]) * 7;
      score += numeric(stats, ["FlatPhysicalDamageMod", "PercentAttackSpeedMod", "FlatCritChanceMod"]) * 0.6;
    }

    if (tag === "Mage") {
      score += hasAny(tags, ["SpellDamage", "Mana", "Cooldown", "MagicPenetration"]) * 8;
      score += numeric(stats, ["FlatMagicDamageMod", "FlatMPPoolMod"]) * 0.08;
    }

    if (tag === "Assassin") {
      score += hasAny(tags, ["Damage", "ArmorPenetration", "Cooldown", "NonbootsMovement"]) * 8;
      score += numeric(stats, ["FlatPhysicalDamageMod", "FlatArmorPenetrationMod"]) * 0.7;
    }

    if (tag === "Fighter") {
      score += hasAny(tags, ["Damage", "Health", "Cooldown", "LifeSteal", "Armor"]) * 7;
      score += numeric(stats, ["FlatPhysicalDamageMod", "FlatHPPoolMod"]) * 0.12;
    }

    if (tag === "Tank") {
      score += hasAny(tags, ["Health", "Armor", "SpellBlock", "Tenacity", "HealthRegen"]) * 8;
      score += numeric(stats, ["FlatHPPoolMod", "FlatArmorMod", "FlatSpellBlockMod"]) * 0.12;
    }

    if (tag === "Support") {
      score += hasAny(tags, ["Aura", "Active", "Cooldown", "ManaRegen", "HealthRegen", "Slow"]) * 8;
      score += item.name.includes("Vow") || item.name.includes("Redemption") || item.name.includes("Locket") ? 10 : 0;
    }
  }

  if (mode === "aram") {
    score += hasAny(tags, ["Health", "HealthRegen", "ManaRegen", "Cooldown", "SpellDamage"]) * 3;
  }

  if (mode === "arena") {
    score += hasAny(tags, ["Health", "LifeSteal", "SpellVamp", "Armor", "SpellBlock", "Tenacity"]) * 5;
  }

  if (mode === "casual") {
    score += item.total < 3400 ? 2 : 0;
  }

  return score;
}

function hasAny(tags: Set<string>, wanted: string[]) {
  return wanted.reduce((total, tag) => total + (tags.has(tag) ? 1 : 0), 0);
}

function numeric(stats: Record<string, number>, keys: string[]) {
  return keys.reduce((total, key) => total + Math.max(0, stats[key] ?? 0), 0);
}

function uniqueItems(items: CatalogItem[], blockedIds: string[]) {
  const blocked = new Set(blockedIds);
  const seen = new Set<string>();

  return items.filter((item) => {
    if (blocked.has(item.id) || seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function styleByTag(tag: string, mode: GameMode): Build["style"] {
  if (mode === "arena") return "Duel";
  if (tag === "Mage" || tag === "Assassin") return "Burst";
  if (tag === "Marksman") return "Scaling";
  if (tag === "Support" || tag === "Tank") return "Utility";
  return "Meta";
}

function difficultyByTag(tag: string): Build["difficulty"] {
  if (tag === "Assassin") return "Hard";
  if (tag === "Mage" || tag === "Marksman") return "Medium";
  return "Easy";
}

function confidenceByMode(mode: GameMode, optionCount: number) {
  const base = mode === "ranked" ? 84 : mode === "aram" ? 80 : mode === "arena" ? 76 : 72;
  return Math.min(93, Math.max(62, base + Math.min(8, Math.floor(optionCount / 18))));
}

function modeCopy(mode: GameMode) {
  if (mode === "ranked") {
    return { label: "Ranked", title: "Meta consistente", summary: "Plano para reduzir variancia, comprar spikes confiaveis e jogar por objetivos." };
  }

  if (mode === "aram") {
    return { label: "ARAM", title: "Build de luta constante", summary: "Plano para teamfights frequentes, poke, sustain e spikes baratos." };
  }

  if (mode === "arena") {
    return { label: "Arena", title: "Build de duelo", summary: "Plano para sobreviver ao burst, vencer 2v2 e abusar de itens exclusivos do modo." };
  }

  return { label: "Normal Game", title: "Build flexivel", summary: "Plano para testar limites do campeao sem fugir da identidade principal." };
}

function runesByTag(tag: string, mode: GameMode): Build["runes"] {
  if (mode === "arena") {
    return { primary: "Arena", keystone: "Augments situacionais", secondary: "Adaptativo", shards: "Priorize sustain, dano e resistencia por lobby" };
  }

  if (tag === "Marksman") {
    return { primary: "Precision", keystone: "Press the Attack", secondary: "Sorcery", shards: "Attack Speed, Adaptive, Health" };
  }

  if (tag === "Mage") {
    return { primary: "Sorcery", keystone: "Arcane Comet", secondary: "Inspiration", shards: "Ability Haste, Adaptive, Health" };
  }

  if (tag === "Assassin") {
    return { primary: "Domination", keystone: "Electrocute", secondary: "Precision", shards: "Adaptive, Adaptive, Health" };
  }

  if (tag === "Tank" || tag === "Support") {
    return { primary: "Resolve", keystone: "Aftershock", secondary: "Inspiration", shards: "Ability Haste, Armor/MR, Health" };
  }

  return { primary: "Precision", keystone: "Conqueror", secondary: "Resolve", shards: "Attack Speed, Adaptive, Health" };
}

function spellsByRole(role: ChampionRole, mode: GameMode) {
  if (mode === "aram") return ["Flash", "Mark"];
  if (mode === "arena") return ["Flash", "Flee"];
  if (role === "Jungle") return ["Flash", "Smite"];
  if (role === "Top") return ["Flash", "Teleport"];
  if (role === "ADC") return ["Flash", "Barrier"];
  if (role === "Support") return ["Flash", "Ignite"];
  return ["Flash", "Ignite"];
}

function powerSpikesByMode(mode: GameMode, core: CatalogItem[]) {
  const first = core[0]?.name ?? "primeiro item";
  const second = core[1]?.name ?? "segundo item";

  if (mode === "aram") return ["Primeira compra completa", first, "Level 11 com ultimates em sequencia"];
  if (mode === "arena") return ["Primeiro augment", first, "Dois itens com round decisivo"];
  if (mode === "casual") return ["Level 6", first, second];
  return ["Level 6", first, "Dois itens antes do terceiro dragao"];
}

function playPatternByTag(tag: string, mode: GameMode) {
  if (mode === "arena") return ["Jogue em torno do cooldown grande", "Priorize alvo isolado", "Use plantas e zona final para forcar erro"];
  if (mode === "aram") return ["Controle wave antes da luta", "Guarde skill chave para engage inimigo", "Compre sustain quando o poke pesar"];
  if (tag === "Marksman") return ["Bata na frontline segura", "Guarde mobilidade para assassinos", "Transforme primeira kill em reset/objetivo"];
  if (tag === "Mage") return ["Push antes de andar", "Force poke antes do all-in", "Jogue por visao lateral em objetivos"];
  if (tag === "Assassin") return ["Procure flanco sem ward", "Entre depois do controle inimigo", "Converta pick em objetivo"];
  if (tag === "Support") return ["Controle brush", "Jogue pelo cooldown do carry", "Troque engage ruim por peel bom"];
  if (tag === "Tank") return ["Absorva cooldowns", "Inicie quando follow-up estiver perto", "Compre resistencia contra maior ameaca"];
  return ["Trocas curtas ate fechar item", "Pressione side lane com visao", "Entre na luta pelo angulo lateral"];
}

function avoidByMode(mode: GameMode) {
  if (mode === "arena") return ["Separar do aliado", "Gastar tudo antes do ringue fechar", "Ignorar sustain do inimigo"];
  if (mode === "aram") return ["Morrer antes do objetivo de wave", "Comprar item caro demais sem spike", "Facecheck sem cooldowns"];
  if (mode === "ranked") return ["Compra fora do matchup", "Lutar sem prioridade", "Forcar antes do item-chave"];
  return ["Testar sem plano", "Copiar build sem olhar composicao", "Ignorar resistencia necessaria"];
}
