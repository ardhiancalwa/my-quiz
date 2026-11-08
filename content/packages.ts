const range = (prefix: string, first: number, last: number) =>
  Array.from({ length: last - first + 1 }, (_, i) => `${prefix}-${first + i}`);
export const examPackages = [
  {
    id: "original-demo-1",
    name: "Paket 01",
    questionIds: [
      ...range("listening", 1, 50),
      ...range("grammar", 1, 40),
      ...range("reading", 1, 50),
    ],
  },
  {
    id: "original-demo-2",
    name: "Paket 02",
    questionIds: [
      ...range("listening", 51, 80),
      ...range("listening", 111, 120),
      ...range("listening", 131, 140),
      ...range("grammar", 41, 55),
      ...range("grammar", 101, 125),
      ...range("reading", 51, 100),
    ],
  },
  {
    id: "original-demo-3",
    name: "Paket 03",
    questionIds: [
      ...range("listening", 81, 110),
      ...range("listening", 121, 130),
      ...range("listening", 141, 150),
      ...range("grammar", 56, 70),
      ...range("grammar", 126, 150),
      ...range("reading", 101, 150),
    ],
  },
];
