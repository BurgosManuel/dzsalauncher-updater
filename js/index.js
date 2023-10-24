const apiUrl = "https://dayzsalauncher.com/api/v2/launcher/servers/dayz";
const serversDate = document.querySelector("#serversDate");
const serversList = document.querySelector("#serversList");
const downloadBtn = document.querySelector("#downloadBtn");
const loadingIcon = document.querySelector("#loadingIcon");

function downloadObjectAsJson(exportObj, exportName) {
  let dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(exportObj, null, "\t"));
  downloadBtn.setAttribute("href", dataStr);
  downloadBtn.setAttribute("download", exportName + ".json");
}

function updateServerList(data) {
  for (let sv of data) {
    let li = document.createElement("li");
    li.innerHTML = `<b>${sv.name}</b> - ${sv.endpoint.ip}:${sv.endpoint.port}`;
    serversList.appendChild(li);
  }
}

function updateServersDate(date) {
  serversDate.classList.remove("text-warning");
  serversDate.classList.add("text-success");
  serversDate.innerText = new Date(date).toLocaleString();
  }

function updateDownloadButton() {
  loadingIcon.classList.add("d-none");
  downloadBtn.classList.remove("d-none");
}

function filterBadData(timeArr) {
  let hour = new String(timeArr[0]);
  let minutes = new String(timeArr[1]);

  if(hour == "24" || minutes == "60") {console.log("badTime Detected ->>", timeArr)}

  let timeIsWrong = hour.length > 2 || minutes.length > 3

  return timeIsWrong;
}

function fixDatesFormat(serverList) {

  serverList.forEach(sv => {
    let timeArr = getServerTimeArray(sv);
    let hour = new String(timeArr[0]);
    let minutes = new String(timeArr[1]);

    let oldTime = sv.time;
    let newTime;

    // We fix those dates with minutes of 3 digits I.E -> 01:163 to 01:16.

    if(minutes.length > 2) {
      minutes = minutes.slice(0,2);
      newTime = hour + ":" + minutes;
      sv.time = newTime;

      logNewTime(sv.name, oldTime, newTime);
    }

    // Fix "24" hours and "60" minutes because max is 23:59.
    if(hour == "24") {
      newTime = "23:" + minutes;
      sv.time = newTime;
      logNewTime(sv.name, oldTime, newTime);
    }

    if(minutes == "60") {
      newTime = hour + ":" + "59";
      sv.time = newTime;
      logNewTime(sv.name, oldTime, newTime);
    }
  });
}

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log("data obtained", data);

    let serverList = data.result;

    let filteredServerList = serverList.filter((sv) =>{
      // Filter server with errors on the "time" property
      let svTime = getServerTimeArray(sv);
      let isWrong = filterBadData(getServerTimeArray(sv));
      if (isWrong) console.log("Server with wrong time ->", sv, svTime);
      return !isWrong;
    });

    fixDatesFormat(filteredServerList);

    updateServersDate(data.created);
    updateServerList(data.result);
    downloadBtn.addEventListener("click", function () {
      downloadObjectAsJson(filteredServerList, "dayz-servers");
    });
  })
  .then(() => updateDownloadButton())
  .catch((err) => console.log(err));


  const getServerTimeArray = (server) => server.time.split(":");

  const logNewTime = (svName, oldTime, newTime) => {
    console.log("I fixed the following server minutes:", {
      serverName: svName,
      oldTime,
      newTime
    });
  }