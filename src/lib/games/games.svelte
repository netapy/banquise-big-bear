<script>
  import { Grid } from "gridjs";
  import "gridjs/dist/theme/mermaid.css";
  import { onMount } from "svelte";
  import "../../appwrite.js";
  import { databases, query } from "../../store.js";
  import { Modals, closeModal, openModal } from "svelte-modals";
  import Modal from "./gameviewModal.svelte";
  import { fade } from "svelte/transition";

  let grid;
  let gamesData = [];
  let selectedId = "";

  const buildTable = () => {
    const promise = databases.listDocuments("62e0fd281976e7171db9", "62e0fe08a4a5d6592df2", [query.limit(100)]);
    promise.then(
      (r) => {
        console.log(r);
        gamesData = r["documents"];
        grid = new Grid({
          autoWidth: true,
          resizable: true,
          search: true,
          sort: true,
          style: { table: { "font-size": "12px" } },
          columns: ["$id", "Title", "Owner", "$createdAt", "category", "Public", "nsfw"],
          data: r["documents"].map((game) => [
            game.$id,
            game["title"],
            game["owner"],
            game["$createdAt"].split("T")[0],
            game["category"].join(", "),
            String(game["public"]),
            String(game["nsfw"]),
          ]),
        });
        grid.render(document.getElementById("tableWrapper"));
        grid.on("rowClick", (...args) => {
          console.log(args[1]["_cells"][0]["data"]);
          selectedId = args[1]["_cells"][0]["data"];
          handleClick(selectedId);
        });
      },
      (e) => {
        console.log(e);
      }
    );
  };
  onMount(() => {
    buildTable();
  });

  function handleClick(id) {
    openModal(Modal, { gameId: id });
  }

</script>

<div class="p-3 mb-3">
  <h3>Key data</h3>
  <div>{gamesData.length} games | {gamesData.filter((x) => x["public"] == true).length} posted games</div>
</div>
<div class="p-3">
  <h3>Table</h3>
  <div id="tableWrapper" />
</div>
<Modals>
  <div slot="backdrop" class="backdrop" on:click={closeModal} transition:fade />
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
