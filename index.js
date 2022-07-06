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
  serversDate.innerText = new Date(date);
}

function updateDownloadButton() {
  loadingIcon.classList.add('d-none');
  downloadBtn.classList.remove('d-none');
}

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    updateServersDate(data.created);
    updateServerList(data.result);
    downloadBtn.addEventListener("click", function () {
      downloadObjectAsJson(data.result, "dayz-servers");
    });
  })
  .then(() => updateDownloadButton())
  .catch((err) => console.log(err));
