<script>
  import { Grid } from "gridjs";
  import { onMount } from "svelte";
  import "../../appwrite.js";
  import { databases, query } from "../../store.js";
  import { Modals, closeModal, openModal } from "svelte-modals";
  import Modal from "./gameviewModal.svelte";
  import { fade } from "svelte/transition";

  let grid;
  let gamesData = [];
  let idMap = {};
  let selectedId = "";

  const gettingAllGames = async () => {
    let documents = [];
    let query_param_games = [
      query.limit(100),
      query.orderDesc(""),
      query.limit(100),
    ];
    while (true) {
      let query_result = await databases.listDocuments(
        "62e0fd281976e7171db9",
        "62e0fe08a4a5d6592df2",
        query_param_games
      );
      documents = documents.concat(query_result["documents"]);
      if (query_result["documents"].length == 0) {
        break;
      }
      query_param_games[2] = query.cursorAfter(
        query_result["documents"][query_result["documents"].length - 1].$id
      );
    }
    return documents;
  };

  const buildTable = async () => {
    const gamesDataReq = await gettingAllGames();
    //  idMap = await getUserNames(gamesDataReq.map((x) => x["owner"]));
    gamesData = gamesDataReq;
    grid = new Grid({
      autoWidth: true,
      resizable: true,
      search: true,
      sort: true,
      style: { table: { "font-size": "14px" },  },
      columns: [
        "$id",
        "Title",
        "Owner",
        "$createdAt",
        "category",
        "Public",
        "nsfw",
      ],
      data: gamesData.map((game) => [
        game.$id,
        game["title"],
        game["owner"],
        //  idMap[game["owner"]],
        game["$createdAt"].split("T")[0],
        game["category"].join(", "),
        String(game["public"]),
        String(game["nsfw"]),
      ]),
    });
    grid.render(document.getElementById("tableWrapper"));
    grid.on("rowClick", (...args) => {
      selectedId = args[1]["_cells"][0]["data"];
      handleClick(selectedId);
    });
  };

  const filterPublicGames = (e) => {
    if (e.target.checked) {
      grid.updateConfig({
        data: gamesData
          .filter((x) => x["public"] != false)
          .map((game) => [
            game.$id,
            game["title"],
            idMap[game["owner"]],
            game["$createdAt"].split("T")[0],
            game["category"].join(", "),
            String(game["public"]),
            String(game["nsfw"]),
          ]),
      });
    } else {
      grid.updateConfig({
        data: gamesData.map((game) => [
          game.$id,
          game["title"],
          idMap[game["owner"]],
          game["$createdAt"].split("T")[0],
          game["category"].join(", "),
          String(game["public"]),
          String(game["nsfw"]),
        ]),
      });
    }
    grid.forceRender();
  };

  onMount(() => {
    buildTable();
  });

  async function getUserNames(userIds) {
    const result = await databases.listDocuments(
      "633fe0ac171c362df477",
      "633fe0baf186f65a0376",
      [query.equal("$id", userIds)]
    );
    const idMap = {};
    for (const theid of userIds) {
      idMap[theid] = result.documents.some((el) => el.$id == theid)
        ? result.documents.find((el) => el.$id === theid)["user_name"]
        : theid;
    }
    return idMap;
  }

  function handleClick(id) {
    openModal(Modal, { gameId: id });
  }
</script>

<div class="p-3 mb-3">
  <h3>Key data</h3>
  <div>
    {gamesData.length} games | {gamesData.filter((x) => x["public"] == true)
      .length} posted games
  </div>
</div>
<div class="p-3">
  <h3>All games</h3>
  <div class="p-3">
    <input
      type="checkbox"
      class="me-2"
      id="publicIO"
      on:change={filterPublicGames}
    /><label for="publicIO">Only public games</label>
  </div>
  <div id="tableWrapper" />
</div>
<Modals>
  <div
    slot="backdrop"
    class="backdrop"
    on:click={closeModal}
    on:keydown={closeModal}
    transition:fade
  />
</Modals>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }

</style>
