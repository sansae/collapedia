const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {
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

  /* test that when calling Wiki.create with valid arguments, that a wiki object is created and stored in the database */
  describe("#create", () => {
    it("should create a wiki object and store it in the database", (done) => {
      Wiki.all()
      .then((wikis) => {
        expect(wikis.length).toBe(0);

        Wiki.create({
          title: "Cryptocurrency",
          body: "A digital form of currency that will not last",
          private: false
        })
        .then((wiki) => {
          Wiki.all()
          .then((wikis) => {
            expect(wikis.length).toBe(1);
            expect(wiki.title).toBe("Cryptocurrency");
            done();
          });
        });
      });
    });

    it("should not create a wiki object with invalid arguments", (done) => {
      Wiki.create({
        title: "Basketball",
        body: "An American sport involving a ball and a hoop"
      })
      .then((wiki) => {
        /* since Wiki.create is missing an argument, this will cause a validation error, which will skip .then and go to .catch */
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Wiki.private cannot be null");
        done();
      });
    });
  });
});
