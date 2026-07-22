export const DUMMY_MATCHES = [
  { id: "d1", name: "Aarav Sharma", gender: "male", interests: ["Music", "Gaming", "Technology"], distanceKm: 4 },
  { id: "d2", name: "Priya Nair", gender: "female", interests: ["Books", "Art", "Writing"], distanceKm: 12 },
  { id: "d3", name: "Wei Chen", gender: "male", interests: ["Cooking", "Travel", "Photography"], distanceKm: 340 },
  { id: "d4", name: "Sofia Rossi", gender: "female", interests: ["Fitness", "Dancing", "Music"], distanceKm: 8 },
  { id: "d5", name: "Kenji Tanaka", gender: "male", interests: ["Anime", "Gaming", "Comedy"], distanceKm: 620 },
  { id: "d6", name: "Fatima Ali", gender: "female", interests: ["Fashion", "Art", "Travel"], distanceKm: 15 },
  { id: "d7", name: "Lucas Silva", gender: "male", interests: ["Sports", "Movies", "Business"], distanceKm: 900 },
  { id: "d8", name: "Elena Petrova", gender: "female", interests: ["Science", "Nature", "Books"], distanceKm: 25 },
  { id: "d9", name: "Omar Haddad", gender: "male", interests: ["Spirituality", "Cooking", "Nature"], distanceKm: 2 },
  { id: "d10", name: "Nina Kowalski", gender: "female", interests: ["Comedy", "Movies", "Fashion"], distanceKm: 500 },
];

export const getAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=256&bold=true`;