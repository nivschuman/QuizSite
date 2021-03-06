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


class Quiz
{
    constructor(name, pin)
    {
        this.name = name;
        this.pin = pin;
        this.questions = [];
        this.curIdx = 0;
    }

    //add question to quiz
    addQuestion(question)
    {
        this.questions[this.questions.length] = question;
    }

    //change to next question in quiz
    next()
    {
        if(this.curIdx != this.questions.length-1)
        {
            this.curIdx++;
    
            this.questions[this.curIdx].updateHtml();

            this.updateNextBtn();
            this.updateBar();
        }
    }

    //change to previous question in quiz
    prev()
    {
        if(this.curIdx != 0)
        {
            this.curIdx--;
    
            this.questions[this.curIdx].updateHtml();

            this.updateNextBtn();
            this.updateBar();
        }
    }

    //update bar completion meter
    updateBar()
    {
        let barPercent = (this.curIdx+1) / this.questions.length * 100;

        document.getElementById("bar").style = "width:" + barPercent + "%";

        document.getElementById("barText").innerHTML = Math.trunc(barPercent) + "% Complete";
    }

    //change next button to submit if on last question
    updateNextBtn()
    {
        if(this.curIdx == this.questions.length-1)
        {
            let btn = document.getElementById("nextBtn");
            btn.innerHTML = "Submit";
            btn.className = "btn btn-danger btn-lg float-md-end";
        }
        else
        {
            let btn = document.getElementById("nextBtn");
            btn.innerHTML = "Next";
            btn.className = "btn btn-primary btn-lg float-md-end";
        }
    }


    //return true of quiz is currently on last question, false otherwise
    onLastQuestion()
    {
        return this.curIdx == this.questions.length-1;
    }

    //return copy of this quiz
    copy()
    {
        let quiz = new Quiz(this.name, this.pin);
        quiz.curIdx = this.curIdx;

        let newQuestions = [];
        for(let k=0; k<this.questions.length; k++)
        {
            newQuestions[k] = this.questions[k].copy();
        }

        quiz.questions = newQuestions;

        return quiz;
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

    //set question to given question. If update is true, update html accordingly
    setQuestion(question, update=true)
    {
        this.question = question;

        if(update)
        {
            this.updateHtml();
        }
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

    copy()
    {
        let question = new Question(this.number, this.type);

        question.setQuestion(this.question, false);

        return question;
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

    //set choice at idx
    setChoice(choiceIdx, choice, update=true)
    {
        this.choices[choiceIdx] = choice;

        if(update)
        {
            this.updateHtml();
        }
    }


    //update this question based on html
    update()
    {
        this.question = document.getElementById("Question").innerHTML;
        this.number = document.getElementById("QuestionNumber").innerHTML.slice(9);

        for(let k=1; k<=this.choices.length; k++)
        {
            let choiceDiv = document.getElementById("choice" + k);

            this.choices[k-1].text = choiceDiv.getElementsByTagName("h1")[0].innerHTML;
            this.choices[k-1].correct = choiceDiv.getElementsByTagName("input")[0].checked;
        }
    }

    //update the html to show this question.
    updateHtml()
    {
        document.getElementById("Question").innerHTML = this.question;
        document.getElementById("QuestionNumber").innerHTML = "Question " + this.number;

        for(let k=1; k<=this.choices.length; k++)
        {
            let choiceDiv = document.getElementById("choice" + k);

            choiceDiv.getElementsByTagName("h1")[0].innerHTML = this.choices[k-1].text;
            choiceDiv.getElementsByTagName("input")[0].checked = this.choices[k-1].correct;
        }
    }

    //return copy of this
    copy()
    {
        let choice_question = new ChoiceQuestion(this.number);
        choice_question.setQuestion(this.question);

        for(let k=0; k<this.choices.length; k++)
        {
            let choice = this.choices[k].copy();
            choice_question.setChoice(k, choice, false);
        }

        return choice_question;
    }
}


class Choice
{
    constructor(text, correct)
    {
        this.text = text;
        this.correct = correct;
    }

    //return copy of this choice
    copy()
    {
        return new Choice(this.text, this.text);
    }
}


let iis = new IIS("http://localhost");
let server = new Server("http://127.0.0.1:5000");

let pin = sessionStorage.getItem("pin");
let quizJson = server.getS("play/getQuiz", {"pin": pin});

let quizName = quizJson["name"];

document.getElementById("title").innerHTML = quizName;

let myQuiz = new Quiz(quizName, pin); //current quiz player is playing

let choice_questions = quizJson["choice_questions"];

//set myQuiz
for(let i=0; i<choice_questions.length; i++)
{
    let choiceQuestionJson = choice_questions[i];

    let number = choiceQuestionJson["number"];
    let question = choiceQuestionJson["question"];

    let choice_question = new ChoiceQuestion(number);
    choice_question.setQuestion(question, false);

    for(let j=0; j<choiceQuestionJson["choices"].length; j++)
    {
        let choiceJson = choiceQuestionJson["choices"][j];

        let text = choiceJson["text"];

        let choice = new Choice(text, false);

        choice_question.setChoice(j, choice, false);
    }

    myQuiz.addQuestion(choice_question);
}


class AbstractMethod extends Error
{
    constructor()
    {
        super("Must override abstract method");
    }
}


myQuiz.questions[0].updateHtml();
myQuiz.updateBar();
myQuiz.updateNextBtn();


//update question accordingly if checkbox is checked
function check()
{
    myQuiz.questions[myQuiz.curIdx].update();
}


//go to next question. If on last question, submit to server and open results page
function next()
{
    if(myQuiz.onLastQuestion())
    {
        let user_id = sessionStorage.getItem("user_id");
        //server checks if answers are correct and returns number of correct answers
        //server also updates users stats.
        let correct = server.postS("play/correctAnswers", {"quiz": myQuiz, "user_id": user_id})["correctAnswers"];
        let incorrect = myQuiz.questions.length - correct;
        let grade = (correct * 100) / myQuiz.questions.length;

        sessionStorage.setItem("correct", correct);
        sessionStorage.setItem("incorrect", incorrect);
        sessionStorage.setItem("grade", grade);

        iis.open("result/Result.html");
    }
    else
    {
        myQuiz.next();
    }
}


//go to previous question
function prev()
{
    myQuiz.prev();
}
