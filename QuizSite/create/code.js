class Quiz
{
    constructor(name, pin)
    {
        this.name = name;
        document.getElementById("name").value = this.name;

        this.pin = pin;
        this.questions = [];
        this.curIdx = -1;
    }

    //add question to quiz. Change html accordingly
    addQuestion(question)
    {
        let buttonsDiv = document.getElementById("buttons");
        let buttons = buttonsDiv.getElementsByTagName("button");
    
        //create new btn for question
        let btn = document.createElement("BUTTON");
        btn.type = "button";
        btn.className = "btn btn-primary btn-lg border";
        btn.id = "QBtn" + buttons.length;
        btn.innerHTML = "Q" + buttons.length;
        btn.onclick = loadQuestion;
    
        //add new btn to buttons
        let arrButtons = Array.prototype.slice.call(buttons); //turns buttons into an array
        let plusBtn = arrButtons[arrButtons.length-1];
        arrButtons[arrButtons.length-1] = btn;
        arrButtons[buttons.length] = plusBtn;
    
        //update buttonsDiv
        buttonsDiv.innerHTML = "";
        
        for(let k=0; k<arrButtons.length; k++)
        {
            buttonsDiv.append(arrButtons[k])
        }
    
        //update current idx
        this.questions[this.questions.length] = question;
        this.curIdx++;
        
        this.loadQuestion(btn)
    }

    //load question from btn clicked to html
    loadQuestion(object, btn)
    {
        //checking whether object is already equal to button or this is equal to button
        if (object instanceof PointerEvent)
        {
            object = btn;
        }

        let idStr = object.id.toString();

        this.curIdx = parseInt(idStr.substring(4, idStr.length))-1;

        this.questions[this.curIdx].updateHtml();
    }

    //update current question according to html
    updateCurrent()
    {
        this.questions[this.curIdx].update();
    }

    //update html to next question
    next()
    {
        if(this.curIdx != this.questions.length-1)
        {
            this.curIdx++;
    
            this.questions[this.curIdx].updateHtml();
        }
    }

    //update html to previous question
    prev()
    {
        if(this.curIdx != 0)
        {
            this.curIdx--;
    
            this.questions[this.curIdx].updateHtml();
        }
    }

    //delete current question. Update html and array accordingly
    del()
    {
        if(this.questions.length == 1)
        {
            document.getElementById("QuestionBox").innerHTML = "";
        }
    
        let buttonsDiv = document.getElementById("buttons");
        let buttons = buttonsDiv.getElementsByTagName("button");
    
        //remove button and question
        let arrButtons = Array.prototype.slice.call(buttons);
        arrButtons.splice(this.curIdx, 1);
        this.questions.splice(this.curIdx, 1)
    
        //update button names accordingly
        for(let k=this.curIdx; k<arrButtons.length-1; k++)
        {
            arrButtons[k].id = "QBtn" + (k+1);
            arrButtons[k].innerHTML = "Q" + (k+1);
            this.questions[k].number = k+1;
        }
    
        //update buttonsDiv
        buttonsDiv.innerHTML = "";
        
        for(let k=0; k<arrButtons.length; k++)
        {
            buttonsDiv.append(arrButtons[k])
        }
    
        this.curIdx--;
    
        this.questions[this.curIdx].updateHtml();
    }
}



class Question
{
    constructor(number, type="question")
    {
        this.number = number;
        this.question = "";
        this.type = type;
    }

    static sortNumerically(questions)
    {
        for(let i=0; i<questions.length-1; i++)
        {
            for(let j=0; j<questions.length-1; j++)
            {
                if(questions[j].compareNumbers(questions[j+1]) == 1)
                {
                    let tmp = questions[j];

                    questions[j] = questions[j+1];
                    questions[j+1] = tmp;
                }
            }
        }
    }

    //compares questions based on their number
    compareNumbers(question)
    {
        if(this.number < question.number)
        {
            return -1;
        }
        else if(this.number > question.number)
        {
            return 1;
        }

        return 0;
    }

    update()
    {
        throw new AbstractMethod();
    }

    updateHtml()
    {
        throw new AbstractMethod();
    }

    toString()
    {
        return "Q" + this.number + ": " + this.question;
    }
}



class ChoiceQuestion extends Question
{
    constructor(number)
    {
        super(number, "ChoiceQuestion");

        this.choices = []

        for(let k=0; k<4; k++)
        {
            this.choices[this.choices.length] = new Choice("", false);
        }
    }

    //set choice in certain index
    setChoice(choice, idx)
    {
        this.choices[idx] = choice;
    }

    //update question according to html input fields
    update()
    {
        this.question = document.getElementById("Question").value;

        let choicesHtml = document.getElementsByClassName("choice");

        for(let k=0; k<choicesHtml.length; k++)
        {
            let choice = choicesHtml[k];

            let inputs = choice.getElementsByTagName("input");

            this.choices[k].correct = inputs[0].checked;
            this.choices[k].text = inputs[1].value;
        }
    }

    updateHtml()
    {
        this.updateQuestionBox();

        document.getElementById("Question").value = this.question;

        let choicesHtml = document.getElementsByClassName("choice");

        for(let k=0; k<choicesHtml.length; k++)
        {
            let choice = choicesHtml[k];

            let inputs = choice.getElementsByTagName("input");

            inputs[0].checked = this.choices[k].correct;
            inputs[1].value = this.choices[k].text;
        }

        let QuestionH1 = document.getElementById("QuestionH1");
        let delBtn = QuestionH1.getElementsByTagName("button")[0];

        QuestionH1.innerHTML = "Question " + this.number + " ";
        QuestionH1.append(delBtn); 
    }

    updateQuestionBox()
    {
        let questionBox = document.getElementById("QuestionBox");
        questionBox.innerHTML = "";

        let questionH1 = document.createElement("h1");
        questionH1.id = "QuestionH1";

        //add delete button
        questionH1.innerHTML = '<button type="button" class="btn btn-danger btn-lg float-end" onclick="del()">Delete</button>';

        //add h1 to questionBox
        questionBox.appendChild(questionH1);

        //add question input box to questionBox
        let questionInput = document.createElement("input");
        questionInput.id = "Question";
        questionInput.className = "form-control form-control-lg";
        questionInput.type = "text";
        questionInput.placeholder = "";

        questionBox.appendChild(questionInput);

        questionBox.innerHTML += "\n<br>\n";

        
        let choicesDiv = document.createElement("div");
        choicesDiv.id = "choices";

        //add choices
        for(let k=1; k<=this.choices.length; k++)
        {
            let choiceDiv = document.createElement("div");
            choiceDiv.id = "choice" + k;
            choiceDiv.className = "choice";

            choiceDiv.innerHTML += '<input class="form-check-input" type="checkbox" value="" id="defaultCheck1" onclick="updateCurrent()">\n';

            let label = document.createElement("label");
            label.className = "form-check-label";
            label.for = "defaultCheck1";
            label.innerHTML += '<input class="form-control form-control-sm" type="text" placeholder="">';

            choiceDiv.appendChild(label);

            choicesDiv.appendChild(choiceDiv);
            choicesDiv.innerHTML += "\n<br>\n";
        }

        questionBox.appendChild(choicesDiv);

        let nextPrevBtns = document.createElement("div");
        nextPrevBtns.className = "nextprevBtns";

        nextPrevBtns.innerHTML += '<button type="button" class="btn btn-warning btn-lg float-start" onclick="prev()">Prev</button>\n';
        nextPrevBtns.innerHTML += '<button type="button" class="btn btn-warning btn-lg float-end" onclick="next()">Next</button>';

        questionBox.appendChild(nextPrevBtns);
    }

    toString()
    {
        let str = super.toString() + "\n";

        for(let k=0; k<this.choices.length; k++)
        {
            str += this.choices[k].text;
            str += "-" + this.choices[k].correct + "\n";
        }

        return str;
    }
}


class Choice
{
    constructor(text, correct)
    {
        this.text = text;
        this.correct = correct;
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


class ServerFailed extends Error
{
    constructor(message)
    {
        super(message);

        this.name = "ServerFailed";
    }

    alert()
    {
        window.alert(this.message);
    }
}

class AbstractMethod extends Error
{
    constructor()
    {
        super("Must override abstract method");
    }
}

let server = new Server("http://127.0.0.1:5000");
let iis = new IIS("http://localhost");

let pin = sessionStorage.getItem("createPin");

document.getElementById("PinH1").innerHTML = "Game Pin: " + pin;

let send_json = {"user_id": sessionStorage.getItem("user_id"), "pin": pin};

let quizJson = server.getS("create/getQuizWithAnswers", send_json)["quiz"];

let myQuiz = new Quiz(quizJson["name"], pin);

let questions = [];

//add choice questions
let choice_questions_json = quizJson["choice_questions"];

for(let k=0; k<choice_questions_json.length; k++)
{
    let choice_question_json = choice_questions_json[k];

    questions[k] = new ChoiceQuestion(choice_question_json["number"]);
    questions[k].question = choice_question_json["question"];

    let choices_json = choice_question_json["choices"];

    for(let i=0; i<choices_json.length; i++)
    {
        let text = choices_json[i]["text"];
        let correct = choices_json[i]["correct"];

        let choice = new Choice(text, correct);

        questions[k].setChoice(choice, i);
    }
}

//sort questions numerically
Question.sortNumerically(questions);

//add questions to quiz
for(let k=0; k<questions.length; k++)
{
    myQuiz.addQuestion(questions[k]);
}

//creates a listener for when you press a key
window.onkeyup = keyup;

//update the current question whenever html is updated
function keyup(e)
{
    myQuiz.updateCurrent();
}

//update current question according to html
function updateCurrent()
{
    myQuiz.updateCurrent()
}

//add new question when plus button is clicked
function addQuestion()
{
    let question = new ChoiceQuestion(myQuiz.curIdx+2);

    myQuiz.addQuestion(question);
}

//load question that was clicked on to html
function loadQuestion(object=null)
{
    myQuiz.loadQuestion(object, this);
}

//move to next question
function next()
{
    myQuiz.next();
}

//move to previous question
function prev()
{
    myQuiz.prev();
}

//delete current question
function del()
{
    myQuiz.del();
}

//post current state of quiz to the server.
function postQuestions()
{
    func = function(responseText)
    {
        if(responseText["posted"] == "false")
        {
            throw new ServerFailed("Server failed to post questions");
        }
    }

    myQuiz.name = document.getElementById("name").value;

    let user_id = sessionStorage.getItem("user_id");
    server.postA("create/postQuestions", {"quiz": myQuiz, "user_id": user_id}, func);
}

//ask server to publish quiz - make quiz public.
function publish()
{
    func = function(responseText)
    {
        if(responseText["published"] == "false")
        {
            throw new ServerFailed("Server failed to publish quiz");
        }

        iis.open("home/Home.html");
    }

    let user_id = sessionStorage.getItem("user_id");
    server.postA("create/publishQuiz", {"pin": myQuiz.pin, "user_id": user_id}, func);
}