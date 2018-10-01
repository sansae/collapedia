const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("routes : users ", () => {
  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  describe("GET /users/signup", () => {
    it("should render a view with a sign-up form", (done) => {
      request.get(`${base}signup`, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });
  });

  describe("GET /users/signin", () => {
    it("should render a view with a sign in form", (done) => {
      request.get(`${base}signin`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign In");
        done();
      });
    });
  });

  describe("GET /users/upgrade", () => {
    it("should render a view with an upgrade form", (done) => {
      request.get(`${base}upgrade`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Upgrade");
        done();
      });
    });
  });

  describe("GET /users/downgrade", () => {
    it("should render a view with a downgrade form", (done) => {
      request.get(`${base}downgrade`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Downgrade");
        done();
      });
    });
  });
});
