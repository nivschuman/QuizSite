class LeaderBoard
{
    constructor()
    {
        this.statuses = [];
    }

    addStatus(status, update=true)
    {
        if(this.statusIndex(status) != -1)
        {
            return false;
        }

        this.statuses[this.statuses.length] = status;

        Status.sort(this.statuses);

        if(update)
        {
            this.updateHtml();
        }

        return true;
    }

    updateHtml()
    {
        let table = document.getElementById("table_body");

        table.innerHTML = "";

        for(let k=0; k<this.statuses.length; k++)
        {
            let status = this.statuses[k];

            let row = table.insertRow();

            row.insertCell().outerHTML = "<th scope=row>" +  (k+1) + "</th>";

            let usernameCol = row.insertCell();
            usernameCol.innerHTML = status.username;

            let gradeCol = row.insertCell();
            gradeCol.innerHTML = Math.round(status.grade);

            let amountPlayedCol = row.insertCell();
            amountPlayedCol.innerHTML = status.amount_played;
        }
    }

    statusIndex(status)
    {
        for(let k=0; k<this.statuses.length; k++)
        {
            if(this.statuses[k].equals(status))
            {
                return k;
            }
        }

        return -1;
    }

    clear()
    {
        this.statuses = [];
        
        let table = document.getElementById("table_body");
        table.innerHTML = "";
    }
}

class Status
{
    constructor(username, grade, amount_played)
    {
        this.username = username;
        this.grade = grade;
        this.amount_played = amount_played;
    }

    equals(status)
    {
        if(!(status instanceof Status))
        {
            return false;
        }

        return this.username == status.username && this.grade == status.grade && this.amount_played == status.amount_played;
    }

    //compares two statuses based on their grade. 0 - equal, -1 smaller than 1 bigger than
    compare(status)
    {
        if(this.grade == status.grade)
        {
            return 0;
        }
        else if(this.grade < status.grade)
        {
            return -1;
        }
        else
        {
            return 1;
        }
    }

    static sort(statuses)
    {
        for(let i=0; i<statuses.length-1; i++)
        {
            for(let j=0; j<statuses.length-1; j++)
            {
                if(statuses[j].compare(statuses[j+1]) == -1)
                {
                    let tmp = statuses[j];

                    statuses[j] = statuses[j+1];
                    statuses[j+1] = tmp;
                }
            }
        }
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

let server = new Server("http://127.0.0.1:5000");

let leaderboard = new LeaderBoard(10);
leaderboard.updateHtml();

function findLeaderboard()
{
    leaderboard.clear();

    let pin = document.getElementById("pin").value;
    let response = server.getS("leaderboard/getStatuses", {"pin": pin});

    if(response["found"] == "false")
    {
        alert("Couldn't find quiz with pin " + pin);
    }
    else
    {
        let statusesJson = response["statuses"];

        for(let k=0; k<statusesJson.length; k++)
        {
            let statusJson = statusesJson[k];

            let status = new Status(statusJson["username"], statusJson["grade"], statusJson["amount"]);

            leaderboard.addStatus(status);
        }
    }
}