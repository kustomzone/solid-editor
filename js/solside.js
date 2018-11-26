/* VERSION 0.1
**     10/31/2018 
*/
var sas = new solidAuthSimple()

var init = function(){
    app.getStoredPrefs()
    sas.get().then( results => {
        app.processResults(results)
    })
}

var app = new Vue({
    el: '#app',
    methods : {
//
// COMMUNICATE WITH THE SOLID SERVER
//
        get : function(thing){ 
            var oldThing = this.currentThing
            this.currentThing = thing
            view.hide();
            sas.get(thing).then( results => {
                 if(sas.err){
                     alert(sas.err)
                     if(oldThing.url===thing.url) 
                         oldThing.url = sas.homeUrl;
                     view.refresh(oldThing.url)
                 }
                 else this.processResults(results)
            })
        },
        rm : function(f){
            if(!this.perms.Control) return
            if( confirm("DELETE RESOURCE "+f.url+"???") ){
                view.hide('fileManager')
                view.hide('folderManager')
                var parentFolder =f.url.replace(f.name,'')
                sas.rm( f.url ).then( success =>{
                    if(success){
                        alert("Resource deleted: " + f.url)
                        view.refresh(parentFolder)
                    }
                    else alert("Couldn't delete "+sas.err)
               })
            }
        },
        addThing : function(type){
            if(!this.newThing.name){
               alert("You didn't supply a name!")
               return;
            }
            view.hide('folderManager')
            var name = this.newThing.name
            var url  = this.folder.url
            sas.add(url,name,type ).then( success => {
                if(success){
                    alert("Resource created: " + name)
                    view.refresh(this.folder.url)
                }
                else alert("Couldn't create "+url+" "+sas.err)
            })
        },
        manageResource : function(thing){
            if(!this.perms.Control) return
            if(thing.type==="folder"){
                this.folder = thing;
                view.show('folderManager');
            }
            else {
                this.file = thing;
                view.show('fileManager');
            }
        },
        getProfile : function(){ 
            var url =  this.webId.replace('#me','')
            view.refresh( url )
        },
        download : function(f){
            var a = document.createElement("a");
            a.href = f.url
            a.setAttribute("download", f.name);
            var b = document.createEvent("MouseEvents");
            b.initEvent("click", false, true);
            a.dispatchEvent(b);
            return false;
         },
//
// EDITOR & FILE MANAGER SETTINGS
//
        setEditKeys  : function(){
            fileDisplay.setEditKeys(this.editKeys)
        },
        setEditTheme  : function(){
             fileDisplay.setEditTheme(this.editTheme)
        },
//
// LOGIN STATES
//
        canControl : function(){
            if( this.perms.Control ) return "canControl"
        },
        setLogState : function(){
              if( this.loggedIn ){
                   this.logState = "login"
                   sas.webId=this.webId="";
                   sas.logout().then( res => {
                       view.refresh(sas.homeUrl)
                   })
               }
               else { 
                   this.logState = "logout"
                   sas.homeUrl = this.homeUrl
                   sas.popupLogin().then(function(){
                       view.refresh()
                   })
               }
            },
        getLogState : function(status){
            var elm = document.getElementById('optionsButton')
            if(status.loggedIn){
                this.webId = status.webId
                this.logState = "logout";  // logState is the button label
                this.loggedIn = true;      // loggedIn is true/false

            }
            else{
                this.webId = ""
                this.logState = "login";
                this.loggedIn = false;
            }
            this.perms=status.permissions
        },
//
// LOCAL STORAGE OF PREFERENCES
//
        storePrefs : function(){
            localStorage.setItem("solState", JSON.stringify({
                  home : this.homeUrl,
                   idp : sas.idp,
                  keys : this.editKeys,
                 theme : this.editTheme,
            }))
        },
        getStoredPrefs : function(){
            var state = localStorage.getItem("solState");
            if(!state) {
                sas.homeUrl = this.homeUrl = "https://dredd.solid.community/public/samples/"
                sas.idp = this.idp = "https://solid.community"
                return;
            }
            state = JSON.parse(state)
            sas.homeUrl = this.homeUrl = state.home
            sas.idp     = this.idp     = state.idp
            this.editKeys  = state.keys
            this.editTheme = state.theme
            fileDisplay.initEditor();
            fileDisplay.setEditTheme(this.editTheme);
            fileDisplay.setEditKeys(this.editKeys);
            return state
        },
//
// MAIN PROCESS LOOP, CALLED ON RETURN FROM ASYNC SOLID CALLS
//
        processResults : function(results){
            if(!results){
                alert( sas.err )
                return
            }
            var key = results.key
            var val = results.value
            if(key.match("folder")){
                app.folder = val
                app.currentThing = val
                if(sas.qname) { 
                    app.currentThing = sas.qname
                    sas.get(sas.qname).then( results => { 
                        if(!results) alert(sas.err)
                        app.processResults(results)
                    })
                }
                else if(sas.hasIndexHtml) { 
                   app.currentThing = {
                       url : val.url + "index.html",
                      type : "text/html"
                    }
                    sas.get(app.currentThing).then( results => { 
                        if( !results ) alert(sas.err)
                        app.processResults(results)
                    })
                }
            }
            if( val.type.match(/(image|audio|video)/)  ){
                val.content=""
            }
            fileDisplay.setContent(val.content) 
            if(!app.currentThing.url.match(sas.solsideUrl))
                fileDisplay.file.srcUrl = app.currentThing.url
            sas.checkStatus(val.url).then( status => {
                var url = location.href.replace(/^[^\?]*\?/,'')
                var url2 = location.href.replace(url,'').replace(/\?$/,'')  
                if(url2) {
                    url2 = url2  + "?url="+encodeURI(val.url)
                }
                history.pushState({s:2,b:1},"dredd",url2)
                app.getLogState(status)
                view.modUI(status,val.type)
            })
        },  /* process results */

    }, /* methods */
    data: { 
        fontSize     : "medium",
        editKeys     : "emacs",
        editTheme    : "dark theme",
        perms        : {},
        currentThing : {},
        newThing     : {},
        file         : {},
        folder       : { name:'loading...' },
        idp          : "",
        homeUrl      : "",
        webId        : "",
        logState     : "",
    }, /* data */
}) /* app */

    var fileDisplay = new Vue({
        el  : '#fileDisplay',
        data : {file:{content:""},displayState:"both" },
        methods : {
            initEditor : function(){
                this.zed = new Zeditor('editor');
                var keys  = app.editKeys  || "emacs"
                var theme = app.editTheme || "dark theme"
                this.setEditKeys(keys);
                this.setEditTheme(theme);
                var size=14; //1260x720 iH = 581px; 1366x768 = 618px
                if(window.innerHeight>600) size = 18
                if(window.innerHeight>900) size = 22
                if(this.displayState==="edOnly") size = size*2;
                this.zed.setSize(size);
            },
            setEditKeys  : function(keys){
                var newKey ="zemacs";
                if(keys==='vim') newKey ="vim"
                this.zed.setKeys(newKey)
                this.keys = newKey;
            },
            setEditTheme  : function(theme){
                var newTheme = "github"
                if(theme.match("dark")){
                    newTheme = "monokai"
                }
                this.zed.setTheme(newTheme)
                this.theme=newTheme
            },
            setContent : function(content){
                //  if(!this.zed) this.initEditor()
                this.initEditor()
                this.file = app.currentThing;
                this.file.content = content;
                if(!this.file.type && this.file.url) 
                    this.file.type = sas.guessFileType(this.file.url)
                this.zed.setModeFromType(this.file.type)
                this.zed.setContents(content)
                this.zed.ed.clearSelection() // remove blue overlay
            },
            saveEdits : function(){
                sas.replace(
                    this.file.url,
                    this.zed.getContents()
                ).then( success => {
                    if(success){
                        alert("Resource saved: " + this.file.url)
                        view.refresh(this.file.url)
                    }
                    else alert("Couldn't save "+sas.err)
               })
            },
            togglePanes : function(){
                if(this.displayState==='edOnly'){
                    this.displayState="dataOnly";
                    this.initEditor()
                return;
                }
                if(this.displayState==='dataOnly'){
                   this.displayState="both"; 
                   this.initEditor()
                   return;
                }
                if(this.displayState==='both'){
                    this.displayState="edOnly";
                    this.initEditor()
                    return;
                }
            },
        }
    })

    var view = {
       currentForm : "",
       show : function(area){
            this.currentForm = this.currentForm || area;
            var x = document.getElementById(this.currentForm)
            document.getElementById(this.currentForm).style.display = 'none'; 
            this.currentForm = area;
            document.getElementById(area).style.display = 'block'; 
            document.getElementById('fileDisplay').style.display = 'none'; 
        },
        hide : function(area){
            document.getElementById('fileDisplay').style.display = 'block'; 
            area = area || this.currentForm;
            if(area)
                document.getElementById(area).style.display = 'none'; 
        },
        refresh : function(url) {
              var url = url || app.currentThing.url
              url = location.href.replace(/\/\??.*/,'').replace(/#$/,'')
                  + "?url="  + url
              url = url.replace(/\/\/$/,'/')
              location.href = url
        },
        modUI : function(status,type){
            var saveButton    = document.getElementById('saveEdits')
            var optionsButton = document.getElementById('optionsButton')
            var profileButton = document.getElementById('profileButton')
            var editDisabled = document.getElementById('editDisabled')
            saveButton.style.display="none"
            optionsButton.style.backgroundColor="#ddd"
            profileButton.style.display="none"
            editDisabled.style.display="table-cell"
            if(status.loggedIn) {
                optionsButton.style.backgroundColor = "rgba(145,200,220,2)";
                profileButton.style.display="inline-block"
                if( status.permissions.Write 
                 && !type.match(/(image|audio|video|folder)/)
                ){
                    saveButton.style.display = 'table-cell'
                    saveButton.style.backgroundColor = "rgba(145,200,220,2)"
                    editDisabled.style.display="none"
                }
            }
        }
    }

    init()

