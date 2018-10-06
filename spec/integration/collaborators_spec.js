const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const Collaborator = require("../../src/db/models").Collaborator;

describe("routes : collaborators", () => {
  beforeEach((done) => {
    this.user;
    this.wiki;
    this.collaborator;

    sequelize.sync({force: true})
    .then((res) => {
      User.create({
        username: "starman",
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "cia",
          body: "government security agency",
          private: false,
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;

          Collaborator.create({
            username: "porith",
            email: "porith@gmail.com",
            userId: this.user.id,
            wikiId: this.wiki.id
          })
          .then((collaborator) => {
            this.collaborator = collaborator;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          })
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });// end beforeEach

  describe("GET /wikis/:wikiId/new", () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "premium",
          userId: this.user.id
        }
      }, (err, res, body) => {
        done();
      });
    });

    it("should render a new collaborator form", (done) => {
      request.get(`${base}wikis/${this.wiki.id}/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Add Collaborator");
        done();
      });
    });
  });
});
