const { Post, PostSchema } = require("./post.js");


function setUpModels(sequelize) {
  // Inicialización
  Post.init(PostSchema, Post.config(sequelize));


  // Relaciones
  Post.associate(sequelize.models);

}

module.exports = setUpModels;
