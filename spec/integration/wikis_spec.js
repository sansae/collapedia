const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
  beforeEach((done) => {
    this.wiki;
    sequelize.sync({force: true}).then((res) => {
      Wiki.create({
        title: "Cryptocurrency",
        body: "A digital form of currency that will not last",
        private: false
      })
      .then((wiki) => {
        this.wiki = wiki;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  /* define the standard user context; standard users are anyone who has an account; they should be able to perform all CRUD actions as long as they are logged in */
  describe("standard user performing CRUD actions for Wiki", () => {
    /* before each test in standard user context, send an authentication request to a route we will create to mock an authentication request */
    beforeEach((done) => {
      User.create({
        username: "osiris",
        email: "osiris@bossman.com",
        password: "123456",
      })
      .then((user) => {
        request.get({     // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            // mock authenticate as user
            userId: user.id,
            username: user.username,
            email: user.email
          }
        }, (err, res, body) => {
          done();
        });
      });
    });

    describe("GET /wikis", () => {
      it("should return a status code 200 and all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Cryptocurrency");
          expect(body).toContain("Wikis");
          done();
        });
      });
    })

    describe("GET /wikis/new", () => {
      it("should display a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });

    describe("POST /wikis/create", () => {
      it("should create a new wiki and redirect", (done) => {
        const options = {
          url: `${base}create`,
          form: {
            title: "Wiki Leaks",
            body: "Blame Southpark",
            private: false
          }
        };

        request.post(options,
          (err, res, body) => {
            Wiki.findOne({where: {title: "Wiki Leaks"}})
            .then((wiki) => {
              expect(res.statusCode).toBe(303);
              expect(wiki.title).toBe("Wiki Leaks");
              expect(wiki.body).toBe("Blame Southpark");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });
    });

    describe("GET /wikis/:id", () => {
      it("should render a show view for the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Cryptocurrency");
          done();
        });
      });
    });

    describe("POST /wikis/:id/destroy", () => {
      it("should delete the wiki with the associated id", (done) => {
        Wiki.all()
        .then((wikis) => {
          const wikisBeforeDelete = wikis.length;
          expect(wikisBeforeDelete).toBe(1);
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.all()
            .then((wikis) => {
              expect(wikis.length).toBe(wikisBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });

    describe("GET /wikis/:id/edit", () => {
      it("should render an edit view form for the selected wiki with pre-populated values", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Cryptocurrency");
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should update the wiki with the associated id", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "Bitcoins",
            body: "The king of cryto?",
            private: true
          }
        };

        request.post(options, (err, res, body) => {
          Wiki.findOne({
            where: { id: this.wiki.id }
          })
          .then((wiki) => {
            expect(wiki.title).toBe("Bitcoins");
            done();
          });
        });
      });
    });
  });// end standard user context
});
