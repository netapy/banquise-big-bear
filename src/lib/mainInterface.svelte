<script>
  let currentMenu = "users";
</script>

<div class="w-100 main-container">
  <div class="toolbar">
    <div class="tb-element hvr-grow" on:click={() => currentMenu = "users"} on:keydown={(e)=>{}}>🙋 Users</div>
    <div class="tb-element hvr-grow" on:click={() => currentMenu = "games"} on:keydown={(e)=>{}}>🕹️ Games</div>
    <div class="tb-element hvr-grow" on:click={() => currentMenu = "stats"} on:keydown={(e)=>{}}>📊 Stats</div>
  </div>
  <div class="content p-4 mt-3">
    {#if currentMenu == "users"}
      <div>users</div>
    {:else if currentMenu == "games"}
      <div>games</div>
    {:else if currentMenu == "stats"}<div>stats</div>
    {/if}
  </div>
</div>

<style>
  .main-container {
    min-height: 600px;
  }
  

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toolbar .tb-element {
    padding: 10px 30px;
    margin: 0px 6px;
    text-align: center;
    border-radius: 16px;
    min-width: 100px;
    background-color: #d9eaf8;
    color: #202020;
    font-family: "Quicksand";
    font-size: 1.2rem;
  }
</style>
