function IndexedDBStorage(appName)
{
	
	var tableName = (appName ? appName  : "WirtualnaPrzychodnia");

	var db = new Dexie(tableName);
            db.version(1).stores({
                dane_osobowe: 'pesel,wiek,plec,imie,nazwisko,kod_pocztowy,miasto,ulica,wojewodztwo,nr_domu,nr_lokalu,gmina,powiat,nr_tel_dom,nr_tel_kom,email,uprawnienia,obywatelstwo,oddzial_nfz',
                historia_choroby: '++id,pesel,objawy,choroba,leki,data'
            });

	
	addOrUpdatePersonsData = function(key,val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11,val12,val13,val14,val15,val16,val17,val18)
    {
    	db.open();
		db.dane_osobowe.put({pesel : key, wiek : val1, plec : val2, imie : val3, nazwisko : val4, kod_pocztowy : val5, miasto : val6, ulica : val7, wojewodztwo : val8, nr_domu : val9, nr_lokalu : val10, gmina : val11, powiat : val12, nr_tel_dom : val13, nr_tel_kom : val14, email : val15, uprawnienia : val16, obywatelstwo : val17, oddzial_nfz : val18}).catch(function(error) {
               		alert ("Ooops: " + error);

            	});
		//db.close();
    };
    
    addOrUpdatePersonsHealtHistory = function(val0, val1, val2, val3, val4)
	{
		db.open();
		//sprawdzanie czy jest osoba o podanym peselu w bazie osob
		db.dane_osobowe.where("pesel").equals(val0).toArray(function(w){
			if (w.length>0) {
				db.historia_choroby.put({pesel : val0, objawy : val1, choroba : val2, leki : val3, data : val4}).catch(function(error) {
               		alert ("Ooops: " + error);
               		console.log(error);
            	});
			}
			else
			{
				alert("Niestety w bazie danych osób nie ma osoby o podanym adresie PESEL :" + val0);
			}
		}).catch(function (error) {
     		console.error(error);
     		alert("Ooops: " + error);
		});
		
		//db.close();
	}
    /*
	addOrUpdatePersonsHealtHistory = function(val0, val1, val2, val3, val4)
	{
		db.open();

		db.historia_choroby.put({pesel : val0, objawy : val1, choroba : val2, leki : val3, data : val4}).catch(function(error) {
               		alert ("Ooops: " + error);
               		console.log(error);
            	});
		//db.close();
	}
	*/
	this.getHealthDataObject = function(key,fun,fun2)
	{
		db.open();
		db.historia_choroby.where("pesel").equals(key).toArray(function(w){
			if (w.length>0) {
				for (var i = 0;i<w.length; i++ ){
					fun(w[i]);
				}
			}
			else
			{
				fun2();
			}
		}).catch(function (error) {
     		console.error(error);
     		alert("Ooops: " + error);
		});
	}

	this.getAllPersonalDataObjects = function(fun,fun2)
	{
		db.open();
		db.dane_osobowe.toCollection().toArray(function(w,cursor){
			if (w.length>0) {
				fun(w);	
			}
			else
			{
				fun2();
			}
		}).catch(function (error) {
     		console.error(error);
     		alert("Ooops: " + error);
		});
	}
	
	this.getAllHealthDataObjects = function(fun,fun2)
	{
		db.open();
		db.historia_choroby.toCollection().toArray(function(w,cursor){
			if (w.length>0) {
				fun(w);	
			}
			else
			{
				fun2();
			}
		}).catch(function (error) {
     		console.error(error);
     		alert("Ooops: " + error);
		});
	}

    this.updateValue = function(key,val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11,val12,val13,val14,val15,val16,val17,val18)
    {
    	addOrUpdatePersonsData(key,val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11,val12,val13,val14,val15,val16,val17,val18);
    }

	this.setPersonsDataValue = function(key,val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11,val12,val13,val14,val15,val16,val17,val18)
   	{
		addOrUpdatePersonsData(key,val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11,val12,val13,val14,val15,val16,val17,val18);
    }
	
	this.setPersonsHealthHistory = function(key,val1,val2,val3,val4)
	{
		addOrUpdatePersonsHealtHistory(key,val1,val2,val3,val4);
	}

	this.getValueByKey = function(key,dataBaseName,fun)
	{
		db.open();
		db[dataBaseName].get(key).then(function(value){
			fun(value);
		}).catch(function(error){
			alert("Oooops: " + error);		
		});
		db.close();
	}
	this.deleteObjectInTable = function(key,dataBaseName)
	{
		db.open();
		//sprawdzanie czy jest osoba o podanym peselu w bazie osob
		db.dane_osobowe.where("pesel").equals(key).toArray(function(w){
			if (w.length>0) {
				db[dataBaseName].delete(key).catch(function(error){
					alert("Nie mozna usunac : " + error);
				});
			}
			else
			{
				alert("Niestety w bazie danych osób nie ma osoby o podanym adresie PESEL :" + key);
			}
		}).catch(function (error) {
     		console.error(error);
     		alert("Ooops: " + error);
		});
		
		db.close();	
	}
	this.clearTable = function(dataBaseName)
	{
		db[dataBaseName].clear();

	}


	this.deleteDatabase = function()
	{
		db.delete().then(function() {
    	alert("Baza danych usunięta");
		}).catch(function (err) {
    	alert("Nie można usunąć bazdy danych");
		}).finally(function() {
    	// Do what should be done next...
		});
		
	
	}
}
