<script>
  import { closeModal } from "svelte-modals";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { databases, getUserName } from "../../store";

  // provided by <Modals />
  export let isOpen;

  export let gameId;
  let promiseSelected;
  let gameAssets = [];

  onMount(() => {
    promiseSelected = databases.getDocument("62e0fd281976e7171db9", "62e0fe08a4a5d6592df2", gameId);
    promiseSelected.then((result) => {
      var gameData = JSON.parse(result["json_game"]);
      for (var background in gameData["backgrounds"]) {
        gameAssets.push(gameData["backgrounds"][background]);
      }
      for (var objIndex in gameData["objects"]) {
        gameAssets.push(gameData["objects"][objIndex]["animImages"].flat());
      }
      gameAssets = gameAssets.flat();
    });
  });

  const assetLinkMaker = (id) => {
    return (
      "https://devback.banquise.app/v1/storage/buckets/62e0fd376bc80b0bcf70/files/" +
      id +
      "/view?project=62e0fcfca3b3c5124f16&fbclid=IwAR09oYlgW-jiVSb9_tMCdx-cEUc8gvmbE6QUlC8VNIvZY0-gDM3AFjzMHA0"
    );
  };

  let newRating = 0;
  let editingRating = false;
  const editRating = ()=>{
    databases.updateDocument("62e0fd281976e7171db9", "6384c64eceb6255252f2", gameId, {"rating":newRating});
    editingRating = false;
  }
</script>

{#if isOpen}
  <div role="dialog" class="modal" transition:fly>
    <div class="contents">
      <div>
        {#if promiseSelected != null}
          {#await promiseSelected then result}
            <div class="d-flex flex-row">
              <div class="p-3">
                <iframe style="border-radius:10px;" height="540" width="320" src={"https://banquise.app/#/minimal_view/" + result["$id"]} title="Content" />
              </div>
              <div class="p-3">
                <div class="p-2">
                  <h4>Infos</h4>
                  <table class="table table-dark">
                    <tbody>
                      <tr>
                        <th scope="row">Titre</th>
                        <td>{result["title"]}</td>
                      </tr>
                      <tr>
                        <th scope="row">Owner_id</th>
                        <td>{result["owner"]}</td>
                      </tr>
                      <tr>
                        <th scope="row">Owner_name</th>
                        <td>
                          {#await databases.getDocument("633fe0ac171c362df477", "633fe0baf186f65a0376", result["owner"]) then user_profile}
                            <td>{user_profile["user_name"]}</td>
                          {/await}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Public</th>
                        <td>{result["public"]}</td>
                      </tr>
                      <tr>
                        <th scope="row">Last update</th>
                        <td>{result["$updatedAt"].split("T")[0]}</td>
                      </tr>
                      <tr>
                        <th scope="row">Rating 🏆</th>
                        {#await databases.getDocument("62e0fd281976e7171db9", "6384c64eceb6255252f2", gameId) then ranking}
                          {#if !editingRating}
                          <td>{newRating == 0 ? ranking["rating"] : newRating}</td>
                          <td on:click={()=>editingRating = true} style="cursor:pointer;">✏️</td>
                          {:else}
                          <td><input type="number" bind:value={newRating}></td>
                          <td on:click={editRating} style="cursor:pointer;">✅</td>
                          {/if}
                        {/await}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="p-2">
                  <h4>Assets</h4>
                  <div class="py-2" style="max-height:200px; overflow-y:auto;">
                    {#each gameAssets as asset}
                      <img style="width:60px; height:60px;object-fit: contain;" src={assetLinkMaker(asset)} alt="asset view" />
                    {/each}
                  </div>
                </div>
                <div class="p-2 mt-3 d-flex align-items-center justify-content-around flex-wrap">
                  <div class="buttonBqz hvr-grow  mb-1">
                    <a
                      href="https://devback.banquise.app/console/project-62e0fcfca3b3c5124f16/databases/database-62e0fd281976e7171db9/collection-62e0fe08a4a5d6592df2/document-{gameId}"
                      target="_blank"
                      rel="noopener noreferrer">Appwrite link ✏️</a
                    >
                  </div>
                  <!-- <div class="buttonBqz  hvr-grow mb-1" style="background-color:#EDC3C3">-50 🏆</div>
                  <div class="buttonBqz  hvr-grow mb-1" style="background-color:#DBECE1">+50 🏆</div> -->
                </div>
              </div>
              <div />
            </div>
          {/await}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    /* allow click-through to backdrop */
    pointer-events: none;
  }

  .contents {
    min-width: 240px;
    width: clamp(50vw, 800px, 90vw);
    border-radius: 6px;
    padding: 16px;
    background: #202020;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
  }

  h2 {
    text-align: center;
    font-size: 24px;
  }
</style>
