<script>
  import Users from "./users/users.svelte";
  import Games from "./games/games.svelte";
  import Assets from "./assets/assets.svelte";
  import Stats from "./stats/stats.svelte";
  let currentMenu = "users";


  const disconnect = (e)=>{
    localStorage.clear();
    window.location.reload();
  }
</script>

<div class="w-100 main-container">
  <div style="opacity:.2; position:absolute; top:0px; left:0px; padding:5px;">v. 1.0.2</div>
  <button class="" style="position:absolute; top:0px; right:0px; border-radius:50%; background-color:transparent; border:none;" on:click={disconnect}>🧹</button>
  <div class="toolbar">
    <div class="tb-element hvr-grow {currentMenu == 'stats' ? 'selected' : ''}" on:click={() => (currentMenu = "stats")} on:keydown={(e) => {}}>📊 Stats</div>
    <div class="tb-element hvr-grow {currentMenu == 'users' ? 'selected' : ''}" on:click={() => (currentMenu = "users")} on:keydown={(e) => {}}>🙋 Users</div>
    <div class="tb-element hvr-grow {currentMenu == 'games' ? 'selected' : ''}" on:click={() => (currentMenu = "games")} on:keydown={(e) => {}}>🕹️ Games</div>
    <div class="tb-element hvr-grow {currentMenu == 'assets' ? 'selected' : ''}" on:click={() => (currentMenu = "assets")} on:keydown={(e) => {}}>🖼️ Assets</div>
  </div>
  <div class="content p-4 mt-3">
    {#if currentMenu == "users"}
      <Users />
    {:else if currentMenu == "games"}
      <Games />
    {:else if currentMenu == "assets"}
      <Assets/>
    {:else if currentMenu == "stats"}
      <Stats/>
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
    border-radius: 20px;
    min-width: 100px;
    background-color: #d9eaf8;
    color: #202020;
    font-family: "Quicksand";
    font-size: 1.2rem;
    transition: all 0.5s ease;
  }

  .selected {
    background-color: white !important;
  }
</style>
