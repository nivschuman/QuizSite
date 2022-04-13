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


document.getElementById("score").innerHTML = sessionStorage.getItem("grade");
document.getElementById("correct").innerHTML = sessionStorage.getItem("correct");
document.getElementById("incorrect").innerHTML = sessionStorage.getItem("incorrect");

let iis = new IIS("http://localhost");


//return to home page
function home()
{
    iis.open("home/Home.html");
}
