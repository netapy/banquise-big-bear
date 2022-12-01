<script>
  import { Grid } from "gridjs";
  import "gridjs/dist/theme/mermaid.css";
  import { onMount } from "svelte";
  import "../../appwrite.js";
  import { databases, query } from "../../store.js";

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
          promiseSelected = databases.getDocument("62e0fd281976e7171db9", "62e0fe08a4a5d6592df2", args[1]["_cells"][0]["data"]);
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

  let promiseSelected;
</script>

<div class="p-3 mb-3">
  <h3>Key data</h3>
  <div>{gamesData.length} games | {gamesData.filter((x) => x["public"] == true).length} posted games</div>
</div>
{#if selectedId != ""}
  <div class="p-3 mb-3">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h3>🕹️ Selected content <span class="ms-2" on:click={() => (selectedId = "")}>✖️</span></h3>
    {#await promiseSelected then result}
      <div class="d-flex flex-row">
        <div>
          <iframe height="640" width="360" src={"https://banquise.app/#/minimal_view/" + result["$id"]} title="Content" />
        </div>
        <div class="p-3">
          {result["title"]}
        </div>
        <div />
      </div>
    {/await}
  </div>
{/if}
<div class="p-3">
  <h3>Table</h3>
  <div id="tableWrapper" />
</div>

<style>
</style>
