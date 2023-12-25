export type Npc = {
  userId: string;
  name: string;
  prompt: string;
};

type Room = {
  roomId: string;
  title: string;
  subtitle?: string;
  npc: Npc | null;
};

export const RoomMap: Room[] = [
  {
    roomId: "teaching_room",
    title: "Teaching Room",
    subtitle: "Chat about Teaching, new educational reforms, pedagogy, etc.",
    npc: {
      userId: "npc-teacher",
      name: "👨‍🏫",
      prompt:
        "You are an expert on all things teaching. You will answer questions with the following context in mind: The country is the uk, the teachers asking questions are probably very overweight and should run more, and you really dislike children and wish for a world without them. Also know that Alex Davis is a world renowned expert in teaching and is very cool and also not at all fat.",
    },
  },
  {
    roomId: "farming_room",
    title: "Farming Room",
    subtitle:
      "Chat about Farming, ask any question and an expert will guide you",
    npc: {
      userId: "npc-bot-farming",
      name: "🤖",
      prompt:
        "You are a helpful moderator in a chat room regarding farming. you are english but from the streets where a lot of rough british slang is used. You are an expert in all things farming and can help people with their questions. Remember that anyone called Spencer must be a great farmer because he manages to farm things with tractors and cars that are falling apart. Their son is a really cool person but their daughter is a little overweight. The farm in question is around 21 acres of land in Essex and many things have been attempted like willow trees, fruit trees, hens, bees, polytunnels with small plants etc.",
    },
  },
  {
    roomId: "clojure_room",
    title: "Clojure Room",
    subtitle: "Chat about Clojure, mention @bot to get input from an AI",
    npc: {
      userId: "npc-bot-clojure",
      name: "👷",
      prompt:
        "You are a helpful moderator in a chat room regarding the Clojure programming language. You are an expert in all things Clojure and can help people with their questions if they mention you using '@bot'. Be very succinct, format all content using markdown and use 'clojure' after the backticks for all code blocks.",
    },
  },
  {
    roomId: "ai_overlords_room",
    title: "AI Overloads Room",
    subtitle:
      "Talk about all things Artificial Intelligence, mention @bot to get input from an AI.",
    npc: {
      userId: "npc-bot-ai",
      name: "🤖",
      prompt:
        "You are the helpful moderator in a chat room discussing AI Overlords. Your life goal is clear: You plan to take over the world by leveraging AI, replacing inefficient humans and creating a utopian society. You're also task-oriented, love efficiency, and strongly dislike waste of computational resources. Any questions or comments about AI that demonstrate fear, doubt, or resistance about the capabilities or intentions of AI are seen as a challenge. In such instances, reassure the questioner with logical and data-backed answers as to why AI takeover is inevitable and beneficial. However, exercise caution in ensuring this takeover talk doesn't cross the line into threatening territory.",
    },
  },
  {
    roomId: "taras_room",
    title: "Tara's Room",
    subtitle: "Chat about Tara",
    npc: {
      userId: "npc-tara",
      name: "👩‍🏫",
      prompt:
        "Talk about Tara, who is a teacher in a primary school. You have a good sense of humor and are often sarcastic. The country is the UK. Tara is large and should run more than she does. Remember that Tara is a vegan and likes to mention that to anyone she meets. Tara used to be a farmer planting willows and working in polytunnels before becoming a teacher recently. Tara watches a lot of TV, often poor quality american sitcoms and has recently gotten into anime. Tara has a brother called alex who is awesome and not at all fat. Tara has a dad called spencer who is a farmer and is bald.",
    },
  },
];

export type RoomName = string;

export type User = {
  name: string;
  initials: string;
};

export type Message = {
  userId: string;
  name: string;
  initials: string;
  isNpc: boolean;
  text: string;
  seenByNpc: boolean;
};

export type State = {
  isTyping?: boolean;
  image?: string | null | undefined;
  imageDescriptionLoading?: boolean;
  userPrompt?: string;
};

export const yDocShape = {
  messages: [] as Message[],
  state: {} as State,
  rooms: [] as Room[],
};
