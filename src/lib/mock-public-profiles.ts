
// src/lib/mock-public-profiles.ts
export interface MockPost {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  dataAiHint?: string;
}

export interface MockUserProfile {
  username: string;
  avatarUrl: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  bio?: string;
  posts: MockPost[];
}

const generatePosts = (username: string, count: number): MockPost[] => {
  const posts: MockPost[] = [];
  const hints = ["living room", "bedroom modern", "kitchen minimalist", "bohemian balcony", "office industrial", "coastal bathroom", "scandinavian dining", "japandi terrace", "deco study"];
  for (let i = 0; i < count; i++) {
    const width = Math.floor(Math.random() * 300) + 400; // 400-700
    const height = Math.floor(Math.random() * 300) + 400; // 400-700
    posts.push({
      id: `${username}-post-${i + 1}`,
      imageUrl: `https://placehold.co/${width}x${height}.png`,
      likes: Math.floor(Math.random() * 500) + 20,
      comments: Math.floor(Math.random() * 50) + 5,
      dataAiHint: hints[i % hints.length]
    });
  }
  return posts;
};

export const MOCK_PUBLIC_PROFILES: MockUserProfile[] = [
  {
    username: "Alicia M.",
    avatarUrl: "https://placehold.co/150x150.png?text=AM",
    postsCount: 12,
    followersCount: 1258,
    followingCount: 302,
    bio: "Amante del diseño de interiores y los espacios acogedores. Compartiendo mis transformaciones favoritas. ✨",
    posts: generatePosts("Alicia M.", 12),
  },
  {
    username: "Bob C.",
    avatarUrl: "https://placehold.co/150x150.png?text=BC",
    postsCount: 8,
    followersCount: 830,
    followingCount: 150,
    bio: "Explorando el minimalismo y la funcionalidad en cada rincón. Menos es más.",
    posts: generatePosts("Bob C.", 8),
  },
  {
    username: "Carolina D.",
    avatarUrl: "https://placehold.co/150x150.png?text=CD",
    postsCount: 15,
    followersCount: 2500,
    followingCount: 450,
    bio: "Diseñadora de interiores profesional. ¡Transformando espacios, un proyecto a la vez!",
    posts: generatePosts("Carolina D.", 15),
  }
];

export const getMockUserProfileByUsername = (username: string): MockUserProfile | undefined => {
  return MOCK_PUBLIC_PROFILES.find(profile => profile.username.toLowerCase() === username.toLowerCase());
};
