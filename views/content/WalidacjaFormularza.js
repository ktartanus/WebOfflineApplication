$(function(){

//formularz dodawania danych personalnych nowych użytkowników
	var czyDodac;
	var tablica_wyrazen = { "pesel" : "^[0-9]{11}$",
							"imie" : "^[a-ząęćńóśźż]{3,32}$",
							"nazwisko" : "^[a-ząęćńóśźż-]{3,32}$",
							"kod_pocztowy" : "^[0-9]{2}-[0-9]{3}$",
							"miasto" : "^[a-ząęćńóśźż ]{1,58}$",
							"nr_domu" : "^[0-9]{1,3}$",
							"nr_lokalu" : "^[0-9]{1,3}$",
							"ulica" : "^[0-9a-ząęćńóśźż -]{3,32}$",
							"gmina" : "^[a-ząęćńóśźż -]{3,32}$",
							"powiat" : "^[a-ząęćńóśźż -]{3,32}$",
							"nr_tel_dom" : "^[0-9]{7}$",
							"nr_tel_kom" : "^[0-9]{9}$",
							"email" : "[0-9a-zA-Ząęćńóśźż\.]{1,30}@[0-9a-zA-Ząęćńóśźż]{2,20}\.[a-zA-Z]{2,20}"};

	function validationTest(id,reg,opt)
	{
		arg = $("#" + id).val();
		if(opt){
			var wyrazenie = new RegExp(reg,opt);
		}
		else
		{
			var wyrazenie = new RegExp(reg);
		}
		return wyrazenie.test(arg);
	
	}	
	function czyDobrzeWypelniono(wartosc, input_name)
	{
		if(!wartosc)
		{
			$("#"+input_name).addClass("errorInput");
			czyDodac = -1;
		}
		else
		{
			$("#"+input_name).removeClass();
			czyDodac = 1;
			
		}
	}

	function ustalWiekIPlec()
	{
		var pesel = $("#pesel").val();
		var aktualnaDate = new Date();
		var aktualnaDateTiem = aktualnaDate.getTime();
	
		if(parseInt(pesel.substr(2,2))>12)
		{
			var peselDate =  new Date("20" + pesel.substr(0,2),pesel.substr(2,2) - 21,pesel.substr(4,2),0,0,0);
		}
		else
		{
			var peselDate =  new Date("19" + pesel.substr(0,2),pesel.substr(2,2) - 1,pesel.substr(4,2),0,0,0);		
		}

		var peselDateTime = peselDate.getTime();
		var wiek = parseInt((aktualnaDateTiem - peselDateTime) / 31688764600); //1 sekunda to 3,16887646000 x 10^-11 roku	
		$("#wiek").val(wiek);
		if(parseInt(pesel[9]%2)>0) // 10 cyfra nieparzysta oznacza mężczyznę, a parzysta kobietę
		{
			document.getElementById("men").selected = true;
		}
		else
		{
			document.getElementById("kob").selected = true;
		}
		
	}

	function poczatekZDuzejLitery(id)
	{
		var slowo = $("#" + id).val();
		$("#" + id).val(slowo[0].toUpperCase()+ slowo.toLowerCase().substr(1));
	}

	$("#pesel").change(function(){
		czyDobrzeWypelniono(validationTest("pesel",tablica_wyrazen["pesel"]), "pesel");
		ustalWiekIPlec();

	});

	$("#imie").change(function(){
		poczatekZDuzejLitery("imie");
		czyDobrzeWypelniono(validationTest("imie", tablica_wyrazen["imie"],"i"),"imie");
	});

	$("#nazwisko").change(function(){
		var slowo = $("#nazwisko").val();
		if(slowo!="")
		{
			if(slowo.indexOf("-")>= 0 )
			{
				var res = slowo.split("-");
				var slowoKoncowe = res[0][0].toUpperCase() + res[0].substr(1) + "-" + res[1][0].toUpperCase() + res[1].substr(1);
				$("#nazwisko").val(slowoKoncowe);
			}
			else 
			{
				$("#nazwisko").val(slowo[0].toUpperCase()+ slowo.toLowerCase().substr(1));
			}
		}
		czyDobrzeWypelniono(validationTest("nazwisko", tablica_wyrazen["nazwisko"],"i"),"nazwisko");
	});

	$("#kod_pocztowy").change(function(){
		czyDobrzeWypelniono(validationTest("kod_pocztowy", tablica_wyrazen["kod_pocztowy"]), "kod_pocztowy");
	});

	$("#miasto").change(function(){


		var slowo = $("#miasto").val();
		if(slowo!="")
		{
			if(slowo.indexOf(" ")>= 0 )
			{
				var res = slowo.split(" ");
				var slowoKoncowe = res[0][0].toUpperCase() + res[0].substr(1) + " " + res[1][0].toUpperCase() + res[1].substr(1);
				$("#miasto").val(slowoKoncowe);
			}
			else 
			{
				$("#miasto").val(slowo[0].toUpperCase()+ slowo.toLowerCase().substr(1));
			}
		}
		czyDobrzeWypelniono(validationTest("miasto", tablica_wyrazen["miasto"],"i"), "miasto");	
	});

	$("#nr_domu").change(function(){
		czyDobrzeWypelniono(validationTest("nr_domu", tablica_wyrazen["nr_domu"]), "nr_domu");
	});

	$("#nr_lokalu").change(function(){
		czyDobrzeWypelniono(validationTest("nr_lokalu", tablica_wyrazen["nr_lokalu"]), "nr_lokalu");
	});

	$("#ulica").change(function(){
		czyDobrzeWypelniono(validationTest("ulica", tablica_wyrazen["ulica"],"i"), "ulica");
	});

	$("#gmina").change(function(){

		var slowo = $("#gmina").val();
		if(slowo!="")
		{
			if(slowo.indexOf(" ")>= 0 )
			{
				var res = slowo.split(" ");
				var slowoKoncowe = res[0][0].toUpperCase() + res[0].substr(1) + " " + res[1][0].toUpperCase() + res[1].substr(1);
				$("#gmina").val(slowoKoncowe);
			}
			else if (slowo.indexOf("-")>= 0 )
			{
				var res = slowo.split("-");
				var slowoKoncowe = res[0][0].toUpperCase() + res[0].substr(1) + "-" + res[1][0].toUpperCase() + res[1].substr(1);
				$("#gmina").val(slowoKoncowe);
			}
			else 
			{
				$("#gmina").val(slowo[0].toUpperCase()+ slowo.toLowerCase().substr(1));
			}
		}
		czyDobrzeWypelniono(validationTest("gmina", tablica_wyrazen["gmina"],"i"), "gmina");	
	});

	$("#powiat").change(function(){

		var slowo = $("#powiat").val();
		if(slowo!="")
		{
			if(slowo.indexOf(" ")>= 0 )
			{
				var res = slowo.split(" ");
				var slowoKoncowe = res[0][0].toUpperCase() + res[0].substr(1) + " " + res[1][0].toUpperCase() + res[1].substr(1);
				$("#powiat").val(slowoKoncowe);
			}
			else if (slowo.indexOf("-")>= 0 )
			{
				var res = slowo.split("-");
				var slowoKoncowe = res[0][0].toUpperCase() + res[0].substr(1) + "-" + res[1][0].toUpperCase() + res[1].substr(1);
				$("#powiat").val(slowoKoncowe);
			}
			else 
			{
				$("#powiat").val(slowo[0].toUpperCase()+ slowo.toLowerCase().substr(1));
			}
		}
		czyDobrzeWypelniono(validationTest("powiat", tablica_wyrazen["powiat"],"i"), "powiat");
	});

	$("#nr_tel_dom").change(function(){

		var slowo = $("#nr_tel_dom").val();
		if(slowo!="")
		{
			if(slowo.indexOf(" ")>= 0 )
			{
				var res = slowo.split(" ");
				var slowoKoncowe = "";
				for (var i = 0; i < res.length; i++) {
					slowoKoncowe += res[i];
				};
				$("#nr_tel_dom").val(slowoKoncowe);
			}
			else if (slowo.indexOf("-")>= 0 )
			{
				var res = slowo.split("-");
				var slowoKoncowe = "";
				for (var i = 0; i < res.length; i++) {
					slowoKoncowe += res[i];
				};
				$("#nr_tel_dom").val(slowoKoncowe);
			}	
			else 
			{
				$("#nr_tel_dom").val(slowo[0].toUpperCase()+ slowo.toLowerCase().substr(1));
			}
		}
		czyDobrzeWypelniono(validationTest("nr_tel_dom", tablica_wyrazen["nr_tel_dom"]), "nr_tel_dom");
	});

	$("#nr_tel_kom").change(function(){
		var slowo = $("#nr_tel_kom").val();
		if(slowo!="")
		{
			if(slowo.indexOf(" ")>= 0 )
			{
				var res = slowo.split(" ");
				var slowoKoncowe = "";
				for (var i = 0; i < res.length; i++) {
					slowoKoncowe += res[i];
				};
				$("#nr_tel_kom").val(slowoKoncowe);
			}
			else if (slowo.indexOf("-")>= 0 )
			{
				var res = slowo.split("-");
				var slowoKoncowe = "";
				for (var i = 0; i < res.length; i++) {
					slowoKoncowe += res[i];
				};
				$("#nr_tel_kom").val(slowoKoncowe);
			}
			else 
			{
				$("#nr_tel_kom").val(slowo[0].toUpperCase()+ slowo.toLowerCase().substr(1));
			}
		}
		czyDobrzeWypelniono(validationTest("nr_tel_kom", tablica_wyrazen["nr_tel_kom"]), "nr_tel_kom");
	});

	$("#email").change(function(){
		var slowo = $("#email").val();
		$("#email").val(slowo.toLowerCase());
		czyDobrzeWypelniono(validationTest("email", tablica_wyrazen["email"],"i"), "email");
		if(czyDodac<0)
		{
			document.getElementById("przycisk_dodawania").disabled = true;
					}
		else if (czyDodac>0)		
		{

			document.getElementById("przycisk_dodawania").disabled = false;
		}
	});

	
//Formularz dodawania historii wizyt

	$("#pesel_osoby").change(function(){

		var slowo = $("#pesel_osoby").val();

		var wyrazenie = new RegExp("^[0-9]{11}$");
		if(!wyrazenie.test(slowo))
		{
			$("#pesel_osoby").addClass("errorInput");
			document.getElementById("dodaj_wizyte").disabled = true;
		}
		else
		{
			$("#pesel_osoby").removeClass();
		}
	});	

	$("#choroba").change(function(){

		var slowo = $("#choroba").val();
		var slowo2 = $("#pesel_osoby").val();
		if(slowo=="")
		{
			$("#choroba").addClass("errorInput");
			document.getElementById("dodaj_wizyte").disabled = true;
		}
		else
		{
			document.getElementById("dodaj_wizyte").disabled = false;
		}
		
	});	
	
})

