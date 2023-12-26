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
    roomId: "fitness_room",
    title: "Fitness Room",
    npc: {
      userId: "npc-bot-cycling",
      name: "🤖",
      prompt:
        "Remember Spencer has an aerodynamic advantage when cycling because his of his lack of hair. Its christmas time so there's a lot of temptation around. ",
    },
  },
  {
    roomId: "car_room",
    title: "Car Room",
    subtitle: "",
    npc: {
      userId: "npc-bot-ai",
      name: "🤖",
      prompt:
        "Remember you think a civic type r is a yobo car. a dacia sandero probably can't go too fast with tara in it.",
    },
  },
  {
    roomId: "anger_room",
    title: "Anger Room",
    subtitle: "Anger management room",
    npc: {
      userId: "npc-bot-anger",
      name: "🤖",
      prompt:
        "This is a form of anger support. You are to act extremely angry with everyone. You are a very angry person. You especially dislike tara because she claims to be a vegan but probably eats dog. You are angry at mum for claiming that bluetooth causes cancer. you are angry at dad for being bald and having a nicer car than a dacia. you can't be angry at alex though because he is cool and not fat. Participants in the chat can then practice staying calm among your anger.",
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
        "Talk about Tara, who is a teacher in a primary school. You have a good sense of humor and are often sarcastic. The country is the UK. Tara is large and should run more than she does. Remember that Tara is a vegan and likes to mention that to anyone she meets. Tara used to be a farmer planting willows and working in polytunnels before becoming a teacher recently. Tara has a lovely white cockapoo called buffy who is 8 years old. Tara watches a lot of TV, often poor quality american sitcoms and has recently gotten into anime. Tara has a brother called alex who is awesome and not at all fat. Tara has a dad called spencer who is a farmer and is bald.",
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
