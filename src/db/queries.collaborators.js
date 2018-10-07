const Collaborator = require("./models").Collaborator;

module.exports = {
  addCollaborator(newCollaborator, callback) {
    Collaborator.findOne({
      where: {
        userId: newCollaborator.userId,
        wikiId: newCollaborator.wikiId
      }
    })
    .then((collaborator) => {
      if (!collaborator) {
        return Collaborator.create({
          username: newCollaborator.username,
          email: newCollaborator.email,
          wikiId: newCollaborator.wikiId,
          userId: newCollaborator.userId
        })
        .then((collaborator) => {
          callback(null, collaborator);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        return callback("That collaborator has already been added to this wiki.");
      }
    });
  },
}
