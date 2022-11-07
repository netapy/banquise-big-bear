function loadUsers() {
  document.getElementById("tableContainer").innerHTML = '<div id="wrapper"></div>';
  new gridjs.Grid({
    columns: ["user_id", "user_name", "email", "registration"],
    server: {
      url: "/users",
      then: (data) => {
        console.log(data.response.users);
        return data.response.users.map((user) => [user.$id, user.name, user.email, user.registration]);
      },
    },
  }).render(document.getElementById("wrapper"));
}

function loadGames() {
  document.getElementById("tableContainer").innerHTML = '<div id="wrapper"></div>';
  new gridjs.Grid({
    columns: ["id", "title", "owner_id", "public", "category", "updatedAt", "createdAt"],
    server: {
      url: "/games",
      then: (data) => {
        return data.response.documents.map((game) => [game.$id, game.title, game.owner, String(game.public), game.category.join(", "), game.$updatedAt.split("T")[0], game.$createdAt.split("T")[0]]);
      },
    },
  }).render(document.getElementById("wrapper"));
}
