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
            console.log(article);
            expect(article.author).toBe("jessjelly");
            expect(article.title).toBe("Running a Node App");
            expect(article.article_id).toBe(1);
            expect(article.body).toBe(
              "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment."
            );
            expect(article.topic).toBe("coding");
            expect(article.created_at).toBe("2020-11-07T05:03:00.000Z");
            expect(article.votes).toBe(0);
            expect(article.article_img_url).toBe(
              "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700"
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
});
