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

  describe("GET /users/sign_up", () => {
    it("should render a view with a sign-up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });
  });
})
