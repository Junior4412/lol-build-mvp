"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Filter,
  PackageSearch,
  Search,
  Shield,
  Sparkles,
  Star,
  Swords,
  Target
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Build,
  BuildArchetypeId,
  buildArchetypes,
  CatalogItem,
  Champion,
  ChampionAbilityDetails,
  GameMode,
  Matchup,
  championImageUrl,
  ddragonVersion,
  getBuildsFor,
  getModeItems,
  itemImageUrl,
  loadChampionAbilityDetails,
  loadDDragonData,
  modes
} from "@/lib/builds";

const version = ddragonVersion();
type SidebarView = "builds" | "matchups" | "favorites";

export default function BuildExplorer() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [query, setQuery] = useState("");
  const [itemQuery, setItemQuery] = useState("");
  const [mode, setMode] = useState<GameMode>("ranked");
  const [archetype, setArchetype] = useState<BuildArchetypeId>("meta");
  const [selectedId, setSelectedId] = useState("");
  const [activeView, setActiveView] = useState<SidebarView>("builds");
  const [abilityDetails, setAbilityDetails] = useState<ChampionAbilityDetails | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    loadDDragonData()
      .then((data) => {
        if (!mounted) return;
        setChampions(data.champions);
        setItems(data.items);
        setSelectedId(data.champions[0]?.id ?? "");
        setStatus("ready");
      })
      .catch((reason: unknown) => {
        if (!mounted) return;
        setError(reason instanceof Error ? reason.message : "Erro inesperado ao carregar Data Dragon.");
        setStatus("error");
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let mounted = true;

    loadChampionAbilityDetails(selectedId)
      .then((details) => {
        if (mounted) setAbilityDetails(details);
      })
      .catch(() => {
        if (mounted) setAbilityDetails(null);
      });

    return () => {
      mounted = false;
    };
  }, [selectedId]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return champions;

    return champions.filter((champion) => {
      const haystack = [champion.name, champion.title, ...champion.roles, ...champion.tags].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [champions, query]);

  const selected = filtered.find((champion) => champion.id === selectedId) ?? filtered[0] ?? champions[0];
  const modeItems = useMemo(() => getModeItems(items, mode), [items, mode]);
  const catalogItems = useMemo(() => {
    const normalized = itemQuery.trim().toLowerCase();
    if (!normalized) return modeItems;

    return modeItems.filter((item) => {
      const haystack = [item.name, item.plaintext, ...item.tags].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [itemQuery, modeItems]);

  const recommendations = useMemo<Build[]>(() => {
    if (!selected) return [];
    return getBuildsFor(selected, items, mode, archetype, champions);
  }, [items, mode, selected, archetype, champions]);

  const featured = recommendations[0];
  const selectedAbilityDetails = abilityDetails?.championId === selected?.id ? abilityDetails : null;

  if (status === "loading") {
    return <StatusPanel title="Carregando meta" text={`Buscando campeoes e itens oficiais do Data Dragon ${version}.`} />;
  }

  if (status === "error") {
    return <StatusPanel title="Data Dragon indisponivel" text={error} />;
  }

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Navegacao do produto">
        <div className="brand">
          <div className="brandMark">
            <Swords size={20} />
          </div>
          <div>
            <strong>DraftForge</strong>
            <span>LoL Build Lab</span>
          </div>
        </div>

        <div className="navGroup">
          <button className={activeView === "builds" ? "navItem active" : "navItem"} onClick={() => setActiveView("builds")} type="button">
            <Sparkles size={17} />
            Builds
          </button>
          <button className={activeView === "matchups" ? "navItem active" : "navItem"} onClick={() => setActiveView("matchups")} type="button">
            <Target size={17} />
            Matchups
          </button>
          <button className={activeView === "favorites" ? "navItem active" : "navItem"} onClick={() => setActiveView("favorites")} type="button">
            <Shield size={17} />
            Favoritos
          </button>
        </div>

        <div className="sidebarPanel">
          <span className="eyebrow">Patch {version}</span>
          <p>
            Todos os campeoes e itens vem do Data Dragon. O meta MVP diferencia Ranked, Normal, ARAM e Arena por mapa,
            classe e regras de modo.
          </p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Build advisor</span>
            <h1>Escolha qualquer campeao e compare builds por modo.</h1>
          </div>
          <a className="deployLink" href="https://vercel.com/new" target="_blank" rel="noreferrer">
            Vercel
            <ArrowUpRight size={16} />
          </a>
        </header>

        <div className="controls">
          <label className="searchBox">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por campeao, rota ou classe"
            />
          </label>

          <div className="modeTabs" aria-label="Selecionar modo de jogo">
            {modes.map((item) => (
              <button
                className={item.id === mode ? "selected" : ""}
                key={item.id}
                onClick={() => setMode(item.id)}
                type="button"
                title={item.hint}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="controls" style={{ marginTop: "1rem" }}>
          <div className="modeTabs" aria-label="Selecionar estilo de build">
            {buildArchetypes.map((arch) => (
              <button
                className={arch.id === archetype ? "selected" : ""}
                key={arch.id}
                onClick={() => setArchetype(arch.id)}
                type="button"
                title={arch.description}
              >
                {arch.shortLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="modeStats">
          <span>{champions.length} campeoes</span>
          <span>{modeItems.length} itens disponiveis neste modo</span>
          <span>Mapa {modes.find((item) => item.id === mode)?.mapId}</span>
        </div>

        <div className="contentGrid">
          <section className="championList" aria-label="Campeoes">
            <div className="sectionHeader">
              <div>
                <span className="eyebrow">Campeoes</span>
                <h2>{filtered.length} encontrados</h2>
              </div>
              <Filter size={18} />
            </div>

            <div className="champions">
              {filtered.map((champion) => (
                <button
                  className={champion.id === selected?.id ? "championRow activeChampion" : "championRow"}
                  key={champion.id}
                  onClick={() => setSelectedId(champion.id)}
                  style={{ "--accent": champion.accent } as React.CSSProperties}
                  type="button"
                >
                  <Image alt="" height={52} src={championImageUrl(champion.id)} unoptimized width={52} />
                  <span>
                    <strong>{champion.name}</strong>
                    <small>
                      {champion.roles.join(" / ")} - {champion.tags.join(" / ")}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          {selected && featured ? (
            <section className="recommendation">
              <div className="heroChampion" style={{ "--accent": selected.accent } as React.CSSProperties}>
                <Image alt={selected.name} height={96} priority src={championImageUrl(selected.id)} unoptimized width={96} />
                <div>
                  <span className="eyebrow">{selected.roles.join(" / ")}</span>
                  <h2>{selected.name}</h2>
                  <p>{selected.title}</p>
                  <div className="tagLine">
                    {selected.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="score">
                  <strong>{featured.confidence}%</strong>
                  <span>confianca</span>
                </div>
              </div>

              {activeView === "builds" ? (
                <BuildView
                  abilityDetails={selectedAbilityDetails}
                  catalogItems={catalogItems}
                  itemQuery={itemQuery}
                  recommendations={recommendations}
                  selected={selected}
                  setItemQuery={setItemQuery}
                />
              ) : null}

              {activeView === "matchups" ? <MatchupsView build={featured} /> : null}

              {activeView === "favorites" ? <FavoritesView build={featured} selected={selected} /> : null}
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function BuildView({
  abilityDetails,
  catalogItems,
  itemQuery,
  recommendations,
  selected,
  setItemQuery
}: {
  abilityDetails: ChampionAbilityDetails | null;
  catalogItems: CatalogItem[];
  itemQuery: string;
  recommendations: Build[];
  selected: Champion;
  setItemQuery: (value: string) => void;
}) {
  return (
    <>
      {recommendations.map((build) => (
        <article className="buildPanel" key={build.id}>
          <div className="buildHeader">
            <div>
              <span className="pill">{build.style}</span>
              <h3>{build.title}</h3>
              <p>{build.summary}</p>
            </div>
            <div className="meta">
              <span>{build.role}</span>
              <span>{build.difficulty}</span>
            </div>
          </div>

          <div className="itemRows">
            <ItemRow label="Start" items={build.starting} />
            <ItemRow label="Core" items={build.core} />
            <ItemRow label="Situacionais" items={build.situational} />
            <ItemRow label="Bota" items={build.boots ? [build.boots] : []} />
          </div>

          <div className="detailsGrid">
            <div className="detailBox">
              <h4>Runas</h4>
              <p>
                <strong>{build.runes.keystone}</strong> em {build.runes.primary}
              </p>
              <span>
                {build.runes.secondary} - {build.runes.shards}
              </span>
            </div>
            <div className="detailBox">
              <h4>Feiticos</h4>
              <p>{build.spells.join(" + ")}</p>
              <span>{build.patchNote}</span>
            </div>
          </div>

          <SkillOrderPanel abilityDetails={abilityDetails} build={build} selected={selected} />

          <div className="playbook">
            <Checklist title="Power spikes" items={build.powerSpikes} />
            <Checklist title="Plano de jogo" items={build.playPattern} />
            <Checklist title="Evitar" items={build.avoid} />
          </div>

          <MatchupPreview build={build} />
        </article>
      ))}

      <section className="catalogPanel" aria-label="Catalogo de itens por modo">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">Itens do modo</span>
            <h2>{catalogItems.length} itens</h2>
          </div>
          <PackageSearch size={18} />
        </div>

        <label className="searchBox compactSearch">
          <Search size={16} />
          <input
            value={itemQuery}
            onChange={(event) => setItemQuery(event.target.value)}
            placeholder="Filtrar item, atributo ou tag"
          />
        </label>

        <div className="itemCatalogGrid">
          {catalogItems.map((item) => (
            <figure className="tinyItem" key={item.id} title={`${item.name} - ${item.total}g`}>
              <Image alt={item.name} height={34} src={itemImageUrl(item.id)} unoptimized width={34} />
              <figcaption>
                <strong>{item.name}</strong>
                <span>{item.total}g - {item.tags.slice(0, 2).join(" / ") || "Item"}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}

function SkillOrderPanel({
  abilityDetails,
  build,
  selected
}: {
  abilityDetails: ChampionAbilityDetails | null;
  build: Build;
  selected: Champion;
}) {
  const abilities = abilityDetails?.abilities ?? [];
  const passive = abilityDetails?.passive;
  const priority = Array.from(new Set(build.skillOrder.filter((key) => key !== "R"))).slice(0, 3);

  return (
    <section className="skillPanel" aria-label="Ordem de habilidades">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">Habilidades</span>
          <h4>Upe {priority.join(" > ")} e pegue R sempre que liberar</h4>
        </div>
        <BookOpen size={18} />
      </div>

      <div className="skillSequence">
        {build.skillOrder.map((key, index) => (
          <span className={key === "R" ? "ultimateSkill" : ""} key={`${key}-${index}`}>
            <small>{index + 1}</small>
            {key}
          </span>
        ))}
      </div>

      <div className="abilityGrid">
        {passive ? <AbilityCard ability={passive} /> : <AbilitySkeleton label={`Passiva de ${selected.name}`} />}
        {(["Q", "W", "E", "R"] as const).map((key) => {
          const ability = abilities.find((item) => item.key === key);
          return ability ? <AbilityCard ability={ability} key={key} /> : <AbilitySkeleton key={key} label={key} />;
        })}
      </div>
    </section>
  );
}

function AbilityCard({ ability }: { ability: NonNullable<ChampionAbilityDetails["passive"]> }) {
  return (
    <article className="abilityCard">
      <strong>{ability.key}</strong>
      <div>
        <h5>{ability.name}</h5>
        <p>{ability.description}</p>
      </div>
    </article>
  );
}

function AbilitySkeleton({ label }: { label: string }) {
  return (
    <article className="abilityCard">
      <strong>?</strong>
      <div>
        <h5>{label}</h5>
        <p>Carregando detalhes oficiais do Data Dragon.</p>
      </div>
    </article>
  );
}

function MatchupPreview({ build }: { build: Build }) {
  return (
    <section className="matchupPreview" aria-label="Resumo de matchups">
      <MatchupColumn compact matchups={build.weakAgainst.slice(0, 3)} title="Counters que mais incomodam" variant="danger" />
      <MatchupColumn compact matchups={build.strongAgainst.slice(0, 3)} title="Voce costuma punir" variant="good" />
    </section>
  );
}

function MatchupsView({ build }: { build: Build }) {
  return (
    <section className="buildPanel">
      <div className="buildHeader">
        <div>
          <span className="pill">Matchups</span>
          <h3>Quem countera e quem voce vence melhor</h3>
          <p>
            Use a primeira lista para banir, jogar mais seguro ou adaptar resistencia. Use a segunda para pressionar lane,
            trocar cedo e acelerar seu core. Estimativa heuristica por rota (sem fonte de stats de partidas reais conectada).
          </p>
        </div>
        <div className="meta">
          <span>{build.role}</span>
          <span>{build.confidence}%</span>
        </div>
      </div>

      <div className="matchupGrid">
        <MatchupColumn matchups={build.weakAgainst} title="Counters do seu campeao" variant="danger" />
        <MatchupColumn matchups={build.strongAgainst} title="Voce e melhor contra" variant="good" />
      </div>
    </section>
  );
}

function MatchupColumn({
  compact = false,
  matchups,
  title,
  variant
}: {
  compact?: boolean;
  matchups: Matchup[];
  title: string;
  variant: "danger" | "good";
}) {
  return (
    <div className={compact ? "matchupColumn compactMatchups" : "matchupColumn"}>
      <h4>{title}</h4>
      {matchups.map((matchup) => (
        <article className={variant === "danger" ? "matchupCard dangerMatchup" : "matchupCard goodMatchup"} key={matchup.championId}>
          <Image alt="" height={42} src={championImageUrl(matchupImageId(matchup.championId))} unoptimized width={42} />
          <div>
            <strong>{matchup.championName}</strong>
            <span>~{matchup.games.toLocaleString("pt-BR")} partidas (estimativa)</span>
          </div>
          <b>{matchup.winRate}%</b>
        </article>
      ))}
    </div>
  );
}

function FavoritesView({ build, selected }: { build: Build; selected: Champion }) {
  return (
    <section className="buildPanel">
      <div className="buildHeader">
        <div>
          <span className="pill">Favoritos</span>
          <h3>{selected.name} pronto para consulta rapida</h3>
          <p>Resumo do campeao selecionado para voce bater o olho antes da partida.</p>
        </div>
        <Star size={24} />
      </div>

      <div className="favoriteGrid">
        <div className="detailBox">
          <h4>Core salvo</h4>
          <p>{build.core.map((item) => item.name).join(" > ")}</p>
          <span>Bota: {build.boots?.name ?? "situacional"}</span>
        </div>
        <div className="detailBox">
          <h4>Melhor alvo</h4>
          <p>{build.strongAgainst[0]?.championName ?? "Sem dados"}</p>
          <span>Matchup favoravel para acelerar vantagem.</span>
        </div>
        <div className="detailBox">
          <h4>Cuidado no draft</h4>
          <p>{build.weakAgainst[0]?.championName ?? "Sem dados"}</p>
          <span>Considere banir ou adaptar a lane.</span>
        </div>
      </div>
    </section>
  );
}

function matchupImageId(championId: string) {
  const aliases: Record<string, string> = {
    LeBlanc: "Leblanc"
  };

  return aliases[championId] ?? championId;
}

function StatusPanel({ title, text }: { title: string; text: string }) {
  return (
    <main className="statusPanel">
      <div className="brandMark">
        <Swords size={20} />
      </div>
      <span className="eyebrow">DraftForge</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </main>
  );
}

function ItemRow({ label, items }: { label: string; items: CatalogItem[] }) {
  return (
    <div className="itemRow">
      <span>{label}</span>
      <div>
        {items.map((item) => (
          <figure key={item.id} title={`${item.name} - ${item.total}g`}>
            <Image alt={item.name} height={40} src={itemImageUrl(item.id)} unoptimized width={40} />
            <figcaption>{item.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="checklist">
      <h4>{title}</h4>
      {items.map((item) => (
        <p key={item}>
          <CheckCircle2 size={15} />
          {item}
        </p>
      ))}
    </div>
  );
}
