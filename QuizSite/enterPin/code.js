class IIS
{
    constructor(iisLink)
    {
        this.iisLink = iisLink;
    }

    open(link)
    {
        var totalLink = this.iisLink + "/" + link;
        window.open(totalLink, "_self");
    }
}

class Server
{
    constructor(serverUrl)
    {
        this.serverUrl = serverUrl;
    }

    //Post data to server. Once server returns response, activate responseFunc with response. Async
    postA(url, data, responseFunc)
    {
        let xhr = new XMLHttpRequest();
        url = this.serverUrl + "/" + url;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let json = JSON.parse(xhr.responseText);
                responseFunc(json);
            }
        };

        xhr.send(JSON.stringify(data));
    }

    //Get data from server. When server returns response, call responseFunc with response. Async
    getA(url, data, responseFunc)
    {
        let xhr = new XMLHttpRequest();
        url = this.serverUrl + "/" + url + "?data=" + encodeURIComponent(JSON.stringify(data));
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let json = JSON.parse(xhr.responseText);
                responseFunc(json)
            }
        };

        xhr.send();
    }

    //post to server. Return response. Sync
    postS(url, data)
    {
        let xhr = new XMLHttpRequest();
        url = this.serverUrl + "/" + url;
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(data));

        return JSON.parse(xhr.responseText);
    }

    //get from server. Return response. Sync
    getS(url, data)
    {
        let xhr = new XMLHttpRequest();
        url = this.serverUrl + "/" + url + "?data=" + encodeURIComponent(JSON.stringify(data));
        xhr.open("GET", url, false);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send();

        return JSON.parse(xhr.responseText);
    }
}

var server = new Server("http://127.0.0.1:5000");
var iis = new IIS("http://localhost");


//ask server if quiz exists when submiting pin
function handleSubmit(event)
{
    event.preventDefault();

    const data = new FormData(event.target);
  
    const pin = data.get("pin");
  
    func = function(responseText)
    {
        if(responseText["exists"] == "false")
        {
            //alert when game with pin doesnt exist
            alert("Game with pin " + responseText["pin"] + " doesn't exist");
        }
        else
        {
            //save pin to session and open play html
            sessionStorage.setItem("pin", responseText["pin"]);
            iis.open("play/Play.html");
        }
    }

    server.getA("enterPin/quizExists", {"pin": pin}, func);
}

const form = document.getElementById("form1");
form.addEventListener('submit', handleSubmit);
