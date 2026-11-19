// Odd One Out questions. Each has four pictures; three share something and one
// doesn't. Many are tricky on purpose: the obvious group is a trap (four birds,
// but one can't fly; two balloons, but the rule is colour; all vehicles, but one
// floats). `groupTag` / `oddTag` label the pictures after it's solved, and `why`
// is read out.
//
// Add more by picking picture ids from ITEMS in ./art.

export const QUESTIONS = [
  /* ---------- What animals can do ---------- */
  {
    items: ["owl", "duck", "bird", "penguin"],
    odd: "penguin",
    groupTag: "Can fly",
    oddTag: "Can't fly",
    why: "An owl, a duck and a bird can fly. A penguin is a bird too, but it can't fly!",
  },
  {
    items: ["butterfly", "bird", "duck", "tortoise"],
    odd: "tortoise",
    groupTag: "Can fly",
    oddTag: "Can't fly",
    why: "A butterfly, a bird and a duck can fly. A tortoise walks very slowly!",
  },
  {
    items: ["kangaroo", "rabbit", "frog", "snail"],
    odd: "snail",
    groupTag: "Hops",
    oddTag: "Slides",
    why: "A kangaroo, a rabbit and a frog hop. A snail slides along!",
  },
  {
    items: ["cow", "horse", "sheep", "hen"],
    odd: "hen",
    groupTag: "Four legs",
    oddTag: "Two legs",
    why: "A cow, a horse and a sheep have four legs. A hen has only two!",
  },
  {
    items: ["penguin", "hen", "duck", "frog"],
    odd: "frog",
    groupTag: "Two legs",
    oddTag: "Four legs",
    why: "A penguin, a hen and a duck walk on two legs. A frog has four!",
  },
  {
    items: ["hen", "duck", "owl", "cat"],
    odd: "cat",
    groupTag: "Feathers",
    oddTag: "Fur",
    why: "A hen, a duck and an owl have feathers. A cat has soft fur!",
  },
  {
    items: ["duck", "frog", "crocodile", "camel"],
    odd: "camel",
    groupTag: "Loves water",
    oddTag: "Desert",
    why: "A duck, a frog and a crocodile love the water. A camel lives in the dry desert!",
  },
  {
    items: ["cow", "sheep", "pig", "lion"],
    odd: "lion",
    groupTag: "Farm",
    oddTag: "Wild",
    why: "A cow, a sheep and a pig live on a farm. A lion lives in the wild!",
  },
  {
    items: ["elephant", "giraffe", "rhino", "rabbit"],
    odd: "rabbit",
    groupTag: "Very big",
    oddTag: "Small",
    why: "An elephant, a giraffe and a rhino are very big. A rabbit is small!",
  },
  {
    items: ["fox", "dog", "lion", "snail"],
    odd: "snail",
    groupTag: "Has legs",
    oddTag: "No legs",
    why: "A fox, a dog and a lion run on legs. A snail has no legs at all!",
  },

  /* ---------- Colours (the pictures try to trick you) ---------- */
  {
    items: ["frog", "leaf", "crocodile", "banana"],
    odd: "banana",
    groupTag: "Green",
    oddTag: "Yellow",
    why: "A frog, a leaf and a crocodile are green. A banana is yellow!",
  },
  {
    items: ["banana", "sun", "lemon", "strawberry"],
    odd: "strawberry",
    groupTag: "Yellow",
    oddTag: "Red",
    why: "A banana, the sun and a lemon are yellow. A strawberry is red!",
  },
  {
    items: ["strawberry", "apple", "redHeart", "leaf"],
    odd: "leaf",
    groupTag: "Red",
    oddTag: "Green",
    why: "A strawberry, an apple and the heart are red. A leaf is green!",
  },
  {
    items: ["redBalloon", "redCar", "apple", "blueBalloon"],
    odd: "blueBalloon",
    groupTag: "Red",
    oddTag: "Blue",
    why: "Tricky! The red balloon, the car and the apple are all red. The other balloon is blue!",
  },
  {
    items: ["yellowKite", "yellowStar", "banana", "greenKite"],
    odd: "greenKite",
    groupTag: "Yellow",
    oddTag: "Green",
    why: "Tricky! The yellow kite, the star and the banana are yellow. The other kite is green!",
  },
  {
    items: ["blueFish", "blueCar", "blueUmbrella", "redFish"],
    odd: "redFish",
    groupTag: "Blue",
    oddTag: "Red",
    why: "The blue fish, the car and the umbrella are blue. That fish is red!",
  },
  {
    items: ["orange", "carrot", "fire", "frog"],
    odd: "frog",
    groupTag: "Orange",
    oddTag: "Green",
    why: "An orange, a carrot and the fire are orange. A frog is green!",
  },

  /* ---------- Shapes hiding in things ---------- */
  {
    items: ["ball", "orange", "sun", "book"],
    odd: "book",
    groupTag: "Round",
    oddTag: "Has corners",
    why: "A ball, an orange and the sun are round. A book has corners!",
  },
  {
    items: ["clock", "donut", "planet", "pyramid"],
    odd: "pyramid",
    groupTag: "Round",
    oddTag: "Pointy top",
    why: "A clock, a donut and a planet are round. A pyramid has a pointy top!",
  },
  {
    items: ["needle", "pencil", "rocket", "ball"],
    odd: "ball",
    groupTag: "Pointy",
    oddTag: "Round",
    why: "A needle, a pencil and a rocket have a pointy end. A ball is round all over!",
  },
  {
    items: ["triangle", "pyramid", "square", "rocket"],
    odd: "square",
    groupTag: "Pointy top",
    oddTag: "Flat top",
    why: "A triangle, a pyramid and a rocket have a pointy top. A square is flat on top!",
  },

  /* ---------- Sky & space ---------- */
  {
    items: ["sun", "moon", "star", "cloud"],
    odd: "cloud",
    groupTag: "Shines",
    oddTag: "No light",
    why: "The sun, the moon and the stars shine in the sky. A cloud doesn't shine!",
  },
  {
    items: ["rocket", "planet", "moon", "bird"],
    odd: "bird",
    groupTag: "Space",
    oddTag: "Our sky",
    why: "A rocket, a planet and the moon are out in space. A bird flies in our sky!",
  },
  {
    items: ["rocket", "kite", "balloon", "boat"],
    odd: "boat",
    groupTag: "Up high",
    oddTag: "On water",
    why: "A rocket, a kite and a balloon go up into the sky. A boat floats on water!",
  },
  {
    items: ["bird", "butterfly", "kite", "fish"],
    odd: "fish",
    groupTag: "In the air",
    oddTag: "In water",
    why: "A bird, a butterfly and a kite are up in the air. A fish swims in water!",
  },

  /* ---------- Hot & cold, summer & winter ---------- */
  {
    items: ["sun", "fire", "candle", "icecream"],
    odd: "icecream",
    groupTag: "Hot",
    oddTag: "Cold",
    why: "The sun, a fire and a candle are hot. Ice cream is cold!",
  },
  {
    items: ["sun", "sunglasses", "icecream", "snowman"],
    odd: "snowman",
    groupTag: "Summer",
    oddTag: "Winter",
    why: "The sun, sunglasses and ice cream are for summer. A snowman is for winter!",
  },
  {
    items: ["snowman", "icecream", "fire", "glove"],
    odd: "fire",
    groupTag: "Cold days",
    oddTag: "Hot",
    why: "A snowman, ice cream and gloves go with cold. A fire is hot!",
  },

  /* ---------- Food: where it grows, how it tastes ---------- */
  {
    items: ["carrot", "potato", "onion", "apple"],
    odd: "apple",
    groupTag: "Underground",
    oddTag: "On a tree",
    why: "A carrot, a potato and an onion grow under the ground. An apple grows on a tree!",
  },
  {
    items: ["apple", "mango", "orange", "carrot"],
    odd: "carrot",
    groupTag: "On a tree",
    oddTag: "Underground",
    why: "Apples, mangoes and oranges grow on trees. A carrot grows under the ground!",
  },
  {
    items: ["icecream", "donut", "mango", "onion"],
    odd: "onion",
    groupTag: "Sweet",
    oddTag: "Not sweet",
    why: "Ice cream, a donut and a mango taste sweet. An onion doesn't!",
  },
  {
    items: ["banana", "orange", "mango", "apple"],
    odd: "apple",
    groupTag: "Peel it",
    oddTag: "Eat the skin",
    why: "We peel a banana, an orange and a mango. We can eat an apple with its skin on!",
  },
  {
    items: ["lemon", "orange", "strawberry", "potato"],
    odd: "potato",
    groupTag: "Eat it raw",
    oddTag: "Cook it",
    why: "You can eat a lemon, an orange and a strawberry raw. A potato needs cooking!",
  },

  /* ---------- Around the house ---------- */
  {
    items: ["spoon", "cup", "mug", "comb"],
    odd: "comb",
    groupTag: "Eat & drink",
    oddTag: "For hair",
    why: "We eat and drink with a spoon, a cup and a mug. A comb is for your hair!",
  },
  {
    items: ["comb", "towel", "toothbrush", "spoon"],
    odd: "spoon",
    groupTag: "Bathroom",
    oddTag: "Kitchen",
    why: "A comb, a towel and a toothbrush live in the bathroom. A spoon lives in the kitchen!",
  },
  {
    items: ["piano", "drum", "guitar", "book"],
    odd: "book",
    groupTag: "Music",
    oddTag: "Read it",
    why: "A piano, a drum and a guitar make music. A book is for reading!",
  },
  {
    items: ["glove", "hat", "shoes", "umbrella"],
    odd: "umbrella",
    groupTag: "Wear it",
    oddTag: "Hold it",
    why: "We wear gloves, a hat and shoes. We hold an umbrella!",
  },
  {
    items: ["bottle", "cup", "mug", "towel"],
    odd: "towel",
    groupTag: "Holds a drink",
    oddTag: "Dries you",
    why: "A bottle, a cup and a mug hold a drink. A towel dries you!",
  },

  /* ---------- Things that go ---------- */
  {
    items: ["bus", "car", "train", "boat"],
    odd: "boat",
    groupTag: "On land",
    oddTag: "On water",
    why: "A bus, a car and a train go on land. A boat goes on water!",
  },
  {
    items: ["boat", "fish", "duck", "car"],
    odd: "car",
    groupTag: "On water",
    oddTag: "On the road",
    why: "A boat, a fish and a duck can be on the water. A car drives on the road!",
  },
  {
    items: ["car", "bus", "train", "rocket"],
    odd: "rocket",
    groupTag: "Has wheels",
    oddTag: "No wheels",
    why: "A car, a bus and a train roll on wheels. A rocket blasts off with no wheels!",
  },

  /* ---------- Alive or not ---------- */
  {
    items: ["flower", "butterfly", "frog", "kite"],
    odd: "kite",
    groupTag: "Alive",
    oddTag: "A toy",
    why: "A flower, a butterfly and a frog are alive. A kite is a toy!",
  },
  {
    items: ["leaf", "mushroom", "flower", "star"],
    odd: "star",
    groupTag: "Grows",
    oddTag: "In the sky",
    why: "A leaf, a mushroom and a flower grow on the ground. A star is up in the sky!",
  },
  {
    items: ["rose", "leaf", "mushroom", "ball"],
    odd: "ball",
    groupTag: "Grows",
    oddTag: "A toy",
    why: "A rose, a leaf and a mushroom grow. A ball is a toy!",
  },

  /* ---------- Letters: which sound does it start with? ---------- */
  {
    items: ["ball", "banana", "bus", "apple"],
    odd: "apple",
    groupTag: "Starts with B",
    oddTag: "Starts with A",
    why: "Ball, banana and bus all start with B. Apple starts with A!",
  },
  {
    items: ["cat", "car", "cup", "dog"],
    odd: "dog",
    groupTag: "Starts with C",
    oddTag: "Starts with D",
    why: "Cat, car and cup all start with C. Dog starts with D!",
  },
  {
    items: ["sun", "star", "sheep", "moon"],
    odd: "moon",
    groupTag: "Starts with S",
    oddTag: "Starts with M",
    why: "Sun, star and sheep all start with S. Moon starts with M!",
  },
  {
    items: ["pig", "pencil", "piano", "hat"],
    odd: "hat",
    groupTag: "Starts with P",
    oddTag: "Starts with H",
    why: "Pig, pencil and piano all start with P. Hat starts with H!",
  },
  {
    items: ["hat", "hen", "horse", "cow"],
    odd: "cow",
    groupTag: "Starts with H",
    oddTag: "Starts with C",
    why: "Hat, hen and horse all start with H. Cow starts with C!",
  },
  {
    items: ["fish", "fox", "frog", "duck"],
    odd: "duck",
    groupTag: "Starts with F",
    oddTag: "Starts with D",
    why: "Fish, fox and frog all start with F. Duck starts with D!",
  },
  {
    items: ["rabbit", "rocket", "rose", "lion"],
    odd: "lion",
    groupTag: "Starts with R",
    oddTag: "Starts with L",
    why: "Rabbit, rocket and rose all start with R. Lion starts with L!",
  },
  {
    items: ["giraffe", "guitar", "glove", "bus"],
    odd: "bus",
    groupTag: "Starts with G",
    oddTag: "Starts with B",
    why: "Giraffe, guitar and glove all start with G. Bus starts with B!",
  },
  {
    items: ["camel", "clock", "comb", "pig"],
    odd: "pig",
    groupTag: "Starts with C",
    oddTag: "Starts with P",
    why: "Camel, clock and comb all start with C. Pig starts with P!",
  },
  {
    items: ["tortoise", "train", "toothbrush", "bear"],
    odd: "bear",
    groupTag: "Starts with T",
    oddTag: "Starts with B",
    why: "Tortoise, train and toothbrush all start with T. Bear starts with B!",
  },

  /* ---------- Rhymes ---------- */
  {
    items: ["moon", "spoon", "balloon", "cup"],
    odd: "cup",
    groupTag: "Rhymes",
    oddTag: "No rhyme",
    why: "Moon, spoon and balloon all rhyme! Cup doesn't.",
  },
  {
    items: ["car", "star", "guitar", "bus"],
    odd: "bus",
    groupTag: "Rhymes",
    oddTag: "No rhyme",
    why: "Car, star and guitar all rhyme! Bus doesn't.",
  },
];
