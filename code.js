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

let iis = new IIS("http://localhost");

function openCreate()
{
    iis.open("create/Create.html");
}

function openEnterPin()
{
    iis.open("enterpin/EnterPin.html");
}
