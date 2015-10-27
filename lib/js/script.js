$(function () {

	var summaryTable = $('#summaryTable').DataTable({	
		destroy: true,
		responsive: true,
		"columns": [
			{ className: "col_date_val" },
			{ className: "col_income_val" },
			{ className: "col_expense_val" },
			{ className: "col_description_val" },
			null
		]
		//"order": [[ 3, "desc" ]],
		//columnDefs: [{targets:6,"orderable":false}]
	});

	// Get JSON File
	$json = "";
	$data = "";
	
	if (!localStorage.length > 0) {	
		/*$.getJSON("data/data.json", function(json) {
			//console.log(json); // this will show the info it in firebug console
			$json = json;
			formatJSON($json);
			formatTabs($json);
			GenerateGrid($data, summaryTable);		
			localStorage.iBudget = JSON.stringify(json);		
		});	*/
			$json = { "pocket": { "income": { "Content1": { "Date": "10-04-15", "Amount": "15", "Description": "Test" }, "Content2": { "Date": "10-04-15", "Amount": "15", "Description": "Test I2" } }, "expense": { "Content1": { "Date": "10-04-15", "Amount": "15", "Description": "Test E" }, "Content2": { "Date": "10-04-15", "Amount": "15", "Description": "Test E2" } } } };
			formatJSON($json);
			formatTabs($json);
			GenerateGrid($data, summaryTable);		
			localStorage.iBudget = JSON.stringify($json);
	}
	else {
		$json = $.parseJSON(localStorage.iBudget);
		$data = formatJSON($json);		
		formatTabs($json);
		GenerateGrid($data, summaryTable);	
	}
	
	function formatJSON($json, tabname) {			
		$data = "{data:[";	
		if (typeof tabname === 'undefined'){
			tab = 'pocket';
		}
		else {
			tab = tabname;
		}
		for (var type in $json[tab]) {	
			for (var content in $json[tab][type]) {
				$data += '["' + $json[tab][type][content].Date + '",';
				if (type == 'income') {
					$data += '"' + $json[tab][type][content].Amount + '", " ", ';
					$data += '"' + $json[tab][type][content].Description + '",';	
					//$data += '"asdasd"]';
					$data += "'<span data-id=\"" + content + "\" data-type=\"" + type + "\" id=\"col_action_edit\" data-category=\"income\" class=\"glyphicon glyphicon-edit\" data-toggle=\"modal\" data-target=\"#edit\"><\/span><span data-id=\"" + content + "\" data-type=\"" + type + "\" id=\"col_action_delete\" data-category=\"income\" class=\"glyphicon glyphicon-trash\" data-toggle=\"modal\" data-target=\"#delete\"><\/span>'],";
				}
				else {										
					$data += ' " ", "' + $json[tab][type][content].Amount + '",';
					$data += '"' + $json[tab][type][content].Description + '",';	
					//$data += '"asdasd"]';
					$data += "'<span data-id=\"" + content + "\" data-type=\"" + type + "\" id=\"col_action_edit\" data-category=\"expense\" class=\"glyphicon glyphicon-edit\" data-toggle=\"modal\" data-target=\"#edit\"><\/span><span data-id=\"" + content + "\" data-type=\"" + type + "\" id=\"col_action_delete\" data-category=\"expense\" class=\"glyphicon glyphicon-trash\" data-toggle=\"modal\" data-target=\"#delete\"><\/span>'],";
				}					
			}
		}
		$data += "]}";
		return $data;
	}
	
	function formatTabs($json) {
		for (var tab in $json) {
			if (tab == "pocket") {
				if ($(".tab.active").length == 0) {
					$(".nav-tabs").append('<li class="tab active"><a href="#" id="pocket" data-toggle="tab">Pocket</a></li>');				
				}
			}
			else {
				$(".nav-tabs").append('<li class="tab"><a href="#" id="' + tab + '" data-toggle="tab">' + tab + ' </a></li>');
			}
		}		
	}
	
	$(".nav-tabs li.tab a").bind('click', function(){
		tab = $(this).attr('id');
		$json = $.parseJSON(localStorage.iBudget);
		formatJSON($json, tab);		
		GenerateGrid($data, summaryTable);
	});
	
	//$json.income.Content3 = { "Date": "10-04-15", "Amount": "15", "Description": "Test I2" }
	
	$("#income-confirm").click(function(){
		tab = $('.nav-tabs li.tab.active a').attr('id');
		date = $("#income_date_text").val();
		amount = $("#income_amount_text").val();
		description = $("#income_description_text").val();
		i = 0
		for (var content in $json[tab]['income']) {
			i++;
		}		
		var content = "Content" + (i+1);	
		if (typeof $json[tab]['income'] === 'undefined') {
			$json[tab]['income'] = {content: { "Date": date, "Amount": amount, "Description": description }};
		}
		else {
			$json[tab]['income']['Content'+ (i+1)] = { "Date": date, "Amount": amount, "Description": description };
		}		
		//$json[tab]['income']['Content'+ (i+1)] = { "Date": date, "Amount": amount, "Description": description };
		localStorage.iBudget = JSON.stringify($json);	
		$json = $.parseJSON(localStorage.iBudget);
		$data = formatJSON($json, tab);		
		GenerateGrid($data, summaryTable);	
		$('#income').modal('hide');
	});
	
	$("#expense-confirm").click(function(){
		tab = $('.nav-tabs li.tab.active a').attr('id');
		date = $("#expense_date_text").val();
		amount = $("#expense_amount_text").val();
		description = $("#expense_description_text").val();
		i = 0
		for (var content in $json[tab]['expense']) {
			i++;
		}		
		var content = "Content" + (i+1);		
		if (typeof $json[tab]['expense'] === 'undefined') {
			$json[tab]['expense'] = {content: { "Date": date, "Amount": amount, "Description": description }};
		}
		else {
			$json[tab]['expense']['Content'+ (i+1)] = { "Date": date, "Amount": amount, "Description": description };
		}
		localStorage.iBudget = JSON.stringify($json);	
		$json = $.parseJSON(localStorage.iBudget);
		$data = formatJSON($json, tab);		
		GenerateGrid($data, summaryTable);	
		$('#expense').modal('hide');		
	});
	
	$("#addtab-confirm").click(function(){
		tabname = $("#addtab_name_text").val();
		$json[""+tabname+""] = {"income": {"Content1": {"Date": "10-04-15","Amount": "15","Description": "Test 1/10"},"Content2": {"Date": "10-04-15","Amount": "1","Description": "Test 1/10 2"}}};
		localStorage.iBudget = JSON.stringify($json);		
		formatTabs($json);		
		window.location.reload(true); 
		//$('#addtab').modal('hide');
	});
	
	$(".removetab").click(function(){		
		tab = $(".tab.active a").text();
		$("#removetab_name_text").val(tab);
	});
	
	$("#removetab-confirm").click(function(){
		tabname = $("#removetab_name_text").val().trim();
		delete $json[tabname];
		localStorage.iBudget = JSON.stringify($json);		
		formatTabs($json);		
		window.location.reload(true); 
	});
	
	//$('[data-toggle="popover"]').popover();	
	
	/*
	$("#admin-login").modal({
		backdrop: 'static',
		keyboard: false
	});
	*/
	
	$user = '';
	/*
	if (sessionStorage['username'] == 'admin') {
		$('#login').modal('hide');
	}
	else {
		$("#login").modal('show');	
		$("#login").modal({
			backdrop: 'static',
			keyboard: false
		});
		$(".container").hide();
	}
	*/
	//Login
	$("#login .login-login").click(function(){
		var user = $('#login #login_name_text').val();
		if(user=='')	{			
			$("#login .result").html("Please enter a valid Name.");
			$("#login .result").addClass("alert alert-danger");
		}
		else {
			$.post("index.php", //Required URL of the page on server
			{ // Data Sending With Request To Server
				user: user,
			})
			.done(function(data){
				//window.location.reload(true);	
				if ($.trim(data) == "Yes") {
					$('#login').modal('hide');		
					$('select[name="selDev"] option').each(function(){
						if ($(this).text().toLowerCase() != user.toLowerCase()){							
							$(this).remove();
						}
					});
					$('#summaryTable tr').find("td:last").remove();
					$('#summaryTable').find("th:last").remove();
					$('.settings').remove();
					$(".container").show();
					$user = "regular";
				}
				else {
					$("#login .result").html("Please enter a valid Name.");
					$("#login .result").addClass("alert alert-danger");
				}
			})
			.fail(function(){
				$("#login .result").html("Please enter a valid Name.");
				$("#login .result").addClass("alert alert-danger");
			});
		}
	});	
	$('#login').on('hidden.bs.modal', function () {
		$("#login .result").html("");
		$("#login .result").removeClass("alert alert-danger");
	});
	
	//Login Admin
	$("#admin-login .login-login").click(function(){
		var user = $('#admin-login #login_name_text').val();
		var pass = $('#admin-login #login_pass_text').val();
		if(user=='')	{			
			$("#admin-login .result").html("Please enter a valid login credentials.");
			$("#admin-login .result").addClass("alert alert-danger");
		}
		else {
			$.post("index.php", //Required URL of the page on server
			{ // Data Sending With Request To Server
				user: user,
				pass: pass,
			})
			.done(function(data){
				//window.location.reload(true);	
				if ($.trim(data) == "Yes") {
					$('#login').modal('hide');		
					$('#admin-login').modal('hide');
					var myDate = new Date();
					sessionStorage.setItem("username", "admin");
					$(".container").show();
					/*$('select[name="selDev"] option').each(function(){
						if ($(this).text().toLowerCase() != user.toLowerCase()){							
							$(this).remove();
						}
					});
					$('#summaryTable tr').find("td:last").remove();
					$('#summaryTable').find("th:last").remove();
					$('.settings').remove();
					$user = "regular";*/
				}
				else {
					$("#admin-login .result").html("Please enter a valid login credentials.");
					$("#admin-login .result").addClass("alert alert-danger");
				}
			})
			.fail(function(){
				$("#admin-login .result").html("Please enter a valid login credentials.");
				$("#admin-login .result").addClass("alert alert-danger");
			});
		}
	});
	$('#admin-login').on('hidden.bs.modal', function () {
		$("#admin-login .result").html("");
		$("#admin-login .result").removeClass("alert alert-danger");
	});
			
	$("#exportTable").click(function(){
		url = "views/export.php";
		var form = $('<form></form>').attr('action', url).attr('method', 'post');  
		//send request
		form.appendTo('body').submit().remove();
	});
	
	
	//Delete Table
	$("#summaryTable").on("click", '#col_action_delete', function(){		
		if ($(this).attr('data-category') === 'income') {
			$("#delete_id_text").val($(this).attr('data-id'));
			$("#delete_tab_text").val($(".tab.active a").text());
			$("#delete_category_text").val('income');
		}
		else {					
			$("#delete_id_text").val($(this).attr('data-id'));
			$("#delete_tab_text").val($(".tab.active a").text());
			$("#delete_category_text").val('expense');
		}	
	});	
	
	$("#delete #delete-confirm").click(function(){			
		var selID = $("#delete_id_text").val().trim();
		var selTab = $("#delete_tab_text").val().trim();		
		var selCat = $("#delete_category_text").val().trim();
		
		if (selID=='' || selTab=='' || selCat=='') {			
			$("#delete .result").html("Please check the fields for incorrect values.");
			$("#delete .result").addClass("alert alert-danger");
		}
		else {		
			if (selTab == "Pocket"){
				selTab = selTab.toLowerCase();
			}
			if (selCat == "income") {
				delete $json[selTab]['income'][selID];
			}
			else {
				delete $json[selTab]['expense'][selID];
			}
			
			localStorage.iBudget = JSON.stringify($json);	
			$json = $.parseJSON(localStorage.iBudget);
			$data = formatJSON($json, selTab);		
			
			$("#delete .result").html("");
			$("#delete .result").removeClass("alert alert-danger");				
			$('#delete').modal('hide');
			GenerateGrid($data, summaryTable);
		}
		
	});	
	$('#delete').on('hidden.bs.modal', function () {
		$("#delete .result").html("");
		$("#delete .result").removeClass("alert alert-danger");
	});
	
	//Edit Table
	$("#summaryTable").on("click", '#col_action_edit', function(){		
		if ($(this).attr('data-category') === 'income') {
			$("#edit_id_text").val($(this).attr('data-id'));
			$("#edit_tab_text").val($(".tab.active a").text());
			$("#edit_category_text").val('income');
			$("#edit_date_text").val($(this).closest("tr").find(".col_date_val").text());
			$("#edit_amount_text").val($(this).closest("tr").find(".col_income_val").text());
			$("#edit_description_text").val($(this).closest("tr").find(".col_description_val").text());
		}
		else {					
			$("#edit_id_text").val($(this).attr('data-id'));
			$("#edit_tab_text").val($(".tab.active a").text());
			$("#edit_category_text").val('expense');
			$("#edit_date_text").val($(this).closest("tr").find(".col_date_val").text());
			$("#edit_amount_text").val($(this).closest("tr").find(".col_expense_val").text());
			$("#edit_description_text").val($(this).closest("tr").find(".col_description_val").text());
		}	
	});	
	
	$("#edit #edit-confirm").click(function(){			
							
		var selID = $("#edit_id_text").val().trim();
		var selTab = $("#edit_tab_text").val().trim();
		var selCat = $("#edit_category_text").val().trim();
		var selDate = $("#edit_date_text").val().trim();
		var selAmount = $("#edit_amount_text").val().trim();
		var selDesc = $("#edit_description_text").val().trim();
		
		if (selTab == "Pocket"){
			selTab = selTab.toLowerCase();
		}
		
		if (selID=='' || selTab=='' || selCat=='' || selDate=='' || selAmount=='' || selDesc=='') {			
			$("#edit .result").html("Please check the fields for incorrect values.");
			$("#edit .result").addClass("alert alert-danger");
		}
		else {
			if (selCat == "income") {								
				//json = "$json['"+selTab+"']['income']";
				//console.log(console.log(json));
				$json[selTab]['income'][selID] = { "Date": selDate, "Amount": selAmount, "Description": selDesc };
			}
			else {
				$json[selTab]['expense'][selID] = { "Date": selDate, "Amount": selAmount, "Description": selDesc };
			}
			
			localStorage.iBudget = JSON.stringify($json);	
			$json = $.parseJSON(localStorage.iBudget);
			$data = formatJSON($json, selTab);		
			
			$("#edit .result").html("");
			$("#edit .result").removeClass("alert alert-danger");				
			$('#edit').modal('hide');
			GenerateGrid($data, summaryTable);
		}
	});	
	$('#edit').on('hidden.bs.modal', function () {
		$("#edit .result").html("");
		$("#edit .result").removeClass("alert alert-danger");
	});
	
	//Generate Table Grid
	function GenerateGrid(data, summaryTable){				
		//data = '{data:[["10-04-15","15", " ", "Test","asdasd"]]}';
		//data = '{data:[["10-04-15","15", "asd", "Test","asdasd"]]}';
		//Trim trailing spaces
		data = $.trim(data);
		
		//Parse data from PHP
		//data = $.parseJSON(data);
		//To Array
		data = eval(data);
		
		//Clear Table
		summaryTable.clear();
		summaryTable.rows.add(data).draw();	
		
		var sum_income = 0;
		var sum_expense = 0;
		
		$(".col_income_val").each(function(){
			var value = $(this).text();
			if(!isNaN(value) && value.length != 1) {
				sum_income += parseFloat(value);
			}			
		});
		
		$(".col_expense_val").each(function(){
			var value = $(this).text();
			if(!isNaN(value) && value.length != 1) {
				sum_expense += parseFloat(value);
			}			
		});
		
		$("#col_total_income").text("Total Income: " + sum_income);
		
		$("#col_total_expense").text("Total Expense: " + sum_expense);
		
		$(".savings .text-muted").text("Total Savings: " + (sum_income - sum_expense));
		
		//if($user == 'regular') {
		//	$('#summaryTable tr').find("td:last").remove();
		//}		
	}
	
	function GenerateSelect(data){			
		//Trim trailing spaces
		data = $.trim(data);
		
		//Parse data from PHP
		data = $.parseJSON(data);
		//To Array
		data = eval(data);
		
		//Clear Table
		summaryTable.clear();
		summaryTable.rows.add(data).draw();				
	}
	
	function CurrentTimeDate(){
		var dateObj = new Date();
		var year = dateObj.getFullYear();
		var month = ((dateObj.getMonth()+1)>=10)? (dateObj.getMonth()+1) : '0' + (dateObj.getMonth()+1); 
		var day = ((dateObj.getDate())>=10)? (dateObj.getDate()) : '0' + (dateObj.getDate());
		var hours = ((dateObj.getHours())>=10)? (dateObj.getHours()) : '0' + (dateObj.getHours());
		var minutes = ((dateObj.getMinutes())>=10)? (dateObj.getMinutes()) : '0' + (dateObj.getMinutes());
		var seconds = ((dateObj.getSeconds())>=10)? (dateObj.getSeconds()) : '0' + (dateObj.getSeconds());
		newdate = year.toString() + '-' + month.toString() + '-' + day.toString() + 'T' + hours.toString() + ':' + minutes.toString() + ':' + seconds.toString();
		return newdate;
	}
})

