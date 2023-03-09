<script>
  import { Grid } from "gridjs";
  import "gridjs/dist/theme/mermaid.css";
  import { onMount } from "svelte";
  import "../../appwrite.js";
  import { client, databases, users, query } from "../../store.js";

  let grid;

  let userData = [];
  let idMap = {};
  let userCount;

  const buildTable = () => {
    const promise = users.list([query.limit(100), query.orderDesc("$createdAt")]);
    promise.then(
      async (r) => {
        
        userData = r["users"];
        userCount = r["total"]
        idMap = await getUserNames(userData.map((x) => x["$id"]));
        grid = new Grid({
          search: true,
          sort: true,
          style: { table: { "font-size": "12px" } },
          columns: ["$id", "username", "Name", "Email", "Registration"],
          data: userData.map((user) => [
            user.$id,
            idMap[user.$id],
            user.name,
            user.email,
            user.$createdAt
          ]),
        });
        grid.render(document.getElementById("tableWrapper"));
      },
      (e) => {
        console.log(e);
      }
    );
  };

  async function getUserNames(userIds) {
    const result = await databases.listDocuments("633fe0ac171c362df477", "633fe0baf186f65a0376", [query.equal("$id", userIds)]);
    const idMap = {};
    for (const theid of userIds) {
      idMap[theid] = result.documents.some((el) => el.$id == theid) ? result.documents.find((el) => el.$id === theid)["user_name"] : theid;
    }
    return idMap;
  }

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

<div class="p-3 mb-3 mx-auto">
  <h3>Key data</h3>
  <div>
    {userCount} users | {userData.filter((x) =>
      dateFilter(x["$createdAt"])
    ).length} new users in last 7 days
  </div>
</div>
<div class="p-3">
  <h3>All users</h3>
  <div id="tableWrapper" />
</div>

<style>
</style>
