var fs = require('fs');

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var passport=require('passport');
var passportLocal = require('passport-local');

var app = express();

app.set('view engine', 'ejs');

app.use(express.static('/home/tarti/Dokumenty/IDB_Node_Express/views/content'));

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({
	secret: process.env.SESSION_SECRET || 'GymIsMyHome',
	resave: false,
	saveUninitialized: false
}));
	
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(function(username,password,done){
	
	if(username === 'lekarz' && password === 'doktordolitle') {
		done(null, {id:username, name:username});
	} else {
		done(null,null);
	}
}));

passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	done(null,{id:id,name:id});
});

app.get('/', function(req, res){
	res.redirect('/login');
});

app.get('/login', function(req,res){ 
	res.render('login');
});


app.get('/ind',isLoggedIn, function(req,res){ 
	res.render('ind');
});


app.post('/zaloguj', passport.authenticate('local', {
		successRedirect : '/ind', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		})); 

app.post('/danePersonalne', function(req,res){
		

		var sparsowanyObiekt = utworzTabliceObiektow(req.body); // zamiana danych na obiekt json
		var obiektDoZapisu;
		// wczytanie danych personalnych z bazy
		fs.readFile('BazaUzytkownikow', 'utf8', function (err,data) {
  			if (err) {
 	  			 return console.log(err);
 			}
  		// obsługa danych
  			
  			var danePersonalne = JSON.parse(data);
  			var new_tab=danePersonalne;
  			var czy_dodano;
  			for (var i=0;i<sparsowanyObiekt.length;i++){
  				var obj = sparsowanyObiekt.pop();
  				czy_znalazl_rownego = true;
  				for(var j=0; j<danePersonalne.length;j++){
  					if(danePersonalne[j].pesel == obj.pesel){	
  						czy_znalazl_rownego = false;
  					}
  				} 
  				if(czy_znalazl_rownego){
  					new_tab.push(obj);
  				}

  			}	
  			obiektDoZapisu = JSON.stringify(new_tab);
  			res.send(obiektDoZapisu);
		
			// uzupełnienie bazy
			fs.writeFile("BazaUzytkownikow", obiektDoZapisu, function(err) {
    		if(err) {
        		return console.log(err);
   		 	}
   		
    		console.log("The file was saved!");
		}); 

		});
});

app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

var port = process.env.PORT || 1337;

app.listen(port,function(){
	console.log('http://127.0.0.1:' + port + '/');
});

function isLoggedIn(req, res, next) {

	// sprawdza czy użytkownik zalogowany w sesji
	if (req.isAuthenticated())
		return next();

	// jeżeli nie zalogowany to przekierowuje na stronę główną, czyli logowania
	res.redirect('/');
}
//tworzy reprezentacje obiektu json z zapytania ajax

function utworzObiekt(obiekt){
	var new_obj = {}; 
	var ind = -1; 		//numer obiektu wewnetrznego;
	var obj_wew = {};	//objekt wewnatrz glownego obiektu;
	for (var i in obiekt){
	  	
		var index_pocz = i.substr(0,poczatek-1);
		var poczatek = i.indexOf("[");
		var koniec = i.indexOf("]");
		var index = i.substr(poczatek+1,koniec-poczatek-1);
		var ind_pom = index_pocz.substr(index_pocz.length-1,1); //numer objektu wewnetrznego;
		
		obj_wew[index] = obiekt[i];

		if (index == "oddzial_nfz"){
			ind ++;
			new_obj[index_pocz+ind] = obj_wew;
			obj_wew ={};
		}
	}
	return new_obj;
};


// tworzy tablice obiektów przesłanych zapytaniem ajaxowym
function utworzTabliceObiektow(obiekt){
	var new_tab = [];
	var obj_wew = {};	//objekt wewnatrz glownego obiektu;
	for (var i in obiekt){
	  	
		var index_pocz = i.substr(0,poczatek-1);
		var poczatek = i.indexOf("[");
		var koniec = i.indexOf("]");
		var index = i.substr(poczatek+1,koniec-poczatek-1);
		var ind_pom = index_pocz.substr(index_pocz.length-1,1); //numer objektu wewnetrznego;
		
		obj_wew[index] = obiekt[i];

		if (index == "oddzial_nfz"){
			new_tab.push(obj_wew);
			obj_wew={};
		}
	}
	return new_tab;
};