function Lekarze()
{

    var version = "v3.2",
        storage = new IndexedDBStorage("Final_Lekarze");

    function pobierzOsobyZFormularza()
    {
        var tablica = [];
        tablica[0] = $("#pesel").val();
        tablica[1] = $("#wiek").val();
        tablica[2] = $("#plec").val();
        tablica[3] = $("#imie").val();
        tablica[4] = $("#nazwisko").val();
        tablica[5] = $("#kod_pocztowy").val();
        tablica[6] = $("#miasto").val();
        tablica[7] = $("#ulica").val();
        tablica[8] = $("#wojewodztwo").val();
        tablica[9] = $("#nr_domu").val();
        tablica[10] = $("#nr_lokalu").val();
        tablica[11] = $("#gmina").val();
        tablica[12] = $("#powiat").val();
        tablica[13] = $("#nr_tel_dom").val();
        tablica[14] = $("#nr_tel_kom").val();
        tablica[15] = $("#email").val();
        tablica[16] = $("#uprawnienia").val();
        tablica[17] = $("#obywatelstwo").val();
        tablica[18] = $("#oddzial_nfz").val();
        
        return tablica;
    };

    function pobierzDaneChoroboweZFormularza()
    {
            var tablica = [];
            tablica[0] = $("#pesel_osoby").val();
            tablica[1] = $("#objawy").val();
            tablica[2] = $("#choroba").val();
            tablica[3] = $("#leki").val();
            var data = new Date();
            tablica[4] = data.toDateString();
 
            return tablica;
    };

    function dodajWizyteDoBazynych(tab)
    {
        storage.setPersonsHealthHistory(tab[0],tab[1],tab[2],tab[3],tab[4]);
    };

    function dodajOsobeDoBazyDaneOsobowe(tab)
    {  
        storage.setPersonsDataValue(tab[0],tab[1],tab[2],tab[3],tab[4],tab[5],tab[6],tab[7],tab[8],tab[9],tab[10],tab[11],tab[12],tab[13],tab[14],tab[15],tab[16],tab[17],tab[18]);
    };

    function dodajOsobe()
    {
        var tabelka = pobierzOsobyZFormularza();
        dodajOsobeDoBazyDaneOsobowe(tabelka);
    };

    function usunPacjenta()
    {
        var key = $("#input_testowy2").val();
        storage.deleteObjectInTable(key,"dane_osobowe");
    };

    function usunCalaBazeOsob()
    {
        var r = confirm("Czy napewno chcesz usunąć całą bazę danych ?");
        if (r == true) {
            storage.deleteDatabase();
        } else {

        }
    };

    function dodajWizyte()
    {
        var dane = pobierzDaneChoroboweZFormularza();
        dodajWizyteDoBazynych(dane);

    }

    // pobiera id pacjenta, pobiera hisotrie choroby z bazy danych
    // i wyświetla ją w postaci listy nagłowków chorób
    function pokazWizyty()
    {
        $("#lista_chorobowa").children().remove();
        var key = $("#pokaz_choroby").val();

        $("#ramka_chorobowa").removeClass();
        storage.getHealthDataObject(key,function(w){

            var $element = $("#template1 .choroba").clone();
            $element.appendTo("#lista_chorobowa");
            $("span.nazwa_choroby", $element).text(w.choroba);
            $("div>div:nth-child(2)", $element).text("Objawy : " + w.objawy);
            $("div>div:nth-child(3)", $element).text("Leki : " + w.leki);
            $("div>div:nth-child(1)",$element).text("Data : " + w.data);
            
            $("button.rozwin_szczegoly_choroby", $element).click(function() { toggleDetails($element); });
        },function(){
            alert("Nie ma histori osób dla pacjenta o podanym numerze PESEL ");
        });
        $()
    };
   
    /*
    Obsługa synchronizacji danych z serverem
    Wysyłanie rządań ajaxowych i obsługa odpowiedzi servera
    */
   
     function pobierzDanePersonalnePacjentow(fun)
    {
        storage.getAllPersonalDataObjects(function(w){
            
                fun(w);

        },function(){
            w=[];
            fun(w);
            //obecnie nawet dla pustej bazy danych pobiera wszystkie wpisy z bazy na serverze
            //alert("Twoja prywatna Baza Pacjentów jest pusta");
        });
    };
    function pobierzDaneChorobowePacjentow(fun)
    {
        storage.getAllHealthDataObjects(function(w){
                
                fun(w);

        },function(){
            alert("Nie ma histori osób dla pacjenta o podanym numerze PESEL ");
        });
    };

    // wysyła tablice ze wszystkimi obiektami na server
    function zapiszDaneZServera(dane){
        var dana;
        var tablica;
        for (var i = 0; i<dane.length; i++){
            dana = dane[i];
            tablica =[];

            for (var j in dana){
                tablica.push(dana[j]);
            }
            dodajOsobeDoBazyDaneOsobowe(tablica);
        }
    };

    // asynchronicznie wysyła i odbiera dana z servera

    function wyslijDanePersonalneNaServer(){
        
        pobierzDanePersonalnePacjentow(function(tab){
           var obj={};
           var data;
           for (var i=0;i<tab.length;i++){
                obj['DanePersonalne' + i] = tab[i];
           }
           //console.log(JSON.stringify(obj));
           //console.log(obj); 
            $.ajax({
          type: "POST",
          url: "/danePersonalne",
          data: obj,
          success: function(response){
            console.log('Przesyłanie danych na server przebiegło pomyślnie');
            data = response;
            data = JSON.parse(data);
            zapiszDaneZServera(data);
          },
          dataType: 'text'
        });     

        });
        
    };

    // pokazuje szczegóły chorób (rozwija nagłowki listy chorób)

    function toggleDetails($choroba)
    {
        $(".szczegoly_choroby", $choroba).slideToggle();
    }

    //  Uruchomianie wszsystkich zdarzeń skryptu

    this.start = function()
    {
    
    $("#pokaz_formularz_pacjentow").click(function(){$("#osoby").toggle();});

    $("#przycisk_dodawania").click(function(){ 
        dodajOsobe();
    });
    $("#usun_obiekt").click(function(){
        usunPacjenta();
    }); 
    $("#usun_tabele").click(function(){
        usunCalaBazeOsob();
    }); 
    
    //obsługa formularza z dodawaniem wizyt

    $("#pokaz_formularz_wizyt").click(function(){$("#formularz_wizyt").toggle();});

    $("#dodaj_wizyte").click(function(){
        dodajWizyte();
    });

    $("#przycisk_pokazywania_chorob").click(function(){
        pokazWizyty();
    }); 

    // automatycznie przy zalogowaniu wysyła asynchorniczne rządanie na server 
    wyslijDanePersonalneNaServer()

    };

    
}

$(function()
{
    window.app = new Lekarze();
    window.app.start();
});
