const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");

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
              expect(article).toHaveProperty(
                "comment_count",
                expect.any(Number)
              );
              expect(article.hasOwnProperty("body")).toBe(false);
            });
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    describe("GET 200: responds with all comments for provided article id, sorted by created_at (desc)", () => {
      test("that it returns 8 comments for article with id of 1", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then((response) => {
            expect(response.body).toHaveProperty("comments");
            const comments = response.body.comments;
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
              expect(comment).toHaveProperty("comment_id", expect.any(Number));
              expect(comment).toHaveProperty("votes", expect.any(Number));
              expect(comment.created_at).toMatch(
                /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/
              );
              expect(comment).toHaveProperty("author", expect.any(String));
              expect(comment).toHaveProperty("body", expect.any(String));
              expect(comment).toHaveProperty("article_id", 1);
            });
            expect(comments).toBeSortedBy("created_at", { descending: true });
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
  });
});
