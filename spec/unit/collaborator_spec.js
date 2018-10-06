const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const Collaborator = require("../../src/db/models").Collaborator;

describe("Collaborator", () => {
  // before each test, we scope a User, Wiki, and Collaborator
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

  describe("#create()", () => {
    it("should create a collaborator object with a username, email, userId, and wikiId", (done) => {
      Collaborator.create({
        username: "osiris",
        email: "osi@gmail.com",
        userId: this.user.id,
        wikiId: this.wiki.id
      })
      .then((collaborator) => {
        expect(collaborator.username).toBe("osiris");
        expect(collaborator.email).toBe("osi@gmail.com");
        expect(collaborator.userId).toBe(this.user.id);
        expect(collaborator.wikiId).toBe(this.wiki.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a collaborator object with missing properties", (done) => {
      Collaborator.create({
        username: "osiris",
        email: "osi@gmail.com"
      })
      .then((collaborator) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Collaborator.userId cannot be null");
        expect(err.message).toContain("Collaborator.wikiId cannot be null");
        done();
      });
    });
  });// end #create()

  describe("#setUser", () => {
    it("should associate a collaborator and a user together", (done) => {
      // create an unassociated user
      User.create({
        username: "hello",
        email: "hello@gmail.com",
        password: "password"
      })
      .then((newUser) => {
        // expect that the original collaborator is associated with the original user
        expect(this.collaborator.userId).toBe(this.user.id);

        // associate the original collaborator with a new user
        this.collaborator.setUser(newUser)
        .then((collaborator) => {
          expect(collaborator.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });

  describe("#getUser", () => {
    it("should return the associated user for the collaborator", (done) => {
      this.collaborator.getUser()
      .then((associatedUser) => {
        expect(associatedUser.email).toBe("starman@tesla.com");
        done();
      });
    });
  });

  describe("#setWiki", () => {
    it("should associate a collaborator and a wiki together", (done) => {
      Wiki.create({
        title: "nba",
        body: "a basketball league",
        private: false,
        userId: this.user.id
      })
      .then((newWiki) => {
        expect(this.collaborator.wikiId).toBe(this.wiki.id);

        this.collaborator.setWiki(newWiki)
        .then((collaborator) => {
          expect(collaborator.wikiId).toBe(newWiki.id);
          done();
        });
      });
    });
  });

  describe("#getWiki", () => {
    it("should return the associated wiki for the collaborator", (done) => {
      this.collaborator.getWiki()
      .then((associatedWiki) => {
        expect(associatedWiki.title).toBe("cia");
        done();
      });
    });
  });
});
