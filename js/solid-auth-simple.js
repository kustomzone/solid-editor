/* VERSION 0.1
** 10/31/2018 
*/
var solidAuthSimple = function() {

var self = this
self.log = function(msg){ console.log(msg) }
self.solsideUrl = "https://dredd.solid.community/public/index.html"

/* FILETYPES */

/* if we got the url from the URL bar, we guess its type from
** it's name, if we got it from get of a folder, we use getFileName()
** instead which does an rdf query on the folder's graph
*/

this.guessFileType = function(url) {
	var ext = url.replace(/.*\./,'')
	if (ext.match(/\/$/))  return 'folder'
	if (ext.match(/md/))   return 'text/markdown'
	if (ext.match(/html/)) return 'text/html'
	if (ext.match(/xml/))  return 'text/xml'
	if (ext.match(/ttl/))  return 'text/turtle'
	if (ext.match(/n3/))   return 'text/n3'
	if (ext.match(/css/))  return 'text/css'
	if (ext.match(/txt/))  return 'text/plain'
	if (ext.match(/json/)) return 'application/json'
	if (ext.match(/js/))   return 'application/javascript'
    if (ext.match(/(png|gif|jpeg|tif|webp)/)) return 'image'
	if (ext.match(/(mp3|aif|ogg)/))           return 'audio'
	if (ext.match(/(avi|mp4|mpeg)/))          return 'video'
	if (ext.match(/rq/))   return 'application/sparql'
	/* default */          return 'text/turtle'
}

this.getFileType = function(graph, url) {
	var subj = $rdf.sym(url)
	var pred=$rdf.sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type")
	var types = graph.each(subj,pred,undefined)
	for(var t in types){
		var type=types[t].value
		if (type.match("ldp#BasicContainer"))
			return "folder"
		if (type.match("http://www.w3.org/ns/iana/media-types/")){
			type=type.replace("http://www.w3.org/ns/iana/media-types/",'')
			return type.replace('#Resource','')
		}
	}
	return "unknown"
}

/* SOLID READ/WRITE FUNCTIONS */
this.rm = async function(url) {
	var res = await solid.auth.fetch(url,{method : 'DELETE'})
		.catch(err => { console.error(err); self.err = err; return false })
	console.log('Resource deleted.', url,res) 
	return true
}
this.add = async function(parentFolder,newThing,type,content) {
	var link = '<http://www.w3.org/ns/ldp#Resource>; rel="type"';
	var filetype;
	if (type === 'folder') {
		var link = '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
		filetype = "text/turtle"
	}
	var request = {
		method : 'POST',
		headers : { 'Content-Type':filetype,slug:newThing,link:link }
	}
	if (content) request.body=content
	var response = await solid.auth.fetch(parentFolder, request)
		.catch(err => { console.error(err); self.err = err; return false })
	console.log(
		'Resource created.', parentFolder+newThing,JSON.stringify(response) 
	)
	return true
}
this.replace = async function(url,contents) {
	var name = url.replace(/.*\//,'')
	var parent = url.replace(name,'')
	var del = await this.rm(url)
	if (del) {
		var add = await this.add(parent,name,"file",contents)
		return(add)
	}
	return(false)
}
this.fetch = async function(url) {
	console.log('fetching ... '+url)
	var res = await solid.auth.fetch(url).catch(err => {
	   console.error(err); self.err = err||"Something went wrong"; return false 
	})
	var txt = await res.text().catch(err => {
	   console.error(err); self.err = err; return false 
	})
	return({value:txt})
}
this.get = async function(thing) {
	self.qname = "";
	thing = thing || self.urlFromQueryString()
	if (typeof(thing) === 'string') thing = { url:thing }
	if (! thing.type) thing.type = self.guessFileType(thing.url)
	var body = await self.fetch(thing.url)
	if (!body) return false
	self.log("got a "+thing.type)
	if (thing.type === "folder") {
		var graph = self.turtle2graph(body.value,thing.url)
		if (!graph) {
			self.err = "Not authorized to access "+thing.url;
			console.log(self.err)
			return false
		} else {
			return self.processFolder(graph,thing.url,body.value) 
		}
	} else {
		/*
		// dynamic fix?
		var parts     = document.currentScript.src.split("/");
		var filename  = parts[parts.length - 1].split(".");
		var result    = filename[filename.length - 2];
		var extension = filename[filename.length - 1];
	   */
	   
		if (body && body.value && body.value.match('alert-danger')
		   && !thing.url.match('solid-auth-simple') && !thing.url.match('bootstrap.css')
		) {
			self.err = "Found 'alert-danger' in "+thing.url
			console.log(body)
			return false
		} else return('file',{key:"file",value:{
			type:thing.type,
			content:body.value,
			url:thing.url
		}})
	}
}

/* SESSION MANAGEMENT */
this.checkPerms = async function(url,agent,session) {
	/* I have a version of this that does a recursive ACL check
	** but it's not ready for prime time yet, so we do this kludge instead
	*/ 
	if (!agent || !url) {
		/* No harm in this, the interface will show a message if the
		** user doesn't actually have read perms
		*/ 
		return { Read:true, Write:false, Control:false }
	}
	if (!self.storage) {
		var path = agent.replace(/^https:\/\/[^/]*\//,'')
		self.storage = agent.replace(path,'')
	}
	if (self.storage && url.match(self.storage)) {
		return { Read:true, Write:true, Control:true }
	} else {
		return { Read:true, Write:false, Control:false }
	}
}
this.checkSession = async function() { 
	var sess = await solid.auth.currentSession()
	if (!sess) {
	  self.webId = self.storage = undefined
	  return;
	}
	self.webId = sess.webId
	self.storage = self.storage
	if (!self.storage) {
	   var path = sess.webId.replace(/^https:\/\/[^/]*\//,'')
	   self.storage = sess.webId.replace(path,'')
	}
	return {webId:self.webId,storage:self.storage }
}
this.checkStatus = async function(url) {
   var sess = await self.checkSession()
   var webId    = (sess) ? sess.webId : ""
   var storage  = (sess) ? sess.storage : ""
   var loggedIn = (sess) ? true : false
   var perms = await self.checkPerms(url,webId)
   return { 
	webId:webId,
	storage:storage,
	loggedIn:loggedIn,
	permissions:perms 
   }
}
this.popupLogin = async function() {
  let session = await solid.auth.currentSession();
  let popupUri = 'https://solid.community/common/popup.html';
  if (!session) { session = await solid.auth.popupLogin({ popupUri }); }
}
this.logout = async function() {
	session=''
	console.log('Logging Out of Solid!')
	var res = await solid.auth.logout();
	return res;
}

/* INTERNAL FUNCTIONS */
this.urlFromQueryString = function() {
	var thing = self.parseQstring();
	if (thing.url) {
		self.qname = thing
		var name   = thing.url.substring(thing.url.lastIndexOf('/')+1);
		var folder = thing.url.replace(name,'')
		thing = {
			 url : folder,
			type : "folder"
		}
	} else {
		thing = {
			 url : self.homeUrl,
			type : "folder"
		}
	}
	return thing
}
this.parseQstring = function() {
	var pairs = location.search.slice(1).split('&');
	var result = {};
	pairs.forEach(function(pair) {
		pair = pair.split('=');
		result[pair[0]] = decodeURIComponent(pair[1] || '');
	});
	return result;
}
this.getFolderItems = function(graph,subj) {
	var contains = {
		folders : [],
		files   : []
	}
	var itemsTmp = graph.each(
		$rdf.sym(subj),
		$rdf.sym('http://www.w3.org/ns/ldp#contains'),
		undefined
	)
	self.log("Got " + itemsTmp.length + " items")
	self.hasIndexHtml = false
	for(i = 0; i < itemsTmp.length; i++) {
		var item = itemsTmp[i];
		var newItem = {}
		newItem.type = this.getFileType(graph, item.value)
		newItem.label=decodeURIComponent(item.value).replace(/.*\//,'')
		if (newItem.type === 'folder') {
			item.value = item.value.replace(/[/]+/g,'/');
			item.value = item.value.replace(/https:/,'https:/');
			var name = item.value.replace(/\/$/,'')
			newItem.name = name.replace(/.*\//,'')
			newItem.url  = item.value
			contains.folders.push(newItem)
		} else {
			newItem.url = item.value
			newItem.name = item.value.replace(/.*\//,'')
		if (newItem.name === 'index.html') { self.hasIndexHtml = true }
			contains.files.push(newItem)
		}
	}
	return contains;
}
this.processFolder = function(graph,url,content,callback) {
	this.log("processing folder")
	var items = self.getFolderItems(graph,url);
	if (self.hasIndexHtml && !self.indexSent && !self.qname) {
		self.indexSent = 1
		var index = {
			url  : url + "index.html",
			type : "text/html"
		}
		self.get(index)
	}
	var fullname = url.replace(/\/$/,'')
	var name     = fullname.replace(/.*\//,'')
	var parent   = fullname.replace(name,'')
	var parentOK = parent.replace('https://','').replace(/^[^/]*/,'')
	if (parentOK) {
		items.folders.unshift({
		 type : "folder",
		  url : parent,
		 name : ".."
		})
	}
	self.currentFolder = {
		 type : "folder",
		 name : name,
	   parent : parent,
		  url : url,
		files : items.files,
	  content : content,
	  folders : items.folders
	}
	return({key:'folder', value: {
		 type : "folder",
		 name : name,
	   parent : parent,
		  url : url,
		files : items.files,
	  content : content,
	  folders : items.folders
	}})
}
this.turtle2graph = function(turtleText,url) {
	var graph=$rdf.graph();
	var contentType = 'text/turtle';
	try{
		$rdf.parse(turtleText,graph,url,contentType);
		return graph;
	} catch(err) {
		console.log(err);
		self.err = err
		return false
	}
}
this.fetchAndParse = async function(url) {
	console.log('fetching ... '+url)
	var res = await solid.auth.fetch(url).catch(err => {
		self.err = err;
		console.log(err);
		return false;
	})
	var txt = await res.text().catch(err => {
		self.err = err;
		console.log(err);
		return false;
	})
	return self.turtle2graph(txt,url)
}
this.fetchJson = async function(url) {
	self.log('fetching ... ' + url)
	var res = await solid.auth.fetch(url).catch(err => self.log(err))
	var txt = await res.json().catch(err=>console.log(err))
	return (txt)
}

return this

} // end solidAuthSimple

if (typeof(module)!="undefined") { module.exports = solidAuthSimple() }
/* END */