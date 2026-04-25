// Function to determine emojis based on program description
export const getEmojisForProgram = (description: string | undefined | null, customEmoji?: string): string[] => {
  const emojis: string[] = [];
  
  // If a custom emoji is provided, split it into individual emojis and return
  if (customEmoji) {
    // Split by spaces and filter out empty strings
    return customEmoji.split(' ').filter(emoji => emoji.trim() !== '');
  }
  
  // If no description is provided, return empty array
  if (!description) {
    return [];
  }
  
  // Keywords to emoji mapping (using actual emoji characters)
  const keywordToEmoji: Record<string, string> = {
    hike: "🥾",
    walk: "🚶",
    trail: "🥾",
    garden: "🌱",
    farm: "🚜",
    animal: "🐐",
    animals: "🐔",
    wildlife: "🦝",
    bird: "🦅",
    birds: "🦅",
    water: "💧",
    lake: "⛰️",
    pond: "⛰️",
    creek: "⛰️",
    plant: "🌿",
    plants: "🌿",
    tree: "🌳",
    trees: "🌳",
    forest: "🌲",
    fish: "🐟",
    marine: "🐠",
    ocean: "🌊",
    art: "🎨",
    science: "🔬",
    history: "📜",
    historic: "🏛️",
    archaeology: "🏺",
    fossil: "🦴",
    stars: "✨",
    space: "🌠",
    astronomy: "🔭",
    nature: "🍃",
    habitat: "🏠",
    restoration: "♻️",
    conservation: "🌎",
    fire: "🔥",
    weather: "☁️",
    climate: "🌡️",
    geology: "🪨",
    rock: "🪨",
    rocks: "🪨",
    soil: "🌱",
    explore: "🔍",
    discovery: "🔎",
    adventure: "🧭",
    insect: "🐝",
    insects: "🐝",
    bug: "🐞",
    bugs: "🐞",
    butterfly: "🦋",
    bee: "🐝",
    season: "🍂",
    fall: "🍁",
    spring: "🌸",
    summer: "☀️",
    winter: "❄️",
    craft: "✂️",
    game: "🎮",
    play: "🎯",
    farming: "🌾",
    harvest: "🌽",
    native: "🌵",
    indigenous: "🪶"
  };
  
  // Convert description to lowercase for case-insensitive matching
  const lowercaseDesc = description.toLowerCase();
  
  // Check for keywords in the description
  Object.entries(keywordToEmoji).forEach(([keyword, emoji]) => {
    if (lowercaseDesc.includes(keyword)) {
      // Only add if the emoji isn't already included
      if (!emojis.includes(emoji)) {
        emojis.push(emoji);
      }
    }
  });
  
  // Limit to 5 emojis max to avoid cluttering
  return emojis.slice(0, 5);
};

// Function to get the Noto Emoji class name for an emoji
export const getNotoEmojiClass = (emoji: string): string => {
  return 'noto-emoji'; // We don't need specific classes anymore since we're using actual emoji characters
};
