const apiUrl = "https://dayzsalauncher.com/api/v2/launcher/servers/dayz";
const serversDate = document.querySelector("#serversDate");
const serversList = document.querySelector("#serversList");
const downloadBtn = document.querySelector("#downloadBtn");
const loadingIcon = document.querySelector("#loadingIcon");

function downloadObjectAsJson(exportObj, exportName) {
  let dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(exportObj));
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

function deleteBadTimes(timeArr) {
  return timeArr[0] != '24' && timeArr[1] != '60';
}

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    let filteredData = data.result.filter((el) => deleteBadTimes(el.time.split(':')));
    let badData =  data.result.filter((el) => !deleteBadTimes(el.time.split(':')));
    console.log('Excluded servers: ' + badData);
    updateServersDate(data.created);
    updateServerList(data.result);
    downloadBtn.addEventListener("click", function () {
      downloadObjectAsJson(filteredData, "dayz-servers");
    });
  })
  .then(() => updateDownloadButton())
  .catch((err) => console.log(err));
