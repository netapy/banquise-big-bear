<script>
  import { client, users } from "./store.js";
  // @ts-ignore
  import MainInterface from "./lib/mainInterface.svelte";

  let apiKey = "";
  let connected = false;

  const setClientKey = () => {
    client.setEndpoint("https://devback.banquise.app/v1").setProject("62e0fcfca3b3c5124f16").setKey(apiKey);
    const promise = users.list();
    promise.then(
      (r) => {
        console.log(r);
        connected = true;
      },
      (e) => {
        console.log(e);
        connected = false;
      }
    );
  };
</script>

<main class="container-fluid {!connected ? "d-flex align-items-center justify-content-center h-100 flex-column" :""}" style="min-height: 90vh;">
  <div class="p-3 d-flex align-items-center justify-content-center">
    <img src="/logo_white_mask_transp.png" width="90" class="mb-2 me-3" alt="logo" />
    <h1 style="font-size: 4rem;">Big Bear</h1>
  </div>
  {#if !connected}
    <div class="p-1 text-center">
      <input  style="width: 400px;" type="text" bind:value={apiKey} placeholder="Secret...🤫" />
      <button class="buttonBqz" on:click={setClientKey}>☑️</button>
    </div>
  {:else}
    <div>
      <MainInterface />
    </div>
  {/if}
</main>
