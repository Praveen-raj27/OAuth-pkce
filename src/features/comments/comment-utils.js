export const comments = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Praveen"
    },
    content: "This is a really useful post!",
    createdAt: "2026-09-28T10:30:00Z",
    likes: 12,
    parentId: null,

    replies: [
      {
        id: 2,
        user: {
          id: 102,
          name: "Arun"
        },
        content: "Yes, I agree!",
        createdAt: "2026-09-28T10:35:00Z",
        likes: 5,
        parentId: 1,

        replies: [
          {
            id: 3,
            user: {
              id: 103,
              name: "Karthik"
            },
            content: "Same here. Very helpful.",
            createdAt: "2026-09-28T10:40:00Z",
            likes: 2,
            parentId: 2,

            replies: []
          }
        ]
      },
      {
        id: 4,
        user: {
          id: 104,
          name: "Vijay"
        },
        content: "I had the same experience.",
        createdAt: "2026-09-28T10:45:00Z",
        likes: 8,
        parentId: 1,

        replies: []
      }
    ]
  }
];