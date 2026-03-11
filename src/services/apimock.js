const mockData = [
  { 
    author: "admin2026", 
    name: "house", 
    points: [
      { x: 100, y: 300 }, 
      { x: 400, y: 300 }, 
      { x: 400, y: 150 }, 
      { x: 250, y: 50 },  
      { x: 100, y: 150 }, 
      { x: 100, y: 300 }, 
      { x: 400, y: 150 }, 
      { x: 100, y: 150 }  
    ] 
  },
  { 
    author: "juan", 
    name: "tree", 
    points: [
      { x: 230, y: 350 }, { x: 270, y: 350 }, { x: 270, y: 250 }, 
      { x: 350, y: 250 }, { x: 380, y: 180 }, { x: 320, y: 130 }, 
      { x: 350, y: 70 },  { x: 250, y: 30 },  { x: 150, y: 70 }, 
      { x: 180, y: 130 }, { x: 120, y: 180 }, { x: 150, y: 250 },
      { x: 230, y: 250 }, { x: 230, y: 350 }
    ] 
  }
];

const apimock = {
  getAll: async () => mockData,
  getByAuthor: async (author) => mockData.filter(bp => bp.author === author),
  getByAuthorAndName: async (author, name) => 
    mockData.find(bp => bp.author === author && bp.name === name),
  create: async (blueprint) => {
    mockData.push(blueprint);
    return blueprint;
  }
};

export default apimock;