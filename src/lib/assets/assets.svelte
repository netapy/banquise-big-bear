<script>
  import { onMount } from "svelte";
  import "../../appwrite.js";
  import { client, users, query, storage } from "../../store.js";

  let imageList = [null,null,null,null];
  
  const createFile = () => {
    for (var fileIndex in imageList){
        if(imageList[fileIndex] != null){
            const promise = storage.createFile2("6319ea08e0cda71569b7", "id123", imageList[fileIndex]);
            promise.then(
              function (response) {
                console.log(response);
                alert(response);
              },
              function (error) {
                console.log(error);
              }
            );
        }
    }
  };

  let file_id;
  let asset_name;
  let asset_credits;
  let asset_category;

  const handleImageChange = (e, index) => {
    if (e.target.files[0].size > 1048576) {
      alert("Fichier trop volumineux! Veuillez séléctionner une image de moins de 1Mo.");
      e.target.value = "";
      return;
    }
    imageList[index] = e.target.files[0];
    console.log(imageList);
  };

</script>

<div class="p-3 mb-3">
  <!-- Add assets -->
  <h3>Add new assets ⚒️</h3>
  <div class="p-3 d-flex flex-column align-items-center mb-4 mt-3" style="background-color: #FAFAFA; border-radius:30px;">
    <div class="d-flex flex-row">
        <input class="d-none" on:change={(e) =>{handleImageChange(e,0)}}  type="file" id="img1" name="img1" accept="image/png, image/jpeg" />
        <label class="addImageCircle" for="img1"><img src={imageList[0] != null ? URL.createObjectURL(imageList[0]) : ""} alt="" /></label>
      {#if imageList[0] != null}
        <input class="d-none" on:change={(e) =>{handleImageChange(e,1)}}  type="file" id="img2" name="img2" accept="image/png, image/jpeg" />
        <label class="addImageCircle" for="img2"><img src={imageList[1] != null ? URL.createObjectURL(imageList[1]) : ""}  alt="" /></label>
      {/if}
      {#if imageList[1] != null}
        <input class="d-none" on:change={(e) =>{handleImageChange(e,2)}}  type="file" id="img3" name="img3" accept="image/png, image/jpeg" />
        <label class="addImageCircle" for="img3"><img src={imageList[2] != null ? URL.createObjectURL(imageList[2]) : ""}  alt="" /></label>
      {/if}
      {#if imageList[2] != null}
        <input class="d-none" on:change={(e) =>{handleImageChange(e,3)}}  type="file" id="img4" name="img4" accept="image/png, image/jpeg" />
        <label class="addImageCircle" for="img4"><img src={imageList[3] != null ? URL.createObjectURL(imageList[3]) : ""}  alt="" /></label>
      {/if}
    </div>
    <div class="p-3 d-flex flex-row">
      <input class="p-1 m-1" type="text" placeholder="file_id" bind:value={file_id} />
      <input class="p-1 m-1" type="text" placeholder="asset_name" bind:value={asset_name} />
      <input class="p-1 m-1" type="text" placeholder="asset_credits" bind:value={asset_credits} />
      <input class="p-1 m-1" type="text" placeholder="asset_category" bind:value={asset_category} />
      <select class="p-1 m-1" name="type">
        <option value="image">image</option>
        <option value="background">background</option>
        <option value="sound">sound</option>
        <option value="music">music</option>
      </select>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="buttonBqz hvr-grow" style="width: fit-content; font-size:1.2rem" on:click={createFile}>Send to server</div>
  </div>


  <!-- Bqz assets -->
  <h3>Banquise Assets</h3>
  {#if false}
  {#await storage.listFiles("6319ea08e0cda71569b7", [query.limit(100)]) then assets}
    <div>
      {#each assets["files"].reverse() as oneAsset}
        <img
          class="m-1"
          width="80"
          src="https://devback.banquise.app/v1/storage/buckets/6319ea08e0cda71569b7/files/{oneAsset['$id']}/view?project=62e0fcfca3b3c5124f16&mode=admin"
          alt=""
        />
      {/each}
    </div>
  {/await}
  {/if}
</div>

<style>
    .addImageCircle{
        width: 160px;
        height: auto;
        min-height: 50px;
        background-color: #dddddd;
        margin: 6px;
        border-radius: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .addImageCircle img{
      max-height: 150px;
    }
</style>
