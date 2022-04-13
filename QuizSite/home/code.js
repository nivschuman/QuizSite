class IIS
{
    constructor(iisLink)
    {
        this.iisLink = iisLink;
    }

    open(link)
    {
        let totalLink = this.iisLink + "/" + link;
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

let iis = new IIS("http://localhost");
let server = new Server("http://127.0.0.1:5000");

let data = server.getS("home/userinfo", sessionStorage.getItem("user_id"));

if(data["found"] == "false")
{
    alert("could not find user. Try to login in again");
}
else
{
    document.getElementById("usernameVal").innerHTML = data["username"];
    document.getElementById("quizzes_doneVal").innerHTML = data["quizzes_done"];
    document.getElementById("correct_answersVal").innerHTML = data["correct_answers"];
    document.getElementById("quizzes_madeVal").innerHTML = data["quizzes_made"];
}

function openEdit()
{
    iis.open("edit/Edit.html");
}

function openEnterPin()
{
    iis.open("enterpin/EnterPin.html");
}

function openLeaderBoards()
{
    iis.open("leaderboard/Leaderboard.html");
}
