<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import "../../appwrite.js";
  import { client, users, query, storage, databases } from "../../store.js";
  import { Client, Storage, Account } from "appwrite";

  const uploadAsset = async () => {
    if (imageList[0] == null) return;
    const clientprov = new Client();
    const storageprov = new Storage(clientprov);
    const accountprov = new Account(clientprov);

    clientprov
      .setEndpoint("https://devback.banquise.app/v1")
      .setProject("62e0fcfca3b3c5124f16");
    await accountprov.createEmailSession(
      "contact@banquise.app",
      localStorage.getItem("clef").substring(0, 10)
    );

    let fileExists = false;
    try {
      let existsio = await storageprov.getFile("62e0fd376bc80b0bcf70","BQZ-" + file_id + "0");
      fileExists = true;
    } catch (error) {
      fileExists = false;
      alert("ID already exists. Change le batard !");
      return;
    }
    console.log("ii");

    for (var fileIndex in imageList) {
      if (imageList[fileIndex] != null) {
        try {
          const result = await storageprov.createFile(
            "62e0fd376bc80b0bcf70",
            "BQZ-" + file_id + fileIndex,
            imageList[fileIndex]
          );
          console.log(result);
        } catch (error) {
          console.error(error);
        }
      }
    }

    const resultParam = await databases.createDocument('62e0fd281976e7171db9', '6319ee54a8b01b588419', 'unique()', {
      "ressource_id": Array.from(Array(imageList.filter(Boolean).length), (x, i) => "BQZ-" + file_id + i).join(";"),
      "store": "banquise",
      "type": asset_type,
      "name": asset_name,
      "credits": asset_credits,
      "category": asset_category.split(";")
    });

    //console.log(resultParam);
    alert("Upload OK");
    //  Resetting
    imageList = [null, null, null, null];
    file_id = null;
    asset_name = null;
    asset_credits = null;
    asset_category = null;
    asset_type = null;
  };

  let imageList = [null, null, null, null];
  let file_id;
  let asset_name;
  let asset_credits;
  let asset_category;
  let asset_type;

  const handleImageChange = (e, index) => {
    if (e.target.files[0].size > 1572864) {
      alert(
        "Fichier trop volumineux! Veuillez séléctionner une image de moins de 1.5Mo."
      );
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
  <div
    class="p-3 d-flex flex-column align-items-center mb-4 mt-3"
    style="background-color: #FAFAFA; border-radius:30px; max-width:1000px"
  >
    <div class="d-flex flex-row">
      <input
        class="d-none"
        on:change={(e) => {
          handleImageChange(e, 0);
        }}
        type="file"
        id="img1"
        name="img1"
        accept="image/png, image/jpeg"
      />
      <label class="addImageCircle" for="img1"
        ><img
          src={imageList[0] != null ? URL.createObjectURL(imageList[0]) : ""}
          alt=""
        /></label
      >
      {#if imageList[0] != null && asset_type == "image"}
        <input
          class="d-none"
          on:change={(e) => {
            handleImageChange(e, 1);
          }}
          type="file"
          id="img2"
          name="img2"
          accept="image/png, image/jpeg"
        />
        <label class="addImageCircle" for="img2"
          ><img
            src={imageList[1] != null ? URL.createObjectURL(imageList[1]) : ""}
            alt=""
          /></label
        >
      {/if}
      {#if imageList[1] != null && asset_type == "image"}
        <input
          class="d-none"
          on:change={(e) => {
            handleImageChange(e, 2);
          }}
          type="file"
          id="img3"
          name="img3"
          accept="image/png, image/jpeg"
        />
        <label class="addImageCircle" for="img3"
          ><img
            src={imageList[2] != null ? URL.createObjectURL(imageList[2]) : ""}
            alt=""
          /></label
        >
      {/if}
      {#if imageList[2] != null && asset_type == "image"}
        <input
          class="d-none"
          on:change={(e) => {
            handleImageChange(e, 3);
          }}
          type="file"
          id="img4"
          name="img4"
          accept="image/png, image/jpeg"
        />
        <label class="addImageCircle" for="img4"
          ><img
            src={imageList[3] != null ? URL.createObjectURL(imageList[3]) : ""}
            alt=""
          /></label
        >
      {/if}
    </div>
    <div class="p-3 d-flex flex-wrap" style="max-width:800px;">
      <input
        class="p-1 m-1"
        type="text"
        placeholder="File id"
        maxlength="30"
        bind:value={file_id}
      />
      <input
        class="p-1 m-1"
        type="text"
        placeholder="Public name"
        bind:value={asset_name}
      />
      <input
        class="p-1 m-1"
        type="text"
        placeholder="Credits"
        bind:value={asset_credits}
      />
      <input
        class="p-1 m-1"
        type="text"
        placeholder="Category (split by ';' no space)"
        bind:value={asset_category}
      />
      <select class="p-1 m-1" name="type" bind:value={asset_type}>
        <option value="image">image</option>
        <option value="background">background</option>
        <option value="sound">sound</option>
        <option value="music">music</option>
      </select>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <button
      class=" hvr-grow"
      style="width: fit-content; font-size:1.2rem"
      on:click={uploadAsset}
      disabled={!file_id ||
        !asset_name ||
        !file_id ||
        !asset_type ||
        !imageList[0]}
    >
      Send to server
    </button>
  </div>

  {#if false}
    <!-- Bqz assets -->
    <h3>Banquise Assets</h3>
    {#await storage.listFiles( "6319ea08e0cda71569b7", [query.limit(100)] ) then assets}
      <div>
        {#each assets["files"].reverse() as oneAsset}
          <img
            class="m-1"
            style="object-fit: contain;"
            width="80"
            src="https://devback.banquise.app/v1/storage/buckets/6319ea08e0cda71569b7/files/{oneAsset[
              '$id'
            ]}/view?project=62e0fcfca3b3c5124f16&mode=admin"
            alt=""
          />
        {/each}
      </div>
    {/await}
  {/if}
</div>

<style>
  .addImageCircle {
    width: 160px;
    height: auto;
    min-height: 150px;
    background-color: #b5b5b5;
    margin: 6px;
    border-radius: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="%23ffffff" d="M14 14V6a2 2 0 012-2h2a2 2 0 012 2v8h8a2 2 0 012 2v2a2 2 0 01-2 2h-8v8a2 2 0 01-2 2h-2a2 2 0 01-2-2v-8H6a2 2 0 01-2-2v-2a2 2 0 012-2h8z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  }
  

  .addImageCircle img {
    max-height: 150px;
    max-width: 150px;
  }
</style>
