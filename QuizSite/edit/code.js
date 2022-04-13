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


class Table
{
    constructor(parentDiv=document)
    {
        this.table = document.createElement("table");
        this.table.className = "table table-bordered";
        
        this.tableBody = document.createElement("tbody");
        this.table.appendChild(this.tableBody);

        parentDiv.appendChild(this.table);
    }

    addRow(data)
    {
        let row = document.createElement("tr");

        let dataHtml = document.createElement("td");
        dataHtml.appendChild(data);

        row.appendChild(dataHtml);

        this.tableBody.appendChild(row);
    }
}


class Quiz
{
    constructor(name, pin)
    {
        this.name = name;
        this.pin = pin;
    }

    toString()
    {
        return "name: " + this.name + "\npin: " + this.pin;
    }
}


let iis = new IIS("http://localhost");
let server = new Server("http://127.0.0.1:5000");


let table = new Table(document.getElementById("tablediv"));


let quizzes = server.getS("edit/getUserQuizzes", sessionStorage.getItem("user_id"))["quizzes"];

for(let k=0; k<quizzes.length; k++)
{
    let name = quizzes[k]["name"];
    let pin = quizzes[k]["pin"];

    let quiz = new Quiz(name, pin);

    let btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-primary btn-lg";
    btn.innerHTML = quiz.toString();
    btn.onclick = openCreate;
    btn.quiz = quiz;

    let delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn-danger btn-lg";
    delBtn.innerHTML = "DELETE";
    delBtn.onclick = deleteQuiz;
    delBtn.quiz = quiz;

    table.addRow(btn);
    table.addRow(delBtn);
}


function deleteQuiz()
{
    let pin = this.quiz.pin;

    let to_send = {"user_id": sessionStorage.getItem("user_id"), "pin": pin};
    let deletedResponse = server.getS("edit/deleteQuiz", to_send);

    if(deletedResponse["deleted"] == "true")
    {
        //TBD change to not have to refresh?!
        alert("Deleted quiz with pin " + deletedResponse[pin] + ".\nRefresh to see changes");
    }
}


function openCreate(btn)
{
    let pin;

    if(btn.id == "newQuizBtn")
    {
        pin = server.getS("create/newQuiz", sessionStorage.getItem("user_id"))["pin"];
    }
    else
    {
        pin = this.quiz.pin;
    }

    sessionStorage.setItem("createPin", pin);

    iis.open("create/Create.html");
}