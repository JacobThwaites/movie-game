export interface Actor {
  id: string;
  label: string;
}

export interface MovieAnswer {
  id: string;
  title: string;
}

export interface Category {
  id: string;
  label: string;
  queryFilter: string;
}

export interface AcceptedCategory extends Category {
  moviesByActorId: Record<string, MovieAnswer[]>;
}

export interface GameSetup {
  actors: Actor[];
  categories: AcceptedCategory[];
  answers: MovieAnswer[][][];
}

interface SparqlBinding {
  [key: string]: {
    type: string;
    value: string;
  };
}

interface SparqlResponse {
  results: {
    bindings: SparqlBinding[];
  };
}

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";
const MIN_MOVIES_PER_ACTOR = 5;
const REQUIRED_ACTOR_COUNT = 3;
const REQUIRED_CATEGORY_COUNT = 3;
const MAX_SETUP_ATTEMPTS = 8;

const PREFIXES = `
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX psv: <http://www.wikidata.org/prop/statement/value/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
`;

const CATEGORIES: Category[] = [
  {
    id: "one-word-title",
    label: "One word title",
    queryFilter: `
      BIND(REPLACE(STR(?title), "^([Tt]he|[Aa]|[Aa]n)\\\\s+", "") AS ?titleForMatching)
      FILTER(!REGEX(?titleForMatching, "\\\\s"))
    `,
  },
  {
    id: "two-word-title",
    label: "Two word title",
    queryFilter: `
      BIND(REPLACE(STR(?title), "^([Tt]he|[Aa]|[Aa]n)\\\\s+", "") AS ?titleForMatching)
      FILTER(REGEX(?titleForMatching, "^\\\\S+\\\\s+\\\\S+$"))
    `,
  },
  {
    id: "three-plus-word-title",
    label: "Three or more word title",
    queryFilter: `
      BIND(REPLACE(STR(?title), "^([Tt]he|[Aa]|[Aa]n)\\\\s+", "") AS ?titleForMatching)
      FILTER(REGEX(?titleForMatching, "^\\\\S+\\\\s+\\\\S+\\\\s+\\\\S+.*$"))
    `,
  },
  {
    id: "starts-a-f",
    label: "Starts A-F",
    queryFilter: `
      BIND(REPLACE(STR(?title), "^[Tt]he\\\\s+", "") AS ?titleForMatching)
      FILTER(REGEX(?titleForMatching, "^[A-Fa-f]"))
    `,
  },
  {
    id: "starts-q-z",
    label: "Starts Q-Z",
    queryFilter: `
      BIND(REPLACE(STR(?title), "^[Tt]he\\\\s+", "") AS ?titleForMatching)
      FILTER(REGEX(?titleForMatching, "^[Q-Zq-z]"))
    `,
  },
  {
    id: "released-after-2000",
    label: "Released after 2000",
    queryFilter: `
      BIND(STR(?title) AS ?titleForMatching)
      ?film wdt:P577 ?date.
      FILTER(?date > "1999-12-31"^^xsd:dateTime)
    `,
  },
  {
    id: "released-before-1990",
    label: "Released before 1990",
    queryFilter: `
      BIND(STR(?title) AS ?titleForMatching)
      ?film wdt:P577 ?date.
      FILTER(?date < "1989-12-31"^^xsd:dateTime)
    `,
  },
  {
    id: "box-office-over-100m",
    label: "Box office over $100M",
    queryFilter: `
      BIND(STR(?title) AS ?titleForMatching)
      ?film p:P2142 ?boxOfficeStatement.
      ?boxOfficeStatement a wikibase:BestRank;
        ps:P2142 ?boxOffice;
        psv:P2142 ?boxOfficeValueNode.
      ?boxOfficeValueNode wikibase:quantityUnit wd:Q4917.
      FILTER(?boxOffice > 100000000)
    `,
  },
  {
    id: "starts-with-vowel",
    label: "Starts with a vowel",
    queryFilter: `
      BIND(REPLACE(STR(?title), "^[Aa]n?\\\\s+", "") AS ?titleForMatching)
      FILTER(REGEX(?titleForMatching, "^[AEIOUaeiou]"))
    `,
  },
  {
    id: "double-letter-title",
    label: "Double letter title",
    queryFilter: `
      BIND(STR(?title) AS ?titleForMatching)
      FILTER(REGEX(?titleForMatching, "([A-Za-z])\\\\1"))
    `,
  },
];

export async function createGameSetup(): Promise<GameSetup> {
  for (let attempt = 0; attempt < MAX_SETUP_ATTEMPTS; attempt += 1) {
    const actors = await fetchRandomActors();
    const categories = await fetchAcceptedCategories(actors);

    if (categories.length === REQUIRED_CATEGORY_COUNT) {
      return {
        actors,
        categories,
        answers: actors.map((actor) =>
          categories.map((category) => category.moviesByActorId[actor.id])
        ),
      };
    }
  }

  throw new Error("Could not find three actors with three matching categories.");
}

export function isCorrectMovieGuess(
  guess: string,
  answers: MovieAnswer[] | undefined
): boolean {
  const normalizedGuess = normalizeTitle(guess);

  return Boolean(
    normalizedGuess &&
      answers?.some((answer) => normalizeTitle(answer.title) === normalizedGuess)
  );
}

async function fetchRandomActors(): Promise<Actor[]> {
  const query = `${PREFIXES}
SELECT DISTINCT ?actor ?actorLabel WHERE {
  VALUES ?award {
    wd:Q103916
    wd:Q106291
    wd:Q103618
    wd:Q106301
    wd:Q181883
    wd:Q593098
    wd:Q463085
    wd:Q1011564
    wd:Q723830
    wd:Q822907
  }

  VALUES ?occupation {
    wd:Q33999
    wd:Q10800557
  }

  ?actor wdt:P1411 ?award.
  ?actor wdt:P18 ?image.
  ?actor wdt:P106 ?occupation.
  ?actor wdt:P569 ?dateOfBirth.

  FILTER(?dateOfBirth >= NOW() - "P90Y"^^xsd:duration)

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en".
  }
}
ORDER BY RAND()
LIMIT ${REQUIRED_ACTOR_COUNT}`;

  const data = await runSparql(query);
  const actors = data.results.bindings.map((binding) => ({
    id: getEntityId(binding.actor.value),
    label: binding.actorLabel.value,
  }));

  if (actors.length !== REQUIRED_ACTOR_COUNT) {
    throw new Error("Wikidata did not return enough actors for a board.");
  }

  return actors;
}

async function fetchAcceptedCategories(
  actors: Actor[]
): Promise<AcceptedCategory[]> {
  const acceptedCategories: AcceptedCategory[] = [];

  for (const category of shuffle(CATEGORIES)) {
    const moviesByActorId = await fetchCategoryMovies(actors, category);
    const hasEnoughMovies = actors.every(
      (actor) => (moviesByActorId[actor.id]?.length ?? 0) > MIN_MOVIES_PER_ACTOR
    );

    if (hasEnoughMovies) {
      acceptedCategories.push({ ...category, moviesByActorId });
    }

    if (acceptedCategories.length === REQUIRED_CATEGORY_COUNT) {
      return acceptedCategories;
    }
  }

  return acceptedCategories;
}

async function fetchCategoryMovies(
  actors: Actor[],
  category: Category
): Promise<Record<string, MovieAnswer[]>> {
  const values = actors
    .map((actor) => `(wd:${actor.id} "${escapeSparqlString(actor.label)}")`)
    .join("\n    ");

  const query = `${PREFIXES}
SELECT ?actor ?actorLabel
       (COUNT(DISTINCT ?film) AS ?filmCount)
       (GROUP_CONCAT(DISTINCT CONCAT(STRAFTER(STR(?film), "entity/"), "::", ?titleForMatching); separator="||") AS ?movies)
WHERE {
  VALUES (?actor ?actorLabel) {
    ${values}
  }

  ?film wdt:P161 ?actor.
  ?film wdt:P31/wdt:P279* wd:Q11424.
  ?film wdt:P1476 ?title.

  FILTER(LANG(?title) = "en")

  ${category.queryFilter}
}
GROUP BY ?actor ?actorLabel
ORDER BY DESC(?filmCount)`;

  const data = await runSparql(query);

  return data.results.bindings.reduce<Record<string, MovieAnswer[]>>(
    (moviesByActorId, binding) => {
      const actorId = getEntityId(binding.actor.value);
      moviesByActorId[actorId] = parseMovies(binding.movies?.value ?? "");
      return moviesByActorId;
    },
    {}
  );
}

async function runSparql(query: string): Promise<SparqlResponse> {
  const response = await fetch(
    `${WIKIDATA_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`,
    {
      headers: {
        Accept: "application/sparql-results+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Wikidata query failed with status ${response.status}.`);
  }

  return response.json();
}

function parseMovies(value: string): MovieAnswer[] {
  if (!value) {
    return [];
  }

  return value.split("||").map((movie) => {
    const [id, ...titleParts] = movie.split("::");
    return {
      id,
      title: titleParts.join("::"),
    };
  });
}

function normalizeTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/^(the|a|an)\s+/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getEntityId(entityUri: string): string {
  return entityUri.substring(entityUri.lastIndexOf("/") + 1);
}

function escapeSparqlString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
