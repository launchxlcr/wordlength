// Daily solution words — variety of lengths from 4 to 10
export const SOLUTIONS: string[] = [
  // 4-letter
  'BARK', 'COIN', 'DIVE', 'GALE', 'HIVE', 'JOLT', 'KEEN', 'LIMB', 'MINT', 'NOVA',
  'OATH', 'PACT', 'REEF', 'SAGE', 'TUSK', 'URGE', 'VANE', 'WREN', 'ZINC', 'AIDE',
  // 5-letter
  'BLAZE', 'CRISP', 'DANCE', 'FLINT', 'GRASP', 'HUNCH', 'JOUST', 'KNACK', 'LUNAR',
  'MIRTH', 'NERVE', 'PIVOT', 'QUIRK', 'STERN', 'TROVE', 'USHER', 'VIGOR', 'WALTZ',
  'YACHT', 'ZONAL', 'ADORN', 'BRISK', 'CHASM', 'DWARF', 'ENVOY', 'FROND', 'GUILE',
  'HAUNT', 'INEPT', 'LARVA', 'MOULT', 'NOTCH', 'OPERA', 'PLUMB', 'RASPY', 'SCOWL',
  'TAPIR', 'UNIFY', 'VIPER', 'WRATH', 'YEARN', 'NYMPH',
  // 6-letter
  'ABLAZE', 'CRAFTS', 'EMBARK', 'FABLED', 'GRAVEL', 'HUNTER', 'JOVIAL', 'LAVISH',
  'MARVEL', 'OYSTER', 'PENCIL', 'QUARTZ', 'RAVINE', 'STANZA', 'THRONG', 'UPBEAT',
  'VELVET', 'WARDEN', 'ZENITH', 'BOUNTY', 'COBALT', 'DAGGER', 'ERRAND', 'FAMINE',
  'GOBLIN', 'HERALD', 'INSULT', 'JIGSAW', 'KINDLE', 'LINGER', 'MENACE',
  'ONWARD', 'PARCEL', 'RASCAL', 'SENTRY', 'TANGLE', 'UNRULY', 'WICKER',
  // 7-letter
  'ANATOMY', 'BALANCE', 'CABINET', 'EAGERLY', 'FANFARE', 'GALLANT', 'HARVEST',
  'ICEBERG', 'JOURNEY', 'KITCHEN', 'LANTERN', 'MASTERY', 'NARRATE', 'OUTLINE',
  'PHANTOM', 'QUANTUM', 'REPLICA', 'SHACKLE', 'TARNISH', 'UNKEMPT', 'VENTURE',
  'WHISPER', 'YEARNED', 'ZEALOUS', 'ABSOLVE', 'BEDROCK', 'CONJURE', 'DURABLE',
  'ELUDING', 'FURNISH', 'GRAPPLE', 'HOSTAGE', 'IMPLORE', 'JAVELIN', 'KNOWING',
  'LURKING', 'MARSHAL', 'NOTABLE', 'OBSCURE',
  // 8-letter
  'PARALYZE', 'ABSOLUTE', 'BLISSFUL', 'DISPATCH', 'ELIGIBLE', 'GRACEFUL', 'HELPLESS',
  'INITIATE', 'JEALOUSY', 'LABORING', 'MAGNOLIA', 'NOTEBOOK', 'OBSTACLE', 'PORTABLE',
  'QUANTITY', 'RELISHED', 'SOLITUDE', 'TRANSMIT', 'UNVEILED', 'VOLCANIC', 'WESTWARD',
  'YEARNING', 'BACKBONE', 'CARNIVAL', 'DAYLIGHT', 'EARNINGS', 'FOOTWEAR', 'GARLANDS',
  'HARDCORE', 'IRONWORK', 'JUBILANT', 'KNAPSACK', 'LANDFALL', 'MERCHANT', 'NUPTIALS',
  // 9-letter
  'ADVENTURE', 'BOULEVARD', 'CALCULATE', 'DEPARTURE', 'ELABORATE', 'FAVORABLE',
  'GATHERING', 'HEARTFELT', 'IMPORTANT', 'JUSTIFIED', 'KNOWLEDGE', 'LABYRINTH',
  'MAGNITUDE', 'NARRATIVE', 'OBJECTIVE', 'PERENNIAL', 'QUARTERED', 'SANCTUARY',
  'TESTAMENT', 'UNCERTAIN', 'VENTURING', 'WATCHWORD', 'XENOPHILE',
  // 10-letter
  'RELENTLESS', 'ACCOMPLISH', 'BASKETBALL', 'COMPREHEND', 'DEDICATION', 'EVENTUALLY',
  'FOUNDATION', 'GENERATING', 'HORIZONTAL', 'ILLUMINATE', 'JOURNEYMAN', 'LIBERATION',
  'MOTIVATION', 'NOTEWORTHY', 'OCCURRENCE', 'PERSEVERED', 'QUESTIONED', 'REMARKABLE',
  'SYSTEMATIC', 'THROUGHOUT',
];

// Deduplicate (preserves first occurrence order)
const _seen = new Set<string>();
export const DAILY_SOLUTIONS: string[] = SOLUTIONS.filter(w => {
  if (_seen.has(w)) return false;
  _seen.add(w);
  return true;
});

const START_DATE = new Date(2025, 0, 1); // Jan 1, 2025

export function getDailyInfo(): { word: string; puzzleNumber: number } {
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const startUTC = new Date(Date.UTC(
    START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate()
  ));
  const dayIndex = Math.floor((todayUTC.getTime() - startUTC.getTime()) / 86400000);
  const puzzleNumber = Math.max(0, dayIndex) + 1;
  const word = DAILY_SOLUTIONS[Math.abs(dayIndex) % DAILY_SOLUTIONS.length];
  return { word, puzzleNumber };
}

export function getTodayDateString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}
