const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const endpointsJson = require("../endpoints.json");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api/invalid-path", () => {
  describe("GET 404: responds with an error if the path does not exist", () => {
    test("that it returns an error object if the path is invalid", () => {
      return request(app)
        .get("/api/invalid-path")
        .expect(404)
        .then((response) => {
          const error = response.body;
          expect(error.msg).toBe("Invalid path!");
        });
    });
  });
});

describe("/api/", () => {
  describe("GET 200: responds with a description of endpoints in JSON format", () => {
    test("that it returns a properly formatted JSON object", () => {
      return request(app)
        .get("/api/")
        .then((response) => {
          expect(response.body).toEqual(endpointsJson);
        });
    });
  });
});

describe("/api/topics", () => {
  describe("GET 200: responds with all topics", () => {
    test("that it returns an object with an array of 3 topics (nested under 'topics') and they match the expected shape", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.hasOwnProperty("topics")).toBe(true);
          const topics = response.body.topics;
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });
});

describe("/api/articles", () => {
  describe("/api/articles/:article_id", () => {
    describe("GET 200: responds with requested article by ID", () => {
      test("that it returns an object of the requested ID (nested under 'article') and it matches the expected shape", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((response) => {
            expect(response.body.hasOwnProperty("article")).toBe(true);
            const { article } = response.body;
            expect(article).toEqual(
              expect.objectContaining({
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: "2020-07-09T19:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
            );
          });
      });
    });
    test("that it returns a 404 error if the article does not exist", () => {
      return request(app)
        .get("/api/articles/666")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article not found!");
        });
    });
    test("that it returns a 400 error if the given ID is not a number", () => {
      return request(app)
        .get("/api/articles/x")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid ID! Article ID must be a number."
          );
        });
    });
  });
  describe("PATCH 200: responds with the article that had its vote count changed", () => {
    test("that it successfully increments the vote_count for the given article", () => {
      const newVote = { inc_votes: 5 };
      return request(app)
        .patch("/api/articles/1/")
        .send(newVote)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty("article");
          const updatedArticle = response.body.article;
          expect(updatedArticle).toEqual(
            expect.objectContaining({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              body: "I find this existence challenging",
              topic: "mitch",
              created_at: "2020-07-09T19:11:00.000Z",
              votes: 105,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
          );
        });
    });
    test("that it successfully decrements the vote_count for the given article", () => {
      const newVote = { inc_votes: -5 };
      return request(app)
        .patch("/api/articles/1/")
        .send(newVote)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty("article");
          const updatedArticle = response.body.article;
          expect(updatedArticle).toEqual(
            expect.objectContaining({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              body: "I find this existence challenging",
              topic: "mitch",
              created_at: "2020-07-09T19:11:00.000Z",
              votes: 95,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
          );
        });
    });
  });
  describe("PATCH 404: responds with error if article not found", () => {
    test("that it returns a 404 error if no user with the given user id exists", () => {
      const newVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/666")
        .send(newVote)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article not found!");
        });
    });
  });
  describe("PATCH 400: responds with error if there is a problem with the given new vote value", () => {
    test("that it returns a 400 error if inc_votes property is missing from request", () => {
      const newVote = { something: "else" };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("New vote must not be missing!");
        });
    });
    test("that it returns a 400 error if the given newVote value is something other than a whole number", () => {
      const newVote = { inc_votes: "x" };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("New vote must be an integer!");
        });
    });
  });
});

describe("/api/articles/", () => {
  describe("GET 200: responds with all articles", () => {
    test("that it returns an object with an array of 12 articles, including a 'comment_count' column and sorted by 'created_at' date (desc)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty("articles");
          const articles = response.body.articles;
          expect(articles.length).toBeGreaterThan(0);
          articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article.created_at).toMatch(
              /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/
            );
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count", expect.any(Number));
            expect(article.hasOwnProperty("body")).toBe(false);
          });
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET 200: responds with all comments for provided article id, sorted by created_at (desc)", () => {
    test("that it returns 11 comments for article with id of 1", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty("comments");
          const comments = response.body.comments;
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.stringMatching(
                  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/
                ),
                author: expect.any(String),
                body: expect.any(String),
                article_id: 1,
              })
            );
          });
          expect(comments[0]).toEqual(
            expect.objectContaining({
              comment_id: 5,
              votes: 0,
              created_at: "2020-11-03T20:00:00.000Z",
              author: "icellusedkars",
              body: "I hate streaming noses",
              article_id: 1,
            })
          );
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("that it returns an empty array if the article id is valid and has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty("comments");
          const comments = response.body.comments;
          expect(comments).toEqual([]);
        });
    });
    test("that it returns a 404 error if the article does not exist", () => {
      return request(app)
        .get("/api/articles/666/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article not found!");
        });
    });
    test("that it returns a 400 error if the given ID is not a number", () => {
      return request(app)
        .get("/api/articles/x/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid ID! Article ID must be a number."
          );
        });
    });
  });
  describe("POST 201: responds with inserted comment", () => {
    test("that a valid format is inserted into the database and the created comment is returned", () => {
      const articleId = 1;
      const newComment = {
        username: "butter_bridge",
        body: "this is a test comment.",
      };
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(newComment)
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty("comment");
          const returnedComment = response.body.comment;
          expect(returnedComment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: newComment.body,
              article_id: articleId,
              author: newComment.username,
              votes: 0,
              created_at: expect.stringMatching(
                /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/
              ),
            })
          );
        });
    });
  });
  describe("POST 404: user or article not found", () => {
    const newComment = {
      username: "madeupusername",
      body: "this is a test comment.",
    };
    test("that it returns a 404 error if the user does not exist", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("User not found!");
        });
    });
    test("that it returns a 404 error if the article does not exist", () => {
      return request(app)
        .post("/api/articles/666/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article not found!");
        });
    });
  });
  describe("POST 400: invalid submitted data", () => {
    test("that it returns a 400 error if the article id is not a number", () => {
      const newComment = {
        username: "butter_bridge",
        body: "test comment",
      };
      request(app)
        .post("/api/articles/x/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Invalid ID! Article ID must be a number."
          );
        });
    });
    test("that it returns a 400 error if comment body property is missing", () => {
      const newComment = {
        username: "butter_bridge",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Comment cannot be missing!");
        });
    });
    test("that it returns a 400 error if comment body value is an empty string", () => {
      const newComment = {
        username: "butter_bridge",
        body: "",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Comment cannot be missing!");
        });
    });
    test("that it returns a 400 error if JSON markup is invalid", () => {
      const invalidJson = `{"usernam= "butter_bridge", "body": "this is a dqdwsd"}`;
      return request(app)
        .post("/api/articles/1/comments")
        .set("Content-type", "application/json")
        .send(invalidJson)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid request body!");
        });
    });
  });
});
