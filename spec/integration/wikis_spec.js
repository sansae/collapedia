const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;

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

  describe("GET /wikis/:id", () => {
    it("should render a show view for the selected wiki", (done) => {
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Cryptocurrency");
        done();
      });
    });
  });
});
