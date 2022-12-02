<script>
  import { Grid } from "gridjs";
  import "gridjs/dist/theme/mermaid.css";
  import { onMount } from "svelte";
  import "../../appwrite.js";
  import { client, users, query } from "../../store.js";

  let grid;

  let userData = [];

  const buildTable = () => {
    const promise = users.list([query.limit(100)]);
    promise.then(
      (r) => {
        userData = r["users"];
        grid = new Grid({
          search: true,
          sort: true,
          style: { table: { "font-size": "12px" } },
          columns: ["$id", "Name", "Email", "Registration"],
          data: r["users"],
        });
        grid.render(document.getElementById("tableWrapper"));
      },
      (e) => {
        console.log(e);
      }
    );
  };

  const dateFilter = (date) => {
    let input_date = new Date(date);
    let lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    if (input_date > lastWeek) {
        return true;
    } else {
        return false;
    }
  };

  onMount(() => {
    buildTable();
  });
</script>

<div class="p-3 mb-3">
  <h3>Key data</h3>
  <div>{userData.length} users | {userData.filter((x) => dateFilter(x["$createdAt"])).length} new users in last 7 days</div>
</div>
<div class="p-3">
  <h3>All users</h3>
  <div id="tableWrapper" />
</div>

<style>
</style>
