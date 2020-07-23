type Note = {
  id: string;
  content: string;
  time: string;
};

const notes = [
  {
    id: "1234115212",
    content: "Lorem ipsum.",
    time: new Date().toISOString()
  },
  {
    id: "5863235232",
    content: "Kahvimuki.",
    time: new Date().toISOString()
  }
];

const resolvers = {
  Query: {
    notes: (): Array<Note> => notes
  }
};

export default resolvers;
