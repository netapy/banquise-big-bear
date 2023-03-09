<script>
  import * as echarts from "echarts";
  import { onMount } from "svelte";
  import { client, users, query, databases } from "../../store.js";

  onMount(() => {
    userGraphGeneration();
    gamesGraphGeneration();
  });

  let userSdk = users;

  const userGraphGeneration = async () => {
    // Get list of users from the `usersvar` object
    let users = await userSdk.list([query.limit(100)]);

    // Extract the dates that the users were created
    const datelist = users.users.map((x) => x.$createdAt);

    // Round the dates to midnight to group users created on the same day together
    const roundedDates = datelist.map((date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    });

    // Get the earliest and latest dates in the list of rounded dates
    const minDate = new Date(Math.min.apply(null, roundedDates));
    const maxDate = new Date(Math.max.apply(null, roundedDates));

    // Generate a list of all dates between the earliest and latest dates
    const allDates = [];
    let currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      allDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count the number of users created on each date
    const dateCounts = {};
    for (const date of allDates) {
      dateCounts[date] = 0;
    }
    for (const date of roundedDates) {
      dateCounts[date] += 1;
    }

    // Extract the labels and data from the dateCounts object
    const labels = allDates.map((d) =>
      d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    );
    let data = allDates.map((d) => dateCounts[d]);

    // Cumulatively sum the data
    for (let i = 1; i < data.length; i++) {
      data[i] += data[i - 1];
    }

    let myChart = echarts.init(document.getElementById("chartcontainerUsers"));
    myChart.setOption({
      title: {
        text: "🙋 New sign-ups on Banquise | total : " + users.total,
        textStyle: {
          color: "white",
        },
      },
      tooltip: {},
      xAxis: {
        data: labels,
      },
      label: {
        show: true,
        position: "bottom",
        textStyle: {
          fontSize: 12,
        },
      },

      yAxis: {},
      series: [
        {
          name: "sign-ups",
          type: "line",
          data: data,
        },
      ],
    });
  };

  const gamesGraphGeneration = async () => {
    // Get list of games from the databases object
    let games = await databases.listDocuments(
      "62e0fd281976e7171db9",
      "62e0fe08a4a5d6592df2",
      [query.limit(100), query.equal("public", true), query.notEqual("$id", "")]
    );

    // Extract the dates that the games were published
    const datelist = games.documents.map((x) => x.$updatedAt);

    // Round the dates to midnight to group games published on the same day together
    const roundedDates = datelist.map((date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    });

    // Get the earliest and latest dates in the list of rounded dates
    const minDate = new Date(Math.min.apply(null, roundedDates));
    const maxDate = new Date(Math.max.apply(null, roundedDates));

    // Generate a list of all dates between the earliest and latest dates
    const allDates = [];
    let currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      allDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count the number of games published on each date
    const dateCounts = {};
    for (const date of allDates) {
      dateCounts[date] = 0;
    }
    for (const date of roundedDates) {
      dateCounts[date] += 1;
    }

    // Extract the labels and data from the dateCounts object
    const labels = allDates.map((d) =>
      d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    );
    let data = allDates.map((d) => dateCounts[d]);

    // Cumulatively sum the data
    for (let i = 1; i < data.length; i++) {
      data[i] += data[i - 1];
    }

    // Create the chart using the ECharts library
    let myChart = echarts.init(document.getElementById("chartcontainerGames"));
    myChart.setOption({
      title: {
        text: "🕹️ Published games on Banquise | total : " + games.total,
        textStyle: {
          color: "white",
        },
      },
      tooltip: {},
      xAxis: {
        data: labels,
        interval: 4,
        //min: 0,
        //max: 10,
      },
      label: {
        show: false,
        position: "bottom",
        textStyle: {
          fontSize: 12,
        },
      },
      yAxis: {},
      series: [
        {
          name: "Published games",
          type: "line",
          data: data,
        },
      ],
    });
  };
</script>


<div style="height:90vh; border-radius:20px;">
  <iframe
    style="border-radius:20px;"
    title="Banquise Analytics"
    src="https://home.banquise.app/"
    frameborder="0"
    marginheight="0"
    marginwidth="0"
    width="100%"
    height="100%"
  />
</div>
<div class="row py-3">
  <div class="col-6">
    <div id="chartcontainerUsers" style="width: 100%; height:400px" />
  </div>
  <div class="col-6">
    <div id="chartcontainerGames" style="width: 100%; height:400px" />
  </div>
</div>
